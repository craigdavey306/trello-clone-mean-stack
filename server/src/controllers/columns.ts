import { Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import ColumnModel from '../models/Column';
import { ExpressRequest, Socket, SocketEventsEnum } from '../types';
import { getErrorMessage } from '../helpers';

/**
 * Schedules a command to retrieve all columns for a specific board.
 * @param req Request
 * @param res Response
 * @param next Next function
 * @returns A promise that will resolve to an array of documents associated with the user.
 */
export const getColumns = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }

    const columns = await ColumnModel.find({ boardId: req.params.boardId });
    res.send(columns);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new column and notifies all users subscribed to the
 * the board that it was created.
 * @param io
 * @param socket
 * @param data
 */
export const createColumn = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.ColumnCreateFailure,
        'User is not authorized'
      );
      return;
    }

    // Create new column.
    const newColumn = new ColumnModel({
      title: data.title,
      boardId: data.boardId,
      userId: socket.user.id,
    });

    const savedColumn = await newColumn.save();

    // Notify everyone subscribed to the channel/room that
    // a new board was created.
    io.to(data.boardId).emit(SocketEventsEnum.ColumnCreateSuccess, savedColumn);
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    socket.emit(SocketEventsEnum.ColumnCreateFailure, errorMessage);
  }
};

/**
 * Logic to delete a column and notify all subscribers about the edit.
 * @param io
 * @param socket
 * @param data
 */
export const deleteColumn = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; columnId: string }
): Promise<void> => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.ColumnDeleteFailure,
        'User is not authorized'
      );
      return;
    }

    await ColumnModel.deleteOne({ _id: data.columnId });

    socket.emit(SocketEventsEnum.ColumnDeleteSuccess);
    io.to(data.boardId).emit(
      SocketEventsEnum.ColumnDeleteSuccess,
      data.columnId
    );
  } catch (err) {
    socket.emit(SocketEventsEnum.ColumnDeleteFailure, getErrorMessage(err));
  }
};

/**
 * Logic to update a column and notify all subscribers about the edit.
 * @param io
 * @param socket
 * @param data
 */
export const updateColumn = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; columnId: string; fields: { title: string } }
): Promise<void> => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.ColumnUpdateFailure,
        'User is not authorized'
      );
      return;
    }

    const updatedColumn = await ColumnModel.findByIdAndUpdate(
      data.columnId,
      data.fields,
      { new: true }
    );

    io.to(data.boardId).emit(
      SocketEventsEnum.ColumnUpdateSuccess,
      updatedColumn
    );
  } catch (err) {
    socket.emit(SocketEventsEnum.ColumnUpdateFailure, getErrorMessage(err));
  }
};

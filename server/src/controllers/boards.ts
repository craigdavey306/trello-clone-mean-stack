import { Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import BoardModel from '../models/Board';
import { ExpressRequest, Socket, SocketEventsEnum } from '../types';
import { getErrorMessage } from '../helpers';

/**
 * Schedules a command to retrieve all boards for the user.
 * @param req Request
 * @param res Response
 * @param next Next function
 * @returns A promise that will resolve to an array of documents associated with the user.
 */
export const getBoards = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }

    const boards = await BoardModel.find({ userId: req.user._id });
    res.send(boards);
  } catch (err) {
    next(err);
  }
};

/**
 * Schedules a command to retrieve a single board.
 * @param req Request
 * @param res Response
 * @param next Next function
 * @returns A promise that will resolve to a document for the requested board.
 */
export const getBoard = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }

    const board = await BoardModel.findById(req.params.boardId);
    res.send(board);
  } catch (err) {
    next(err);
  }
};

/**
 * Schedules a command to create a new board.
 * @param req Request
 * @param res Response
 * @param next Next function
 * @returns A promise that resolve to the newly created board.
 */
export const createBoard = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }

    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user._id,
    });

    const savedBoard = await newBoard.save();
    res.send(savedBoard);
  } catch (err) {
    next(err);
  }
};

/**
 * Joins a socket channel/room for a specific board.
 * @param io
 * @param socket
 * @param data
 */
export const joinBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
): void => {
  socket.join(data.boardId);
};

/**
 * Logic to leave a channel/room. A room might be left when the user navigates away
 * from the current board on the client.
 * @param io
 * @param socket
 * @param data
 */
export const leaveBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
): void => {
  socket.leave(data.boardId);
};

/**
 * Logic to update a board and notify all subscribers about the edit.
 * @param io
 * @param socket
 * @param data
 */
export const updateBoard = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; fields: { title: string } }
): Promise<void> => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.BoardsUpdateFailure,
        'User is not authorized'
      );
      return;
    }

    const updatedBoard = await BoardModel.findByIdAndUpdate(
      data.boardId,
      data.fields,
      { new: true }
    );

    socket.emit(SocketEventsEnum.BoardsUpdateSuccess, updatedBoard);
    io.to(data.boardId).emit(
      SocketEventsEnum.BoardsUpdateSuccess,
      updatedBoard
    );
  } catch (err) {
    socket.emit(SocketEventsEnum.BoardsUpdateFailure, getErrorMessage(err));
  }
};

/**
 * Logic to delete a board and notify all subscribers about the edit.
 * @param io
 * @param socket
 * @param data
 */
export const deleteBoard = async (
  io: Server,
  socket: Socket,
  data: { boardId: string }
): Promise<void> => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.BoardsDeleteFailure,
        'User is not authorized'
      );
      return;
    }

    await BoardModel.deleteOne({ _id: data.boardId });

    socket.emit(SocketEventsEnum.BoardsDeleteSuccess);
    io.to(data.boardId).emit(SocketEventsEnum.BoardsDeleteSuccess);
  } catch (err) {
    socket.emit(SocketEventsEnum.BoardsDeleteFailure, getErrorMessage(err));
  }
};

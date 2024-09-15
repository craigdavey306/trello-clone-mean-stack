import { Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import TaskModel from '../models/Task';
import { ExpressRequest, Socket, SocketEventsEnum } from '../types';
import { getErrorMessage } from '../helpers';

/**
 * Schedules a command to retrieve all tasks for a specific board.
 * @param req Request
 * @param res Response
 * @param next Next function
 * @returns A promise that will resolve to an array of documents associated with the user.
 */
export const getTasks = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }

    const tasks = await TaskModel.find({ boardId: req.params.boardId });

    res.send(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new task and notifies all users subscribed to the
 * the board that it was created.
 * @param io
 * @param socket
 * @param data
 */
export const createTask = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; title: string; columnId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(SocketEventsEnum.TaskCreateFailure, 'User is not authorized');
      return;
    }

    // Create new task.
    const newTask = new TaskModel({
      title: data.title,
      boardId: data.boardId,
      userId: socket.user.id,
      columnId: data.columnId,
    });

    const savedTask = await newTask.save();

    // Notify everyone subscribed to the channel/room that
    // a new task was created.
    io.to(data.boardId).emit(SocketEventsEnum.TaskCreateSuccess, savedTask);
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    socket.emit(SocketEventsEnum.TaskCreateFailure, errorMessage);
  }
};

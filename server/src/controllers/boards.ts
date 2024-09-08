import { Response, NextFunction } from 'express';
import BoardModel from '../models/Board';
import { ExpressRequest } from '../types';

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

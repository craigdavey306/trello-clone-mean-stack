import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import * as columnsController from './controllers/columns';
import * as tasksController from './controllers/tasks';
import authMiddleware from './middleware/auth';
import { SocketEventsEnum } from './types/socketEvents.enum';
import { secret } from './config';
import User from './models/User';
import { Socket } from './types/socket.interface';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
const port = process.env.PORT ?? 4001;
const databaseUri = process.env.DATABASE_CONNECTION_URI;
const databaseName = process.env.DATABASE;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Remove the Object._id and just return Object.id.
mongoose.set('toJSON', {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id;
  },
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);
app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.get('/api/board/:boardId', authMiddleware, boardsController.getBoard);
app.get(
  '/api/board/:boardId/columns',
  authMiddleware,
  columnsController.getColumns
);
app.get('/api/board/:boardId/tasks', authMiddleware, tasksController.getTasks);
app.post('/api/boards', authMiddleware, boardsController.createBoard);

io.use(async (socket: Socket, next) => {
  try {
    const token = socket.handshake.auth.token as string;
    const data = jwt.verify(token.split(' ')[1], secret) as {
      id: string;
      email: string;
    };
    const user = await User.findById(data.id);

    if (!user) {
      return next(new Error('Authentication error'));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
}).on('connection', (socket) => {
  // listen for join board event
  socket.on(SocketEventsEnum.BoardsJoin, (data) => {
    boardsController.joinBoard(io, socket, data);
  });

  // listen for leave board event
  socket.on(SocketEventsEnum.BoardsLeave, (data) => {
    boardsController.leaveBoard(io, socket, data);
  });

  // listen for create column event
  socket.on(SocketEventsEnum.ColumnCreate, (data) => {
    columnsController.createColumn(io, socket, data);
  });

  // listen for task create event
  socket.on(SocketEventsEnum.TaskCreate, (data) => {
    tasksController.createTask(io, socket, data);
  });

  // listen for board update event
  socket.on(SocketEventsEnum.BoardsUpdate, (data) => {
    boardsController.updateBoard(io, socket, data);
  });

  // listen for board delete event
  socket.on(SocketEventsEnum.BoardsDelete, (data) => {
    boardsController.deleteBoard(io, socket, data);
  });

  // listen for column delete event
  socket.on(SocketEventsEnum.ColumnDelete, (data) => {
    columnsController.deleteColumn(io, socket, data);
  });

  // listen for column update event
  socket.on(SocketEventsEnum.ColumnUpdate, (data) => {
    columnsController.updateColumn(io, socket, data);
  });

  // listen for task update event
  socket.on(SocketEventsEnum.TaskUpdate, (data) => {
    tasksController.updateTask(io, socket, data);
  });

  // listen for task delete event
  socket.on(SocketEventsEnum.TaskDelete, (data) => {
    tasksController.deleteTask(io, socket, data);
  });
});

mongoose.connect(`${databaseUri}/${databaseName}`).then(() => {
  console.log('Connected to MongoDB');
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

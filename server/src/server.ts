import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import authMiddleware from './middleware/auth';

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

console.log(databaseUri, databaseName);

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
app.post('/api/boards', authMiddleware, boardsController.createBoard);

io.on('connection', () => {
  console.log('Connected');
});

mongoose.connect(`${databaseUri}/${databaseName}`).then(() => {
  console.log('Connected to MongoDB');
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

/**
 * Defines event names used for communicating via sockets.
 *
 * Names need to match between the server and client.
 */
export enum SocketEventsEnum {
  BoardsJoin = 'boards:join',
  BoardsLeave = 'boards:leave',
  BoardsUpdate = 'boards:update',
  BoardsUpdateSuccess = 'boards:updateSuccess',
  BoardsUpdateFailure = 'boards:updateFailure',
  BoardsDelete = 'boards:delete',
  BoardsDeleteSuccess = 'boards:deleteSuccess',
  BoardsDeleteFailure = 'boards:deleteFailure',
  ColumnCreate = 'column:create',
  ColumnCreateSuccess = 'column:createSuccess',
  ColumnCreateFailure = 'column:createFailure',
  TaskCreate = 'task:create',
  TaskCreateSuccess = 'task:createSuccess',
  TaskCreateFailure = 'task:createFailure',
}

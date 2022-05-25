export enum ClientEvents {
  LOGIN = "login",
  LOGOUT = "logout",
  CREATE_ROOM = "create-room",
  JOIN_ROOM = "join-room",
  DISCONNECT = "disconnect",
  SEND_MESSAGE = "send-message",
}

export enum ServerEvents {
  NEW_MESSAGE = "new-message",
  LOGIN_FAIL = "login-fail",
  LOGIN_SUCCESS = "login-success",
  CREATE_ROOM_FAIL = "create-room-fail",
  CREATE_ROOM_SUCCESS = "create-room-success",
  JOIN_ROOM_FAIL = "join-room-fail",
  JOIN_ROOM_SUCCESS = "join-room-success",
  OUT_FAIL = "out-fail",
  OUT_SUCCESS = "out-success",
  SEND_MESSAGE_FAIL = "send-message-fail",
  SEND_MESSAGE_SUCCESS = "send-message-success",
}

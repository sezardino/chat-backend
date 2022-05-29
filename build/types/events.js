"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerEvents = exports.ClientEvents = void 0;
var ClientEvents;
(function (ClientEvents) {
    ClientEvents["LOGIN"] = "login";
    ClientEvents["LOGOUT"] = "logout";
    ClientEvents["CREATE_ROOM"] = "create-room";
    ClientEvents["JOIN_ROOM"] = "join-room";
    ClientEvents["DISCONNECT"] = "disconnect";
    ClientEvents["SEND_MESSAGE"] = "send-message";
})(ClientEvents = exports.ClientEvents || (exports.ClientEvents = {}));
var ServerEvents;
(function (ServerEvents) {
    ServerEvents["NEW_MESSAGE"] = "new-message";
    ServerEvents["LOGIN_FAIL"] = "login-fail";
    ServerEvents["LOGIN_SUCCESS"] = "login-success";
    ServerEvents["CREATE_ROOM_FAIL"] = "create-room-fail";
    ServerEvents["CREATE_ROOM_SUCCESS"] = "create-room-success";
    ServerEvents["JOIN_ROOM_FAIL"] = "join-room-fail";
    ServerEvents["JOIN_ROOM_SUCCESS"] = "join-room-success";
    ServerEvents["OUT_FAIL"] = "out-fail";
    ServerEvents["OUT_SUCCESS"] = "out-success";
    ServerEvents["SEND_MESSAGE_FAIL"] = "send-message-fail";
    ServerEvents["SEND_MESSAGE_SUCCESS"] = "send-message-success";
})(ServerEvents = exports.ServerEvents || (exports.ServerEvents = {}));

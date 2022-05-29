"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.SuccessMessages = void 0;
var SuccessMessages;
(function (SuccessMessages) {
    SuccessMessages["JOIN_ROOM"] = "You are join to room";
    SuccessMessages["ROOM_CREATED"] = "Room created";
    SuccessMessages["LOGGED_IN"] = "You are logged in";
    SuccessMessages["LOGGED_OUT"] = "User logged out successfully";
    SuccessMessages["USER_CREATED"] = "User created Successfully";
})(SuccessMessages = exports.SuccessMessages || (exports.SuccessMessages = {}));
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["NO_ROOM"] = "Room does not exist";
    ErrorMessages["ROOM_EXIST"] = "Room already exists";
    ErrorMessages["USER_EXIST"] = "User already exists";
    ErrorMessages["NOT_LOGGED"] = "User not logged in";
    ErrorMessages["USER_NOT_IN_ROOM"] = "This user does not belong to this room";
})(ErrorMessages = exports.ErrorMessages || (exports.ErrorMessages = {}));

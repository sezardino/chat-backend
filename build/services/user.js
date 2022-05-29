"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = exports.UsersService = void 0;
const abs_1 = require("./abs");
class UsersService extends abs_1.AbstractService {
}
exports.UsersService = UsersService;
const users = [];
exports.usersService = new UsersService(users);

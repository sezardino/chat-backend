import { Message, NewMessageData, Room, User } from "./models";

export interface LoginDto {
  name: string;
  id: User["id"];
}

export interface CreateRoomDto {
  name: Room["name"];
  userId: User["id"];
}

export interface SendMessageDto {
  room: Room["id"];
  message: NewMessageData;
}

export interface JoinRoomDto {
  userId: User["id"];
  roomName: Room["name"];
}

export interface NewMessageDto {
  messages: Message[];
}

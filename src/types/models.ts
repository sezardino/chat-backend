export interface WithId {
  id: string;
}

export interface WithName {
  name: string;
}

export interface User extends WithName, WithId {}

export interface Message extends WithId {
  from?: Pick<User, "id" | "name">;
  body: string;
  date: number;
}

export interface Room extends WithId, WithName {
  users: User["id"][];
  messages: Message[];
}

export type NewMessageData = Pick<Message, "body" | "from">;

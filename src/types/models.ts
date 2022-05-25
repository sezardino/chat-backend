export interface WithId {
  id: string;
}

export interface WithName {
  name: string;
}

export interface User extends WithName, WithId {}

export interface Message extends WithId {
  from: User["name"];
  body: string;
  date: number;
}

export interface Room extends WithId {
  users: User["id"][];
  messages: Message[];
}

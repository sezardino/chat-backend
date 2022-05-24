export interface WithId {
  id: string;
}

export interface WithName {
  name: string;
}

export interface User extends WithName, WithId {
  rooms: Room[];
}

export interface Message extends WithId {
  from: User;
  body: string;
  date: Date;
}

export interface Chat extends WithId, WithName {
  users: User["id"][];
  messages: Message[];
}

export interface Room extends WithId {}

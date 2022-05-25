import { Room } from "./models";

export interface Notification {
  type: "error" | "success" | "info";
  title: string;
}

export type ClientHandler = (notification: Notification) => void;

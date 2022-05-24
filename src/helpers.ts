import { Notification } from "./types";

export const getErrNotification = (title: string): Notification => {
  return { title, type: "error" };
};

export const getSuccessNotification = (title: string): Notification => {
  return { title, type: "success" };
};

export const getInfoNotification = (title: string): Notification => {
  return { title, type: "info" };
};

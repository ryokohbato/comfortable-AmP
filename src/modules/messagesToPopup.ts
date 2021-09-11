import { MessagesToBackground } from "./messagesToBackground";

export type MessagesFromBackground = {
  Timing: "initialize",
  Value: any,
} | {
  Timing: "runtime-popup",
  Value: string,
} | {
  Timing: "runtime-tabs",
  Value: MessagesToBackground,
};
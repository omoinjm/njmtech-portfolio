import { EventEmitter } from "node:events";

const eventEmitter = new EventEmitter({ captureRejections: true });

export default eventEmitter;

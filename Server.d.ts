import Bun from "bun";
import EventEmitter from "events";

export interface Server extends Bun.Server {
  eventHandler: EventEmitter,
  basedir: string
}

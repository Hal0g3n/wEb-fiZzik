import { camera } from "./camera.js";
import { add_key_listener, check_keys } from "./key.js";
import { make } from "./lib.js";
import { Thing } from "./thing.js";

const Body = Matter.Body,
      Vector = Matter.Vector;

export class Amogus extends Thing {

  constructor() {
    super(Vector.create(0, 0));
    this.make(make.player);
  }

  tick() {
    super.tick();
    this.tick_player();
  }

  tick_player() {
    // this.target.facing = camera.mouse_position;
    // move player
    const move_x = (check_keys(["ArrowRight", "KeyD"]) ? 1 : 0) - (check_keys(["ArrowLeft", "KeyA"]) ? 1 : 0);
    const move_y = (check_keys(["ArrowDown", "KeyS"]) ? 1 : 0) - (check_keys(["ArrowUp", "KeyW"]) ? 1 : 0);
    this.move_player(Vector.create(move_x, move_y));
  }

  draw(ctx) {
    super.draw(ctx);
    this.draw_player(ctx);
  }

  draw_player(ctx) {
    // among us
    // sus?
  }

  move_player(v) {
    this.move_force(Vector.normalise(v));
  }

}

export const player = new Amogus();
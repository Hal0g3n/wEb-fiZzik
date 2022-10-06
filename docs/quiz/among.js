import { collide } from "./collide.js";
import { util } from "./util.js";

let time = 0;

const pi = Math.PI;

const config = { [null]: null }; // null

// window size
let _w = window.innerWidth;
let _h = window.innerHeight;

// mouse stuff
const mouse = {
  x: _w / 2,
  y: _h / 2,
  down: false,
};

// camera stuff
const camera = {
  x: _w / 2,
  y: _h / 2,
  size: null, // todo
};

// canvas stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = _w;
canvas.height = _h;

// map 
const among_map = [
  { shape: "line", x1: 100, y1: 100, x2: 100, y2: -100, },
  { shape: "line", x1: 100, y1: 100, x2: -100, y2: 100, },
  { shape: "line", x1: -100, y1: -100, x2: 100, y2: -100, },
  { shape: "line", x1: -100, y1: -100, x2: -100, y2: 100, },
];

// among us svgs
const svg = {
  among1: "m 0 30 l 0 -10 c 0 -13 7 -20 20 -20 c 13 0 20 7 20 13 l -2 0 c 0 -5 -6 -11 -18 -11 c -12 0 -18 6 -18 18 l 0 10 l -2 0 z m 38 -11 l 2 0 l 0 11 l -2 0 l 0 -11 z M 0 0 m 0 30 l 0 10 l 2 0 l 0 -10 l -2 0 m 38 0 l 0 10 l 2 0 l 0 -10 l -2 0 z M 0 0  m 0 39 c -3 0 -7 0 -7 -3 l 0 -17 c 0 -3 4 -3 8 -3 l -1 2 c -3 0 -5 0 -5 2 l 0 15 c 0 2 2 2 5 2 l 0 2 z M 0 0  m 17 16 c 0 -5 10 -5 13 -5 c 3 0 13 0 13 5 c 0 5 -10 5 -13 5 c -3 0 -13 0 -13 -5 m 2 0 c 0 2 5 3 11 3 c 6 0 11 -1 11 -3 c 0 -2 -5 -3 -11 -3 c -7 0 -11 1 -11 3 z M 0 0  m 0 40 c 0 15 2 15 12 15 c 8 0 0 -13 8 -13 c 8 0 0 13 8 13 c 10 0 12 0 12 -15 l -2 0 c 0 13 -2 13 -8 13 c -8 1 0 -12 -8 -13 l -4 0 c -8 1 0 14 -8 13 c -6 0 -8 0 -8 -13",
  among2: "",
  among3: "",
  among4: "",
};


class Thing {
  
  static things = [];

  static tick_all() {
    for (const t of Thing.things) {
      if (t != null) t.tick();
    }
  }

  static draw_all() {
    for (const t of Thing.things) {
      if (t != null) t.draw();
    }
  }

  static get_line_p1(t) {
    
  }

  constructor(o) {
    Thing.things.push(this);
    this.make(o);
  }

  x = 0;
  y = 0;
  map = false;
  player = false;
  dynamic = false;

  make(o) {
    for (const k in o) {
      this[k] = o[k]; // ok
    }
  }

  tick() {

  }

  draw() {

    this.draw_shape();

  }

  draw_shape() {
    // test
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    switch (this.shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, pi * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case "line":
        // ctx.lineWidth = ?;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        break;
      default:
        console.error("invalid shape for thing: " + this.shape);
    }
  }

  remove() {
    const Ls = [Thing.things];
    for (const L of Ls) {
      const index = L.indexOf(this);
      if (index != null && index > -1) {
        L.splice(index, 1);
      }
    }
  }

};

class Among extends Thing {

  move_speed = 5;

  constructor() {
    super();
    this.make({
      player: true,
      dynamic: true,
      shape: "circle",
      x: 0,
      y: 0,
      r: 20,
    });
  }

  tick() {
    super.tick();
    this.tick_move();
  }

  tick_move() {
    let dx = 0;
    let dy = 0;
    if (keys["KeyW"] || keys["ArrowUp"]) dy--;
    if (keys["KeyS"] || keys["ArrowDown"]) dy++;
    if (keys["KeyA"] || keys["ArrowLeft"]) dx--;
    if (keys["KeyD"] || keys["ArrowRight"]) dx++;
    if (dx !== 0 || dy !== 0) {
      this.move(dx, dy);
    }
  }

  move(x, y) {
    const sqrt = Math.sqrt(x * x + y * y);
    this.x += x / sqrt * this.move_speed;
    this.y += y / sqrt * this.move_speed;
    
    // collide
    for (const t of Thing.things) {
      if (t === this || !t.map) continue;
      switch (t.shape) {
        case "line":
          collide.line_circle()
      }
    }
  }

};

const among = new Among();

const tick = () => {
  
  time += 1;
  Thing.tick_all();

  // nice smooth camera
  const smooth_amount = 0.05;
  camera.x = util.lerp(camera.x, -among.x + _w / 2, smooth_amount);
  camera.y = util.lerp(camera.y, -among.y + _h / 2, smooth_amount);

};

const draw = () => {

  // draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, _w, _h);

  ctx.save();
  ctx.translate(camera.x, camera.y);
  Thing.draw_all();
  ctx.restore();

  // draw foreground

  // draw UI

};

// main loop

const loop = () => {
  
  tick();
  draw();
  // audio

};

const init = () => {
  make_map();
};

const make_map = () => {
  for (const element of among_map) {
    const t = new Thing(element);
    t.map = true;
  }
};

const main = (event) => {

  init();

  setInterval(loop, 16);

};

// event listeners

const mouse_down = () => {

};

const mouse_up = () => {

};

const mouse_right = () => {

};

const update_mouse = (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};

const keys = {

};

const key_listeners = {

};

window.addEventListener("load", main);

window.addEventListener("resize", function(event) {
  _w = window.innerWidth;
  _h = window.innerHeight;
  canvas.width = _w;
  canvas.height = _h;
});

window.addEventListener("mousemove", update_mouse);
window.addEventListener("mousedown", function(event) {
  update_mouse(event);
  /*
  if (event.buttons > 0) {
    Dot.for_each((dot) => {
      dot.x = _mx;
      dot.y = _my;
    });
  }
  */
  mouse.down = true;
  mouse_down();
});
window.addEventListener("mouseup", function(event) {
  mouse.down = false;
  mouse_up();
});
window.addEventListener("contextmenu", function(event) {
  event.preventDefault();
  mouse_right();
});

window.addEventListener("keypress", function(event) {
  event.preventDefault();
  const listener = key_listeners[event.code];
  if (listener != null) {
    listener();
  }
});

window.addEventListener("keydown", function(event) {
  keys[event.code] = true;
});

window.addEventListener("keyup", function(event) {
  keys[event.code] = false;
});
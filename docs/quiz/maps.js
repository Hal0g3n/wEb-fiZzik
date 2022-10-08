import { C } from "./lib.js";
import { Thing } from "./thing.js";
import { util } from "./util.js";

const Vector = Matter.Vector;

const sqrt_2 = Math.sqrt(2);
const sqrt_3 = Math.sqrt(3);

const degrees_22 = util.deg_to_rad(22.5);
const degrees_45 = util.deg_to_rad(45);
const degrees_90 = degrees_45 * 2;
const degrees_30 = util.deg_to_rad(30);
const degrees_60 = degrees_30 * 2;
const degrees_120 = degrees_60 * 2;

// map 
const translate = (list, tx = 0, ty = 0) => {
  for (const M of list) {
    M.x = (M.x || 0) + tx;
    M.y = (M.y || 0) + ty;
  }
  return list;
};

export const player_starting_position = {
  x: 0,
  y: 0,
};

const main_map = [

  // borders
  { shapes: [{ type: "line", x1: 10000, y1: 10000, x2: 10000, y2: -10000, }], parent: "border", },
  { shapes: [{ type: "line", x1: 10000, y1: 10000, x2: -10000, y2: 10000, }], parent: "border", },
  { shapes: [{ type: "line", x1: -10000, y1: -10000, x2: 10000, y2: -10000, }], parent: "border", },
  { shapes: [{ type: "line", x1: -10000, y1: -10000, x2: -10000, y2: 10000, }], parent: "border", },

  // ***** cafeteria *****
  ...translate([
    { shapes: [{ type: "line", x1: -500, y1: -70, x2: -500, y2: -200, }] },
    { shapes: [{ type: "line", x1: -500, y1: -200, x2: -300, y2: -400, }] },
    { shapes: [{ type: "line", x1: -300, y1: -400, x2: 300, y2: -400, }] },
    { shapes: [{ type: "line", x1: 300, y1: -400, x2: 500, y2: -200, }] },
    { shapes: [{ type: "line", x1: 500, y1: -200, x2: 500, y2: -70, }] },
    { shapes: [{ type: "line", x1: 500, y1: 70, x2: 500, y2: 300, }] },
    { shapes: [{ type: "line", x1: 500, y1: 300, x2: 300, y2: 500, }] },
    { shapes: [{ type: "line", x1: 300, y1: 500, x2: -200, y2: 500, }] },
    { shapes: [{ type: "line", x1: -200, y1: 500, x2: -500, y2: 200, }] },
    { shapes: [{ type: "line", x1: -500, y1: 200, x2: -500, y2: 70, }] },
    { shapes: [
      { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
      { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
      x: -250, y: 250, color: C.table_blue, parent: "window",
    },
    { shapes: [
      { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
      { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
      x: -250, y: -150, color: C.table_blue, parent: "window",
    },
    { shapes: [
      { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
      { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
      x: 250, y: 250, color: C.table_blue, parent: "window",
    },
    { shapes: [
      { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
      { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
      x: 250, y: -150, color: C.table_blue, parent: "window",
    },
    { shapes: [
      { type: "polygon", sides: 8, r: 100, rotation: degrees_22, color: C.light_table_blue, },
      { type: "polygon", sides: 8, r: 80, rotation: degrees_22, stroke: C.white, line_width: 3, body: true, }],
      x: 0, y: 50, color: C.table_blue,
    },

    // "secret"
    { shapes: [{ type: "line", x1: -500 - 60 * sqrt_2, y1: -70, x2: -500 - 60 * sqrt_2, y2: -200, }] },
    { shapes: [{ type: "line", x1: -500 - 60 * sqrt_2, y1: -200, x2: -300, y2: -400 - 60 * sqrt_2, }] },
    { shapes: [{ type: "line", x1: -300, y1: -400 - 60 * sqrt_2, x2: -40, y2: -400 - 60 * sqrt_2, }] },
    { shapes: [{ type: "line", x1: 40, y1: -400 - 60 * sqrt_2, x2: 300, y2: -400 - 60 * sqrt_2, }] },
    { shapes: [{ type: "line", x1: 300, y1: -400 - 60 * sqrt_2, x2: 500 + 60 * sqrt_2, y2: -200, }] },
    { shapes: [{ type: "line", x1: 500 + 60 * sqrt_2, y1: -200, x2: 500 + 60 * sqrt_2, y2: -70, }] },

    // right passage
    { shapes: [{ type: "line", x1: 500 + 60 * sqrt_2, y1: -70, x2: 800, y2: -70, }] },
    { shapes: [{ type: "line", x1: 500, y1: 70, x2: 800, y2: 70, }] },

    // left passage
    { shapes: [{ type: "line", x1: -500 - 60 * sqrt_2, y1: -70, x2: -800, y2: -70, }] },
    { shapes: [{ type: "line", x1: -500, y1: 70, x2: -800, y2: 70, }] },

  ], 0, 0),
  /*
  { shapes: [{ type: "line", x1: 200, y1: 200, x2: 200, y2: -200, }] },
  { shapes: [{ type: "line", x1: 200, y1: 200, x2: -200, y2: 200, }] },
  { shapes: [{ type: "line", x1: -200, y1: -200, x2: 200, y2: -200, }] },
  { shapes: [{ type: "line", x1: -200, y1: -200, x2: -200, y2: 200, }] },
  { shapes: [{ type: "line", x1: -140, y1: -100, x2: 30, y2: 100, }] },
  { shapes: [{ type: "line", x1: 80, y1: -30, x2: 50, y2: 140, }], parent: "door", spin: 0.01, },
  { shapes: [{ type: "polygon", sides: 4, r: 10, line_width: 0, }], x: 100, y: -100, static: false, fixed: false, parent: "wall", },
  */
];

const make_map = () => {

  for (const M of main_map) {

    if (M.parent == null) {
      M.parent = "wall";
    }

    for (let si = 0; si < M.shapes.length; si++) {
      const s = M.shapes[si];
      if (s.type === "line" && (si === 0 || s.body)) {
        s.type = "rectangle";
        const x = s.x2 - s.x1;
        const y = s.y2 - s.y1;
        const newx = (s.x1 + s.x2) / 2;
        const newy = (s.y1 + s.y2) / 2;
        s.x = 0;
        s.y = 0;
        s.w = 1;
        s.h = Math.sqrt(x * x + y * y) / 2;
        s.body = true;
        M.position = Vector.create(newx + (M.x || 0), newy + (M.y || 0)); // use position instead of x and y for one less Vector.create()?
        M.angle = Math.atan2(newx - s.x2, s.y2 - newy);
        break;
      }
    }

    // console.log(JSON.stringify(M));

    const t = new Thing(M.position);
    t.make(M);
    t.create();
    
  }

};

export const init_map = () => {
  make_map();
};
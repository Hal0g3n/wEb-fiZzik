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
  if (tx === 0 && ty === 0) return list;
  for (const M of list) {
    M.x = (M.x || 0) + tx;
    M.y = (M.y || 0) + ty;
    if (M.constraint != null) {
      let oo = M.constraint;
      if (!Array.isArray(oo)) {
        oo = [oo];
      }
      for (const o of oo) {
        o.x = (o.x || 0) + tx;
        o.y = (o.y || 0) + ty;
      }
    }
  }
  return list;
};

const old_player_starting_position = {
  x: 0,
  y: -100,
};

export const player_starting_position = {
  x: 0,
  y: -100,
};

const map_cafeteria = [

  // walls
  { shapes: [{ type: "line", x1: -500, y1: -70, x2: -500, y2: -200, }] },
  { shapes: [{ type: "line", x1: -500, y1: -200, x2: -300, y2: -400, }] },
  { shapes: [{ type: "line", x1: -300, y1: -400, x2: 300, y2: -400, }] },
  { shapes: [{ type: "line", x1: 300, y1: -400, x2: 500, y2: -200, }] },
  { shapes: [{ type: "line", x1: 500, y1: -200, x2: 500, y2: -70, }] },
  { shapes: [{ type: "line", x1: 500, y1: 70, x2: 500, y2: 300, }] },
  { shapes: [{ type: "line", x1: 500, y1: 300, x2: 300, y2: 500, }] },
  { shapes: [{ type: "line", x1: 300, y1: 500, x2: 75, y2: 500, }] },
  { shapes: [{ type: "line", x1: -25, y1: 500, x2: -200, y2: 500, }] },
  { shapes: [{ type: "line", x1: -200, y1: 500, x2: -500, y2: 200, }] },
  { shapes: [{ type: "line", x1: -500, y1: 200, x2: -500, y2: 70, }] },

  // "tables"
  { shapes: [
    { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
    { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
    x: -250, y: 250, color: C.table_blue, parent: "movewindow",
    constraint: [{ type: "fix_point", stiffness: 0.01, }], fix_angle: 0, restitution: 2,
    message: "Boing!",
  },
  { shapes: [
    { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
    { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
    x: -250, y: -150, color: C.table_blue, parent: "movewindow",
    constraint: [{ type: "fix_point", stiffness: 0.01, }], fix_angle: 0, restitution: 2,
    message: "Boing!",
  },
  { shapes: [
    { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
    { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
    x: 250, y: 250, color: C.table_blue, parent: "movewindow",
    constraint: [{ type: "fix_point", stiffness: 0.01, }], fix_angle: 0, restitution: 2,
    message: "Boing!",
  },
  { shapes: [
    { type: "polygon", sides: 8, r: 75, rotation: degrees_22, color: C.light_table_blue, },
    { type: "polygon", sides: 8, r: 60, rotation: degrees_22, body: true, }],
    x: 250, y: -150, color: C.table_blue, parent: "movewindow",
    constraint: [{ type: "fix_point", stiffness: 0.01, }], fix_angle: 0, restitution: 2,
    message: "Boing!",
  },

  // main table
  { shapes: [
    { type: "polygon", sides: 8, r: 100, rotation: degrees_22, color: C.light_table_blue, },
    { type: "polygon", sides: 8, r: 80, rotation: degrees_22, stroke: C.white, line_width: 3, body: true, }],
    x: 0, y: 50, color: C.table_blue, message: "There used to be a red button here... where did it go?",
  },
  { shapes: [{ type: "svg", svg: "food", x: 0, y: 200, r: 50, }], parent: "floor", color: C.floor_symbol, },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 15, }], x: 0, y: -350, parent: "task", task: 1, },

  // "secret"
  { shapes: [{ type: "line", x1: -500 - 60 * sqrt_2, y1: -70, x2: -500 - 60 * sqrt_2, y2: -200, }] },
  { shapes: [{ type: "line", x1: -500 - 60 * sqrt_2, y1: -200, x2: -300, y2: -400 - 60 * sqrt_2, }] },
  { shapes: [{ type: "line", x1: -300, y1: -400 - 60 * sqrt_2, x2: -40, y2: -400 - 60 * sqrt_2, }] },
  { shapes: [{ type: "line", x1: 40, y1: -400 - 60 * sqrt_2, x2: 300, y2: -400 - 60 * sqrt_2, }] },
  { shapes: [{ type: "line", x1: 300, y1: -400 - 60 * sqrt_2, x2: 500 + 60 * sqrt_2, y2: -200, }] },
  { shapes: [{ type: "line", x1: 500 + 60 * sqrt_2, y1: -200, x2: 500 + 60 * sqrt_2, y2: -70, }] },
  
  // sus room
  {
    shapes: [{ type: "line", x1: -40, y1: -400 - 60 * sqrt_2, x2: 0, y2: -400 - 60 * sqrt_2 }],
    parent: "door", constraint: [{ type: "pivot", x: -40, y: -400 - 60 * sqrt_2, }, { type: "fix_point", x: 0, y: -400 - 60 * sqrt_2, }],
    message: "Sus?", message_once: false,
  },
  {
    shapes: [{ type: "line", x1: 40, y1: -400 - 60 * sqrt_2, x2: 0, y2: -400 - 60 * sqrt_2 }],
    parent: "door", constraint: [{ type: "pivot", x: 40, y: -400 - 60 * sqrt_2, }, { type: "fix_point", x: 0, y: -400 - 60 * sqrt_2, }],
    message: "Sus?", message_once: false,
  },
  { shapes: [{ type: "line", x1: 40, y1: -400 - 60 * sqrt_2, x2: 40, y2: -550, }] },
  { shapes: [{ type: "line", x1: -40, y1: -400 - 60 * sqrt_2, x2: -40, y2: -550, }] },
  { shapes: [{ type: "line", x1: 40, y1: -550, x2: 300, y2: -550, }] },
  { shapes: [{ type: "line", x1: -40, y1: -550, x2: -300, y2: -550, }] },
  { shapes: [{ type: "line", x1: 300, y1: -1000, x2: 300, y2: -550, }] },
  { shapes: [{ type: "line", x1: -300, y1: -1000, x2: -300, y2: -550, }] },
  { shapes: [{ type: "line", x1: -300, y1: -1000, x2: 300, y2: -1000, }] },
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: 0, y: -775, parent: "task", task: 16, },
  { shapes: [{ type: "svg", svg: "amogus", x: -140, y: -950, r: 1.5, }], parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "amogus_visor", x: -140, y: -950, r: 1.5, }], parent: "floor", color: C.floor_symbol, },
  
  // doors
  {
    shapes: [{ type: "line", x1: 500.1, y1: -70, x2: 500 + 59.95 * sqrt_2, y2: -70, }],
    parent: "door", constraint: [{ type: "pivot", x: 500 + 59.95 * sqrt_2, y: -70, }, { type: "fix_point", x: 500.1, y: -70, }],
    message: "Wow, a door! I've never seen one before!", message_once: true, // why does this rhyme
  },
  {
    shapes: [{ type: "line", x1: -500.1, y1: -70, x2: -500 - 59.95 * sqrt_2, y2: -70, }],
    parent: "door", constraint: [{ type: "pivot", x: -500 - 59.95 * sqrt_2, y: -70, }, { type: "fix_point", x: -500.1, y: -70, }],
  },

  // spinning door and bottom passage
  {
    shapes: [{ type: "line", x1: -25, y1: 500, x2: 75, y2: 500, }],
    parent: "door", constraint: [{ type: "pivot", x: 25, y: 500, }, { type: "fix_point", x: -24.9, y: 500, }, /*{ type: "fix_point", x: 74, y: 500, } */],
  },
  { shapes: [{ type: "svg", svg: "arrow_down", x: 25, y: 470, r: 30, }], parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "line", x1: 90, y1: 500, x2: 72, y2: 680, }] },
  { shapes: [{ type: "line", x1: 62, y1: 780, x2: 50, y2: 900, }] },
  { shapes: [{ type: "line", x1: -40, y1: 500, x2: 0, y2: 900, }] },
  { shapes: [{ type: "line", x1: 0, y1: 900, x2: 0, y2: 1000, }] },
  { shapes: [{ type: "line", x1: 50, y1: 900, x2: 50, y2: 1000, }] },


  // left passage
  { shapes: [{ type: "line", x1: -500 - 60 * sqrt_2, y1: -70, x2: -1200, y2: -70, }] },
  { shapes: [{ type: "line", x1: -500, y1: 70, x2: -700, y2: 70, }] },
  { shapes: [{ type: "svg", svg: "arrow_left", x: -450, y: 0, r: 75, }], parent: "floor", color: C.floor_symbol, },

  // right passage
  { shapes: [{ type: "line", x1: 500 + 60 * sqrt_2, y1: -70, x2: 800, y2: -70, }] },
  { shapes: [{ type: "line", x1: 500, y1: 70, x2: 800, y2: 70, }] },
  { shapes: [{ type: "svg", svg: "arrow_right", x: 450, y: 0, r: 75, }], parent: "floor", color: C.floor_symbol, },

  // vent
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 450, y: 150, parent: "floor", color: C.floor_symbol, },

];

const map_medbay = [

  // walls
  { shapes: [{ type: "line", x1: -65, y1: 0, x2: -150, y2: 0, }] },
  { shapes: [{ type: "line", x1: -150, y1: 0, x2: -150, y2: 300, }] },
  { shapes: [{ type: "line", x1: -150, y1: 300, x2: -50, y2: 400, }] },
  { shapes: [{ type: "line", x1: -50, y1: 400, x2: 400, y2: 400, }] },
  { shapes: [{ type: "line", x1: 400, y1: 400, x2: 400, y2: 350, }] },
  { shapes: [{ type: "line", x1: 400, y1: 350, x2: 200, y2: 350, }] },
  { shapes: [{ type: "line", x1: 200, y1: 350, x2: 150, y2: 300, }] },
  { shapes: [{ type: "line", x1: 150, y1: 300, x2: 150, y2: 0, }] },
  { shapes: [{ type: "line", x1: 150, y1: 0, x2: 65, y2: 0, }] },

  // beds
  { shapes: [{ type: "rectangle", w: 60, h: 30, body: true, }, { type: "rectangle", w: 12.5, h: 25, x: 43, color: C.offwhite, }],
    x: 89, y: 60, parent: "movewindow", color: C.bed_blue,
    constraint: [{ type: "fix_point", stiffness: 0.009, }], fix_angle: 0,
  },
  { shapes: [{ type: "rectangle", w: 60, h: 30, body: true, }, { type: "rectangle", w: 12.5, h: 25, x: -43, color: C.offwhite, }],
    x: -89, y: 120, parent: "movewindow", color: C.bed_blue,
    constraint: [{ type: "fix_point", stiffness: 0.009, }], fix_angle: 0,
  },
  { shapes: [{ type: "rectangle", w: 60, h: 30, body: true, }, { type: "rectangle", w: 12.5, h: 25, x: 43, color: C.offwhite, }],
    x: 89, y: 180, parent: "movewindow", color: C.bed_blue,
    constraint: [{ type: "fix_point", stiffness: 0.009, }], fix_angle: 0,
  },
  { shapes: [{ type: "rectangle", w: 60, h: 30, body: true, }, { type: "rectangle", w: 12.5, h: 25, x: -43, color: C.offwhite, }],
    x: -89, y: 240, parent: "movewindow", color: C.bed_blue,
    constraint: [{ type: "fix_point", stiffness: 0.009, }], fix_angle: 0,
  },

  // doors
  {
    shapes: [{ type: "line", x1: -64.9, y1: 0, x2: 0, y2: 0, }],
    parent: "door", constraint: [{ type: "pivot", x: -64, y: 0, }, { type: "fix_point", x: -1, y: 0, }],
  },
  {
    shapes: [{ type: "line", x1: 64.9, y1: 0, x2: 0, y2: 0, }],
    parent: "door", constraint: [{ type: "pivot", x: 64, y: 0, }, { type: "fix_point", x: 1, y: 0, }],
  },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: 125, y: 250, parent: "task", task: 2, },
  { shapes: [{ type: "polygon", sides: 6, r: 20, }], x: 325, y: 375, parent: "task", task: 11, },

  // floor
  { shapes: [{ type: "svg", svg: "arrow_down", r: 25, }], x: 0, y: -25, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "medical", r: 50, }], x: 75, y: 300, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: -75, y: 325, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "arrow_right", r: 30, }], x: 250, y: 375, parent: "floor", color: C.floor_symbol, },

];

const map_admin = [

  // walls
  { shapes: [{ type: "line", x1: 5, y1: -50, x2: 450, y2: -50, }] },
  { shapes: [{ type: "line", x1: 450, y1: -50, x2: 450, y2: 200, }] },
  { shapes: [{ type: "line", x1: 450, y1: 200, x2: 380, y2: 250, }] },
  { shapes: [{ type: "line", x1: 380, y1: 250, x2: 100, y2: 250, }] },
  { shapes: [{ type: "line", x1: 100, y1: 250, x2: 100, y2: 50, }] },
  { shapes: [{ type: "line", x1: 100, y1: 50, x2: -5, y2: 50, }] },

  // floor
  { shapes: [{ type: "svg", svg: "arrow_right", r: 25, }], x: 0, y: 0, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "admin", r: 50, }], x: 410, y: 0, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 150, y: 200, parent: "floor", color: C.floor_symbol, },

  // main table
  { shapes: [
    { type: "rectangle", w: 80, h: 50, color: C.grey, },
    { type: "rectangle", w: 60, h: 30, body: true, stroke: C.lime, line_width: 10, }],
    x: 275, y: 125, color: C.lime,
  },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: 400, y: 205, parent: "task", task: 3,  },

];

const map_weapons = [

  // walls
  { shapes: [{ type: "line", x1: 0, y1: -70, x2: 0, y2: -300, }] },
  { shapes: [{ type: "line", x1: 0, y1: -300, x2: 150, y2: -300, }] },
  { shapes: [{ type: "line", x1: 150, y1: -300, x2: 450, y2: 0, }] },
  { shapes: [{ type: "line", x1: 450, y1: 0, x2: 450, y2: 250, }] },
  { shapes: [{ type: "line", x1: 450, y1: 250, x2: 200, y2: 250, }] },
  { shapes: [{ type: "line", x1: 100, y1: 250, x2: 50, y2: 250, }] },
  { shapes: [{ type: "line", x1: 50, y1: 250, x2: 0, y2: 200, }] },
  { shapes: [{ type: "line", x1: 0, y1: 200, x2: 0, y2: 70, }] },

  // railings
  { shapes: [{ type: "line", x1: 1, y1: 70, x2: 50, y2: 70, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 50, y1: 70, x2: 100, y2: 150, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 100, y1: 150, x2: 100, y2: 249, }], parent: "window", color: C.window_red, },

  { shapes: [{ type: "line", x1: 1, y1: -70, x2: 70, y2: -70, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 70, y1: -70, x2: 70, y2: -299, }], parent: "window", color: C.window_red, },

  { shapes: [{ type: "line", x1: 449, y1: 0, x2: 350, y2: 0, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 350, y1: 0, x2: 200, y2: 150, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 200, y1: 150, x2: 200, y2: 249, }], parent: "window", color: C.window_red, },

  // floor
  { shapes: [{ type: "svg", svg: "sword", r: 50, }], x: 190, y: 0, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 115, y: -260, parent: "floor", color: C.floor_symbol, },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: 250, y: -120, parent: "task", task: 4, },


];

const map_co2 = [ // co2, not o2! neutron stars like consuming co2. yum yum!

  // walls
  { shapes: [{ type: "line", x1: -100, y1: -150, x2: -100, y2: -50, }] },
  { shapes: [{ type: "line", x1: -100, y1: -50, x2: -200, y2: -50, }] },
  { shapes: [{ type: "line", x1: -200, y1: -50, x2: -200, y2: -70, }] },
  { shapes: [{ type: "line", x1: -200, y1: -70, x2: -430, y2: -70, }] },
  { shapes: [{ type: "line", x1: -430, y1: -70, x2: -430, y2: -50, }] },
  { shapes: [{ type: "line", x1: -430, y1: -50, x2: -500, y2: 0, }] },
  { shapes: [{ type: "line", x1: -500, y1: 0, x2: -500, y2: 200, }] },
  { shapes: [{ type: "line", x1: -500, y1: 200, x2: -200, y2: 200, }] },
  { shapes: [{ type: "line", x1: -200, y1: 200, x2: -200, y2: 50, }] },
  { shapes: [{ type: "line", x1: -200, y1: 50, x2: 100, y2: 50, }] },
  { shapes: [{ type: "line", x1: 100, y1: 50, x2: 100, y2: 200, }] },
  { shapes: [{ type: "line", x1: 100, y1: 200, x2: -100, y2: 200, }] },
  { shapes: [{ type: "line", x1: -100, y1: 200, x2: -100, y2: 550, }] },
  { shapes: [{ type: "line", x1: 0, y1: 550, x2: 0, y2: 300, }] },
  { shapes: [{ type: "line", x1: 0, y1: 300, x2: 200, y2: 300, }] },
  { shapes: [{ type: "line", x1: 200, y1: 300, x2: 200, y2: 175, }] },
  { shapes: [{ type: "line", x1: 200, y1: 175, x2: 400, y2: 175, }] },
  { shapes: [{ type: "line", x1: 400, y1: 75, x2: 200, y2: 75, }] },
  { shapes: [{ type: "line", x1: 200, y1: 75, x2: 200, y2: -50, }] },
  { shapes: [{ type: "line", x1: 200, y1: -50, x2: 0, y2: -50, }] },
  { shapes: [{ type: "line", x1: 0, y1: -50, x2: 0, y2: -150, }] },
  { shapes: [{ type: "polygon", sides: 10, r: 20, stroke: C.white, line_width: 3, }], x: -350, y: 75, spin: -0.01, parent: "movewall", balloon: 5.5, },
  
  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: -480, y: 180, parent: "task", task: 5, },

  // floor
  { shapes: [{ type: "svg", svg: "co2", r: 50, }], x: -150, y: 0, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "arrow_left", r: 35, }], x: -200, y: 0, parent: "floor", color: C.floor_symbol, },

  { shapes: [{ type: "svg", svg: "plane", r: 50, }], x: 350, y: 125, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "arrow_right", r: 35, }], x: 400, y: 125, parent: "floor", color: C.floor_symbol, },

];

const map_navigation = [ // hmmm snake?

  // walls
  { shapes: [{ type: "line", x1: -101, y1: -50, x2: 0, y2: -50, }] },
  { shapes: [{ type: "line", x1: 0, y1: -50, x2: 0, y2: -300, }] },
  { shapes: [{ type: "line", x1: 0, y1: -300, x2: 350, y2: -300, }] },
  { shapes: [{ type: "line", x1: 350, y1: -300, x2: 500, y2: -75, }] },
  { shapes: [{ type: "line", x1: 500, y1: -75, x2: 500, y2: 75, }] },
  { shapes: [{ type: "line", x1: 500, y1: 75, x2: 350, y2: 300, }] },
  { shapes: [{ type: "line", x1: 350, y1: 300, x2: 0, y2: 300, }] },
  { shapes: [{ type: "line", x1: 0, y1: 300, x2: 0, y2: 50, }] },
  { shapes: [{ type: "line", x1: 0, y1: 50, x2: -101, y2: 50, }] },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 15, }], x: 5, y: 0, parent: "task", task: 8,
    message: "Why is this task blocking my way???", message_once: true,
  },
  { shapes: [{ type: "polygon", sides: 6, r: 25, }], x: 450, y: 0, parent: "task", task: 99,
    message: "Snake!!!", message_once: true,
  },

  // floor
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 50, y: -250, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 50, y: 250, parent: "floor", color: C.floor_symbol, },

];

const map_shields = [ // it's just map_weapons, but in the opposite y-direction!

  // walls
  { shapes: [{ type: "line", x1: 0, y1: 70, x2: 0, y2: 300, }] },
  { shapes: [{ type: "line", x1: 0, y1: 300, x2: 150, y2: 300, }] },
  { shapes: [{ type: "line", x1: 150, y1: 300, x2: 450, y2: 0, }] },
  { shapes: [{ type: "line", x1: 450, y1: 0, x2: 450, y2: -250, }] },
  { shapes: [{ type: "line", x1: 450, y1: -250, x2: 200, y2: -250, }] },
  { shapes: [{ type: "line", x1: 100, y1: -250, x2: 50, y2: -250, }] },
  { shapes: [{ type: "line", x1: 50, y1: -250, x2: 0, y2: -200, }] },
  { shapes: [{ type: "line", x1: 0, y1: -200, x2: 0, y2: -70, }] },

  // railings
  { shapes: [{ type: "line", x1: 1, y1: -70, x2: 50, y2: -70, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 50, y1: -70, x2: 100, y2: -150, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 100, y1: -150, x2: 100, y2: -249, }], parent: "window", color: C.window_red, },

  { shapes: [{ type: "line", x1: 1, y1: 70, x2: 70, y2: 70, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 70, y1: 70, x2: 70, y2: 299, }], parent: "window", color: C.window_red, },
  
  { shapes: [{ type: "line", x1: 449, y1: 0, x2: 350, y2: 0, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 350, y1: 0, x2: 200, y2: -150, }], parent: "window", color: C.window_red, },
  { shapes: [{ type: "line", x1: 200, y1: -150, x2: 200, y2: -249, }], parent: "window", color: C.window_red, },

  // floor
  { shapes: [{ type: "svg", svg: "shield", r: 50, }], x: 190, y: 0, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 115, y: 260, parent: "floor", color: C.floor_symbol, },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: 250, y: 120, parent: "task", task: 9, },

];

const map_communications = [
  
  // walls
  { shapes: [{ type: "line", x1: 250, y1: -70, x2: -250, y2: -50, }] },
  { shapes: [{ type: "line", x1: 250, y1: 70, x2: 20, y2: 61, }] },
  { shapes: [{ type: "line", x1: -20, y1: 59, x2: -250, y2: 50, }] },
  { shapes: [{ type: "line", x1: 20, y1: 61, x2: 20, y2: 150, }] },
  { shapes: [{ type: "line", x1: 20, y1: 150, x2: 200, y2: 150, }] },
  { shapes: [{ type: "line", x1: 200, y1: 150, x2: 200, y2: 350, }] },
  { shapes: [{ type: "line", x1: 200, y1: 400, x2: -200, y2: 400, }] },
  { shapes: [{ type: "line", x1: -200, y1: 350, x2: -200, y2: 150, }] },
  { shapes: [{ type: "line", x1: -200, y1: 350, x2: -150, y2: 400, }] },
  { shapes: [{ type: "line", x1:  200, y1: 350, x2:  150, y2: 400, }] },
  { shapes: [{ type: "line", x1: -200, y1: 150, x2: -20, y2: 150, }] },
  { shapes: [{ type: "line", x1: -20, y1: 150, x2: -20, y2: 59, }] },

  // floor
  { shapes: [{ type: "svg", svg: "chat", r: 50, }], x: -150, y: 200, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "arrow_down", r: 25, }], x: 0, y: 100, parent: "floor", color: C.floor_symbol, },

  // Tasks  
  { shapes: [{ type: "polygon", sides: 6, r: 7, }], x: 170, y: 300, parent: "task", task: 13, },

];

const map_storage = [

  // walls
  { shapes: [{ type: "line", x1: 25, y1: 0, x2: 275, y2: 0, }] },
  { shapes: [{ type: "line", x1: 275, y1: 0, x2: 275, y2: 150, }] },
  { shapes: [{ type: "line", x1: 275, y1: 250, x2: 275, y2: 700, }] },
  { shapes: [{ type: "line", x1: 200, y1: 700, x2: -250, y2: 700, }] },
  { shapes: [{ type: "line", x1: -250, y1: 700, x2: -300, y2: 650, }] },
  { shapes: [{ type: "line", x1: -300, y1: 550, x2: -300, y2: 50, }] },
  { shapes: [{ type: "line", x1: -300, y1: 50, x2: -250, y2: 0, }] },
  { shapes: [{ type: "line", x1: -250, y1: 0, x2: -25, y2: 0, }] },
  { shapes: [{ type: "line", x1: -300, y1: 50, x2: -250, y2: 0, }] },

  // doors
  /*
  {
    shapes: [{ type: "line", x1: 275, y1: 150.1, x2: 275, y2: 249.9, }],
    parent: "door", constraint: [{ type: "fix_point", x: 275, y: 150.1, }, { type: "fix_point", x: 275, y: 249.9, }],
  },
  */
  { shapes: [{ type: "line", x1: 235, y1: 150, x2: 235, y2: 250, }] },
  /*
  {
    shapes: [{ type: "line", x1: -300, y1: 550.1, x2: -300, y2: 649.9, }],
    parent: "door", constraint: [{ type: "fix_point", x: 275, y: 550.1, }, { type: "fix_point", x: 275, y: 649.9, }],
  },
  */
  { shapes: [{ type: "line", x1: -260, y1: 550, x2: -260, y2: 650, }] },


  // boxes
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: 0, y: 350, parent: "box", },
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: -1, y: 350, parent: "box", },
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: -2, y: 349, parent: "box", },
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: -3, y: 351, parent: "box", },
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: -4, y: 360, parent: "box", },
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: -10, y: 370, parent: "box", },
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: -20, y: 380, parent: "box", },
  { shapes: [{ type: "polygon", sides: 4, r: 30, rotation: degrees_45, }], x: -30, y: 390, parent: "box", },
  { shapes: [{ type: "line", x1: 200, y1: 700, x2: 275, y2: 700, }], parent: "rubbishwall", },
  { shapes: [{ type: "line", x1: 200, y1: 765, x2: 275, y2: 765, }], parent: "wall", delete_box: true, },

  // floor
  { shapes: [{ type: "svg", svg: "box", r: 50, }], x: 225, y: 650, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "arrow_down", r: 25, }], x: 0, y: -50, parent: "floor", color: C.floor_symbol, },

];

const map_electrical = [

  // walls
  { shapes: [{ type: "line", x1: 400, y1: 100, x2: -300, y2: 100, }] },
  { shapes: [{ type: "line", x1: -300, y1: 100, x2: -300, y2: -100, }] },
  { shapes: [{ type: "line", x1: -300, y1: -100, x2: -400, y2: -100, }] },

  { shapes: [{ type: "line", x1: 400, y1: 0, x2: 100, y2: 0, }] },
  { shapes: [{ type: "line", x1: 100, y1: 0, x2: 400, y2: -500, }] },
  { shapes: [{ type: "line", x1: 400, y1: -500, x2: -100, y2: -500, }] },
  { shapes: [{ type: "line", x1: -100, y1: -500, x2: -100, y2: 0, }] },
  { shapes: [{ type: "line", x1: -100, y1: 0, x2: -200, y2: 0, }] },
  { shapes: [{ type: "line", x1: -200, y1: 0, x2: -200, y2: -200, }] },
  { shapes: [{ type: "line", x1: -200, y1: -200, x2: -400, y2: -200, }] },

  // doors
  {
    shapes: [{ type: "line", x1: -99.9, y1: 0, x2: 0, y2: 0, }],
    parent: "door", constraint: [{ type: "pivot", x: -99, y: 0, }, { type: "fix_point", x: -1, y: 0, }],
  },
  {
    shapes: [{ type: "line", x1: 99.9, y1: 0, x2: 0, y2: 0, }],
    parent: "door", constraint: [{ type: "pivot", x: 99, y: 0, }, { type: "fix_point", x: 1, y: 0, }],
  },

  // electric box
  { shapes: [{ type: "rectangle", w: 1, h: 25, x: 43, }, { type: "rectangle", w: 100, h: 50, body: true, stroke: C.white, line_width: 3, }],
    x: 1, y: -300, parent: "movable", color: C.grey,
    constraint: [{ type: "fix_point", stiffness: 0.01, }], fix_angle: 0,
  },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: 0, y: -425, parent: "task", task: 10, },
  { shapes: [{ type: "polygon", sides: 6, r: 7, }], x: 385, y: -491.5, parent: "task", task: 12, },

  // floor
  { shapes: [{ type: "svg", svg: "lightning", r: 50, }], x: 0, y: -175, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: -65, y: -470, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "arrow_right", r: 25, rotation: -degrees_22, }], x: 350, y: -475, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "arrow_up", r: 25, }], x: 0, y: 25, parent: "floor", color: C.floor_symbol, },

]

const map_engines = [ // with corridors!

  // lower engine walls
  { shapes: [{ type: "line", x1: 200, y1: 750, x2: 0, y2: 750, }] },
  { shapes: [{ type: "line", x1: 0, y1: 750, x2: 0, y2: 950, }] },
  { shapes: [{ type: "line", x1: 0, y1: 950, x2: -400, y2: 950, }] },
  { shapes: [{ type: "line", x1: -400, y1: 950, x2: -500, y2: 850, }] },
  { shapes: [{ type: "line", x1: -500, y1: 850, x2: -500, y2: 450, }] },
  { shapes: [{ type: "line", x1: -500, y1: 450, x2: -290, y2: 450, }] },
  { shapes: [{ type: "line", x1: -210, y1: 450, x2: 0, y2: 450, }] },
  { shapes: [{ type: "line", x1: 0, y1: 450, x2: 0, y2: 650, }] },
  { shapes: [{ type: "line", x1: 0, y1: 650, x2: 200, y2: 650, }] },

  // upper engine walls
  { shapes: [{ type: "line", x1: 200, y1: -770, x2: 0, y2: -770, }] },
  { shapes: [{ type: "line", x1: 0, y1: -770, x2: 0, y2: -950, }] },
  { shapes: [{ type: "line", x1: 0, y1: -950, x2: -400, y2: -950, }] },
  { shapes: [{ type: "line", x1: -400, y1: -950, x2: -500, y2: -850, }] },
  { shapes: [{ type: "line", x1: -500, y1: -850, x2: -500, y2: -450, }] },
  { shapes: [{ type: "line", x1: -500, y1: -450, x2: -290, y2: -450, }] },
  { shapes: [{ type: "line", x1: -210, y1: -450, x2: 0, y2: -450, }] },
  { shapes: [{ type: "line", x1: 0, y1: -450, x2: 0, y2: -630, }] },
  { shapes: [{ type: "line", x1: 0, y1: -630, x2: 300, y2: -630, }] },

  // corridor
  { shapes: [{ type: "line", x1: -290, y1: -450, x2: -290, y2: -100, }] },
  { shapes: [{ type: "line", x1: -290, y1: 100, x2: -290, y2: 450, }] },
  { shapes: [{ type: "line", x1: -210, y1: -450, x2: -210, y2: -100, }] },
  { shapes: [{ type: "line", x1: -210, y1: 100, x2: -210, y2: 450, }] },
  

  // both engines
  { shapes: [{ type: "rectangle", w: 1, h: 25, x: 43, }, { type: "rectangle", w: 150, h: 100, body: true, stroke: C.window_red, line_width: 3, }],
  x: -351, y: 700, parent: "movable", color: C.grey,
  constraint: [{ type: "fix_point", stiffness: 0.01, }], fix_angle: 0,
  },
  { shapes: [{ type: "rectangle", w: 1, h: 25, x: 43, }, { type: "rectangle", w: 150, h: 100, body: true, stroke: C.window_red, line_width: 3, }],
    x: -351, y: -700, parent: "movable", color: C.grey,
    constraint: [{ type: "fix_point", stiffness: 0.01, }], fix_angle: 0,
  },

  // floor
  { shapes: [{ type: "svg", svg: "engine", r: 50, }], x: -100, y: -700, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "engine", r: 50, }], x: -100, y: 700, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: -50, y: -900, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: -50, y: 900, parent: "floor", color: C.floor_symbol, },

  // tasks
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: -350, y: -875, parent: "task", task: 7, },
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: -350, y: 875, parent: "task", task: 6, },

];

const map_security = [

  // corridor to map_engine
  { shapes: [{ type: "line", x1: -150, y1: -100, x2: 0, y2: -100, }] },
  { shapes: [{ type: "line", x1: -150, y1: 100, x2: 0, y2: 100, }] },
  
  // walls
  { shapes: [{ type: "line", x1: 0, y1: -100, x2: 0, y2: -250, }] },
  { shapes: [{ type: "line", x1: 0, y1: -250, x2: 50, y2: -300, }] },
  { shapes: [{ type: "line", x1: 50, y1: -300, x2: 190, y2: -300, }] },
  { shapes: [{ type: "line", x1: 190, y1: -300, x2: 240, y2: -250, }] },
  { shapes: [{ type: "line", x1: 0, y1: 100, x2: 0, y2: 250, }] },
  { shapes: [{ type: "line", x1: 0, y1: 250, x2: 240, y2: 250, }] },
  { shapes: [{ type: "line", x1: 240, y1: 250, x2: 240, y2: -250, }] },
  
  // floor
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 190, y: 200, parent: "floor", color: C.floor_symbol, },

  // tasks  
  { shapes: [{ type: "polygon", sides: 6, r: 10, }], x: 120, y: -250, parent: "task", task: 15, },

];

const map_reactor = [
  
  // corridor to map_engine
  { shapes: [{ type: "line", x1: 120, y1: -100, x2: 335, y2: -100, }] },
  { shapes: [{ type: "line", x1: 120, y1:  100, x2: 335, y2:  100, }] },
  
  // walls
  { shapes: [{ type: "line", x1: -330, y1: -390, x2: -330, y2: -90, }] },
  { shapes: [{ type: "line", x1: -330, y1:  390, x2: -330, y2:  90, }] },
  { shapes: [{ type: "line", x1: -330, y1: -390, x2: -60, y2: -540, }] },
  { shapes: [{ type: "line", x1: -330, y1:  390, x2: -60, y2:  540, }] },
  { shapes: [{ type: "line", x1: -60, y1: -540, x2: -0, y2: -540, }] },
  { shapes: [{ type: "line", x1: -60, y1:  540, x2: -0, y2:  540, }] },
  { shapes: [{ type: "line", x1: 0, y1: -540, x2: 0, y2: -270, }] },
  { shapes: [{ type: "line", x1: 0, y1:  540, x2: 0, y2:  270, }] },
  { shapes: [{ type: "line", x1: 0, y1: -270, x2: 120, y2: -270, }] },
  { shapes: [{ type: "line", x1: 0, y1:  270, x2: 120, y2:  270, }] },
  { shapes: [{ type: "line", x1: 120, y1: -100, x2: 120, y2: -270, }] },
  { shapes: [{ type: "line", x1: 120, y1:  100, x2: 120, y2:  270, }] },
  
  // reactor
  { shapes: [{ type: "rectangle", w: 90, h: 90, body: true, stroke: C.window_red, line_width: 3, }],
    x: -240, y: 0, parent: "movable", color: C.grey,
  },

  // floor
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: -150, y: -270, parent: "floor", color: C.floor_symbol, },
  { shapes: [{ type: "svg", svg: "vent", r: 35, }], x: 0, y: 220, parent: "floor", color: C.floor_symbol, },

  // tasks  
  { shapes: [{ type: "polygon", sides: 6, r: 7, }], x: -300, y: 270, parent: "task", task: 14, },

  // final pathway
  { shapes: [{ type: "line", x1: -330, y1: -90, x2: -6330, y2: -10, }] },
  { shapes: [{ type: "line", x1: -330, y1:  90, x2: -6330, y2:  10, }] },

];

const main_map = [

  // big borders
  { shapes: [{ type: "line", x1: 20000, y1: 20000, x2: 20000, y2: -20000, }], parent: "border", },
  { shapes: [{ type: "line", x1: 20000, y1: 20000, x2: -20000, y2: 20000, }], parent: "border", },
  { shapes: [{ type: "line", x1: -20000, y1: -20000, x2: 20000, y2: -20000, }], parent: "border", },
  { shapes: [{ type: "line", x1: -20000, y1: -20000, x2: -20000, y2: 20000, }], parent: "border", },

  // maps of areas
  // maybe change the place names?
  ...translate(map_cafeteria, 0, 0),
  ...translate(map_medbay, -850, 70),
  ...translate(map_admin, 67, 730),
  ...translate(map_weapons, 800, 0),
  ...translate(map_co2, 1000, 400),
  ...translate(map_navigation, 1500, 525),
  ...translate(map_shields, 800, 1200),
  ...translate(map_communications, 550, 1200),
  ...translate(map_storage, 25, 1000),
  ...translate(map_electrical, -675, 1550),
  ...translate(map_engines, -1275, 700),
  ...translate(map_security, -1335, 700),
  ...translate(map_reactor, -1900, 700),

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
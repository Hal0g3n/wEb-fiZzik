

export const C = {

  transparent: "#00000000",
  white: "#ffffff",
  offwhite: "#dedede",
  grey: "#808080",
  floor_symbol: "#60606060",
  black: "#000000",

  red: "#ff0000", // "#amogus",
  door: "#9b735e",
  lime: "#5aa612",
  window_blue: "#32a2a8",
  bed_blue: "#116e96",
  table_blue: "#0b4163",
  light_table_blue: "#146fa8",

}

const group = {
  none: 0x0000,
  default: 0x0001,
  wall: 0x0002,
  player: 0x0004,
  all: 0x00FF,
};

export const category = {
  group: group,
  all: {
    category: group.default,
    mask: group.all,
  },
  none: {
    category: group.default,
    mask: group.none,
  },
  wall: {
    category: group.wall,
    mask: group.default | group.player | group.wall,
  },
  player: {
    category: group.player,
    mask: group.default | group.wall | group.player,
  },
};

export const make = { };

make.default = {

};

make.wall = {
  wall: true,
  fixed: true,
  static: true,
  blocks_sight: true,
  size: 1,
  friction: 0.1,
  collision_filter: category.wall,
  color: C.white,
  stroke: C.transparent,
  /*
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 100, h: 1, body: true, },
  ],
  */
};

make.border = {
  parent: "wall",
  always_on_screen: true,
}

make.decoration = {
  parent: "wall",
  blocks_sight: false,
  decoration: true,
};

make.floor = {
  parent: "decoration",
  floor: true,
};

make.window = {
  parent: "wall",
  blocks_sight: false,
  color: C.window_blue,
};

make.spinwall = {
  parent: "wall",
  fixed: false,
};

make.movewall = {
  parent: "wall",
  fixed: false,
};

make.door = {
  parent: "wall",
  fixed: false,
  static: false,
  color: C.door,
};

make.movable = {
  parent: "wall",
  fixed: false,
  static: false,
};

make.movewindow = {
  parent: "wall",
  fixed: false,
  static: false,
  blocks_sight: false,
};

//make.walltest = {"shapes":[{"type":"rectangle","x1":200,"y1":200,"x2":200,"y2":-200,"x":0,"y":0,"w":1,"h":200,"body":true,}],"parent":"wall","position":{"x":200,"y":0},"angle":-1.5707963267948966};

make.player = {
  player: true,
  fixed: false,
  static: false,
  blocks_sight: false,
  size: 30,
  speed: 50,
  density: 0.001,
  friction: 0.1,
  collision_filter: category.player,
  color: C.red,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
  ],
};
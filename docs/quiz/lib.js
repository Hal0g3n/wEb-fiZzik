

export const C = {

  transparent: "#00000000",

}

const group = {
  none: 0x0000,
  default: 0x0001,
  wall: 0x0002,
  among: 0x0004,
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
    mask: group.default | group.player,
  },
  player: {
    category: group.player,
    mask: group.default | group.wall,
  },
};

export const make = { };

make.default = { };
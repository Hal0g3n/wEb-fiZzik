import { Thing } from "./thing.js";

const Vector = Matter.Vector;

// map 
const translate = (list, tx, ty) => {
  const result = [ ];

  for (const M of list) {
    M.x = (M.x || 0) + tx;
    M.y = (M.y || 0) + ty;
  }

  return result;
};

const main_map = [

  // borders
  { shapes: [{ type: "line", x1: 10000, y1: 10000, x2: 10000, y2: -10000, }], parent: "border", },
  { shapes: [{ type: "line", x1: 10000, y1: 10000, x2: -10000, y2: 10000, }], parent: "border", },
  { shapes: [{ type: "line", x1: -10000, y1: -10000, x2: 10000, y2: -10000, }], parent: "border", },
  { shapes: [{ type: "line", x1: -10000, y1: -10000, x2: -10000, y2: 10000, }], parent: "border", },

  { shapes: [{ type: "line", x1: 200, y1: 200, x2: 200, y2: -200, }] },
  { shapes: [{ type: "line", x1: 200, y1: 200, x2: -200, y2: 200, }] },
  { shapes: [{ type: "line", x1: -200, y1: -200, x2: 200, y2: -200, }] },
  { shapes: [{ type: "line", x1: -200, y1: -200, x2: -200, y2: 200, }] },
  { shapes: [{ type: "line", x1: -140, y1: -100, x2: 30, y2: 100, }] },
  { shapes: [{ type: "line", x1: 80, y1: -30, x2: 50, y2: 140, }], parent: "spinwall", spin: 0.01, },
  { shapes: [{ type: "polygon", sides: 4, r: 10, line_width: 0, }], x: 100, y: -100, static: false, fixed: false, parent: "wall", },
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
        M.angle = Math.atan2(s.x2 - newx, s.y2 - newy);
        break;
      }
    }

    console.log(JSON.stringify(M));

    const t = new Thing(M.position);
    t.make(M);
    t.create();
    
  }

};

export const init_map = () => {
  make_map();
};
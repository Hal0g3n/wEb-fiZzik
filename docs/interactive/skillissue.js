// window size
let _w = window.innerWidth;
let _h = window.innerHeight;
// mouse position
let _mx = _w / 2;
let _my = _h / 2;

// canvas stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// classes

// •
class Dot {

  static dots = [];

  static init() {
    for (let i = 0; i < 10; i++) {
      let d = new Dot();
      d.create();
    }
  }

  static tick_all() {
    for (const dot of Dot.dots) {
      if (dot != null) dot.tick();
    }
  }

  static draw_all() {
    for (const dot of Dot.dots) {
      if (dot != null) dot.draw();
    }
  }

  static for_each(fn) {
    for (const dot of Dot.dots) {
      if (dot != null) fn(dot);
    }
  }

  // position (non-null after constructor has run)
  x = _w / 2;
  y = _h / 2;
  // target position (non-null after constructor has run)
  tx = null;
  ty = null;

  constructor(x, y) {
    if (x != null) this.tx = x;
    if (y != null) this.ty = y;
    if (this.tx == null) this.tx = Math.round(Math.random() * _w * 0.8 + _w * 0.1);
    if (this.ty == null) this.ty = Math.round(Math.random() * _h * 0.8 + _h * 0.1);
  }
  
  create() {
    Dot.dots.push(this);
  }

  tick() {
    const lerp_amount = 0.03;
    this.x = lerp(this.x, this.tx, lerp_amount);
    this.y = lerp(this.y, this.ty, lerp_amount);
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  remove() {
    const index = Dot.dots.indexOf(this);
    if (index != null && index > -1) {
      Dot.dots.splice(index, 1);
    }
  }

  distance2(dot) {
    return (this.x - dot.x) * (this.x - dot.x) + (this.y - dot.y) * (this.y - dot.y);
  }

  random_target() {
    this.tx = Math.round(Math.random() * _w * 0.8 + _w * 0.1);
    this.ty = Math.round(Math.random() * _h * 0.8 + _h * 0.1);
  }

};

// util

const lerp = (a, b, t) => {
  return a * (1 - t) + b * t;
}

const get_color_component = (number_from_0_to_1) => {
  let result = Math.floor(number_from_0_to_1 * 255).toString(16);
  result = result.length == 1 ? "0" + result : result;
  return result;
}

const color_alpha = (hex, alpha) => {
  return hex + get_color_component(alpha);
}

const deg_to_rad = (deg) => {
  return deg / 180 * Math.PI;
}

const rad_to_deg = (rad) => {
  return rad / Math.PI * 180;
}

// functions

const init = () => {
  init_canvas();
  Dot.init();
  setInterval(tick, 16);
};

const tick = () => {
  Dot.tick_all();
  draw_before();
  Dot.draw_all();
  skill_issue(); // draw_lines
  draw_after();
};

const init_canvas = () => {
  canvas.width = _w;
  canvas.height = _h;
};

const draw_before = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, _w, _h);
  ctx.fillStyle = "darkred";
  ctx.beginPath();
  ctx.arc(_w / 2, _h / 2, 100, 0, Math.PI * 2);
  ctx.fill();
};

const draw_after = () => {
}

const skill_issue = () => {
  // what?
  const threshold = Math.min(_w, _h) * 0.5;
  ctx.fillStyle = "transparent";
  ctx.lineWidth = 4;
  for (const d1 of Dot.dots) {
    if (d1 != null) for (const d2 of Dot.dots) {
      if (d2 == null) continue;
      const dist2 = d1.distance2(d2);
      if (dist2 <= threshold * threshold) {
        const dist = Math.sqrt(dist2);
        ctx.strokeStyle = color_alpha("#FFFFFF", 1 - dist / threshold);
        ctx.beginPath();
        ctx.moveTo(d1.x, d1.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.stroke();
      }
    }
  }
};

// event listeners

window.addEventListener("load", function(event) {
  init();
});
window.addEventListener("resize", function(event) {
  _w = window.innerWidth;
  _h = window.innerHeight;
  init_canvas();
});

const update_mouse = (event) => {
  _mx = event.clientX;
  _my = event.clientY;
}

window.addEventListener("mousemove", update_mouse);
window.addEventListener("mousedown", function(event) {
  Dot.for_each((dot) => {
    dot.random_target();
  });
  update_mouse(event);
  if (event.buttons > 0) {
    Dot.for_each((dot) => {
      dot.x = _mx;
      dot.y = _my;
    });
  }
});
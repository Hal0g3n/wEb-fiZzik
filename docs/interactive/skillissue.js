
const pi = Math.PI; // why

const among = new Image();
among.src = "among.png";

const config = {

  star: {
    radius: 0.47, // widths
    balls: 500, // number
    ball_size: 20, // pixels
  },

  camera: {
    FOV: 0.4, // widths
  },

};

// window size
let _w = window.innerWidth;
let _h = window.innerHeight;
let fov = _w * config.camera.FOV;

// mouse stuff
const mouse = {
  x: _w / 2,
  y: _h / 2,
  down: false,
};

// canvas stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// classes

// •
class Dot {

  static _id = 0;

  static dots = [];

  static r = 10; // global radius multiplier

  static init() {
    for (let i = 0; i < config.star.balls; i++) {
      let d = new Dot(_w * config.star.radius, config.star.ball_size);
      d.colour = random_color_close_to("#4475f688", 0.1); // random_color() + "99";
      d.create();
      d.random_all();
      d.theta = d.t_theta;
      d.phi = d.t_phi;
    }
  }

  static tick_all() {
    for (const dot of Dot.dots) {
      if (dot != null) dot.tick();
    }
  }

  static draw_all() {
    Dot.dots.sort((a, b) => {
      return a.dr - b.dr;
    });
    for (const dot of Dot.dots) {
      if (dot != null) dot.draw();
    }
  }

  static for_each(fn) {
    for (const dot of Dot.dots) {
      if (dot != null) fn(dot);
    }
  }

  id = Dot._id++;

  size = 0.001;
  t_size = 5;

  // cartesian position (non-null after constructor has run)
  x = _w / 2;
  y = _h / 2;
  z = 0;
  // target cartesian position (non-null after constructor has run)
  tx = null;
  ty = null;
  // 3d polar coordinates
  r = 0.001;
  theta = 0.001; // theta
  phi = 0.001; // phi
  // target polar position
  t_r = null;
  t_theta = null;
  t_phi = null;
  t_r_mult = 1;

  // screen stuff (to be calculated)
  sx = 0;
  sy = 0;
  sr = 0;
  dr = 0;

  // display stuff
  colour = "#ffffff";

  constructor(r, size) {
    //if (x != null) this.tx = x;
    //if (y != null) this.ty = y;
    //if (this.tx == null) this.tx = Math.round(Math.random() * _w * 0.8 + _w * 0.1);
    //if (this.ty == null) this.ty = Math.round(Math.random() * _h * 0.8 + _h * 0.1);
    if (r != null) this.t_r = r;
    if (size != null) this.t_size = size;
  }
  
  create() {
    Dot.dots.push(this);
  }

  tick() {
    this.t_theta += 8 / this.r / Dot.r;
    // this.t_phi += 0.01;
    const lerp_amount = 0.05;
    this.size = lerp(this.size, this.t_size, lerp_amount);
    this.r = lerp(this.r, this.t_r * this.t_r_mult * Dot.r, lerp_amount);
    this.theta = lerp_angle(this.theta, this.t_theta, lerp_amount);
    this.phi = lerp_angle(this.phi, this.t_phi, lerp_amount);
    this.calculate();
  }

  calculate() {
    // mod the stuff
    this.t_theta %= pi * 2;
    this.t_phi %= pi;
    // polar to cartesian
    this.x = this.r * Math.sin(this.phi) * Math.cos(this.theta);
    this.y = this.r * Math.cos(this.phi);
    this.z = this.r * Math.sin(this.phi) * Math.sin(this.theta) + this.r;
    // projection
    const dr = (fov / (fov + this.z));
    this.dr = dr;
    this.sx = (this.x * dr) + _w / 2;
    this.sy = (this.y * dr) + _h / 2;
    this.sr = this.size * dr;
  }

  draw() {
    ctx.fillStyle = this.colour; //(this.id === 0) ? "lime" : this.colour;
    ctx.beginPath();
    ctx.arc(this.sx, this.sy, this.sr, 0, pi * 2);
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

  distance3(dot) { // no, the 3 in this case does not mean cubed, but 3d...
    return (this.x - dot.x) * (this.x - dot.x) + (this.y - dot.y) * (this.y - dot.y) + (this.z - dot.z) * (this.z - dot.z);
  }

  /*
  random_target() {
    this.tx = Math.round(Math.random() * _w * 0.8);
    this.ty = Math.round(Math.random() * _h * 0.8);
  }
  */

  random_angles() {
    this.t_theta = Math.random() * 2 * pi;
    this.t_phi = Math.acos((Math.random() * 2) - 1); // 0, pi
  }

  random_all() {
    this.t_r_mult = random_sphere();
    this.random_angles();
  }

};

// util

const lerp = (a, b, t) => {
  return a * (1 - t) + b * t;
}

const lerp_angle = (a1, a2, t) => {
  return a1 + (((((a2 - a1) % (pi * 2)) + pi * 3) % (pi * 2)) - pi) * t;
}

const lerp_half_angle = (a1, a2, t) => {
  return lerp_mod(a1, a2, t, pi);
}

const lerp_mod = (a1, a2, t, mod) => {
  return a1 + (((((a2 - a1) % mod) + mod * 3 / 2) % mod) - mod / 2) * t;
}

const random_sphere = () => {
  return Math.cbrt(Math.random());
}

const get_color_component = (number_from_0_to_1) => {
  let result = ((number_from_0_to_1 * 255) | 0).toString(16);
  result = result.length == 1 ? "0" + result : result;
  return result;
}

const get_number_from_hex = (hex) => {
  return parseInt(hex, 16).toString(10);
}

const color_alpha = (hex, alpha) => {
  return hex + get_color_component(alpha);
}

const random_color = () => {
  return "#" + get_color_component(Math.random()) + get_color_component(Math.random()) + get_color_component(Math.random());
}

const random_color_close_to = (color, amount = 0.05) => {
  return "#" + 
    get_color_component(get_number_from_hex(color.substring(1, 3)) / 255 - amount / 2 + Math.random() * amount) +
    get_color_component(get_number_from_hex(color.substring(3, 5)) / 255 - amount / 2 + Math.random() * amount) +
    get_color_component(get_number_from_hex(color.substring(5)) / 255 - amount / 2 + Math.random() * amount);
}

const deg_to_rad = (deg) => {
  return deg / 180 * pi;
}

const rad_to_deg = (rad) => {
  return rad / pi * 180;
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
  const r = _w * config.star.radius / 2 * 0.6;

  ctx.clearRect(0, 0, _w, _h);
  // ctx.fill();

  // ctx.drawImage(among, _w / 2 - r, _h / 2 - r);
};

const draw_after = () => {
}

const skill_issue = () => {
  // no no no
  return;
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

const mouse_down = () => {
  Dot.r = 0.2;
}

const mouse_up = () => {
  Dot.r = 7;
}

const mouse_right = () => {
  Dot.for_each((dot) => {
    dot.random_all();
  });
}

// event listeners

window.addEventListener("load", function(event) {
  init();
});
window.addEventListener("resize", function(event) {
  _w = window.innerWidth;
  _h = window.innerHeight;
  fov = _w * config.camera.FOV;
  init_canvas();
});

const update_mouse = (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

const key_listeners = {

  "Space": function() {
    Dot.for_each((dot) => {
      dot.random_all();
    });
  },

  "KeyQ": function() {
    Dot.for_each((dot) => {
      dot.t_r *= 1.1;
    });
  },

  "KeyW": function() {
    Dot.for_each((dot) => {
      dot.t_r /= 1.1;
    });
  },

};

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
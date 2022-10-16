
// vars

let _w = window.innerWidth;
let _h = window.innerHeight;

// canvas stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const config = {

  la_y_er: [0, 0.1],
  layer_heights: [0.1, ],
  layer_colours: ["#999999", ],
  layers: {

  },

};

// main functions


const draw_background = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, _w, _h);
};

const draw_foreground = () => {
  // draw layers
  let layer_index = 0;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  for (let layer_index = 0; layer_index < config.la_y_er.length; layer_index++) {
    let layer_start = config.la_y_er[layer_index] * _h;
    let layer_height = config.layer_heights[layer_index] * _h;
    let c = config.layer_colours[layer_index];
    ctx.fillStyle = c;
    ctx.fillRect(0, layer_start, _w, layer_height);
    ctx.strokeRect(0, layer_start, _w, layer_height);
    if (layer_index === 2) {
      
    }
  }
};

const draw = () => {
  draw_background();
  draw_foreground();
}

const tick = () => {
  draw();
};

const init = () => {
  init_canvas();
  setInterval(tick, 16);
};

const init_canvas = () => {
  canvas.width = _w;
  canvas.height = _h;
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

const color_alpha = (hex, alpha) => {
  return hex + get_color_component(alpha);
}

const random_color = () => {
  return "#" + get_color_component(Math.random()) + get_color_component(Math.random()) + get_color_component(Math.random());
}

const deg_to_rad = (deg) => {
  return deg / 180 * pi;
}

const rad_to_deg = (rad) => {
  return rad / pi * 180;
}

const draw_circle = (x, y, r) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
import { draw } from "./draw.js";
import { check_keys } from "./key.js";
import { ctx, FPS, screen } from "./main.js";
import { util } from "./util.js";

const Vector = Matter.Vector;


export const ui = {
  time: 0,
  old_click: false,
  new_click: false,
  old_rclick: false,
  new_rclick: false,
};

export const check_click = function() {
  return check_keys(["Mouse", "Space"]);
}

export const init_ui = function() {
  
}



const tick_ui_before = function() {

}



export const draw_ui_before = function() {
  tick_ui_before();
  if (check_click()) {
    ui.new_click = !ui.old_click;
    ui.old_click = true;
  } else {
    ui.new_click = false;
    ui.old_click = false;
  }
  if (check_keys(["MouseRight"])) {
    ui.new_rclick = !ui.old_rclick;
    ui.old_rclick = true;
  } else {
    ui.new_rclick = false;
    ui.old_rclick = false;
  }

}

let _w, _h, size;
let x, y, w, h, r;
let c, f, s;



export const draw_ui_middle = function() {

}



export const draw_ui = function() {

  _w = screen.w;
  _h = screen.h;
  size = Math.sqrt(screen.w * screen.h) / 100;

  draw_taskbar();
  draw_fps();
  draw_bottom_text();

}

let old_taskbar_ratio = 0;

const draw_taskbar = () => {

  const tasks = 1;
  const total_tasks = 2;
  const ratio = util.lerp(old_taskbar_ratio, tasks / total_tasks, 0.05);
  old_taskbar_ratio = ratio;

  ctx.lineWidth = size * 0.4;
  ctx.strokeStyle = "#ffffff60";
  draw.stroke_rect(size * 1.3, size * 1.3, size * 50.4, size * 3.4);
  ctx.fillStyle = "#05a10020";
  draw.fill_rect(size * 1.5, size * 1.5, size * 50, size * 3);

  ctx.fillStyle = "#02611b";
  draw.fill_rect(size * 1.5, size * 1.5, size * 50 * ratio, size * 3);

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = `${Math.round(size * 2)}px roboto condensed`;
  ctx.fillStyle = "#ffffff";
  draw.fill_text("TOTAL TASKS COMPLETED", size * 2, size * 3 + 1);

}

let old_n = 0;

const draw_fps = () => {

  const n = util.lerp(old_n, Math.min(FPS, 60), 0.05);
  old_n = n;
  const ratio = n / 60;

  x = screen.w - size * 5;

  ctx.lineWidth = size * 0.4;
  ctx.strokeStyle = "#ffffff60";
  draw.stroke_rect(x - size * 0.2, size * 1.8, size * 3.4, size * 10.4);
  ctx.fillStyle = "#05a10020";
  draw.fill_rect(x, size * 2, size * 3, size * 10);
  
  ctx.fillStyle = chroma.mix("#611802", "#02611b", ratio);
  draw.fill_rect(x, size * (12 - 10 * ratio), size * 3, size * 10 * ratio);

  // draw fps text

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";

  ctx.font = `${Math.round(size * 2)}px roboto condensed`;
  draw.fill_text(`${Math.round(n)}`, x + size * 1.5, size * 6.3 + 1);

  ctx.font = `${Math.round(size * 0.8)}px roboto condensed`;
  draw.fill_text(`FPS`, x + size * 1.5, size * 7.8 + 1);
  
}

const draw_bottom_text = () => {

  

}
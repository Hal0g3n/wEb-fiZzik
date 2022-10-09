import { camera } from "./camera.js";
import { collide } from "./collide.js";
import { draw } from "./draw.js";
import { check_keys } from "./key.js";
import { C } from "./lib.js";
import { ctx, FPS, screen } from "./main.js";
import { player } from "./thing.js";
import { util } from "./util.js";

const Vector = Matter.Vector;

export const ui = {

  time: 0,
  old_click: false,
  new_click: false,
  old_rclick: false,
  new_rclick: false,
  show_info: true,

  paused: function() {
    return ui.show_info;
  }

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
  ui.time++;
}

let _w, _h, size;
let x, y, w, h, r;
let c, f, s, i;
let hover, click;


export const draw_ui_middle = function() {

}



export const draw_ui = function() {

  _w = screen.w;
  _h = screen.h;
  size = Math.sqrt(screen.w * screen.h) / 100;

  draw_info();
  draw_taskbar();
  draw_fps();
  draw_bottom_text();

}

const draw_info = () => {

  if (ui.show_info) {

    w = _w * 0.75;
    h = _h * 0.75;
    
    // draw background rectangle
    ctx.lineWidth = size * 0.4;
    ctx.strokeStyle = "#ffffffb0";
    draw.stroke_rectangle(_w / 2, _h / 2, w + size * 0.4, h + size * 0.4);
    ctx.fillStyle = "#05a10080";
    draw.fill_rectangle(_w / 2, _h / 2, w, h);

    // draw cross
    x = (_w + w) / 2 - size * 5;
    y = (_h - h) / 2 + size * 5;
    r = size * 2.5;
    hover = collide.point_circle(camera.mouse, x, y, r * 1.2);
    ctx.fillStyle = hover ? C.red : C.white;
    draw.svg("cross", x, y, r * 2);
    if (hover && ui.new_click) {
      ui.show_info = false;
    }

  } else {

    // draw info button
    x = _w - size * 5;
    y = _h - size * 5;
    r = size * 2.5;
    hover = collide.point_circle(camera.mouse, x, y, r * 1.2);
    ctx.fillStyle = hover ? C.window_blue : C.white;
    draw.svg("info", x, y, r * 2);
    if (hover && ui.new_click) {
      ui.show_info = true;
    }


  }

}

let old_taskbar_ratio = 0;

const draw_taskbar = () => {

  const tasks = player.tasks_complete;
  const total_tasks = player.total_tasks;
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
  draw.fill_text("TOTAL TASKS COMPLETED", size * 2.25, size * 3.1);
  
  player.display_radius = util.lerp(player.display_radius, player.real_radius, 0.04);
  ctx.font = `${Math.round(size * 1.5)}px roboto condensed`;
  s = `Your radius: ${Math.round(player.display_radius)} km`;
  w = draw.get_text_width(s);
  ctx.lineWidth = size * 0.4;
  ctx.fillStyle = "#05a10080";
  draw.fill_rect(size * 1.5, size * 5.9, w + size * 1.5, size * 2.2);
  ctx.fillStyle = "#ffffff";
  draw.fill_text(s, size * 2.25, size * 7.1);

}

let old_n = 0;

const draw_fps = () => {

  const n = util.lerp(old_n || 0, Math.min(FPS, 60), 0.05);
  old_n = n || 0;
  const ratio = n / 60;

  x = _w - size * 5;

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

let bottom_text = null;
let bottom_text_time = 0;
let bottom_text_timeout = 0;
let old_bottom_text_height = 0;
let target_bottom_text_height = -50;

const draw_bottom_text = () => {

  const text_height = util.lerp(old_bottom_text_height, target_bottom_text_height, 0.1);
  old_bottom_text_height = text_height;

  if (ui.time - bottom_text_time > bottom_text_timeout) {
    bottom_text_time = 0;
    target_bottom_text_height = -50;
  }

  if (target_bottom_text_height < -40 && old_bottom_text_height < -40) {
    bottom_text = null;
  }

  if (bottom_text == null) return;

  y = _h - text_height;

  ctx.font = `${Math.round(size * 2)}px roboto condensed`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  w = draw.get_text_width([bottom_text]);
  if (w > _w * 0.75) {
    w = _w * 0.75;
    const splitted = draw.split_text(bottom_text, _w * 0.75);
    let yy = y - ((splitted.length - 1) * size * 2.5);
    ctx.fillStyle = "#05a10020";
    draw.fill_rect(_w / 2 - w / 2 - size, yy - size * 2, w + size * 2, size * 4 + (y - yy));
    for (const s of splitted) {
      ctx.fillStyle = C.white;
      draw.fill_text(s, _w / 2, yy + 1);
      yy += size * 2.5;
    }
  } else {
    ctx.fillStyle = "#05a10020";
    draw.fill_rect(_w / 2 - w / 2 - size, y - size * 2, w + size * 2, size * 4);

    ctx.fillStyle = C.white;
    draw.fill_text(bottom_text, _w / 2, y + 1);
  }

}

export const send_bottom_text = (text, target_height = 50, timeout = null) => {

  if (bottom_text === text) {
    return;
  }

  timeout = timeout || (text.split(" ").length * 20);

  const time_left = bottom_text_timeout - (ui.time - bottom_text_time);
  
  if (bottom_text == null || time_left <= 0) {
    bottom_text = text;
    bottom_text_time = ui.time;
    bottom_text_timeout = timeout;
    target_bottom_text_height = target_height;
    return;
  }

  // a text is displayed now, wait time_left / 2 seconds before showing the new one
  const wait_time = Math.round(time_left / 2);
  // console.log(time_left, wait_time);
  bottom_text_time -= wait_time;
  setTimeout(() => {
    bottom_text = text;
    bottom_text_time = ui.time;
    bottom_text_timeout = timeout;
    target_bottom_text_height = target_height;
  }, wait_time * 16 + 500);

}

window.send_bottom_text = send_bottom_text;
import { camera } from "./camera.js";
import { collide } from "./collide.js";
import { draw } from "./draw.js";
import { add_key_listener } from "./key.js";
import { C } from "./lib.js";
import { ctx, screen } from "./main.js";
import { questions } from "./questions.js";
import { ui } from "./ui.js";

export const tasks = {

  time: 0,

  active: false,
  thing: null,

  number: -1,
  question: -1,

};

tasks.enter = (thing) => {
  tasks.active = true;
  tasks.thing = thing;
  tasks.number = thing.task;
  tasks.load_task_from_number();
};

tasks.load_task_from_number = () => {

  tasks.question = -1;

  switch (tasks.number) {
    case 1:
      tasks.question = 1;
      break;
    case 2:
      tasks.question = 2;
      break;
    case 3:
      tasks.question = 3;
      break;
    case 4:
      tasks.question = 4;
      break;
  }

};

tasks.exit = () => {
  if (!tasks.active) return;
  tasks.active = false;
  tasks.thing = null;
  tasks.number = -1;
}

tasks.init = () => {
  
  add_key_listener("Escape", function() {
    tasks.exit();
  });

};

tasks.tick = () => {

  tasks.time++;
  
};

let _w, _h, size;
let x, y, w, h, r;
let c, f, s, i;
let hover, click;

const check_mcq = (number) => {

  const question = questions[tasks.question];

  question.chosen[number] = true;

  if (number === question.answer) {
    tasks.thing.color = C.lime;
  }

}

const mcq_numbers = "⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿";

const draw_mcq = () => {

  const question = questions[tasks.question];

  w = _w * 0.75;
  h = _h * 0.75;

  ctx.lineWidth = size * 0.4;
  ctx.strokeStyle = "#ffffffb0";
  draw.stroke_rectangle(_w / 2, _h / 2, w + size * 0.4, h + size * 0.4);
  ctx.fillStyle = tasks.thing.color + "80";
  draw.fill_rectangle(_w / 2, _h / 2, w, h);

  h = _h * 0.08;
  y = _h * 0.125;
  
  y += h * 1.25;

  ctx.font = `${Math.round(h * 0.6)}px roboto condensed`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const splitted_question = draw.split_text(question.question, _w * 0.75);
  ctx.fillStyle = "#ffffff";
  for (const s of splitted_question) {
    draw.fill_text(s, _w / 2, y);
  }

  y += h * 1.25;

  ctx.font = `${Math.round(h * 0.4)}px roboto condensed`;
  i = 1;
  for (const choice of question.choices) {
    const chosen = question.chosen[i];
    hover = collide.point_rectangle(camera.mouse, _w / 2, y, w, h);
    s = `${mcq_numbers.charAt(i)}  ${choice}`;
    w = draw.get_text_width(s) + size * 2;
    ctx.lineWidth = size * 0.4;
    ctx.strokeStyle = "#ccccccb0";
    draw.stroke_rectangle(_w / 2, y, w + size * 0.4, h + size * 0.4);
    ctx.fillStyle = (chosen ? (i === question.answer ? "#05a100" : "#a12000") : "#a19c00") + (hover ? "af" : "");
    draw.fill_rectangle(_w / 2, y, w, h);
    ctx.fillStyle = "#ffffff";
    draw.fill_text(s, _w / 2, y);
    if (hover && ui.new_click) {
      check_mcq(i);
    }
    y += h * 1.35;
    i++;
  }

};

tasks.draw = () => {

  if (!tasks.active) return;

  _w = screen.w;
  _h = screen.h;
  size = Math.sqrt(screen.w * screen.h) / 100;
  
  if (tasks.question > 0) {
    draw_mcq();
  }

};
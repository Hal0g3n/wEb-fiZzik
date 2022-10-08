
import { Thing, player } from "./thing.js";
import { Camera, camera } from "./camera.js";
import { init_key, add_key_listener } from "./key.js";
import { make } from "./lib.js";
import { init_map, player_starting_position } from "./maps.js";
import { clip_visibility_polygon } from "./see.js";
import { init_ui, ui } from "./ui.js";
import { collide, init_collide } from "./collide.js";

const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Vector = Matter.Vector;

// const parameters = new URLSearchParams(document.location.search);

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
export const screen = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};

// create the engine (and world)
export const engine = Engine.create({
  gravity: {
    x: 0,
    y: 0,
  },
});
export const world = engine.world;
export const runner = Runner.create();

function init_before() {

  // set player position

}

function tick(time) {
  camera.draw();
  if (true) { // !paused
    Runner.tick(runner, engine);
    camera.tick();
  }
}

function init_after() {
  
  // create player
  player.position = player_starting_position;
  player.create();

  // create map
  init_map();

  // add key listeners
  /*
  add_key_listener("KeyA", function() {
    console.log("a");
  });
  */

}

function test() {

  //const t = new Thing(make.walltest.position);
  //t.make(make.walltest);
  //t.create();

}

function init() {
  init_before();
  init_canvas();
  init_key();
  init_collide();
  init_ui();
  init_after();
  test();
}

function main() {
  init();
  // create main loop
  setInterval(tick, 16);
  loading_done();
}

function loading_done() {
  
  // done!

}

window.addEventListener("load", function(event) {
  main();
});


// canvas.js and events.js are basically put here for now

const init_canvas = function() {
  ctx.lineCap = "square"; // "round"
  ctx.lineJoin = "miter"; // "round"
  resize();
}

const resize = function() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  screen.w = w;
  screen.h = h;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w;
  canvas.style.height = h;
  camera.width = w;
  camera.height = h;
}

window.addEventListener("resize", function(event) {
  resize();
});

// resize detector, scale the camera accordingly
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    let width = 0;
    if (entry.contentBoxSize) {
      const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
      width = contentBoxSize.inlineSize;
    } else {
      width = entry.contentRect.width;
    }
    let height = width / window.innerWidth * window.innerHeight;
    camera.scale = Math.sqrt(width * height) * Camera.settings.camera_scale;
  }
});
resizeObserver.observe(document.getElementById("canvas"));

// fps counter
const fps_times = [];
export let FPS; // import this in ui.js

function fps_loop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (fps_times.length > 0 && fps_times[0] <= now - 1000) {
      fps_times.shift();
    }
    fps_times.push(now);
    FPS = fps_times.length;
    fps_loop();
  });
}

fps_loop();

import { Thing, player } from "./thing.js";
import { camera } from "./camera.js";
import { init_key, add_key_listener } from "./key.js";
import { make } from "./lib.js";
import { init_map } from "./maps.js";
import { clip_visibility_polygon } from "./see.js";
import { init_ui, ui } from "./ui.js";

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
  camera.draw(ctx);
  if (true) { // !paused
    Runner.tick(runner, engine);
    camera.tick();
  }
}

function init_after() {
  
  // create player
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
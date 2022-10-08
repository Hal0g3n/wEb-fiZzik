import { check_keys } from "./key.js";

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



export const draw_ui_middle = function() {

}



export const draw_ui = function() {

}

const draw_bottom_text = () => {

}
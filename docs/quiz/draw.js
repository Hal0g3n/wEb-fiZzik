import { ctx } from "./main.js";
import { SVG } from "./svg.js";

export const draw = {};


draw.clear = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

draw.clear_transparent = function() {
  // Store the current transformation matrix
  ctx.save();
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Restore the transform
  ctx.restore();
}

// circles

draw.circle = function(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
}

draw.arc = function(x, y, r, s, e, clockwise = false) {
  ctx.beginPath();
  ctx.arc(x, y, r, s, e, !clockwise);
}

// rectangles

draw.stroke_rect = function(x, y, w, h) {
  ctx.strokeRect(x, y, w, h);
}

draw.fill_rect = function(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

draw.stroke_rectangle = function(x, y, w, h) {
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
}

draw.fill_rectangle = function(x, y, w, h) {
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

// angle in radians
draw.draw_rect_angle = function(x, y, w, h, a) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(a);
  ctx.rect(-w / 2, -h / 2, w, h);
}

draw.stroke_rect_angle = function(x, y, w, h, a) {
  draw.draw_rect_angle(x, y, w, h, a);
  ctx.stroke();
  ctx.restore();
}

draw.fill_rect_angle = function(x, y, w, h, a) {
  draw.draw_rect_angle(x, y, w, h, a);
  ctx.fill();
  ctx.restore();
}

draw.stroke_rectangle_angle = function(x, y, w, h, a) {
  draw.stroke_rect_angle(x - w / 2, y - h / 2, w, h, a);
}

draw.fill_rectangle_angle = function(x, y, w, h, a) {
  draw.fill_rect_angle(x - w / 2, y - h / 2, w, h, a);
}

// lines

draw.line = function(x1, y1, x2, y2) {
  ctx.beginPath();
  if (x2 == null && y2 == null) {
    ctx.moveTo(x1.x, x1.y);
    ctx.lineTo(y1.x, y1.y);
  } else {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

draw.regular_polygon = function(sides, r, x, y, angle = 0) {
  const oldlinecap = ctx.lineCap;
  ctx.lineCap = "square";
  ctx.beginPath();
  let a = angle;
  ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
  // draw one more side because lineCap is weird
  for (let i = 0; i < sides + 1; ++i) {
    a += Math.PI * 2 / sides;
    ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
  }
  ctx.lineCap = oldlinecap;
}

draw.x_cross = function(x, y, w, h, ratio = 0.7) {
  const x_gap = w * (1 - ratio) / 2;
  const y_gap = h * (1 - ratio) / 2;
  draw.line(x + x_gap, y + y_gap, x + w - x_gap, y + h - y_gap);
  draw.line(x + w - x_gap, y + y_gap, x + x_gap, y + h - y_gap);
}

// texts

draw.fill_text = function(s, x, y) {
  ctx.fillText(s, x, y);
}

draw.stroke_text = function(s, x, y) {
  ctx.strokeText(s, x, y);
}

draw._split_text = function(text, max_width) {
  let words = text.split(" "),
      lines = [],
      current_line = words[0];
  for (let i = 1; i < words.length; i++) {
    let word = words[i],
        width = ctx.measureText(current_line + " " + word).width;
    if (width < max_width) {
        current_line += " " + word;
    } else {
        lines.push(current_line);
        current_line = word;
    }
  }
  lines.push(current_line);
  return lines;
}

draw.split_text = function(text, max_width) {
  const lines = text.split("\n"),
        newlines = [];
  for (const line of lines) {
    for (const a of draw._split_text(line, max_width)) {
      newlines.push(a);
    }
  }
  return newlines;
}

draw.get_text_width = function(text_array) {
  if (!Array.isArray(text_array)) {
    text_array = [text_array];
  }
  let _max = 0;
  for (let text of text_array) {
    _max = Math.max(_max, ctx.measureText(text).width);
  }
  return _max;
}

draw.svg = function(type, x, y, size, rot, fill) {
  if (!SVG.hasOwnProperty(type)) throw "No such SVG type: " + type;
  if (fill != undefined) ctx.fillStyle = fill;
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot * Math.PI / 180);
  ctx.translate(-size / 2, -size / 2);
  ctx.scale(size / 24, size / 24);
  ctx.fill(new Path2D(SVG[type]));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
export const util = {};

util.lerp = (a, b, t) => {
  return a * (1 - t) + b * t;
}

util.lerp_angle = (a1, a2, t) => {
  return a1 + (((((a2 - a1) % (pi * 2)) + pi * 3) % (pi * 2)) - pi) * t;
}

util.lerp_half_angle = (a1, a2, t) => {
  return lerp_mod(a1, a2, t, pi);
}

util.lerp_mod = (a1, a2, t, mod) => {
  return a1 + (((((a2 - a1) % mod) + mod * 3 / 2) % mod) - mod / 2) * t;
}

util.random_sphere = () => {
  return Math.cbrt(Math.random());
}

util.get_color_component = (number_from_0_to_1) => {
  let result = Math.floor(number_from_0_to_1 * 255).toString(16);
  result = result.length == 1 ? "0" + result : result;
  return result;
}

util.color_alpha = (hex, alpha) => {
  return hex + get_color_component(alpha);
}

util.random_color = () => {
  return "#" + get_color_component(Math.random()) + get_color_component(Math.random()) + get_color_component(Math.random());
}

util.deg_to_rad = (deg) => {
  return deg / 180 * pi;
}

util.rad_to_deg = (rad) => {
  return rad / pi * 180;
}

const Vector = Matter.Vector;

// just some extensions
Vector.createpolar = function(theta, r = 1) {
  return Vector.create(r * Math.cos(theta), r * Math.sin(theta));
}
Vector.lerp = function(v1, v2, smoothness) {
  return Vector.add(Vector.mult(v1, 1 - smoothness), Vector.mult(v2, smoothness));
}
Vector.lerp_angle = function(a1, a2, smoothness) {
  return Vector.angle(Vector.create(), Vector.add(Vector.createpolar(a1, 1 - smoothness), Vector.createpolar(a2, smoothness)));
}
Vector.deg_to_rad = function(degrees) {
  return degrees / 180 * Math.PI;
}
Vector.rad_to_deg = function(radians) {
  return radians * 180 / Math.PI;
}
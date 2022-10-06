import { camera } from "./camera.js";
import { draw } from "./draw.js";
import { C, category, make } from "./lib.js";
import { canvas, ctx, world } from "./main.js";
import { ui } from "./ui.js";

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Query = Matter.Query,
      Vector = Matter.Vector;

export class Thing {

  static things = [];

  static time = 1;

  static tick_things = function() {
    for (const thing of Thing.things) {
      thing.tick();
    }
    Thing.time++;
  }

  static draw_things = function() {
    // sorts things in ascending order of their layer property
    const sorted_things = Thing.things.sort(function(a, b) {
      return a.layer - b.layer;
    });
    for (const thing of sorted_things) {
      thing.draw();
    }
  }
  
  static settings = {
    force_factor: 0.00005,
    recoil_factor: 50.0,
    friction_factor: 1.0,
    density_factor: 1.0,
  }

  // location variables
  body = null; // physics body
  size = 0;
  initial_position = Vector.create();
  initial_angle = 0;
  initial_velocity = Vector.create();

  // property booleans
  exists = false;
  fixed = false;
  deleted = false;
  blocks_sight = false;

  // physics
  friction = 0;
  restitution = 0;
  density = 0.001;
  collision_filter = category.all;

  // display
  stroke = C.transparent;
  color = "#FFFFFF";
  layer = 0;
  shapes = [];

  constructor(position) {
    if (position != null) {
      this.initial_position = Vector.clone(position);
    }
    this.make(make.default);
  }

  make(o) {
    if (o == null) return;
    if (o.hasOwnProperty("parent")) {
      for (let make_thing of o.parent) {
        this.make(make[make_thing]);
      }
    }
    for (let k in o) {
      if (o[k] != null && o.hasOwnProperty(k)) {
        this[k] = o[k];
      }
    }
  }

  get position() {
    return Vector.clone(this.body == null ? this.initial_position : this.body.position);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get angle() {
    return this.body == null ? this.initial_angle : this.body.angle;
  }

  get rotation() {
    return this.angle;
  }
  
  get screenpos() {
    return camera.object_position(this.position);
  }

  get velocity() {
    return Vector.clone(this.body == null ? this.initial_velocity : this.body.velocity);
  }

  set position(position) {
    if (this.body == null) {
      this.initial_position = position;
    } else {
      Body.setPosition(this.body, position);
    }
  }

  set velocity(velocity) {
    if (this.body == null) {
      this.initial_velocity = velocity;
    } else {
      Body.setPosition(this.body, velocity);
    }
  }

  set angle(angle) {
    if (this.body == null) {
      this.initial_angle = angle;
    } else {
      Body.setAngle(this.body, angle);
    }
  }

  set rotation(angle) {
    this.angle = angle;
  }

  tick() {

  }

  real_point_location(vector) {
    return Vector.add(this.position, Vector.rotate(Vector.create(this.get_shape_dimension(vector.x, 1, 0), this.get_shape_dimension(vector.y, 1, 0)), this.rotation));
  }

  draw_point_location(vector, scale) {
    return Vector.add(this.screenpos, Vector.mult(Vector.rotate(Vector.create(this.get_shape_dimension(vector.x, 1, 0), this.get_shape_dimension(vector.y, 1, 0)), this.rotation), scale));
  }

  get_shape_dimension(dimension, multiplier = 1, normal = 1) {
    let d = 1;
    if (multiplier == null) {
      multiplier = 1;
    }
    if (dimension == null) {
      d = normal;
    } else if (typeof dimension === "number") {
      d = dimension;
    } else {
      console.error("Invalid dimension type: " + typeof dimension);
    }
    return this.size * multiplier * d;
  }

  draw(scale = camera.scale) {
    for (const shape of this.shapes) {
      this.draw_shape(scale, shape);
    }
  }

  draw_shape(scale, shape, options = { }) {
    ctx.lineWidth = (shape.width || 3);
    const size = this.size * scale;
    const type = shape.type;
    console.log(this.x);
    const location = this.draw_point_location(Vector.create(shape.x, shape.y), scale);
    const x = location.x;
    const y = location.y;
    const rot = (shape.rotation || 0) + this.rotation;
    let r, w, h, location2, x2, y2, c, stroke;
    stroke = options.stroke || shape.stroke || this.stroke || C.transparent;
    c = options.color || shape.color || this.color;
    ctx.strokeStyle = stroke;
    ctx.fillStyle = c;
    switch (type) {
      case "circle":
        r = size * (shape.r || 1);
        draw.circle(ctx, x, y, r);
        ctx.fill();
        ctx.stroke();
        break;
      case "square":
      case "rectangle":
        w = size * (shape.w || 1) * 2;
        h = size * (shape.h || 1) * 2;
        draw.fill_rectangle_angle(ctx, x, y, w, h, rot);
        draw.stroke_rectangle_angle(ctx, x, y, w, h, rot);
        break;
      case "rounded_square":
      case "rounded_rectangle":
        // TODO: make an actually rounded rectangle
        w = size * (shape.w || 1) * 2;
        h = size * (shape.h || 1) * 2;
        draw.fill_rectangle_angle(ctx, x, y, w, h, rot);
        draw.stroke_rectangle_angle(ctx, x, y, w, h, rot);
        break;
      case "line":
        location2 = this.draw_point_location(Vector.create(shape.x2, shape.y2), scale);
        x2 = location2.x;
        y2 = location2.y;
        draw.line(ctx, x, y, x2, y2);
        break;
      case "polygon":
        r = size * (shape.r || 1);
        draw.regular_polygon(ctx, shape.sides, r, x, y, rot);
        ctx.fill();
        ctx.stroke();
        break;
      default:
        console.error("Invalid shape type: " + type);
        break;
    }
  }

  create() {
    this.create_list();
    this.create_body();
    this.exists = true;
  }

  create_list() {
    if (!Thing.things.includes(this)) {
      Thing.things.push(this);
    }
  }

  create_body() {
    if (this.no_body) return;
    if (this.body != null) {
      this.remove_body();
    }
    const shapes = this.shapes;
    const options = {
      isStatic: this.fixed,
      isBullet: this.is_bullet,
      collisionFilter: this.collision_filter,
      label: this.label,
      density: this.density * Thing.settings.density_factor,
      restitution: this.restitution,
      frictionAir: this.friction * Thing.settings.friction_factor,
      friction: 0,
      frictionStatic: 0,
    };
    let body = null;
    let shape = null;
    if (shapes.length <= 0) {
      return;
    } else if (shapes.length === 1) {
      shape = shapes[0];
    } else {
      for (const s of shapes) {
        if (s.body) shape = s;
      }
    }
    const type = shape.type;
    const location = this.real_point_location(Vector.create(shape.x, shape.y));
    const x = location.x;
    const y = location.y;
    if (type.includes("circle")) {
      const r = this.get_shape_dimension(shape.r);
      body = Bodies.circle(x, y, r, options);
    } else if (type.includes("rectangle") || type.includes("square")) {
      const w = this.get_shape_dimension(shape.w, 2);
      const h = this.get_shape_dimension(shape.h, 2);
      body = Bodies.rectangle(x, y, w, h, options);
    } else if (type.includes("polygon")) {
      const r = this.get_shape_dimension(shape.r);
      const vertices = math_util.regpoly(shape.sides, r, shape.rotation || 0, x, y);
      body = Bodies.fromVertices(x, y, [vertices], options); // Bodies.polygon(x, y, shape.sides, r, options);
    } else if (type.includes("line") && false) { // not yet ready
      const location2 = this.real_point_location(Vector.create(shape.x2, shape.y2));
      const middle = Vector.mult(Vector.add(location, location2), 0.5);
      const vertices = [Vector.sub(location, middle), Vector.sub(location2, middle)];
      console.log(vertices);
      body = Bodies.fromVertices(0, 0, vertices, options);
    } else {
      console.error("Invalid shape type for body: " + type);
    }
    body.thing = this;
    body.restitution = this.restitution;
    Body.setAngle(body, this.initial_angle);
    this.body = body;
    Composite.add(world, this.body);
    // set velocity
    Body.setVelocity(body, this.initial_velocity);
  }

  remove() {
    this.remove_list();
    this.remove_body();
  }

  remove_list() {
    for (const array of [Thing.things]) {
      // remove this from array
      const index = array.indexOf(this);
      if (index != null && index > -1) {
        array.splice(index, 1);
      }
    }
  }

  remove_body() {
    if (this.body != null) {
      // remove from world
      Composite.remove(world, this.body);
      this.body = null;
      return true;
    } else {
      return false;
    }
  }

  query_point(x, y) {
    // do the thing where a vector can actually be passed as a parameter of this function
    // why doesn't javascript have function overloading
    let v;
    if (y != null) v = Vector.create(x, y);
    else v = x;
    return Query.point([this.body], v);
  }

  move_force(v) {
    const move_v = Vector.mult(v, this.speed * this.body.mass * Thing.settings.force_factor);
    if (this.body != null) {
      Body.applyForce(this.body, this.position, move_v);
    }
  }

  push_to(target, amount) {
    const push = Vector.mult(Vector.createpolar(Vector.angle(this.position, target), 1), amount);
    if (this.body != null && this.position != null && push.x != null && push.y != null) {
      Body.applyForce(this.body, this.position, push);
    }
  }

}
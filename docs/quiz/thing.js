import { camera } from "./camera.js";
import { collide } from "./collide.js";
import { draw } from "./draw.js";
import { check_keys, add_key_listener } from "./key.js";
import { C, category, make } from "./lib.js";
import { canvas, ctx, screen, world } from "./main.js";
import { ui } from "./ui.js";
import { util } from "./util.js";

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint,
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
  body; // physics body
  size = 0;
  initial_position = Vector.create();
  initial_angle = 0;
  initial_velocity = Vector.create();

  // property booleans
  exists = false;
  fixed = false;
  static = false;
  deleted = false;
  blocks_sight = false;
  decoration = false;

  // physics
  friction = 0;
  restitution = 0;
  density = 0.001;
  collision_filter = category.all;

  constraint; // physics constraint options
              // since constraint starts with "const", don't modify it!

  // display
  stroke;
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
      let parent = o.parent;
      if (typeof parent === "string") {
        parent = [o.parent];
      }
      for (let make_thing of parent) {
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

  set x(x) {
    if (this.body == null) {
      this.initial_position.x = x;
    } else {
      const pos = Vector.clone(this.position);
      pos.x = x;
      Body.setPosition(this.body, pos);
    }
  }

  set y(y) {
    if (this.body == null) {
      this.initial_position.y = y;
    } else {
      const pos = Vector.clone(this.position);
      pos.y = y;
      Body.setPosition(this.body, pos);
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

    this.tick_position();
    this.tick_rotation();

  }

  tick_position() {

  }

  tick_rotation() {

    if (this.spin != null) {
      this.angle += this.spin;
    }
    if (this.door_angle != null) {
      this.angle = util.lerp(this.angle, this.door_angle, 0.05);
    }
    
  }

  memo_shape_size = null;

  roughly_on_screen() { // not exact
    const shape = this.get_body_shape();
    let shape_size = this.memo_shape_size;
    if (shape_size == null) {
      shape_size = this.size;
      if (shape.type === "line") {
        let minx = Math.min(0, shape.x1 || 0, shape.x2 || 0);
        let maxx = Math.max(0, shape.x1 || 0, shape.x2 || 0);
        let miny = Math.min(0, shape.y1 || 0, shape.y2 || 0);
        let maxy = Math.max(0, shape.y1 || 0, shape.y2 || 0);
        let dx = maxx - minx;
        let dy = maxy - miny;
        shape_size *= Math.sqrt(dx * dx + dy * dy);
      } else if (shape.type === "polygon") {
        shape_size *= shape.r || 1;
      } else if (shape.type === "rectangle") {
        shape_size *= Math.max(shape.w || 1, shape.h || 1);
      }
    }
    const screenpos = this.screenpos;
    return !(screenpos.x + shape_size < 0 || screenpos.x - shape_size > screen.w
      || screenpos.y + shape_size < 0 || screenpos.y - shape_size > screen.h); 
  }

  exactly_on_screen() { // very exact
    let points_on_screen = 0;
    for (const point of this.get_points()) {
      const draw_point = camera.object_position(point);
      if (draw_point.x < 0 || draw_point.x > w) continue;
      if (draw_point.y < 0 || draw_point.y > h) continue;
      points_on_screen++;
    }
    return points_on_screen > 0;
  }

  fully_on_screen() { // very exact
    const points = this.get_points();
    for (const point of points) {
      const draw_point = camera.object_position(point);
      if (draw_point.x < 0 || draw_point.x > w) return false;
      if (draw_point.y < 0 || draw_point.y > h) return false;
    }
    return true;
  }

  memo_shape_points = null;
  memo_get_points = null;

  // returns an array of points (in world coordinates)
  get_points() {

    if (this.fixed && this.memo_get_points != null) {
      return this.memo_get_points;
    }

    const shape = this.get_body_shape();
    const shape_points = this.memo_shape_points || [ ];
    const points = [ ];

    if (shape_points.length <= 0) {
      if (shape.type === "line") {
        shape_points.push(Vector.create(shape.x1, shape.y1));
        shape_points.push(Vector.create(shape.x2, shape.y2));
      } else if (shape.type === "polygon") {
        shape_points.push(...util.regpoly(shape.sides, shape.r || 1, shape.rotation || 0, shape.x, shape.y));
      } else if (shape.type === "circle") {
        shape_points.push(...util.regpoly(12, shape.r || 1, 0, shape.x, shape.y));
      } else if (shape.type === "rectangle") {
        if (shape.w * this.size <= 1) {
          const _h = shape.h;
          shape_points.push(Vector.create(shape.x, shape.y + _h));
          shape_points.push(Vector.create(shape.x, shape.y - _h));
        } else if (shape.h * this.size <= 1) {
          const _w = shape.w;
          shape_points.push(Vector.create(shape.x + _w, shape.y));
          shape_points.push(Vector.create(shape.x - _w, shape.y));
        } else {
          const _w = shape.w;
          const _h = shape.h;
          shape_points.push(Vector.create(shape.x + _w, shape.y + _h));
          shape_points.push(Vector.create(shape.x - _w, shape.y + _h));
          shape_points.push(Vector.create(shape.x - _w, shape.y - _h));
          shape_points.push(Vector.create(shape.x + _w, shape.y - _h));
        }
      } else {
        console.error("thing.get_points: invalid shape type for get_points: " + shape.type + "!")
      }
    }

    for (const shape_point of shape_points) {
      points.push(this.real_point_location(shape_point));
    }
    
    if (this.fixed) {
      this.memo_get_points = points;
    }
    return points;

  }

  memo_get_segments = null;
  
  // returns an array of segments (collide.make_segment) typed
  get_segments() {

    const source = player.position;

    if (this.fixed && this.memo_get_segments != null) {
      for (const segment of this.memo_get_segments) {
        collide.calculate_segment_angles(source, segment);
        collide.calculate_segment_beginning(segment);
      }
      return this.memo_get_segments;
    }

    const points = this.get_points();
    const segments = [ ];

    if (points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];
      segments.push(collide.make_segment(source, p1, p2));
    } else if (points.length > 2) {
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        segments.push(collide.make_segment(source, p1, p2));
      }
    } else {
      console.error("thing.get_segments: Less than 2 points!");
    }
    
    if (this.fixed) {
      this.memo_get_segments = segments;
    }

    return segments;

  }

  get_body_shape() {
    const shapes = this.shapes;
    if (shapes.length <= 0) {
      console.error("nobody exists")
    } else if (shapes.length === 1) {
      return shapes[0];
    } else {
      for (const s of shapes) {
        if (s.body) return s;
      }
      return shapes[0];
    }
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
    ctx.lineWidth = (shape.line_width || 0);
    const size = this.size * scale;
    const type = shape.type;
    const location = this.draw_point_location(Vector.create(shape.x, shape.y), scale);
    const x = location.x;
    const y = location.y;
    const rot = (shape.rotation || 0) + this.rotation;
    let r, w, h, location1, x1, y1, location2, x2, y2, c, stroke;
    c = options.color || shape.color || this.color;
    stroke = options.stroke || shape.stroke || this.stroke || c;
    ctx.strokeStyle = stroke;
    ctx.fillStyle = c;
    switch (type) {
      case "circle":
        r = size * (shape.r || 1);
        draw.circle(x, y, r);
        ctx.fill();
        ctx.stroke();
        break;
      case "square":
      case "rectangle":
        w = size * (shape.w || 1) * 2;
        h = size * (shape.h || 1) * 2;
        draw.fill_rectangle_angle(x, y, w, h, rot);
        draw.stroke_rectangle_angle(x, y, w, h, rot);
        break;
      case "rounded_square":
      case "rounded_rectangle":
        // TODO: make an actually rounded rectangle
        w = size * (shape.w || 1) * 2;
        h = size * (shape.h || 1) * 2;
        draw.fill_rectangle_angle(x, y, w, h, rot);
        draw.stroke_rectangle_angle(x, y, w, h, rot);
        break;
      case "line":
        location1 = this.draw_point_location(Vector.create(shape.x1, shape.y1), scale);
        x1 = location1.x;
        y1 = location1.y;
        location2 = this.draw_point_location(Vector.create(shape.x2, shape.y2), scale);
        x2 = location2.x;
        y2 = location2.y;
        ctx.strokeStyle = ctx.fillStyle; // temp
        draw.line(x1, y1, x2, y2);
        break;
      case "polygon":
        r = size * (shape.r || 1);
        draw.regular_polygon(shape.sides, r, x, y, rot);
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
    if (this.decoration) return;
    if (this.body != null) {
      this.remove_body();
    }
    const shapes = this.shapes;
    const options = {
      isStatic: this.static,
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
      const vertices = util.regpoly(shape.sides, r, shape.rotation || 0, x, y);
      body = Bodies.fromVertices(x, y, [vertices], options); // Bodies.polygon(x, y, shape.sides, r, options);
    } else if (type.includes("line") && false) { // not yet ready
      /*
      const x = shape.x2 - shape.x1;
      const y = shape.y2 - shape.y1;
      const newx = (shape.x1 + shape.x2) / 2;
      const newy = (shape.y1 + shape.y2) / 2;
      const newlength = Math.sqrt(x * x + y * y) / 2;
      const newposition = Vector.create(newx, newy);
      const newangle = Math.atan2(shape.x2 - newx, shape.y2 - newy);
      this.initial_angle += newangle;
      */
      const location2 = this.real_point_location(Vector.create(shape.x2, shape.y2));
      const middle = Vector.mult(Vector.add(location, location2), 0.5);
      const vertices = [Vector.sub(location, middle), Vector.sub(location2, middle), Vector.sub(location, middle)];
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

    // optional: create constraint
    if (this.constraint != null) {
      this.create_constraint();
    }
  }

  create_constraint() {
    if (this.body == null) return;
    const raint = "";
    let constraint_options = this.constraint;
    if (!Array.isArray(constraint_options)) {
      constraint_options = [constraint_options];
    }
    let constraint;
    let point, x, y;
    for (const o of constraint_options) {
      switch (o.type) {
        case "pivot":
          x = o.x == null ? this.x : o.x;
          y = o.y == null ? this.y : o.y;
          constraint = Constraint.create({
            pointA: {
              x: x,
              y: y,
            },
            bodyB: this.body,
            pointB: {
              x: x - this.x,
              y: y - this.y,
            },
            length: 0,
          });
          break;
        case "fix_point":
          x = o.x == null ? this.x : o.x;
          y = o.y == null ? this.y : o.y;
          constraint = Constraint.create({
            pointA: {
              x: x,
              y: y,
            },
            bodyB: this.body,
            pointB: {
              x: x - this.x,
              y: y - this.y,
            },
            stiffness: o.stiffness == null ? 0.0008 : o.stiffness,
            damping: o.damping || 0,
          });
          break;
        default:
          console.error("invalid constraint type in thing.create_constraint: " + o.type);
      }
      Composite.add(world, constraint);      
    }
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


// amogus.js, but here now becausse of import issues...

export class Amogus extends Thing {

  static tick() {
    
  }

  constructor() {
    super(Vector.create(0, 0));
    this.make(make.player);
  }

  tick() {
    super.tick();
    this.tick_player();
  }

  tick_player() {
    // this.target.facing = camera.mouse_position;
    // move player
    const move_x = (check_keys(["ArrowRight", "KeyD"]) ? 1 : 0) - (check_keys(["ArrowLeft", "KeyA"]) ? 1 : 0);
    const move_y = (check_keys(["ArrowDown", "KeyS"]) ? 1 : 0) - (check_keys(["ArrowUp", "KeyW"]) ? 1 : 0);
    this.move_force(Vector.normalise(Vector.create(move_x, move_y)));
  }

  draw(ctx) {
    super.draw(ctx);
    this.draw_player(ctx);
  }

  draw_player(ctx) {
    // among us
    // sus?
  }

}

export const player = new Amogus();


window.Thing = Thing;
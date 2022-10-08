import { engine } from "./main.js";
import { send_bottom_text } from "./ui.js";

export const collide = { };

const PI = Math.PI;

const Engine = Matter.Engine,
      Events = Matter.Events,
      Vector = Matter.Vector;

collide.point_circle = (point, circle, r) => {
  const dx = circle.x - point.x;
  const dy = circle.y - point.y;
  r = r || circle.r;
  return dx * dx + dy * dy <= r * r;
}

collide.circle_circle = (c1, c2, r1, r2) => {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const r = r1 + r2;
  return dx * dx + dy * dy <= r * r;
}

collide.line_circle = (a, b, circle, radius, nearest) => {
  radius = radius || circle.r;
  // check to see if start or end points lie within circle 
  if (collide.point_circle(a, circle, radius)) {
    if (nearest) {
      nearest.x = a.x;
      nearest.y = a.y;
    }
      return true
  } if (collide.point_circle(b, circle, radius)) {
    if (nearest) {
      nearest.x = a.x;
      nearest.y = a.y;
    }
    return true;
  }

  const x1 = a[0],
        y1 = a[1],
        x2 = b[0],
        y2 = b[1],
        cx = circle[0],
        cy = circle[1];

  // vector d
  const dx = x2 - x1;
  const dy = y2 - y1;

  // vector lc
  const lcx = cx - x1;
  const lcy = cy - y1;

  // project lc onto d, resulting in vector p
  const dLen2 = dx * dx + dy * dy // length^2 of d
  const px = dx;
  const py = dy;
  if (dLen2 > 0) {
    const dp = (lcx * dx + lcy * dy) / dLen2;
    px *= dp;
    py *= dp;
  }

  if (!nearest)
    nearest = { };
  nearest.x = x1 + px;
  nearest.y = y1 + py;

  // length^2 of p
  const pLen2 = px * px + py * py;

  // check collision
  return collide.point_circle(nearest, circle, radius)
          && pLen2 <= dLen2 && (px * dx + py * dy) >= 0;
}

// added and modified from https://github.com/Silverwolf90/2d-visibility/blob/master/src/

collide.calculate_segment_angles = (source, segment) => {
  const x = source.x;
  const y = source.y;
  const dx = 0.5 * (segment.p1.x + segment.p2.x) - x;
  const dy = 0.5 * (segment.p1.y + segment.p2.y) - y;

  segment.d = (dx * dx) + (dy * dy);
  segment.p1.angle = Math.atan2(segment.p1.y - y, segment.p1.x - x);
  segment.p2.angle = Math.atan2(segment.p2.y - y, segment.p2.x - x);
};

collide.calculate_segment_beginning = (segment) => {
  let angle = segment.p2.angle - segment.p1.angle;

  if (angle <= -PI) angle += 2 * PI;
  if (angle > PI) angle -= 2 * PI;

  segment.p1.begin = angle > 0;
  segment.p2.begin = !segment.p1.begin;
};

collide.make_segment = (source, p1, p2) => {
  const segment = {
    p1: Vector.clone(p1),
    p2: Vector.clone(p2),
    d: 0,
  }
  segment.p1.segment = segment;
  segment.p2.segment = segment;
  collide.calculate_segment_angles(source, segment);
  collide.calculate_segment_beginning(segment);
  return segment;
}

collide.endpoint_sort_comparator = (p1, p2) => {
  if (p1.angle > p2.angle) return 1;
  if (p1.angle < p2.angle) return -1;
  if (!p1.begin && p2.begin) return 1;
  if (p1.begin && !p2.begin) return -1;
  return 0;
};

collide.left_of = (segment, point) => {
  const cross_product = (segment.p2.x - segment.p1.x) * (point.y - segment.p1.y)
                      - (segment.p2.y - segment.p1.y) * (point.x - segment.p1.x);
  return cross_product < 0;
};

collide.lerp_vector = (p1, p2, f) => {
  return Vector.create(
    p1.x * (1 - f) + p2.x * f,
    p1.y * (1 - f) + p2.y * f
  );
};

collide.segment_in_front = (seg1, seg2, relative_point) => {

  const A1 = collide.left_of(seg1, collide.lerp_vector(seg2.p1, seg2.p2, 0.01));
  const A2 = collide.left_of(seg1, collide.lerp_vector(seg2.p2, seg2.p1, 0.01));
  const A3 = collide.left_of(seg1, relative_point);
  
  const B1 = collide.left_of(seg2, collide.lerp_vector(seg1.p1, seg1.p2, 0.01));
  const B2 = collide.left_of(seg2, collide.lerp_vector(seg1.p2, seg1.p1, 0.01));
  const B3 = collide.left_of(seg2, relative_point);

  if (B1 === B2 && B2 !== B3) return true;
  if (A1 === A2 && A2 === A3) return true;
  if (A1 === A2 && A2 !== A3) return false;
  if (B1 === B2 && B2 === B3) return false;

  return false;

};

collide.line_intersection = (p1, p2, p3, p4) => {
  const s = (
    (p4.x - p3.x) * (p1.y - p3.y) -
    (p4.y - p3.y) * (p1.x - p3.x)
  ) / (
    (p4.y - p3.y) * (p2.x - p1.x) -
    (p4.x - p3.x) * (p2.y - p1.y)
  );  
  return Vector.create(
    p1.x + s * (p2.x - p1.x),
    p1.y + s * (p2.y - p1.y)
  );
};

collide.triangle_points = (origin_point, angle1, angle2, segment) => {

  const p1 = origin_point;
  const p2 = Vector.create(origin_point.x + Math.cos(angle1), origin_point.y + Math.sin(angle1));
  const p3 = Vector.create(0, 0);
  const p4 = Vector.create(0, 0);

  if (segment) {
    p3.x = segment.p1.x;
    p3.y = segment.p1.y;
    p4.x = segment.p2.x;
    p4.y = segment.p2.y;
  } else {
    p3.x = origin_point.x + Math.cos(angle1) * 200;
    p3.y = origin_point.y + Math.sin(angle1) * 200;
    p4.x = origin_point.x + Math.cos(angle2) * 200;
    p4.y = origin_point.y + Math.sin(angle2) * 200;
  }

  const start = collide.line_intersection(p3, p4, p1, p2);

  p2.x = origin_point.x + Math.cos(angle2);
  p2.y = origin_point.y + Math.sin(angle2);

  const end = collide.line_intersection(p3, p4, p1, p2);

  return [start, end];

};

collide.calculate_visibility = (origin, endpoints) => {

  const open_segments = [ ];
  const output = [ ];
  let begin_angle = 0;

  endpoints.sort(collide.endpoint_sort_comparator);

  for (let pass = 0; pass < 2; pass += 1) {

    for (let i = 0; i < endpoints.length; i += 1) {
      let endpoint = endpoints[i];
      let open_segment = open_segments[0];
      
      if (endpoint.begin) {
        let index = 0;
        let segment = open_segments[index];
        while (segment && collide.segment_in_front(endpoint.segment, segment, origin)) {
          index += 1;
          segment = open_segments[index];
        }

        if (!segment) {
          open_segments.push(endpoint.segment);
        } else {
          open_segments.splice(index, 0, endpoint.segment);
        }
      } else {
        let index = open_segments.indexOf(endpoint.segment);
        if (index > -1) open_segments.splice(index, 1);
      }
      
      if (open_segment !== open_segments[0]) {
        if (pass === 1) {
          const triangle_points = collide.triangle_points(origin, begin_angle, endpoint.angle, open_segment);
          output.push(triangle_points);
        }
        begin_angle = endpoint.angle;
      }
    }

  }

  return output;

};

const flat_map = (cb, array) =>
  array.reduce((flat_array, item) => flat_array.concat(cb(item)), []);

collide.get_endpoints_from_segments = (segments) => {
  return flat_map((segment) => [segment.p1, segment.p2], segments);
};


const collide_start = function(a, b, pair) {
  const t = a.thing;
  const u = b.thing;
  if (u.player) {
    if (t.message != null) {
      send_bottom_text(t.message);
    }
  }
}

const collide_end = function(a, b, pair) {

}

export const init_collide = function() {
  Events.on(engine, "collisionStart", function(event) {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      collide_start(a, b, pair);
      collide_start(b, a, pair);
    }
  });
  Events.on(engine, "collisionEnd", function(event) {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      collide_end(a, b, pair);
      collide_end(b, a, pair);
    }
  });
}
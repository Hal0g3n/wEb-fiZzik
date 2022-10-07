// yuan
import { camera } from "./camera.js";
import { collide } from "./collide.js";
import { draw } from "./draw.js";
import { screen, ctx } from "./main.js";
import { Thing, player} from "./thing.js";

const Query = Matter.Query,
      Vector = Matter.Vector;

export const clip_visibility_polygon = () => {

  ctx.save();
  
  const w = screen.w;
  const h = screen.h;
  const radius = Math.sqrt(w * w + h * h) * 1.5; // multiplied by 1.5, just in case

  // get points from all things

  const points = [ ];
  const bodies = [ ];
  const end_points = [ ];

  for (const t of Thing.things) {
    if (t.body == null || t == player) continue;
    if (!t.roughly_on_screen()) continue;
    let points_on_screen = 0;
    for (const point of t.get_points()) {
      const draw_point = camera.object_position(point);
      if (draw_point.x < 0 || draw_point.x > w) continue;
      if (draw_point.y < 0 || draw_point.y > h) continue;
      points_on_screen++;
      points.push(point);
    }
    bodies.push(t.body);
    const segments = t.get_segments();
    end_points.push(...collide.get_endpoints_from_segments(segments));
  }

  const start = player.position;

  /*

  // just a test

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const diff = Vector.sub(point, start);
    const end = Vector.add(start, Vector.mult(diff, radius / Vector.magnitude(diff)));
    const query = Query.ray(bodies, start, end, 1); // ray width = 1
    //console.log(query);

    ctx.strokeStyle = "red";
    const s = camera.object_position(start);
    const e = camera.object_position(end);
    draw.line(ctx, s.x, s.y, e.x, e.y);
  }
  */

  // the real thing is in collide
  const result = collide.calculate_visibility(start, end_points);

  //console.log(result.length);
  const s = camera.object_position(start);
  for (const triangle of result) {
    const p1 = triangle[0];
    const p2 = triangle[1];
    ctx.fillStyle = "#ff000055";
    ctx.strokeStyle = "#00000000";
    const e1 = camera.object_position(p1);
    const e2 = camera.object_position(p2);
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(e1.x, e1.y);
    ctx.lineTo(e2.x, e2.y);
    ctx.lineTo(s.x, s.y);
    ctx.fill();
    //draw.line(ctx, s.x, s.y, e1.x, e1.y);
    //draw.line(ctx, s.x, s.y, e2.x, e2.y);
  }

}

export const unclip_visibility_polygon = () => {

  ctx.restore();

}

window.clip_visibility_polygon = clip_visibility_polygon;
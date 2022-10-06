export const collide = { };

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
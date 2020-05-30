export  { klein };

function klein(v, u, target) {
  u *= Math.PI;
  v *= 2 * Math.PI;
  u = u * 2;

  let x;
  let z;

  if (u < Math.PI) {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
      z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
  } else {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
      z = -8 * Math.sin(u);
  }

  const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

  target.set(x, y, z).multiplyScalar(3);
}

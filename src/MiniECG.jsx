import React, { useEffect, useState } from "react";

// Make the ECG line span 120 units
const ecgPoints = [
  [0, 20], [20, 20], [30, 10], [40, 30], [50, 20], [70, 20],
  [80, 15], [90, 25], [100, 20], [120, 20]
];

function interpolate(points, t) {
  let total = 0;
  let segLengths = [];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    const len = Math.sqrt(dx * dx + dy * dy);
    segLengths.push(len);
    total += len;
  }
  let dist = t * total;
  let drawnPoints = [points[0]];
  for (let i = 1; i < points.length; i++) {
    if (dist <= segLengths[i - 1]) {
      const ratio = dist / segLengths[i - 1];
      const x = points[i - 1][0] + ratio * (points[i][0] - points[i - 1][0]);
      const y = points[i - 1][1] + ratio * (points[i][1] - points[i - 1][1]);
      drawnPoints.push([x, y]);
      return { dot: [x, y], line: drawnPoints };
    }
    drawnPoints.push(points[i]);
    dist -= segLengths[i - 1];
  }
  return { dot: points[points.length - 1], line: points };
}

const MiniECG = () => {
  const [dotT, setDotT] = useState(0);

  useEffect(() => {
    let start;
    function animate(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % 2000;
      setDotT(elapsed / 2000);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => {};
  }, []);

  const { dot, line } = interpolate(ecgPoints, dotT);

  return (
    <svg width={120} height={40} viewBox="0 0 120 40">
      <polyline
        points={line.map(p => p.join(",")).join(" ")}
        // stroke="#be4662"
        stroke="#fa9b9b"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx={dot[0]}
        cy={dot[1]}
        r={3}
        fill="#fa9b9b"
        // stroke="#be4662"
        strokeWidth="1"
      />
    </svg>
  );
};

export default MiniECG;
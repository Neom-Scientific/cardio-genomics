// import React from "react";

// const AnimatedBackground = () => (
//   <div className="animated-bg">
//     {/* Animated ECG line */}
//     <svg className="ecg-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
//       <polyline
//         className="ecg-line"
//         points="0,100 100,100 120,40 140,160 160,100 300,100 320,60 340,140 360,100 1200,100"
//         stroke="#be4662"
//         strokeWidth="4"
//         fill="none"
//       />
//     </svg>
//     {/* Floating hearts */}
//     {[...Array(7)].map((_, i) => (
//       <svg
//         key={i}
//         className={`heart heart-${i}`}
//         viewBox="0 0 32 29.6"
//         width="32"
//         height="30"
//       >
//         <path
//           d="M23.6,0c-3.4,0-6.4,2.7-7.6,5.3C14.8,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.1,16,21.2,16,21.2s16-12.1,16-21.2
//           C32,3.8,28.2,0,23.6,0z"
//           fill="#fa9b9b"
//           opacity="0.7"
//         />
//       </svg>
//     ))}
//   </div>
// );

// export default AnimatedBackground;

import React, { useEffect, useState } from "react";

// ECG points (add more for realism if you want)
const ecgPoints = [
    [0, 100], [40, 100], [60, 80], [80, 100], // baseline
    [100, 40], [120, 160], [140, 100], // spike
    [180, 100], [200, 80], [220, 100], // baseline
    [240, 60], [260, 100], // small bump
    [300, 100], [340, 100], // flat
    [360, 40], [380, 160], [400, 100], // spike
    [440, 100], [460, 80], [480, 100], // baseline
    [500, 60], [520, 100], // small bump
    [560, 100], [600, 100], // flat
    [620, 40], [640, 160], [660, 100], // spike
    [700, 100], [720, 80], [740, 100], // baseline
    [760, 60], [780, 100], // small bump
    [820, 100], [860, 100], // flat
    [880, 40], [900, 160], [920, 100], // spike
    [960, 100], [980, 80], [1000, 100], // baseline
    [1020, 60], [1040, 100], // small bump
    [1080, 100], [1120, 100], // flat
    [1140, 100], [1200, 100] // end
  ];

// Helper to interpolate between points
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

const AnimatedBackground = () => {
  const [dotT, setDotT] = useState(0);

  useEffect(() => {
    let start;
    function animate(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % 6000; // 2s for full ECG
      setDotT(elapsed / 6000);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => {};
  }, []);

  const { dot, line } = interpolate(ecgPoints, dotT);

  return (
    <div className="animated-bg">
      <svg className="ecg-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
        {/* Only draw up to the dot */}
        <polyline
          points={line.map(p => p.join(",")).join(" ")}
          stroke="#be4662"
          strokeWidth="4"
          fill="none"
        />
        {/* Moving dot */}
        <circle
          cx={dot[0]}
          cy={dot[1]}
          r={8}
          fill="#fa9b9b"
          stroke="#be4662"
          strokeWidth="3"
        />
      </svg>
      {/* Floating human hearts */}
      {/* {[...Array(7)].map((_, i) => (
        <img
          key={i}
          src="/human_heart.svg"
          alt="Heart"
          width={32}
          height={30}
          className={`heart heart-${i}`}
          style={{ opacity: 0.7 }}
        />
      ))} */}
    </div>
  );
};

export default AnimatedBackground;
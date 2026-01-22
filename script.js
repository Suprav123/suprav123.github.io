(() => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");

  const saved = localStorage.getItem("theme");
  if (saved === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");

  const syncIcon = () => {
    const t = root.getAttribute("data-theme") || "light";
    themeBtn.querySelector(".icon").textContent = (t === "dark") ? "☾" : "☀";
  };
  syncIcon();

  themeBtn.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme") || "light";
    const next = (cur === "dark") ? "light" : "dark";
    if (next === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    localStorage.setItem("theme", next);
    syncIcon();
  });

  const canvas = document.getElementById("mowerCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const covFill = document.getElementById("covFill");
  const covValue = document.getElementById("covValue");
  const regenBtn = document.getElementById("regenBtn");
  const pauseBtn = document.getElementById("pauseBtn");

  let obstacles = [];
  let path = [];
  let idx = 0;
  let paused = false;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function randInt(a, b){ return Math.floor(a + Math.random()*(b-a+1)); }

  function regen(){
    obstacles = [];
    for(let i=0;i<8;i++){
      obstacles.push({ x: randInt(70, W-70), y: randInt(60, H-60), r: randInt(14, 26) });
    }
    path = buildZigZagPath();
    idx = 0;
    paused = false;
    pauseBtn.textContent = "Pause";
  }

  function buildZigZagPath(){
    const laneGap = 26, margin = 26;
    const pts = [];
    let dir = 1;
    for(let y = margin; y <= H - margin; y += laneGap){
      if(dir === 1){
        for(let x = margin; x <= W - margin; x += 10) pts.push(avoidObstacles(x, y));
      } else {
        for(let x = W - margin; x >= margin; x -= 10) pts.push(avoidObstacles(x, y));
      }
      dir *= -1;
    }
    return smooth(pts, 0.22);
  }

  function avoidObstacles(x, y){
    for(const o of obstacles){
      const dx = x - o.x, dy = y - o.y;
      const d = Math.hypot(dx, dy);
      if(d < o.r + 8){
        const ang = Math.atan2(dy, dx);
        return { x: o.x + Math.cos(ang) * (o.r + 12), y: o.y + Math.sin(ang) * (o.r + 12) };
      }
    }
    return {x, y};
  }

  function smooth(points, alpha){
    if(points.length < 2) return points;
    const out = [points[0]];
    for(let i=1;i<points.length;i++){
      const p = points[i];
      const prev = out[out.length-1];
      out.push({ x: prev.x + (p.x - prev.x) * (1 - alpha), y: prev.y + (p.y - prev.y) * (1 - alpha) });
    }
    return out;
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const dark = (document.documentElement.getAttribute("data-theme") === "dark");

    ctx.globalAlpha = dark ? 0.16 : 0.10;
    ctx.strokeStyle = dark ? "#ffffff" : "#0b172a";
    ctx.lineWidth = 1;
    for(let x=0;x<=W;x+=26){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for(let y=0;y<=H;y+=26){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.globalAlpha = 1;

    for(const o of obstacles){
      ctx.beginPath();
      ctx.fillStyle = dark ? "rgba(255,255,255,0.10)" : "rgba(11,23,42,0.06)";
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.40)" : "rgba(11,23,42,0.28)";
      ctx.lineWidth = 2;
      ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    }

    if(path.length){
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = dark ? "rgba(46,230,201,0.92)" : "rgba(139,123,255,0.92)";
      ctx.moveTo(path[0].x, path[0].y);
      const end = clamp(idx, 1, path.length-1);
      for(let i=1;i<=end;i++) ctx.lineTo(path[i].x, path[i].y);
      ctx.stroke();

      const p = path[end];
      ctx.beginPath();
      ctx.fillStyle = dark ? "rgba(139,123,255,0.92)" : "rgba(46,230,201,0.92)";
      ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
      ctx.fill();

      const prev = path[Math.max(0, end-1)];
      const ang = Math.atan2(p.y - prev.y, p.x - prev.x);
      ctx.beginPath();
      ctx.strokeStyle = dark ? "rgba(139,123,255,0.65)" : "rgba(11,23,42,0.35)";
      ctx.lineWidth = 2;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(ang)*18, p.y + Math.sin(ang)*18);
      ctx.stroke();

      const cov = Math.round((end/(path.length-1))*100);
      covFill.style.width = cov + "%";
      covValue.textContent = cov + "%";
    }
  }

  function tick(){
    if(!paused){
      idx += 2;
      if(idx >= path.length) idx = path.length - 1;
    }
    draw();
    requestAnimationFrame(tick);
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if(e.shiftKey){
      let best = -1, bestD = 1e9;
      obstacles.forEach((o, i) => {
        const d = Math.hypot(o.x - x, o.y - y);
        if(d < bestD){ bestD = d; best = i; }
      });
      if(best >= 0 && bestD < 60) obstacles.splice(best, 1);
    } else {
      obstacles.push({ x, y, r: 20 + Math.random()*10 });
    }

    path = buildZigZagPath();
    idx = 0;
  });

  regenBtn.addEventListener("click", regen);
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "Play" : "Pause";
  });

  regen();
  tick();
})();

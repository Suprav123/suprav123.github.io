gsap.registerPlugin(ScrollTrigger);

const bootLines = [
  "> initializing suprav_portfolio.deck",
  "> loading embedded systems module",
  "> loading robotics module",
  "> checking sensors: OK",
  "> checking control logic: OK",
  "> loading project rail",
  "> 3D build core: online",
  "> engineer detected",
  "> welcome. scroll to explore_"
];

const bootText = document.querySelector("#bootText");
let lineIndex = 0;
let charIndex = 0;

function typeBootText() {
  if (!bootText || lineIndex >= bootLines.length) return;

  const currentLine = bootLines[lineIndex];
  bootText.textContent =
    bootLines.slice(0, lineIndex).join("\n") +
    (lineIndex > 0 ? "\n" : "") +
    currentLine.slice(0, charIndex + 1);

  charIndex++;

  if (charIndex >= currentLine.length) {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeBootText, 115);
  } else {
    setTimeout(typeBootText, 15);
  }
}

typeBootText();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis;

if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({
    lerp: 0.2,
    wheelMultiplier: 1.65,
    touchMultiplier: 1.8,
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  lenis.on("scroll", ScrollTrigger.update);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -20, duration: 0.8 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

gsap.from(".hero-copy > *", {
  y: 36,
  opacity: 0,
  duration: 0.85,
  stagger: 0.1,
  ease: "power3.out"
});

gsap.from(".hero-visual > *", {
  y: 34,
  opacity: 0,
  duration: 0.9,
  stagger: 0.12,
  delay: 0.12,
  ease: "power3.out"
});

const revealSections = gsap.utils.toArray(".reveal-section");
revealSections.forEach((section) => {
  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 76%"
    }
  });
});

gsap.from(".status-card", {
  y: 32,
  opacity: 0,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".status-grid",
    start: "top 78%"
  }
});

const projectTrack = document.querySelector(".project-track");
const projectsWrap = document.querySelector(".projects-wrap");
let horizontalTween;

function killTriggersByPrefix(prefix) {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars && typeof trigger.vars.id === "string" && trigger.vars.id.startsWith(prefix)) {
      trigger.kill();
    }
  });
}

function setupProjectDetailReveals() {
  killTriggersByPrefix("projectReveal");
  const cards = gsap.utils.toArray(".project-card");

  cards.forEach((card, index) => {
    const items = card.querySelectorAll(".project-visual, .project-detail p, .project-detail li, .project-detail .btn");
    if (!items.length) return;

    if (window.innerWidth > 860 && horizontalTween) {
      gsap.set(items, { autoAlpha: 0, y: 18 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          id: `projectReveal-${index}`,
          trigger: card,
          containerAnimation: horizontalTween,
          start: "left 72%",
          end: "left 36%",
          scrub: true
        }
      });
    } else {
      gsap.set(items, { autoAlpha: 0, y: 18 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          id: `projectReveal-${index}`,
          trigger: card,
          start: "top 78%"
        }
      });
    }
  });
}

function setupHorizontalScroll() {
  killTriggersByPrefix("projectRail");
  killTriggersByPrefix("projectReveal");

  if (horizontalTween) horizontalTween.kill();
  if (!projectTrack || !projectsWrap) return;

  gsap.set(projectTrack, { x: 0 });

  if (window.innerWidth <= 860) {
    projectsWrap.style.height = "auto";
    horizontalTween = null;
    setupProjectDetailReveals();
    return;
  }

  const sticky = document.querySelector(".projects-sticky");
  const styles = window.getComputedStyle(sticky);
  const sidePadding = parseFloat(styles.paddingLeft) || 24;
  const distance = Math.max(0, projectTrack.scrollWidth - window.innerWidth + sidePadding * 2);

  // Faster than the first version, but long enough for card details to reveal smoothly.
  const scrollDistance = Math.max(distance * 1.05, window.innerHeight * 2.25);
  projectsWrap.style.height = `${scrollDistance + window.innerHeight * 1.08}px`;

  horizontalTween = gsap.to(projectTrack, {
    x: -distance,
    ease: "none",
    scrollTrigger: {
      id: "projectRail-main",
      trigger: projectsWrap,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      scrub: 0.18,
      pin: false,
      invalidateOnRefresh: true
    }
  });

  setupProjectDetailReveals();
}

setupHorizontalScroll();
window.addEventListener("resize", () => {
  setupHorizontalScroll();
  ScrollTrigger.refresh();
});

const wires = gsap.utils.toArray(".wire, .route");
wires.forEach((wire) => {
  gsap.to(wire, {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".mower-diagram",
      start: "top 76%"
    }
  });
});

gsap.from(".paper-card", {
  y: 30,
  opacity: 0,
  stagger: 0.08,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".publications",
    start: "top 78%"
  }
});

gsap.from(".log-entry", {
  y: 30,
  opacity: 0,
  stagger: 0.08,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".experience",
    start: "top 78%"
  }
});

gsap.from(".skill-module, .skill-orbit", {
  y: 30,
  opacity: 0,
  stagger: 0.08,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".skills",
    start: "top 78%"
  }
});

// Lightweight 3D tilt for cards. It adds depth but does not hijack scrolling.
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 861 || reduceMotion) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = -((y / rect.height) - 0.5) * 7;
    gsap.to(card, { rotateX, rotateY, duration: 0.22, ease: "power2.out" });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.28, ease: "power2.out" });
  });
});

// Magnetic buttons, kept subtle so they do not feel annoying.
gsap.utils.toArray(".btn").forEach((btn) => {
  btn.addEventListener("mousemove", (event) => {
    if (reduceMotion) return;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.08, y: y * 0.12, duration: 0.18 });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.22 });
  });
});

function initHero3D() {
  const canvas = document.querySelector("#labCanvas");
  if (!canvas || !window.THREE || reduceMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));

  const group = new THREE.Group();
  scene.add(group);

  const chip = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.15, 0.18),
    new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.82 })
  );
  group.add(chip);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.46, 1),
    new THREE.MeshBasicMaterial({ color: 0x81f495, wireframe: true, transparent: true, opacity: 0.72 })
  );
  group.add(core);

  const pointGeometry = new THREE.BufferGeometry();
  const points = [];
  for (let i = 0; i < 110; i++) {
    points.push((Math.random() - 0.5) * 5.5, (Math.random() - 0.5) * 3.8, (Math.random() - 0.5) * 3.2);
  }
  pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const particles = new THREE.Points(
    pointGeometry,
    new THREE.PointsMaterial({ color: 0x67e8f9, size: 0.022, transparent: true, opacity: 0.72 })
  );
  scene.add(particles);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);

  function animate() {
    group.rotation.x += 0.004;
    group.rotation.y += 0.009;
    core.rotation.y -= 0.014;
    particles.rotation.y += 0.0018;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

function initMorph3D() {
  const canvas = document.querySelector("#morphCanvas");
  if (!canvas || !window.THREE || reduceMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 6.95;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

  const material = new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.9 });
  const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x81f495, wireframe: true, transparent: true, opacity: 0.22 });

  const geometries = [
    () => new THREE.IcosahedronGeometry(1.15, 2),
    () => new THREE.BoxGeometry(1.85, 1.85, 1.85, 5, 5, 5),
    () => new THREE.TorusKnotGeometry(0.78, 0.23, 96, 12),
    () => new THREE.OctahedronGeometry(1.35, 2),
    () => new THREE.DodecahedronGeometry(1.2, 1),
    () => new THREE.TorusGeometry(1.12, 0.28, 24, 120)
  ];
  const labels = ["SENSE MODULE", "CONTROL CORE", "ACTUATOR NODE", "PACKAGED BUILD", "VALIDATION LOOP", "SHIPPING MODE"];
  const colors = [0x67e8f9, 0x81f495, 0xffd166, 0x67e8f9, 0x81f495, 0xffd166];

  const group = new THREE.Group();
  scene.add(group);
  group.scale.set(0.78, 0.78, 0.78);

  let mesh = new THREE.Mesh(geometries[0](), material);
  let glow = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.012, 16, 120), glowMaterial);
  glow.rotation.x = Math.PI / 2;
  group.add(mesh, glow);

  const pointGeometry = new THREE.BufferGeometry();
  const points = [];
  for (let i = 0; i < 170; i++) {
    points.push((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
  }
  pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const particles = new THREE.Points(
    pointGeometry,
    new THREE.PointsMaterial({ color: 0x67e8f9, size: 0.018, transparent: true, opacity: 0.6 })
  );
  scene.add(particles);

  const steps = gsap.utils.toArray(".morph-step");
  const label = document.querySelector("#morphLabel");
  let activeStage = 0;

  function setStage(stage) {
    if (stage === activeStage) return;
    activeStage = stage;
    mesh.geometry.dispose();
    mesh.geometry = geometries[stage]();
    material.color.setHex(colors[stage]);
    glowMaterial.color.setHex(colors[stage]);
    if (label) label.textContent = labels[stage];
    steps.forEach((step, index) => step.classList.toggle("is-active", index === stage));
    gsap.fromTo(mesh.scale, { x: 0.52, y: 0.52, z: 0.52 }, { x: 1, y: 1, z: 1, duration: 0.42, ease: "back.out(1.7)" });
    gsap.fromTo(mesh.rotation, { x: mesh.rotation.x + 0.7, y: mesh.rotation.y - 0.5 }, { x: mesh.rotation.x, y: mesh.rotation.y, duration: 0.6, ease: "power2.out" });
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);

  if (window.innerWidth > 860) {
    ScrollTrigger.create({
      id: "morphBuild",
      trigger: ".build-morph-section",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const stageCount = geometries.length;
        const stage = Math.min(stageCount - 1, Math.floor(self.progress * stageCount));
        setStage(stage);
        group.rotation.z = self.progress * Math.PI * 0.75;
      }
    });
  }

  function animate() {
    mesh.rotation.x += 0.0045;
    mesh.rotation.y += 0.008;
    glow.rotation.z += 0.01;
    particles.rotation.y += 0.0018;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

function initPathPlanner() {
  const canvas = document.querySelector("#pathCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const cols = 24;
  const rows = 14;
  const obstacleZones = [];
  let blocked = new Set();
  let route = [];
  let animatedCells = 0;
  let animationFrame;

  const coverageStat = document.querySelector("#coverageStat");
  const obstacleStat = document.querySelector("#obstacleStat");
  const routeStat = document.querySelector("#routeStat");
  const seedButton = document.querySelector("#seedObstacles");
  const runButton = document.querySelector("#runPlanner");
  const clearButton = document.querySelector("#clearPlanner");

  function cellKey(c, r) { return `${c},${r}`; }
  function fromKey(key) { return key.split(",").map(Number); }
  function isInside(c, r) { return c >= 0 && c < cols && r >= 0 && r < rows; }
  function isBlocked(c, r) { return blocked.has(cellKey(c, r)); }
  function randomBetween(min, max) { return min + Math.random() * (max - min); }

  function refreshBlockedCells() {
    blocked = new Set();
    obstacleZones.forEach((zone) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = c - zone.c;
          const dy = r - zone.r;
          if (Math.sqrt(dx * dx + dy * dy) <= zone.radius) {
            blocked.add(cellKey(c, r));
          }
        }
      }
    });
  }

  function resizeCanvasForDisplay() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function getMetrics() {
    const rect = canvas.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      cellW: rect.width / cols,
      cellH: rect.height / rows
    };
  }

  function neighbors(c, r) {
    return [
      [c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]
    ].filter(([nc, nr]) => isInside(nc, nr) && !isBlocked(nc, nr));
  }

  function findPath(start, goal) {
    const startKey = cellKey(start.c, start.r);
    const goalKey = cellKey(goal.c, goal.r);
    if (isBlocked(start.c, start.r) || isBlocked(goal.c, goal.r)) return [];
    if (startKey === goalKey) return [start];

    const queue = [startKey];
    const cameFrom = new Map([[startKey, null]]);

    while (queue.length) {
      const current = queue.shift();
      const [c, r] = fromKey(current);
      for (const [nc, nr] of neighbors(c, r)) {
        const next = cellKey(nc, nr);
        if (cameFrom.has(next)) continue;
        cameFrom.set(next, current);
        if (next === goalKey) {
          const path = [];
          let walk = next;
          while (walk) {
            const [wc, wr] = fromKey(walk);
            path.push({ c: wc, r: wr });
            walk = cameFrom.get(walk);
          }
          return path.reverse();
        }
        queue.push(next);
      }
    }

    return [];
  }

  function getCoverageTargets() {
    const targets = [];
    for (let r = 0; r < rows; r++) {
      const leftToRight = r % 2 === 0;
      for (let i = 0; i < cols; i++) {
        const c = leftToRight ? i : cols - 1 - i;
        if (!isBlocked(c, r)) targets.push({ c, r });
      }
    }
    return targets;
  }

  function buildRoute() {
    refreshBlockedCells();
    const targets = getCoverageTargets();
    if (!targets.length) return [];

    const path = [targets[0]];
    let current = targets[0];

    for (const target of targets.slice(1)) {
      const segment = findPath(current, target);
      if (segment.length > 1) {
        path.push(...segment.slice(1));
        current = target;
      }
    }

    return path;
  }

  function updateStats() {
    const free = cols * rows - blocked.size;
    const uniqueVisited = new Set(route.slice(0, animatedCells).map((cell) => cellKey(cell.c, cell.r))).size;
    const coverage = free ? Math.min(100, Math.round((uniqueVisited / free) * 100)) : 0;
    if (coverageStat) coverageStat.textContent = `${coverage}%`;
    if (obstacleStat) obstacleStat.textContent = `${obstacleZones.length}`;
    if (routeStat) routeStat.textContent = `${Math.min(animatedCells, route.length)}`;
  }

  function draw() {
    refreshBlockedCells();
    const { width, height, cellW, cellH } = getMetrics();
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "rgba(6, 42, 39, 0.58)");
    bg.addColorStop(0.52, "rgba(2, 22, 28, 0.82)");
    bg.addColorStop(1, "rgba(1, 11, 18, 0.92)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Soft terrain points only. No circular/radar rings.
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const x = c * cellW;
        const y = r * cellH;
        ctx.fillStyle = "rgba(103,232,249,0.075)";
        ctx.beginPath();
        ctx.arc(x, y, 1.05, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const visited = new Set(route.slice(0, animatedCells).map((cell) => cellKey(cell.c, cell.r)));
    visited.forEach((key) => {
      const [c, r] = fromKey(key);
      const cx = c * cellW + cellW / 2;
      const cy = r * cellH + cellH / 2;
      ctx.fillStyle = "rgba(103, 232, 249, 0.105)";
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cellW, cellH) * 0.27, 0, Math.PI * 2);
      ctx.fill();
    });

    // Obstacles are circular blocked zones with randomized size.
    obstacleZones.forEach((zone) => {
      const cx = (zone.c + 0.5) * cellW;
      const cy = (zone.r + 0.5) * cellH;
      const rad = Math.min(cellW, cellH) * zone.radius * 0.68;
      const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad * 1.35);
      g.addColorStop(0, "rgba(255, 209, 102, 0.50)");
      g.addColorStop(0.52, "rgba(255, 209, 102, 0.20)");
      g.addColorStop(1, "rgba(255, 209, 102, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rad * 1.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 209, 102, 0.24)";
      ctx.strokeStyle = "rgba(255, 209, 102, 0.62)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    if (route.length && animatedCells > 0) {
      const visibleRoute = route.slice(0, animatedCells);
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(129, 244, 149, 0.92)";
      ctx.shadowColor = "rgba(129, 244, 149, 0.58)";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      visibleRoute.forEach((cell, index) => {
        const x = cell.c * cellW + cellW / 2;
        const y = cell.r * cellH + cellH / 2;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      const start = visibleRoute[0];
      const head = visibleRoute[visibleRoute.length - 1];
      if (start) drawMarker(start, "START", "#67e8f9");
      if (head) drawMarker(head, "BOT", "#81f495");
    }

    updateStats();
  }

  function drawMarker(cell, label, color) {
    const { cellW, cellH } = getMetrics();
    const x = cell.c * cellW + cellW / 2;
    const y = cell.r * cellH + cellH / 2;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(x, y, Math.min(cellW, cellH) * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = "600 10px JetBrains Mono, monospace";
    ctx.fillStyle = "rgba(233,251,255,0.82)";
    ctx.fillText(label, x + 9, y - 8);
  }

  function animateRoute() {
    cancelAnimationFrame(animationFrame);
    route = buildRoute();
    animatedCells = 0;

    function step() {
      animatedCells = Math.min(route.length, animatedCells + 3);
      draw();
      if (animatedCells < route.length) animationFrame = requestAnimationFrame(step);
    }

    step();
  }

  function zoneOverlapsExisting(candidate) {
    return obstacleZones.some((zone) => {
      const dx = zone.c - candidate.c;
      const dy = zone.r - candidate.r;
      return Math.sqrt(dx * dx + dy * dy) < zone.radius + candidate.radius + 0.8;
    });
  }

  function seedObstacles() {
    obstacleZones.length = 0;
    route = [];
    animatedCells = 0;

    const count = Math.floor(randomBetween(9, 15));
    let attempts = 0;
    while (obstacleZones.length < count && attempts < 180) {
      attempts++;
      const candidate = {
        c: Math.floor(randomBetween(2, cols - 2)),
        r: Math.floor(randomBetween(1, rows - 1)),
        radius: randomBetween(0.75, 1.55)
      };

      // Keep a bit of space near the starting and ending rows so the route has room to begin/end.
      if ((candidate.c < 3 && candidate.r < 3) || (candidate.c > cols - 4 && candidate.r > rows - 4)) continue;
      if (zoneOverlapsExisting(candidate)) continue;
      obstacleZones.push(candidate);
    }

    refreshBlockedCells();
    draw();
  }

  function findZoneAt(c, r) {
    return obstacleZones.findIndex((zone) => {
      const dx = c - zone.c;
      const dy = r - zone.r;
      return Math.sqrt(dx * dx + dy * dy) <= zone.radius + 0.3;
    });
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const { cellW, cellH } = getMetrics();
    const c = Math.floor((event.clientX - rect.left) / cellW);
    const r = Math.floor((event.clientY - rect.top) / cellH);
    if (!isInside(c, r)) return;

    const existing = findZoneAt(c, r);
    if (existing >= 0) {
      obstacleZones.splice(existing, 1);
    } else {
      obstacleZones.push({ c, r, radius: randomBetween(0.75, 1.45) });
    }

    route = [];
    animatedCells = 0;
    refreshBlockedCells();
    draw();
  });

  seedButton?.addEventListener("click", seedObstacles);
  runButton?.addEventListener("click", animateRoute);
  clearButton?.addEventListener("click", () => {
    obstacleZones.length = 0;
    blocked.clear();
    route = [];
    animatedCells = 0;
    draw();
  });

  window.addEventListener("resize", resizeCanvasForDisplay);
  resizeCanvasForDisplay();
  seedObstacles();
}

function initReferencePopups() {
  document.querySelectorAll(".reference-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = button.closest(".log-entry");
      if (!entry) return;
      const isOpen = entry.classList.toggle("reference-open");
      const popover = entry.querySelector(".reference-popover");
      if (popover) popover.setAttribute("aria-hidden", String(!isOpen));
      button.textContent = isOpen ? "Okay, proof unlocked ✅" : button.dataset.label || button.textContent;
    });
    button.dataset.label = button.textContent;
  });
}

initReferencePopups();

initHero3D();
initMorph3D();
initPathPlanner();

window.addEventListener("load", () => {
  setupHorizontalScroll();
  ScrollTrigger.refresh();
});

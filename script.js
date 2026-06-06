/* ============================================================
   GOODBYE WEBSITE — script.js
   ============================================================ */

/* ---------- BG CANVAS ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

const COLORS = ['#0ea5e9','#06b6d4','#38bdf8','#0369a1','#7dd3fc','#22d3ee'];

const orbs = Array.from({length: 7}, (_, i) => ({
  x: Math.random(), y: Math.random(),
  r: 200 + Math.random() * 250,
  vx: (Math.random() - 0.5) * 0.0003,
  vy: (Math.random() - 0.5) * 0.0003,
  color: COLORS[i % COLORS.length],
  alpha: 0.04 + Math.random() * 0.07
}));

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

function drawOrbs() {
  ctx.clearRect(0, 0, W, H);
  orbs.forEach(o => {
    o.x += o.vx; o.y += o.vy;
    if (o.x < 0 || o.x > 1) o.vx *= -1;
    if (o.y < 0 || o.y > 1) o.vy *= -1;
    const grd = ctx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
    grd.addColorStop(0, o.color + Math.round(o.alpha*255).toString(16).padStart(2,'0'));
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  });
  requestAnimationFrame(drawOrbs);
}
drawOrbs();

/* ---------- TYPEWRITER ---------- */
function typeInto(el, txt, speed = 55) {
  el.textContent = '';
  return new Promise(resolve => {
    let i = 0;
    function tick() {
      if (i >= txt.length) { resolve(); return; }
      el.textContent += txt[i++];
      setTimeout(tick, speed + (Math.random() * 30 - 15));
    }
    tick();
  });
}

/* ---------- SLIDE ENGINE ---------- */
const slides   = Array.from(document.querySelectorAll('.slide'));
const dots     = Array.from(document.querySelectorAll('.dot'));
const pbarFill = document.getElementById('pbar-fill');
let current    = 0;
let busy       = false;

function show(el) {
  if (!el) return;
  el.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show-anim')));
}

function updateDots(idx) {
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  pbarFill.style.width = ((idx / (slides.length - 1)) * 100) + '%';
}

function goSlide(idx) {
  if (busy || idx === current) return;
  // ✅ ຫ້າມຂ້າມ — ຕ້ອງໄປຕາມລຳດັບເທົ່ານັ້ນ
  if (idx !== current + 1) return;
  busy = true;
  const prev = slides[current];
  prev.classList.add('exit');
  setTimeout(() => { prev.classList.remove('active', 'exit'); }, 700);
  current = idx;
  slides[current].classList.add('active');
  updateDots(current);
  setTimeout(() => { playSlide(current); busy = false; }, 150);
}

function nextSlide() {
  if (current < slides.length - 1) goSlide(current + 1);
}

/* ---------- BLOCK swipe/keyboard skip ---------- */
// keyboard: ລົບ arrow key navigation ອອກ ຫ້າມໄປຫຼັງ
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  // ລົບ arrow key skip ອອກທັງໝົດ
});

// touch swipe: ປິດໝົດ
// (ລຶບ touchstart/touchend navigation)

/* ---------- YEAR SELECTOR ---------- */
let yearChosen = false;

function selectYear(el, label, msg) {
  if (yearChosen) return;
  yearChosen = true;
  el.classList.add('selected');
  document.querySelectorAll('.year-chip').forEach(c => c.classList.add('locked'));
  const result = document.getElementById('yearResult');
  result.textContent = msg;
  result.classList.add('show');
  const btn = document.getElementById('btn2');
  if (btn.classList.contains('hidden')) {
    setTimeout(() => show(btn), 600);
  }
}

/* ---------- GALLERY LIGHTBOX ---------- */
function openLightbox(item) {
  const img = item.querySelector('img');
  if (!img || !img.src || img.src === window.location.href) return;
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  lbImg.src = img.src;
  lb.classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

/* ---------- GAME (SLIDE 8) ---------- */
let gameInterval = null;
let gameTimeout  = null;
let gameRunning  = false;
let score        = 0;
let timeLeft     = 10;

function startGame() {
  const area      = document.getElementById('gameArea');
  const stats     = document.getElementById('gameStats');
  const startBtn  = document.getElementById('gameStartBtn');
  const result    = document.getElementById('gameResult');

  score    = 0;
  timeLeft = 10;
  gameRunning = true;

  startBtn.style.display = 'none';
  result.classList.add('hidden');
  result.textContent = '';
  show(stats);
  document.getElementById('gameScore').textContent = '0';
  document.getElementById('gameTimer').textContent = '10';

  // spawn hearts
  area.innerHTML = '';
  spawnHeart(area);

  // countdown timer
  gameInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('gameTimer').textContent = timeLeft;
    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

function spawnHeart(area) {
  if (!gameRunning) return;
  const btn = document.createElement('button');
  btn.className = 'heart-btn';
  btn.textContent = '💙';
  // ສຸ່ມຕຳແໜ່ງ
  const maxX = area.offsetWidth  - 64;
  const maxY = area.offsetHeight - 64;
  btn.style.left = Math.max(0, Math.random() * maxX) + 'px';
  btn.style.top  = Math.max(0, Math.random() * maxY) + 'px';
  btn.onclick = () => {
    if (!gameRunning) return;
    score++;
    document.getElementById('gameScore').textContent = score;
    btn.classList.add('heart-pop');
    setTimeout(() => btn.remove(), 300);
    if (score >= 10) { endGame(true); return; }
    spawnHeart(area);
  };
  area.appendChild(btn);
  // ຖ້າ 2.5s ບໍ່ກົດ ຍ້າຍໃໝ່
  setTimeout(() => {
    if (gameRunning && btn.parentNode) {
      btn.remove();
      spawnHeart(area);
    }
  }, 2500);
}

function endGame(win) {
  gameRunning = false;
  clearInterval(gameInterval);
  clearTimeout(gameTimeout);

  const area   = document.getElementById('gameArea');
  const result = document.getElementById('gameResult');
  area.innerHTML = '';

  result.classList.remove('hidden');
  show(result);

  if (win) {
    result.innerHTML = '🎉 ເກັ່ງເວີຍຍ555+! ກົດຄົບ 10 ອັນ!<br><small>ເບິດສ່ຳນິລະ 555+</small>';
  } else {
    result.innerHTML = `😭 ໄດ້ ${score}/10 ອັນ… ຄັ້ງໜ້າເອົາໃຫມ່ !<br><small>ຫຼິ້ນໃໝ່ບໍ?</small>`;
    // ປຸ່ມ retry
    const retry = document.createElement('button');
    retry.className = 'game-start-btn';
    retry.style.marginTop = '12px';
    retry.textContent = '🔄 ຫຼິ້ນໃໝ່';
    retry.onclick = () => {
      result.classList.add('hidden');
      document.getElementById('gameStats').classList.add('hidden');
      startGame();
    };
    result.appendChild(retry);
  }
  setTimeout(() => show(document.getElementById('btn8')), 800);
}

/* ---------- SLIDE SCRIPTS ---------- */
async function playSlide(idx) {
  switch (idx) {

    case 0: {
      const tw  = document.getElementById('tw1');
      const sub = document.getElementById('sub1');
      const btn = document.getElementById('btn1');
      await typeInto(tw, tw.dataset.text, 90);
      await delay(300); show(sub);
      await delay(900); show(btn);
      break;
    }

    case 1: {
      yearChosen = false;
      document.querySelectorAll('.year-chip').forEach(c => c.classList.remove('locked','selected'));
      const result = document.getElementById('yearResult');
      result.classList.remove('show'); result.textContent = '';
      const tw  = document.getElementById('tw2');
      const sel = document.getElementById('yearsel');
      await typeInto(tw, tw.dataset.text, 70);
      await delay(400); show(sel);
      break;
    }

    case 2: {
      const tw    = document.getElementById('tw3');
      const sub   = document.getElementById('sub3');
      const funny = document.getElementById('funny3');
      const btn   = document.getElementById('btn3');
      await typeInto(tw, tw.dataset.text, 65);
      await delay(300); show(sub);
      await delay(600); show(funny);
      await delay(1000); show(btn);
      break;
    }

    case 3: {
      const wrap = document.getElementById('cards4');
      const btn  = document.getElementById('btn4');
      show(wrap);
      await delay(80);
      for (const card of wrap.querySelectorAll('.flow-card')) {
        const span = card.querySelector('.card-tw');
        card.classList.add('show');
        await delay(200);
        await typeInto(span, span.dataset.text, 45);
        await delay(200);
      }
      await delay(400); show(btn);
      break;
    }

    case 4: {
      const grid = document.getElementById('gallery5');
      const btn  = document.getElementById('btn5');
      show(grid);
      await delay(100);
      const items = grid.querySelectorAll('.gallery-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('show'), i * 120);
      });
      await delay(items.length * 120 + 400);
      show(btn);
      break;
    }

    case 5: {
      const wrap = document.getElementById('list6');
      const btn  = document.getElementById('btn6');
      show(wrap);
      await delay(80);
      for (const line of wrap.querySelectorAll('.list-line')) {
        const span = line.querySelector('.list-tw');
        line.classList.add('show');
        await delay(150);
        await typeInto(span, span.dataset.text, 40);
        await delay(150);
      }
      await delay(400); show(btn);
      break;
    }

    case 6: {
      const paras = ['lp1','lp2','lp3','lp4'].map(id => document.getElementById(id));
      const sign  = document.getElementById('lsign');
      const btn   = document.getElementById('btn7');
      for (const p of paras) {
        p.classList.remove('hidden');
        await typeInto(p, p.dataset.text, 50);
        await delay(350);
      }
      await delay(300); show(sign);
      await delay(800); show(btn);
      break;
    }

    case 7: {
      // game slide — reset state
      gameRunning = false;
      clearInterval(gameInterval);
      score = 0; timeLeft = 10;
      const area    = document.getElementById('gameArea');
      const stats   = document.getElementById('gameStats');
      const result  = document.getElementById('gameResult');
      const btn8    = document.getElementById('btn8');
      area.innerHTML = '<button class="game-start-btn" id="gameStartBtn" onclick="startGame()">▶ ເລີ່ມເລີຍ!</button>';
      stats.classList.add('hidden');
      result.classList.add('hidden');
      btn8.classList.add('hidden');
      btn8.classList.remove('show-anim');
      break;
    }

    case 8: {
      const tw     = document.getElementById('tw8');
      const fsub   = document.getElementById('fsub9');
      const ffunny = document.getElementById('ffunny9');
      const estamp = document.getElementById('estamp9');
      await delay(400);
      await typeInto(tw, tw.dataset.text, 100);
      await delay(400); show(fsub);
      await delay(900); show(ffunny);
      await delay(900); show(estamp);
      break;
    }
  }
}

/* ---------- HELPERS ---------- */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ---------- INIT ---------- */
updateDots(0);
playSlide(0);

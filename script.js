/* ============================================================
   GOODBYE WEBSITE — script.js  (ocean blue edition)
   ============================================================ */

/* ---------- BG CANVAS ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

const COLORS = ['#0ea5e9','#06b6d4','#38bdf8','#0369a1','#7dd3fc','#22d3ee'];

const orbs = Array.from({length: 7}, (_, i) => ({
  x: Math.random(),
  y: Math.random(),
  r: 200 + Math.random() * 250,
  vx: (Math.random() - 0.5) * 0.0003,
  vy: (Math.random() - 0.5) * 0.0003,
  color: COLORS[i % COLORS.length],
  alpha: 0.04 + Math.random() * 0.07
}));

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
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

/* ---------- YEAR SELECTOR (SLIDE 2) ---------- */
let yearChosen = false;

function selectYear(el, label, msg) {
  if (yearChosen) return;          // กดได้แค่ครั้งเดียว
  yearChosen = true;

  // mark selected
  el.classList.add('selected');

  // lock all chips
  document.querySelectorAll('.year-chip').forEach(c => c.classList.add('locked'));

  const result = document.getElementById('yearResult');
  result.textContent = msg;
  result.classList.add('show');

  // show button after selection
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

/* ---------- SLIDE SCRIPTS ---------- */
async function playSlide(idx) {
  switch (idx) {

    /* SLIDE 1 */
    case 0: {
      const tw  = document.getElementById('tw1');
      const sub = document.getElementById('sub1');
      const btn = document.getElementById('btn1');
      await typeInto(tw, tw.dataset.text, 90);
      await delay(300); show(sub);
      await delay(900); show(btn);
      break;
    }

    /* SLIDE 2 — interactive year */
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

    /* SLIDE 3 */
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

    /* SLIDE 4 — cards */
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

    /* SLIDE 5 — gallery */
    case 4: {
      const grid = document.getElementById('gallery5');
      const btn  = document.getElementById('btn5');
      show(grid);
      await delay(100);
      // animate items in one by one
      const items = grid.querySelectorAll('.gallery-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('show');
        }, i * 120);
      });
      await delay(items.length * 120 + 400);
      show(btn);
      break;
    }

    /* SLIDE 6 — list */
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

    /* SLIDE 7 — letter */
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

    /* SLIDE 8 — final */
    case 7: {
      const tw     = document.getElementById('tw8');
      const fsub   = document.getElementById('fsub');
      const ffunny = document.getElementById('ffunny');
      const estamp = document.getElementById('estamp');
      await delay(400);
      await typeInto(tw, tw.dataset.text, 100);
      await delay(400); show(fsub);
      await delay(900); show(ffunny);
      await delay(900); show(estamp);
      break;
    }
  }
}

/* ---------- KEYBOARD & SWIPE ---------- */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goSlide(Math.max(0, current - 1));
  if (e.key === 'Escape') closeLightbox();
});

let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, {passive:true});
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
    if (dy < 0) nextSlide();
    else goSlide(Math.max(0, current - 1));
  }
}, {passive:true});

/* ---------- HELPERS ---------- */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ---------- INIT ---------- */
updateDots(0);
playSlide(0);
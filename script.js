/* ============================================================
   GOODBYE WEBSITE — script.js
   ============================================================ */

/* ---------- BG CANVAS (floating orbs) ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

const COLORS = ['#ff6b9d','#a78bfa','#34d399','#fbbf24','#60a5fa'];

const orbs = Array.from({length: 6}, (_, i) => ({
  x: Math.random(),
  y: Math.random(),
  r: 180 + Math.random() * 220,
  vx: (Math.random() - 0.5) * 0.0004,
  vy: (Math.random() - 0.5) * 0.0004,
  color: COLORS[i % COLORS.length],
  alpha: 0.05 + Math.random() * 0.07
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

/* ---------- TYPEWRITER CORE ---------- */
/**
 * Type text into element char by char.
 * @param {HTMLElement} el  - the element to type into
 * @param {string}      txt - text to type
 * @param {number}      speed - ms per char (default 55)
 * @returns {Promise}
 */
function typeInto(el, txt, speed = 55) {
  el.textContent = '';
  return new Promise(resolve => {
    let i = 0;
    function tick() {
      if (i >= txt.length) { resolve(); return; }
      el.textContent += txt[i++];
      setTimeout(tick, speed + (Math.random() * 30 - 15)); // slight jitter
    }
    tick();
  });
}

/* ---------- SLIDE ENGINE ---------- */
const slides     = Array.from(document.querySelectorAll('.slide'));
const dots       = Array.from(document.querySelectorAll('.dot'));
const pbarFill   = document.getElementById('pbar-fill');
let current      = 0;
let busy         = false;

function show(el) {
  el.classList.remove('hidden');
  // force reflow then animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('show-anim'));
  });
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

  setTimeout(() => {
    playSlide(current);
    busy = false;
  }, 150);
}

function nextSlide() {
  if (current < slides.length - 1) goSlide(current + 1);
}

/* ---------- SLIDE SCRIPTS ---------- */
async function playSlide(idx) {
  switch (idx) {

    /* ===== SLIDE 1 ===== */
    case 0: {
      const tw   = document.getElementById('tw1');
      const sub  = document.getElementById('sub1');
      const btn  = document.getElementById('btn1');
      await typeInto(tw, tw.dataset.text, 90);
      await delay(300);
      show(sub);
      await delay(900);
      show(btn);
      break;
    }

    /* ===== SLIDE 2 ===== */
    case 1: {
      const tw    = document.getElementById('tw2');
      const sub   = document.getElementById('sub2');
      const strip = document.getElementById('strip2');
      const btn   = document.getElementById('btn2');
      await typeInto(tw, tw.dataset.text, 60);
      await delay(300);
      show(sub);
      await delay(500);
      show(strip);
      await delay(1000);
      show(btn);
      break;
    }

    /* ===== SLIDE 3 ===== */
    case 2: {
      const tw    = document.getElementById('tw3');
      const sub   = document.getElementById('sub3');
      const funny = document.getElementById('funny3');
      const btn   = document.getElementById('btn3');
      await typeInto(tw, tw.dataset.text, 65);
      await delay(300);
      show(sub);
      await delay(600);
      show(funny);
      await delay(1000);
      show(btn);
      break;
    }

    /* ===== SLIDE 4 (cards) ===== */
    case 3: {
      const cardsWrap = document.getElementById('cards4');
      const btn       = document.getElementById('btn4');
      show(cardsWrap);
      await delay(80);

      const cards = cardsWrap.querySelectorAll('.flow-card');
      for (const card of cards) {
        const span = card.querySelector('.card-tw');
        card.classList.add('show');
        await delay(200);
        await typeInto(span, span.dataset.text, 45);
        await delay(200);
      }
      await delay(400);
      show(btn);
      break;
    }

    /* ===== SLIDE 5 (list) ===== */
    case 4: {
      const listWrap = document.getElementById('list5');
      const btn      = document.getElementById('btn5');
      show(listWrap);
      await delay(80);

      const lines = listWrap.querySelectorAll('.list-line');
      for (const line of lines) {
        const span = line.querySelector('.list-tw');
        line.classList.add('show');
        await delay(150);
        await typeInto(span, span.dataset.text, 40);
        await delay(150);
      }
      await delay(400);
      show(btn);
      break;
    }

    /* ===== SLIDE 6 (letter) ===== */
    case 5: {
      const paras = [
        document.getElementById('lp1'),
        document.getElementById('lp2'),
        document.getElementById('lp3'),
        document.getElementById('lp4'),
      ];
      const sign = document.getElementById('lsign');
      const btn  = document.getElementById('btn6');

      for (const p of paras) {
        p.classList.remove('hidden');
        await typeInto(p, p.dataset.text, 50);
        await delay(350);
      }
      await delay(300);
      show(sign);
      await delay(800);
      show(btn);
      break;
    }

    /* ===== SLIDE 7 (final) ===== */
    case 6: {
      const tw     = document.getElementById('tw7');
      const fsub   = document.getElementById('fsub');
      const ffunny = document.getElementById('ffunny');
      const estamp = document.getElementById('estamp');
      await delay(400);
      await typeInto(tw, tw.dataset.text, 100);
      await delay(400);
      show(fsub);
      await delay(900);
      show(ffunny);
      await delay(900);
      show(estamp);
      break;
    }
  }
}

/* ---------- KEYBOARD & SWIPE ---------- */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goSlide(Math.max(0, current - 1));
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

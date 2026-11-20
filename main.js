/**
 * VEENIT RAMTEKE — F1 MOTORSPORT & KATANA SLICE ENGINE
 * Fullscreen Katana Blade Transitions · F1 Tachometer Telemetry · Lenis Momentum Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     01. LENIS VIRTUAL MOMENTUM SMOOTH SCROLLING
     ========================================================================== */
  let lenis = null;
  try {
    if (typeof window.Lenis !== 'undefined') {
      lenis = new window.Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.5,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } catch (e) {
    console.warn('Lenis could not be initialized:', e);
  }

  /* ==========================================================================
     02. KATANA PAGE-CUTTING TRANSITION SYSTEM
     ========================================================================== */
  const cutCanvas = document.getElementById('katana-cut-canvas');
  const bladeFlash = document.getElementById('katana-blade-flash');
  let cutCtx = null;
  let cutW = 0, cutH = 0;
  const sparks = [];

  if (cutCanvas) {
    cutCtx = cutCanvas.getContext('2d');
    cutW = cutCanvas.width = window.innerWidth;
    cutH = cutCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      cutW = cutCanvas.width = window.innerWidth;
      cutH = cutCanvas.height = window.innerHeight;
    });
  }

  function executeKatanaSlash(callback) {
    // 1. Trigger razor blade flash beam
    if (bladeFlash) {
      bladeFlash.classList.remove('slashing');
      void bladeFlash.offsetWidth; // Force reflow
      bladeFlash.classList.add('slashing');
    }

    // 2. Play metallic blade slice SFX
    playSound('katana');

    // 3. Emit high-voltage sparks along slash vector
    if (cutCtx) {
      const sparkCount = 55;
      const startX = cutW * 0.1;
      const startY = cutH * 0.1;
      const endX = cutW * 0.9;
      const endY = cutH * 0.9;

      for (let i = 0; i < sparkCount; i++) {
        const t = Math.random();
        const originX = startX + (endX - startX) * t;
        const originY = startY + (endY - startY) * t;

        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 1.4;
        const speed = Math.random() * 10 + 4;

        sparks.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: Math.random() * 0.04 + 0.02,
          color: Math.random() > 0.4 ? '#e10600' : (Math.random() > 0.5 ? '#ffffff' : '#ff1801'),
          size: Math.random() * 2.8 + 1,
        });
      }
    }

    if (callback) {
      setTimeout(callback, 80);
    }
  }

  function renderKatanaSparks() {
    if (cutCtx && sparks.length > 0) {
      cutCtx.clearRect(0, 0, cutW, cutH);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.2; // Gravity pull
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
        } else {
          cutCtx.fillStyle = s.color;
          cutCtx.globalAlpha = s.life;
          cutCtx.shadowColor = '#e10600';
          cutCtx.shadowBlur = 8;
          cutCtx.beginPath();
          cutCtx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
          cutCtx.fill();
        }
      }
      cutCtx.globalAlpha = 1.0;
      cutCtx.shadowBlur = 0;
    }
    requestAnimationFrame(renderKatanaSparks);
  }
  requestAnimationFrame(renderKatanaSparks);

  // Slash Gate Buttons & Slash-to-Next
  document.querySelectorAll('.katana-slash-gate, .btn-slash-next').forEach((gate) => {
    gate.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSelector = this.getAttribute('data-target') || this.getAttribute('data-slash-target');
      if (!targetSelector) return;

      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        executeKatanaSlash(() => {
          targetEl.classList.add('katana-slice-section', 'sliced-enter');
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });
  });

  // Nav link smooth anchoring with Katana Slice
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        executeKatanaSlash(() => {
          targetEl.classList.add('katana-slice-section', 'sliced-enter');
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }

          const mobileDrawer = document.getElementById('mobile-drawer');
          if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            mobileDrawer.classList.remove('open');
          }
        });
      }
    });
  });

  // Back to top
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      executeKatanaSlash(() => {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.4 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // Intersection Observer for Section Slice Unfurling on Scroll
  const f1Sections = document.querySelectorAll('section.f1-section, .hero-section');
  let currentInteractingSection = null;

  if ('IntersectionObserver' in window) {
    const sliceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target !== currentInteractingSection) {
            currentInteractingSection = entry.target;
            entry.target.classList.add('katana-slice-section', 'sliced-enter');
            executeKatanaSlash();
          }
        });
      },
      { threshold: 0.28 }
    );

    f1Sections.forEach((sec) => sliceObserver.observe(sec));
  }

  /* ==========================================================================
     03. FORMULA 1 STEERING WHEEL REV BAR & TACHOMETER ENGINE
     ========================================================================== */
  const revLeds = document.querySelectorAll('.f1-shift-bar .rev-led');
  const gearIndicator = document.getElementById('cockpit-gear');
  const speedVal = document.getElementById('telemetry-speed');

  let lastY = window.scrollY;
  let rawVelocity = 0;
  let smoothedRPM = 0;

  function updateF1Cockpit() {
    const curY = window.scrollY;
    rawVelocity = Math.abs(curY - lastY);
    lastY = curY;

    // Smoothed RPM simulation (0 to 12,000 RPM)
    smoothedRPM += (rawVelocity - smoothedRPM) * 0.16;

    // Map velocity to 15 LEDs
    const activeLedCount = Math.min(15, Math.floor(smoothedRPM / 3.2));

    revLeds.forEach((led, i) => {
      if (i < activeLedCount) {
        led.classList.add('active');
      } else {
        led.classList.remove('active');
      }
    });

    // Dynamic Gear shifting (G1 to G8)
    if (gearIndicator) {
      const gear = Math.min(8, Math.max(1, Math.floor(smoothedRPM / 5.5) + 1));
      gearIndicator.textContent = gear;
    }

    // Dynamic Telemetry Speed (climbs up to 348 KM/H with DRS active)
    if (speedVal) {
      const speed = Math.min(348, Math.floor(290 + smoothedRPM * 2.5));
      speedVal.textContent = `${speed} KM/H`;
    }

    requestAnimationFrame(updateF1Cockpit);
  }
  requestAnimationFrame(updateF1Cockpit);

  /* ==========================================================================
     04. AERODYNAMIC STREAMLINE WIND TUNNEL CANVAS
     ========================================================================== */
  const streamCanvas = document.getElementById('f1-streamline-canvas');
  if (streamCanvas) {
    const sCtx = streamCanvas.getContext('2d');
    let sW = (streamCanvas.width = window.innerWidth);
    let sH = (streamCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      sW = streamCanvas.width = window.innerWidth;
      sH = streamCanvas.height = window.innerHeight;
    });

    const lines = [];
    const lineCount = 35;

    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x: Math.random() * sW,
        y: Math.random() * sH,
        length: Math.random() * 90 + 40,
        speed: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.35 + 0.1,
        color: Math.random() > 0.4 ? '#e10600' : '#ffffff',
      });
    }

    function renderStreamlines() {
      sCtx.clearRect(0, 0, sW, sH);

      lines.forEach((l) => {
        l.y += l.speed;
        if (l.y > sH) {
          l.y = -l.length;
          l.x = Math.random() * sW;
        }

        sCtx.strokeStyle = l.color;
        sCtx.globalAlpha = l.alpha;
        sCtx.lineWidth = 1;
        sCtx.beginPath();
        sCtx.moveTo(l.x, l.y);
        sCtx.lineTo(l.x - 4, l.y + l.length);
        sCtx.stroke();
      });
      sCtx.globalAlpha = 1.0;
      requestAnimationFrame(renderStreamlines);
    }
    requestAnimationFrame(renderStreamlines);
  }

  /* ==========================================================================
     05. KATANA BLADE CURSOR WITH INTERPOLATION
     ========================================================================== */
  const katanaCursor = document.getElementById('katana-cursor');
  let mX = -100, mY = -100;
  let curX = -100, curY = -100;

  window.addEventListener('mousemove', (e) => {
    mX = e.clientX;
    mY = e.clientY;
  });

  function renderKatanaCursor() {
    if (katanaCursor) {
      curX += (mX - curX) * 0.2;
      curY += (mY - curY) * 0.2;
      katanaCursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    }
    requestAnimationFrame(renderKatanaCursor);
  }
  requestAnimationFrame(renderKatanaCursor);

  document.querySelectorAll('a, button, .f1-tab, .switch-btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      if (katanaCursor) katanaCursor.classList.add('hovering-link');
    });
    btn.addEventListener('mouseleave', () => {
      if (katanaCursor) katanaCursor.classList.remove('hovering-link');
    });
  });

  // Magnetic button physics
  document.querySelectorAll('.magnetic-item').forEach((item) => {
    item.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
    });

    item.addEventListener('mouseleave', function () {
      this.style.transform = `translate3d(0, 0, 0)`;
      this.style.transition = 'transform 0.4s var(--ease-f1)';
    });

    item.addEventListener('mouseenter', function () {
      this.style.transition = 'none';
    });
  });

  /* ==========================================================================
     06. FLOATING PROJECT PREVIEW ON PADDOCK HOVER
     ========================================================================== */
  const floatingPreview = document.getElementById('floating-preview');
  const previewImg = document.getElementById('floating-preview-img');
  const previewTitle = document.getElementById('floating-preview-title');
  const previewTag = document.getElementById('floating-preview-tag');
  const rows = document.querySelectorAll('.project-hover-row');

  let fpX = -100, fpY = -100;
  let targetFpX = -100, targetFpY = -100;

  rows.forEach((row) => {
    row.addEventListener('mouseenter', function () {
      const src = this.getAttribute('data-preview-img');
      const title = this.getAttribute('data-preview-title');
      const tag = this.getAttribute('data-preview-tag');

      if (previewImg && src) previewImg.src = src;
      if (previewTitle && title) previewTitle.textContent = title;
      if (previewTag && tag) previewTag.textContent = tag;

      if (floatingPreview) {
        floatingPreview.classList.add('active');
        playSound('hover');
      }
    });

    row.addEventListener('mouseleave', () => {
      if (floatingPreview) floatingPreview.classList.remove('active');
    });

    row.addEventListener('mousemove', (e) => {
      targetFpX = e.clientX + 25;
      targetFpY = e.clientY - 100;
    });
  });

  function renderFloatingPreview() {
    if (floatingPreview) {
      fpX += (targetFpX - fpX) * 0.15;
      fpY += (targetFpY - fpY) * 0.15;
      floatingPreview.style.setProperty('--fp-x', `${fpX}px`);
      floatingPreview.style.setProperty('--fp-y', `${fpY}px`);
    }
    requestAnimationFrame(renderFloatingPreview);
  }
  requestAnimationFrame(renderFloatingPreview);

  /* ==========================================================================
     07. LIVE CLOCK (PUNE, INDIA)
     ========================================================================== */
  const clockEl = document.getElementById('live-ist-clock');
  function updateISTClock() {
    if (!clockEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    clockEl.textContent = `PUNE ${new Intl.DateTimeFormat('en-GB', options).format(now)} IST`;
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  /* ==========================================================================
     08. WEB AUDIO SYNTHESIZER (KATANA SWORD SLICE & F1 PIT BEEPS)
     ========================================================================== */
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function playSound(type = 'click') {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      if (type === 'katana') {
        // Razor-sharp metallic Katana unsheathe & aerodynamic whoosh
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(2800, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.19);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'hover') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.04);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else {
        // High-tech pit radio click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      // Audio context ignore
    }
  }

  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      const offIcon = soundToggle.querySelector('.sound-off-icon');
      const onIcon = soundToggle.querySelector('.sound-on-icon');

      if (soundEnabled) {
        if (offIcon) offIcon.style.display = 'none';
        if (onIcon) onIcon.style.display = 'block';
        showToast('F1 Telemetry & Katana SFX Armed');
        playSound('katana');
      } else {
        if (offIcon) offIcon.style.display = 'block';
        if (onIcon) onIcon.style.display = 'none';
        showToast('Telemetry Sound Muted');
      }
    });
  }

  /* ==========================================================================
     09. PROJECTS VIEW SWITCHER (CARDS vs. PADDOCK INDEX)
     ========================================================================== */
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');
  const gridView = document.getElementById('projects-grid-view');
  const listView = document.getElementById('projects-list-view');

  if (gridBtn && listBtn && gridView && listView) {
    gridBtn.addEventListener('click', () => {
      executeKatanaSlash(() => {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        gridView.style.display = 'grid';
        listView.style.display = 'none';
      });
    });

    listBtn.addEventListener('click', () => {
      executeKatanaSlash(() => {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        gridView.style.display = 'none';
        listView.style.display = 'flex';
      });
    });
  }

  /* ==========================================================================
     10. POWERTRAIN TECHNICAL MATRIX FILTER
     ========================================================================== */
  const f1Tabs = document.querySelectorAll('.f1-tab');
  const chips = document.querySelectorAll('.powertrain-chip');

  f1Tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      playSound('click');
      f1Tabs.forEach((t) => t.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      chips.forEach((c) => {
        const cat = c.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          c.style.display = 'flex';
          c.style.opacity = '1';
        } else {
          c.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     11. BIBTEX CITATION COPY & DRAWER TOGGLE
     ========================================================================== */
  const copyBibtexBtn = document.getElementById('copy-bibtex-btn');
  const bibtexContainer = document.getElementById('bibtex-container');

  if (copyBibtexBtn && bibtexContainer) {
    copyBibtexBtn.addEventListener('click', () => {
      executeKatanaSlash(() => {
        const isVis = bibtexContainer.style.display === 'block';
        bibtexContainer.style.display = isVis ? 'none' : 'block';

        const bibtex = `@article{thosar2026prashikshan,
  title     = {Prashikshan: A Centralized Academia--Industry Interface for Internship and Skill Validation},
  author    = {Thosar, Devidas and Gujjula, Trisha and Devgirkar, Tanishka and Ramteke, Veenit and Sharma, Lakshmi and Patil, Girish and Gaur, Anjali},
  journal   = {Recent Trends in Data Science Technology},
  volume    = {2},
  number    = {2},
  pages     = {1--7},
  year      = {2026},
  publisher = {HBRP Publication Pvt. Ltd.},
  issn      = {3107-7498},
  doi       = {10.5281/zenodo.19552932},
  url       = {https://doi.org/10.5281/zenodo.19552932}
}`;
        navigator.clipboard.writeText(bibtex).then(() => {
          showToast('BibTeX Citation Copied to Pit Clipboard');
        });
      });
    });
  }

  /* ==========================================================================
     12. RADIO DRIVER EMAIL COPY
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      playSound('click');
      const email = this.getAttribute('data-email') || 'veenitramteke@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Driver Comms Copied: ${email}`);
      });
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  /* ==========================================================================
     13. MOBILE DRAWER TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      playSound('click');
      mobileDrawer.classList.toggle('open');
    });
  }

  /* ==========================================================================
     14. DRIVER MONOCOQUE TILT PHYSICS
     ========================================================================== */
  const monocoque = document.getElementById('hero-driver-monocoque');
  if (monocoque && window.innerWidth > 992) {
    monocoque.addEventListener('mousemove', (e) => {
      const rect = monocoque.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      monocoque.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });

    monocoque.addEventListener('mouseleave', () => {
      monocoque.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      monocoque.style.transition = 'transform 0.5s var(--ease-f1)';
    });

    monocoque.addEventListener('mouseenter', () => {
      monocoque.style.transition = 'none';
    });
  }
});

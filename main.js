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
     02. 3D KATANA CENTER-CUT & OVERLAPPING PAGE-PEEL ENGINE
     ========================================================================== */
  const katanaPeelStage = document.getElementById('katana-peel-stage');
  const peelSparksCanvas = document.getElementById('katana-peel-sparks-canvas');
  let peelSparksCtx = null;
  const peelSparks = [];

  // Telemetry metadata per sector for dynamic 3D peel HUD
  const SECTOR_METADATA = {
    '#top': { num: '01', sector: 'SECTOR 01 // COCKPIT', title: 'PRECISION ENGINEERING', sub: 'AI SYSTEMS & MONOCOQUE VELOCITY' },
    '#projects': { num: '02', sector: 'SECTOR 02 // POWERTRAIN', title: 'HYBRID VELOCITY', sub: 'FEATURED PROJECTS · DRISHTI · VASH · PRASHIKSHAN' },
    '#publication': { num: '03', sector: 'SECTOR 03 // RESEARCH', title: 'SCIENTIFIC PODIUM', sub: 'HBRP JOURNAL · DATA SCIENCE & TECH (DOI 10.5281)' },
    '#honors': { num: '04', sector: 'SECTOR 04 // PODIUMS', title: 'GRAND PRIX TROPHIES', sub: 'P1 IIT GUWAHATI AVINYA · ELECTRONOVA ROBOTICS' },
    '#experience': { num: '05', sector: 'SECTOR 05 // PIT STRATEGY', title: 'APPLIED GOVERNANCE', sub: 'PPGF POLITICAL CONSULTING · ICPC COMPETITIVE CODING' },
    '#education': { num: '06', sector: 'SECTOR 06 // DRIVER ACADEMY', title: 'DUAL PEDIGREE', sub: 'IIM BANGALORE DBE · GHRCEM B.TECH CSE (CGPA 8.5)' },
    '#about': { num: '07', sector: 'SECTOR 07 // ARSENAL', title: 'ENGINE ARCHITECTURE', sub: 'PYTHON · PYTORCH · FASTAPI · ROS2 · NEXT.JS' },
    '#resume': { num: '08', sector: 'SECTOR 08 // SUPERLICENSE', title: 'OFFICIAL DOSSIER', sub: 'FIA RESUME SUPERLICENSE · DOWNLOAD VERIFIED PDF' },
    '#contact': { num: '09', sector: 'SECTOR 09 // FINISH LINE', title: 'PADDOCK CLUB', sub: 'PIT WALL COMMUNICATIONS · VEENITRAMTEKE@GMAIL.COM' }
  };

  if (peelSparksCanvas) {
    peelSparksCtx = peelSparksCanvas.getContext('2d');
    const resizeSparksCanvas = () => {
      peelSparksCanvas.width = peelSparksCanvas.offsetWidth || 420;
      peelSparksCanvas.height = peelSparksCanvas.offsetHeight || 800;
    };
    resizeSparksCanvas();
    window.addEventListener('resize', resizeSparksCanvas);
  }

  function triggerKatanaPeelSparks() {
    if (!peelSparksCanvas || !peelSparksCtx) return;
    const w = peelSparksCanvas.width;
    const h = peelSparksCanvas.height;
    const centerX = w / 2;

    const sparkCount = 80;
    for (let i = 0; i < sparkCount; i++) {
      const originY = 60 + Math.random() * (h - 220);
      const isLeft = Math.random() > 0.5;
      const angle = isLeft
        ? Math.PI - 0.2 + (Math.random() - 0.5) * 0.9
        : 0.2 + (Math.random() - 0.5) * 0.9;
      const speed = Math.random() * 9 + 4;

      peelSparks.push({
        x: centerX + (Math.random() - 0.5) * 6,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.7 - (Math.random() * 2),
        life: 1.0,
        decay: Math.random() * 0.035 + 0.02,
        color: Math.random() > 0.5 ? '#ffffff' : (Math.random() > 0.4 ? '#ffd700' : (Math.random() > 0.3 ? '#ff5500' : '#e10600')),
        size: Math.random() * 2.8 + 1.2
      });
    }
  }

  function renderKatanaPeelSparks() {
    if (peelSparksCtx && peelSparks.length > 0) {
      peelSparksCtx.clearRect(0, 0, peelSparksCanvas.width, peelSparksCanvas.height);

      for (let i = peelSparks.length - 1; i >= 0; i--) {
        const s = peelSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.22; // Gravity
        s.life -= s.decay;

        if (s.life <= 0) {
          peelSparks.splice(i, 1);
        } else {
          peelSparksCtx.fillStyle = s.color;
          peelSparksCtx.globalAlpha = s.life;
          peelSparksCtx.shadowColor = '#ff4400';
          peelSparksCtx.shadowBlur = 9;
          peelSparksCtx.beginPath();
          peelSparksCtx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
          peelSparksCtx.fill();
        }
      }
      peelSparksCtx.globalAlpha = 1.0;
      peelSparksCtx.shadowBlur = 0;
    }
    requestAnimationFrame(renderKatanaPeelSparks);
  }
  requestAnimationFrame(renderKatanaPeelSparks);

  function getCurrentSectorId() {
    const list = ['#top', '#projects', '#publication', '#honors', '#experience', '#education', '#about', '#resume', '#contact'];
    const curY = window.scrollY || window.pageYOffset;
    let curr = '#top';
    for (const id of list) {
      const el = document.querySelector(id);
      if (el) {
        if (curY >= el.offsetTop - 200) {
          curr = id;
        }
      }
    }
    return curr;
  }

  let isPeeling = false;

  function executeKatanaCenterPeel(targetSelector, sourceSelector, callback) {
    if (!targetSelector) return;
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    if (isPeeling) return; // Prevent double-slash overlap
    isPeeling = true;

    const srcId = sourceSelector || getCurrentSectorId();
    const srcMeta = SECTOR_METADATA[srcId] || SECTOR_METADATA['#top'];
    const tgtMeta = SECTOR_METADATA[targetSelector] || { num: '02', sector: 'SECTOR // NEXT', title: 'HYBRID VELOCITY', sub: 'PRECISION ENGINEERING' };

    // Update Underlay HUD text
    const underlaySec = document.getElementById('underlay-hud-sector');
    const underlayTitle = document.getElementById('underlay-hud-title');
    const underlaySub = document.getElementById('underlay-hud-sub');
    if (underlaySec) underlaySec.textContent = tgtMeta.sector;
    if (underlayTitle) underlayTitle.textContent = tgtMeta.title;
    if (underlaySub) underlaySub.textContent = tgtMeta.sub;

    // Update Left & Right Flap text (showing previous section peeling away)
    const peelLeftSec = document.getElementById('peel-left-sector');
    const peelLeftTitle = document.getElementById('peel-left-title');
    const peelRightSec = document.getElementById('peel-right-sector');
    const peelRightTitle = document.getElementById('peel-right-title');
    if (peelLeftSec) peelLeftSec.textContent = srcMeta.sector;
    if (peelLeftTitle) peelLeftTitle.textContent = srcMeta.title;
    if (peelRightSec) peelRightSec.textContent = srcMeta.sector;
    if (peelRightTitle) peelRightTitle.textContent = srcMeta.title;

    // 1. Play authentic Katana unsheathe and slash audio
    playSound('katana');

    // 2. Activate 3D Peel Stage
    if (katanaPeelStage) {
      katanaPeelStage.classList.remove('peeling');
      void katanaPeelStage.offsetWidth; // Reflow
      katanaPeelStage.classList.add('active', 'peeling');
      triggerKatanaPeelSparks();
    }

    // 3. Mid-peel scroll synchronization (at 450ms when flaps are curling back)
    setTimeout(() => {
      targetEl.classList.add('katana-slice-section', 'sliced-enter');
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -50, duration: 1.1 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);

    // 4. Conclude peel and restore interactive stage
    setTimeout(() => {
      if (katanaPeelStage) {
        katanaPeelStage.classList.remove('peeling');
        setTimeout(() => {
          katanaPeelStage.classList.remove('active');
          isPeeling = false;
          if (callback) callback();
        }, 180);
      } else {
        isPeeling = false;
        if (callback) callback();
      }
    }, 1180);
  }

  // Alias for backward compatibility
  function executeKatanaSlash(callback) {
    playSound('katana');
    triggerKatanaPeelSparks();
    if (callback) setTimeout(callback, 80);
  }

  // Slash Gate Buttons between sections
  document.querySelectorAll('.katana-slash-gate, .btn-slash-next').forEach((gate) => {
    gate.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSelector = this.getAttribute('data-target') || this.getAttribute('data-slash-target');
      const fromSelector = this.getAttribute('data-from');
      if (targetSelector) {
        executeKatanaCenterPeel(targetSelector, fromSelector);
      }
    });
  });

  // Nav link smooth anchoring with 3D Katana Center Cut
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const currentSrc = getCurrentSectorId();
        executeKatanaCenterPeel(targetId, currentSrc, () => {
          const mobileDrawer = document.getElementById('mobile-drawer');
          if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            mobileDrawer.classList.remove('open');
          }
        });
      }
    });
  });

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

/**
 * VEENIT RAMTEKE — STRIKE-INSPIRED INTERACTIVE ENGINE
 * Lenis Momentum Scroll · Katana Blade Page-Cutting Engine · F1 Telemetry Tachometer
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

  // Smooth anchor links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        playSound('katana');
        triggerKatanaSlash();

        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -60, duration: 1.3 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }

        // Close mobile drawer if open
        const mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
        }
      }
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      playSound('katana');
      triggerKatanaSlash();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ==========================================================================
     02. DYNAMIC CONTEXTUAL CURSOR WITH SPRING PHYSICS
     ========================================================================== */
  const cursor = document.getElementById('custom-cursor');
  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
  });

  function renderCursor() {
    if (isMoving && cursor) {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Context triggers
  const interactiveLinks = document.querySelectorAll('a, button, .skill-tab, .view-btn');
  interactiveLinks.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hovering-link');
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hovering-link');
    });
  });

  const projectCards = document.querySelectorAll('.project-card, .table-row');
  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hovering-project');
    });
    card.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hovering-project');
    });
  });

  // Magnetic button pull effect
  const magneticItems = document.querySelectorAll('.magnetic-item');
  magneticItems.forEach((btn) => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0)`;
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = `translate3d(0px, 0px, 0px)`;
      this.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', function () {
      this.style.transition = 'none';
    });
  });

  /* ==========================================================================
     03. FLOATING PROJECT PREVIEW (SIGNATURE STRIKE.UNO UX)
     ========================================================================== */
  const floatingPreview = document.getElementById('floating-preview');
  const previewImg = document.getElementById('floating-preview-img');
  const previewTitle = document.getElementById('floating-preview-title');
  const previewTag = document.getElementById('floating-preview-tag');
  const tableRows = document.querySelectorAll('.project-hover-row');

  let fpX = -100, fpY = -100;
  let targetFpX = -100, targetFpY = -100;

  tableRows.forEach((row) => {
    row.addEventListener('mouseenter', function () {
      const imgSrc = this.getAttribute('data-preview-img');
      const title = this.getAttribute('data-preview-title');
      const tag = this.getAttribute('data-preview-tag');

      if (previewImg && imgSrc) previewImg.src = imgSrc;
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
     04. HARDWARE-ACCELERATED AMBIENT CANVAS (GRID & PARTICLES)
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(45, Math.floor(width / 32));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        const dxMouse = mouseX - p1.x;
        const dyMouse = mouseY - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          p1.x -= dxMouse * 0.015;
          p1.y -= dyMouse * 0.015;
        }

        ctx.fillStyle = 'rgba(204, 255, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateCanvas);
    }
    requestAnimationFrame(animateCanvas);
  }

  /* ==========================================================================
     05. KATANA SLASH PAGE-CUTTING ANIMATION ENGINE
     ========================================================================== */
  const slashCanvas = document.getElementById('katana-slash-canvas');
  const bladeVisual = document.getElementById('katana-blade-visual');
  let slashCtx = null;
  let slashWidth = 0, slashHeight = 0;
  const sparks = [];

  if (slashCanvas) {
    slashCtx = slashCanvas.getContext('2d');
    slashWidth = slashCanvas.width = window.innerWidth;
    slashHeight = slashCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      slashWidth = slashCanvas.width = window.innerWidth;
      slashHeight = slashCanvas.height = window.innerHeight;
    });
  }

  function triggerKatanaSlash() {
    // 1. Blade visual flash
    if (bladeVisual) {
      bladeVisual.classList.remove('slashing');
      void bladeVisual.offsetWidth; // Force reflow
      bladeVisual.classList.add('slashing');
    }

    // 2. Spawn spark burst along the diagonal slash line
    if (slashCtx) {
      const sparkCount = 45;
      const startX = slashWidth * 0.15;
      const startY = slashHeight * 0.15;
      const endX = slashWidth * 0.85;
      const endY = slashHeight * 0.85;

      for (let i = 0; i < sparkCount; i++) {
        const t = Math.random();
        const originX = startX + (endX - startX) * t;
        const originY = startY + (endY - startY) * t;

        // Eject perpendicular to slash angle
        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 1.2;
        const speed = Math.random() * 8 + 3;

        sparks.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: Math.random() * 0.04 + 0.02,
          color: Math.random() > 0.4 ? '#00f0ff' : (Math.random() > 0.5 ? '#ffffff' : '#ccff00'),
          size: Math.random() * 2.5 + 1,
        });
      }
    }

    playSound('katana');
  }

  function renderSlashParticles() {
    if (slashCtx && sparks.length > 0) {
      slashCtx.clearRect(0, 0, slashWidth, slashHeight);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15; // Gravity
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
        } else {
          slashCtx.fillStyle = s.color;
          slashCtx.globalAlpha = s.life;
          slashCtx.beginPath();
          slashCtx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
          slashCtx.fill();
        }
      }
      slashCtx.globalAlpha = 1.0;
    }
    requestAnimationFrame(renderSlashParticles);
  }
  requestAnimationFrame(renderSlashParticles);

  // Intersection Observer for Section Slicing on Scroll
  const sectionBlocks = document.querySelectorAll('section.section-block, .hero-section');
  let lastSlicedSection = null;

  if ('IntersectionObserver' in window) {
    const sliceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target !== lastSlicedSection) {
            lastSlicedSection = entry.target;
            entry.target.classList.add('katana-slice-section', 'sliced-enter');
            triggerKatanaSlash();
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionBlocks.forEach((sec) => sliceObserver.observe(sec));
  }

  /* ==========================================================================
     06. FORMULA 1 REV LIMITER & TACHOMETER SIMULATION ENGINE
     ========================================================================== */
  const f1Leds = document.querySelectorAll('.f1-led-group .led');
  const gearDisplay = document.getElementById('f1-gear-indicator');
  const speedDisplay = document.getElementById('f1-speed-val');

  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let smoothedVelocity = 0;

  function updateF1Telemetry() {
    const currentY = window.scrollY;
    scrollVelocity = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;

    // Smooth lerp for RPM feel
    smoothedVelocity += (scrollVelocity - smoothedVelocity) * 0.15;

    // Map velocity to 15 LEDs
    const activeLeds = Math.min(15, Math.floor(smoothedVelocity / 3.5));

    f1Leds.forEach((led, idx) => {
      if (idx < activeLeds) {
        led.classList.add('active');
      } else {
        led.classList.remove('active');
      }
    });

    // Dynamic Gear shifting (G1 to G8)
    if (gearDisplay) {
      let gear = Math.min(8, Math.max(1, Math.floor(smoothedVelocity / 6) + 1));
      gearDisplay.textContent = `G${gear}`;
    }

    // Dynamic Speed simulation (up to 348 KM/H with DRS active)
    if (speedDisplay) {
      let speed = Math.min(348, Math.floor(280 + smoothedVelocity * 2.2));
      speedDisplay.textContent = `${speed} KM/H`;
    }

    requestAnimationFrame(updateF1Telemetry);
  }
  requestAnimationFrame(updateF1Telemetry);

  /* ==========================================================================
     07. LIVE IST CLOCK (PUNE, INDIA)
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
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockEl.textContent = `PUNE ${timeStr} IST`;
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  /* ==========================================================================
     08. WEB AUDIO SYNTHESIZER (KATANA SLASH, F1 REV & CLICKS)
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
        // Metallic Katana blade unsheathe & aerodynamic whoosh
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'hover') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.04);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'nav') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else {
        // Crisp high-tech click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      // Audio context error ignore
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
        showToast('Audio Telemetry & Katana SFX Active');
        playSound('katana');
      } else {
        if (offIcon) offIcon.style.display = 'block';
        if (onIcon) onIcon.style.display = 'none';
        showToast('Sound muted');
      }
    });
  }

  /* ==========================================================================
     09. PROJECTS VIEW MODE TOGGLE (CARDS vs. INDEX TABLE)
     ========================================================================== */
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');
  const gridView = document.getElementById('projects-grid-view');
  const listView = document.getElementById('projects-list-view');

  if (gridBtn && listBtn && gridView && listView) {
    gridBtn.addEventListener('click', () => {
      playSound('katana');
      triggerKatanaSlash();
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      gridView.style.display = 'grid';
      listView.style.display = 'none';
    });

    listBtn.addEventListener('click', () => {
      playSound('katana');
      triggerKatanaSlash();
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      gridView.style.display = 'none';
      listView.style.display = 'flex';
    });
  }

  /* ==========================================================================
     10. SKILLS MATRIX FILTERING
     ========================================================================== */
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillChips = document.querySelectorAll('.skill-chip');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      playSound('click');
      skillTabs.forEach((t) => t.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      skillChips.forEach((chip) => {
        const cat = chip.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          chip.style.display = 'flex';
          chip.style.opacity = '1';
        } else {
          chip.style.display = 'none';
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
      playSound('katana');
      triggerKatanaSlash();
      const isVisible = bibtexContainer.style.display === 'block';
      bibtexContainer.style.display = isVisible ? 'none' : 'block';

      const bibtexText = `@article{thosar2026prashikshan,
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
      navigator.clipboard.writeText(bibtexText).then(() => {
        showToast('BibTeX Citation copied to clipboard');
      });
    });
  }

  /* ==========================================================================
     12. COPY EMAIL BUTTONS & TOAST NOTIFICATION
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      playSound('click');
      const email = this.getAttribute('data-email') || 'veenitramteke@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      });
    });
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
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
     14. TACTICAL HERO PORTRAIT TILT EFFECT
     ========================================================================== */
  const portraitFrame = document.getElementById('hero-portrait-frame');
  if (portraitFrame && window.innerWidth > 992) {
    portraitFrame.addEventListener('mousemove', (e) => {
      const rect = portraitFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      portraitFrame.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });

    portraitFrame.addEventListener('mouseleave', () => {
      portraitFrame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      portraitFrame.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    portraitFrame.addEventListener('mouseenter', () => {
      portraitFrame.style.transition = 'none';
    });
  }
});

/**
 * VEENIT RAMTEKE — STRIKE-INSPIRED INTERACTIVE ENGINE
 * Lenis Momentum Scrolling · Spring Physics Cursor · Ambient Canvas · Floating Preview
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
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
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
        playSound('nav');
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
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
      playSound('click');
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
      // Spring interpolation
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
    const count = Math.min(50, Math.floor(width / 28));

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

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Interaction with mouse
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
     05. LIVE IST CLOCK (PUNE, INDIA)
     ========================================================================== */
  const clockEl = document.getElementById('live-ist-clock');
  function updateISTClock() {
    if (!clockEl) return;
    const now = new Date();
    // Format in IST (UTC + 5:30)
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
     06. WEB AUDIO MICRO-SYNTHESIZER (SOUND INTERACTIONS)
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
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.04);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'nav') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else {
        // Crisp click
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
        showToast('Sound effects enabled');
        playSound('nav');
      } else {
        if (offIcon) offIcon.style.display = 'block';
        if (onIcon) onIcon.style.display = 'none';
        showToast('Sound muted');
      }
    });
  }

  /* ==========================================================================
     07. PROJECTS VIEW MODE TOGGLE (CARDS vs. INDEX TABLE)
     ========================================================================== */
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');
  const gridView = document.getElementById('projects-grid-view');
  const listView = document.getElementById('projects-list-view');

  if (gridBtn && listBtn && gridView && listView) {
    gridBtn.addEventListener('click', () => {
      playSound('click');
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      gridView.style.display = 'grid';
      listView.style.display = 'none';
    });

    listBtn.addEventListener('click', () => {
      playSound('click');
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      gridView.style.display = 'none';
      listView.style.display = 'flex';
    });
  }

  /* ==========================================================================
     08. SKILLS MATRIX FILTERING
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
     09. BIBTEX CITATION COPY & DRAWER TOGGLE
     ========================================================================== */
  const copyBibtexBtn = document.getElementById('copy-bibtex-btn');
  const bibtexContainer = document.getElementById('bibtex-container');

  if (copyBibtexBtn && bibtexContainer) {
    copyBibtexBtn.addEventListener('click', () => {
      playSound('click');
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
     10. COPY EMAIL BUTTONS & TOAST NOTIFICATION
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
     11. MOBILE DRAWER TOGGLE
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
     12. TACTICAL HERO PORTRAIT TILT EFFECT
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

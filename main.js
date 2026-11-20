/**
 * VEENIT RAMTEKE — CREATIVE STUDIO & INTERACTIVE 3D AI SYSTEMS
 * WebGL/Canvas Particle Physics · Fluid Dual-Ring Cursor · 3D Perspective Tilt · Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     01. LUCIDE ICONS INITIALIZATION
     ========================================================================== */
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     02. LENIS SMOOTH MOMENTUM SCROLL
     ========================================================================== */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
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

  /* ==========================================================================
     03. READING / SCROLL PROGRESS BAR & HEADER BLUR
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress-bar');
  const header = document.querySelector('.studio-header');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  /* ==========================================================================
     04. INTERACTIVE 3D PARTICLES CANVAS (PHYSICS & REPULSION)
     ========================================================================== */
  const canvas = document.getElementById('interactive-3d-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    let mouse = { x: -1000, y: -1000, radius: 140 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 90);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2.2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.4 ? 'rgba(99, 102, 241, ' : (Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(236, 72, 153, ');
        this.alpha = Math.random() * 0.5 + 0.25;
      }

      update() {
        this.baseX += this.vx;
        this.baseY += this.vy;

        if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

        // Mouse Repulsion Physics
        const dx = mouse.x - this.baseX;
        const dy = mouse.y - this.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const forceX = (dx / dist) * force * 45;
          const forceY = (dy / dist) * force * 45;
          this.x = this.baseX - forceX;
          this.y = this.baseY - forceY;
        } else {
          this.x += (this.baseX - this.x) * 0.08;
          this.y += (this.baseY - this.y) * 0.08;
        }
      }

      draw() {
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const opacity = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  /* ==========================================================================
     05. FLUID DUAL-RING 3D CURSOR
     ========================================================================== */
  const cursor = document.getElementById('studio-cursor');
  const cursorTag = document.getElementById('cursor-tag');
  let mouseX = -100, mouseY = -100;
  let curX = -100, curY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    if (cursor) {
      curX += (mouseX - curX) * 0.22;
      curY += (mouseY - curY) * 0.22;
      cursor.style.transform = `translate3d(${curX - 22}px, ${curY - 22}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Link & Button Hover States
  document.querySelectorAll('a, button, .magnetic-item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hovering');
    });
  });

  // Card Hover States
  document.querySelectorAll('.project-3d-card, .bento-card, .award-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (cursor) {
        cursor.classList.add('hovering-card');
        if (cursorTag) cursorTag.textContent = 'EXPLORE';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hovering-card');
    });
  });

  /* ==========================================================================
     06. 3D PERSPECTIVE CARD TILT DYNAMICS
     ========================================================================== */
  document.querySelectorAll('.card-tilt-target').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 6.5;
      const rotateY = (x / (rect.width / 2)) * 6.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  /* ==========================================================================
     07. PROJECTS VIEW MODE SWITCHER & FLOATING TRACKER
     ========================================================================== */
  const viewCardsBtn = document.getElementById('view-cards-btn');
  const viewIndexBtn = document.getElementById('view-index-btn');
  const gridView = document.getElementById('projects-grid-view');
  const indexView = document.getElementById('projects-index-view');
  const tracker = document.getElementById('floating-project-tracker');
  const trackerImg = document.getElementById('floating-tracker-img');
  const trackerTag = document.getElementById('floating-tracker-tag');
  const trackerTitle = document.getElementById('floating-tracker-title');

  if (viewCardsBtn && viewIndexBtn && gridView && indexView) {
    viewCardsBtn.addEventListener('click', () => {
      viewCardsBtn.classList.add('active');
      viewIndexBtn.classList.remove('active');
      gridView.style.display = 'grid';
      indexView.style.display = 'none';
      playSound('click');
    });

    viewIndexBtn.addEventListener('click', () => {
      viewIndexBtn.classList.add('active');
      viewCardsBtn.classList.remove('active');
      gridView.style.display = 'none';
      indexView.style.display = 'flex';
      playSound('click');
    });
  }

  // Floating Tracker in Index View
  let trackerX = -100, trackerY = -100;
  let targetTrkX = -100, targetTrkY = -100;

  document.querySelectorAll('.index-row-item').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const img = row.getAttribute('data-preview-img');
      const tag = row.getAttribute('data-preview-tag');
      const title = row.getAttribute('data-preview-title');

      if (tracker && trackerImg) {
        trackerImg.src = img;
        if (trackerTag) trackerTag.textContent = tag;
        if (trackerTitle) trackerTitle.textContent = title;
        tracker.classList.add('active');
      }
    });

    row.addEventListener('mouseleave', () => {
      if (tracker) tracker.classList.remove('active');
    });

    row.addEventListener('mousemove', (e) => {
      targetTrkX = e.clientX + 20;
      targetTrkY = e.clientY - 90;
    });
  });

  function renderTracker() {
    if (tracker) {
      trackerX += (targetTrkX - trackerX) * 0.2;
      trackerY += (targetTrkY - trackerY) * 0.2;
      tracker.style.setProperty('--x', `${trackerX}px`);
      tracker.style.setProperty('--y', `${trackerY}px`);
    }
    requestAnimationFrame(renderTracker);
  }
  requestAnimationFrame(renderTracker);

  /* ==========================================================================
     08. CASE STUDY MODAL DRAWER
     ========================================================================== */
  const modal = document.getElementById('case-study-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-content');

  const CASE_STUDIES = {
    drishti: {
      tag: 'COMPUTER VISION // EDGE AI // CRISIS MANAGEMENT',
      title: 'DRISHTI: Autonomous Disaster Response AI',
      desc: 'An end-to-end multi-modal crisis intelligence engine that coordinates real-time field operations, automated victim triage, and edge geospatial route planning under severe connectivity dropouts.',
      metrics: [
        { label: 'Latency', val: '< 45ms' },
        { label: 'Segmentation Acc', val: '94.2%' },
        { label: 'Routing Efficiency', val: '+38%' }
      ],
      tech: ['Python 3.12', 'PyTorch', 'YOLOv8', 'FastAPI', 'OpenCV', 'GIS Routing'],
      highlights: [
        'Integrated real-time drone aerial imagery segmentation identifying collapsed structures and flood margins.',
        'Engineered an offline-first mobile sync protocol operating seamlessly during severe cellular blackout conditions.',
        'Deployed dynamic shortest-path emergency vehicle dispatchers prioritizing acute critical casualty corridors.'
      ],
      repo: 'https://github.com/veenit-cell'
    },
    vash: {
      tag: 'GRAPH NEURAL NETWORKS // FINTECH FORENSICS',
      title: 'VASH: High-Throughput Financial Fraud Detection Graph',
      desc: 'An automated financial forensics graph network designed to detect complex layered money laundering syndicates, circular transaction rings, and multi-hop fraudulent smurfing rings.',
      metrics: [
        { label: 'Detection Accuracy', val: '99.4%' },
        { label: 'Throughput', val: '12.5k txn/sec' },
        { label: 'False Positive Drop', val: '64%' }
      ],
      tech: ['PyTorch Geometric', 'GraphSAGE', 'Neo4j Cypher', 'Docker', 'FastAPI', 'Python'],
      highlights: [
        'Trained Graph Convolutional Networks (GCN) and GraphSAGE embeddings on millions of synthetic and anonymized banking nodes.',
        'Constructed sub-second subgraph cycle traversal algorithms identifying synthetic identity fraud clusters.',
        'Packaged modular Docker microservices for scalable containerized deployment in enterprise compliance environments.'
      ],
      repo: 'https://github.com/veenit-cell'
    },
    prashikshan: {
      tag: 'DATA SCIENCE PLATFORM // PEER-REVIEWED PUBLICATION',
      title: 'Prashikshan: Adaptive AI Data Science Platform',
      desc: 'Peer-reviewed pedagogical platform engineered to accelerate computational and algorithmic competency through real-time cognitive retention telemetry and dynamic difficulty scaling.',
      metrics: [
        { label: 'Comprehension Boost', val: '+42%' },
        { label: 'Peer-Reviewed Vol', val: 'Vol 2, Issue 2' },
        { label: 'Zenodo DOI', val: '10.5281' }
      ],
      tech: ['React 18', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Statistical ML'],
      highlights: [
        'Published in Recent Trends in Data Science Technology (HBRP Publication, e-ISSN 3107-7498).',
        'Built automated feedback loops measuring code compilation error frequency and debugging hesitation times.',
        'Validated across multi-cohort testing benchmarks proving substantial retention gains.'
      ],
      repo: 'https://doi.org/10.5281/zenodo.19552932'
    },
    electronova: {
      tag: 'EDGE ROBOTICS // SLAM // AUTONOMOUS NAVIGATION',
      title: 'Electronova: Autonomous Edge Robotics Telemetry',
      desc: '1st Position winning autonomous navigation rover engineered with ROS 2, LiDAR spatial mapping, and low-latency motor control under compute-constrained micro-controller constraints.',
      metrics: [
        { label: 'Prize Position', val: '1st Place' },
        { label: 'SLAM Accuracy', val: '< 2.5cm' },
        { label: 'Obstacle Evasion', val: '100% Zero-Collision' }
      ],
      tech: ['ROS 2 Humble', 'C++20', 'LiDAR 2D SLAM', 'Embedded C', 'Raspberry Pi 4', 'Motor PID'],
      highlights: [
        'Awarded 1st Position in Data-Driven Innovation at the Electronova Robotics Hackathon 2024.',
        'Wrote custom C++ nodes for odometry sensor fusion, Kalman filtering, and real-time obstacle evasion.',
        'Transmitted live telemetry feeds back to a central ground station dashboard over secure low-latency UDP sockets.'
      ],
      repo: 'https://github.com/veenit-cell'
    }
  };

  function openCaseStudy(caseKey) {
    const data = CASE_STUDIES[caseKey];
    if (!data || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 24px;">
        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent-cyan); letter-spacing: 0.12em; display: block; margin-bottom: 8px;">${data.tag}</span>
        <h3 style="font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.3;">${data.title}</h3>
      </div>
      <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px;">${data.desc}</p>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; padding: 18px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 10px;">
        ${data.metrics.map(m => `
          <div>
            <div style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">${m.label}</div>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff;">${m.val}</div>
          </div>
        `).join('')}
      </div>

      <h4 style="font-size: 14px; font-family: var(--font-mono); color: var(--accent-indigo); margin-bottom: 12px; letter-spacing: 0.08em;">// KEY ARCHITECTURAL DELIVERABLES</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px;">
        ${data.highlights.map(h => `
          <li style="position: relative; padding-left: 20px; font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
            <span style="position: absolute; left: 0; color: var(--accent-cyan);">→</span> ${h}
          </li>
        `).join('')}
      </ul>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px;">
        ${data.tech.map(t => `<span class="tag-pill">${t}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 14px;">
        <a href="${data.repo}" target="_blank" rel="noopener noreferrer" class="btn-studio-solid" style="padding: 10px 20px; font-size: 13px;">
          <span>Open Verified Source</span>
          <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
        </a>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    modal.classList.add('open');
    playSound('chord');
  }

  function closeCaseStudy() {
    if (modal) modal.classList.remove('open');
  }

  document.querySelectorAll('[data-case]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const caseKey = btn.getAttribute('data-case');
      openCaseStudy(caseKey);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseStudy);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCaseStudy);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeCaseStudy();
    }
  });

  /* ==========================================================================
     09. TECHNICAL ARSENAL FILTER CHIPS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.stack-filter-btn');
  const stackChips = document.querySelectorAll('.stack-chip');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      playSound('click');
      filterBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      stackChips.forEach((chip) => {
        const cat = chip.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          chip.style.display = 'flex';
          chip.style.opacity = '1';
        } else {
          chip.style.display = 'none';
          chip.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     10. BIBTEX DRAWER & COPY CITATION
     ========================================================================== */
  const toggleBibtexBtn = document.getElementById('toggle-bibtex-btn');
  const bibtexContainer = document.getElementById('bibtex-container');
  const copyBibtexBtn = document.getElementById('copy-bibtex-btn');

  if (toggleBibtexBtn && bibtexContainer) {
    toggleBibtexBtn.addEventListener('click', () => {
      playSound('click');
      const isVisible = bibtexContainer.style.display === 'block';
      bibtexContainer.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (copyBibtexBtn) {
    copyBibtexBtn.addEventListener('click', () => {
      playSound('click');
      const code = document.querySelector('.bibtex-code code');
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          showToast('BibTeX Citation Copied to Clipboard');
        });
      }
    });
  }

  /* ==========================================================================
     11. DIRECT EMAIL COPY ACTION
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

  /* ==========================================================================
     12. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }
  }

  /* ==========================================================================
     13. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileTrigger = document.getElementById('mobile-menu-trigger');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileTrigger && mobileDrawer) {
    mobileTrigger.addEventListener('click', () => {
      playSound('click');
      mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     14. LIVE PUNE (IST) CLOCK
     ========================================================================== */
  function updateISTClock() {
    const clockEl = document.getElementById('ist-clock');
    if (!clockEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockEl.textContent = `${new Intl.DateTimeFormat([], options).format(now)} IST`;
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  /* ==========================================================================
     15. AMBIENT WEB AUDIO SYNTHESIZER
     ========================================================================== */
  let audioCtx = null;
  let soundEnabled = false;

  function playSound(type = 'click') {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;

      if (type === 'chord') {
        // Soft airy chime chord
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.04, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.6);
        });
      } else {
        // Delicate click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    const offIcon = soundToggleBtn.querySelector('.sound-icon-off');
    const onIcon = soundToggleBtn.querySelector('.sound-icon-on');

    soundToggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      soundEnabled = !soundEnabled;

      if (soundEnabled) {
        if (offIcon) offIcon.style.display = 'none';
        if (onIcon) onIcon.style.display = 'block';
        showToast('Ambient Creative Audio Activated');
        playSound('chord');
      } else {
        if (offIcon) offIcon.style.display = 'block';
        if (onIcon) onIcon.style.display = 'none';
        showToast('Audio Muted');
      }
    });
  }

  // Smooth hash navigation with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.1 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

});

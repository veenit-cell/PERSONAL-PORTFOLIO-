# Veenit Ramteke — Systems & AI Engineer Portfolio

<div align="center">

  <h1>Veenit Ramteke</h1>
  <p><strong>AI &amp; Systems Engineer · Researcher · BBA (DBE) @ IIM Bangalore &amp; B.Tech CSE @ GHRCEM</strong></p>

  [![Website Status](https://img.shields.io/badge/Live%20Demo-Vercel%20Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://veenit-strike-portfolio.vercel.app)
  [![UX Style](https://img.shields.io/badge/UX%20Style-Strike.uno%20Inspired-ccff00?style=for-the-badge&logoColor=black)](https://veenit-strike-portfolio.vercel.app)
  [![Performance](https://img.shields.io/badge/FPS-60%20Momentum%20Scroll-00f0ff?style=for-the-badge)](https://veenit-strike-portfolio.vercel.app)
  [![DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.19552932-blue?style=for-the-badge&logo=doi&logoColor=white)](https://doi.org/10.5281/zenodo.19552932)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  <br/>

  <p align="center">
    <a href="https://veenit-strike-portfolio.vercel.app"><strong>Explore Live Website »</strong></a>
    ·
    <a href="https://github.com/veenit-cell/PERSONAL-PORTFOLIO-"><strong>GitHub Repository »</strong></a>
    ·
    <a href="https://doi.org/10.5281/zenodo.19552932"><strong>Zenodo DOI »</strong></a>
    ·
    <a href="https://github.com/veenit-cell/publication"><strong>Research Publication Repo »</strong></a>
    ·
    <a href="mailto:veenitramteke@gmail.com"><strong>Contact Directly »</strong></a>
  </p>

</div>

---

## 🌟 Overview

This repository hosts the next-generation personal portfolio for **Veenit Ramteke**, designed with the luxury brutalist aesthetic, tactile motion, and fluid micro-interactions popularized by award-winning digital creative studios like **[strike.uno](https://strike.uno/)**.

The website presents Veenit's work spanning disaster response intelligence, financial fraud detection, embedded robotics, and peer-reviewed academic research within a high-performance, 60fps kinetic digital interface.

---

## ⚡ Signature UX & Interactions

- **Momentum Virtual Scroll**: Powered by **Lenis**, delivering virtual inertia scrolling without native browser stutter.
- **Dynamic Contextual Cursor**: Dual-ring cursor with spring physics interpolation, expanding to context badges (`VIEW`) over project assets, inverting on text, and magnetically snapping to interactive controls.
- **Floating Project Preview Tracker (Signature `strike.uno` Interaction)**: An interactive project index table where hovering over any project name smoothly spawns and trails a floating preview card with rotational physics following the user's pointer.
- **Hardware-Accelerated Ambient Canvas**: Interactive particle and connection network reacting to pointer velocity and proximity.
- **Tactile Film Grain Overlay**: Hardware-accelerated SVG noise filter giving digital surfaces a physical, editorial texture.
- **Live IST Operations Clock**: Real-time ticking operational clock synced to `Asia/Kolkata` (`PUNE, IN [IST HH:MM:SS]`) alongside an active availability pulse indicator.
- **Web Audio Micro-Synthesizer**: Synthesizer audio clicks providing responsive haptic audio feedback on user interactions with toggleable mute memory.

---

## 🚀 Featured Projects

1. **DRISHTI — Disaster Intelligence & Response Platform**
   - *Architecture:* React 19, TypeScript, FastAPI, PostgreSQL / PostGIS Spatial Clustered.
   - *Scope:* Deterministic recommendation engine assessing evidence quality, asset readiness, road network disruptions, and offline command queuing.
2. **VASH — Financial Fraud Detection & Threat Intelligence Platform**
   - *Architecture:* Python, Scikit-Learn, NetworkX, SHA-256 Hash Chaining.
   - *Scope:* High-throughput transaction anomaly scoring with Isolation Forests, SHAP explainability, and bipartite graph mule-ring detection.
3. **Prashikshan — AI-Driven Academia–Industry Interface**
   - *Architecture:* Node.js, Express, SQLite, REST API, JWT / RBAC.
   - *Scope:* Peer-reviewed platform connecting university curriculum matrices directly with enterprise competency rubrics.
4. **Electronova Robotics Platform — Autonomous Obstacle Avoidance Bot**
   - *Architecture:* Embedded C++, Microcontroller, Optical Encoders, Tuned PID Control.
   - *Scope:* Award-winning 24-hour sprint robotics platform featuring sensor fusion and closed-loop motor regulation.

---

## 📚 Peer-Reviewed Research Publication

- **Title:** *Prashikshan: A Centralized Academia–Industry Interface for Internship and Skill Validation*
- **Journal:** *Recent Trends in Data Science Technology*, Volume 02, Issue 02 (May–Aug 2026), pp. 1–7
- **Authors:** Dr. Devidas Thosar, Trisha Gujjula, Tanishka Devgirkar, **Veenit Ramteke**, Lakshmi Sharma, Girish Patil, and Anjali Gaur
- **Publisher:** HBRP Publication Pvt. Ltd. (Certified: 13/04/2026)
- **ISSN (Online):** 3107-7498
- **Permanent DOI:** [10.5281/zenodo.19552932](https://doi.org/10.5281/zenodo.19552932)
- **Paper Repository:** [github.com/veenit-cell/publication](https://github.com/veenit-cell/publication)

---

## 🏆 Honors & Distinctions

- 🥇 **Winner (First Prize) — AVINYA Hackathon, IIT Guwahati (2026)**
- 🥇 **Winner (First Position) — Electronova Robotics Hackathon, Data-Driven Innovation (2024)**

---

## 🎓 Education & Experience

- **IIM Bangalore**: BBA in Digital Business & Entrepreneurship (2026–2029)
- **GH Raisoni College of Engineering & Management**: B.Tech in CSE (2024–2028, CGPA: 8.5 / 10.0)
- **PPGF**: Political Consulting Intern / ICPC Trainee (Oct 2026 – Present)

---

## 📂 Repository Structure

```
.
├── .gitignore               # Clean git exclusions
├── README.md                # Engineering documentation
├── index.html               # Main application entry point
├── style.css                # Dark luxury brutalist styling & animations
├── main.js                  # Lenis, cursor physics, canvas & audio engine
├── vercel.json              # Edge deployment & security headers
└── assets/
    └── images/
        ├── veenit-portrait.jpg                # Profile portrait
        ├── drishti-dashboard.svg              # DRISHTI telemetry visual
        ├── vash-dashboard.svg                 # VASH fraud analytics visual
        ├── prashikshan-dashboard.svg          # Prashikshan platform visual
        ├── electronova-dashboard.svg          # Electronova robotics visual
        ├── avinya-iit-guwahati.jpeg           # IIT Guwahati winner verification
        └── electronova-robotics-winner.jpeg   # Electronova robotics winner verification
```

---

## 💻 Local Preview

Run any lightweight local static server:

```bash
# Python 3
python -m http.server 3000

# Node
npx serve .
```

Navigate to `http://localhost:3000` to experience the website with full 60fps momentum scrolling and interactive effects.

---

## 📬 Contact

- **Email:** [veenitramteke@gmail.com](mailto:veenitramteke@gmail.com)
- **LinkedIn:** [linkedin.com/in/veenit-ramteke](https://www.linkedin.com/in/veenit-ramteke/)
- **GitHub:** [github.com/veenit-cell](https://github.com/veenit-cell)

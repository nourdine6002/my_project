document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  if (isMobile) document.body.classList.add('mobile-browser');

  // Force scroll to top on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // 0. Dark / Light Mode Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      if (themeIcon) themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // 1. Splash Screen Logic
  const splashScreen = document.getElementById('splash-screen');
  const bootSequence = document.getElementById('boot-sequence');
  const splashContent = document.getElementById('splash-content');

  if (splashScreen && bootSequence && splashContent) {
    document.body.style.overflow = 'hidden';
    
    const logs = [
      "BIOS Date 04/10/26 19:15:32 Ver 1.00",
      "CPU: AuthenticAMD AMD Ryzen 9 5900X",
      "Memory Test: 32768M OK",
      "[ OK ] Mounting /var/log/syslog...",
      "[ OK ] Initializing Nourdine_OS Kernel...",
      "Loading cryptography modules... DONE",
      "Establishing secure connection to portfolio... ENABLED",
      "Bypassing mainframe protocols...",
      "[ OK ] Decrypting profile data blocks...",
      "Access Granted."
    ];

    let logIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (logIndex < logs.length) {
        const p = document.createElement('div');
        p.textContent = logs[logIndex];
        bootSequence.appendChild(p);
        logIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          bootSequence.style.display = 'none';
          splashContent.style.display = 'block';
          
          setTimeout(() => {
            splashScreen.classList.add('fade-out');
            document.body.style.overflow = '';
          }, 1000); // 1 second of loading bar
          
        }, 300); // Wait 300ms after boots finish before showing logo
      }
    }, 70); // Rapid printing
  }

  // 2. Matrix Code Rain Canvas Effect
  const canvas = document.getElementById('matrix-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    // Set canvas to full page height/width
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('.hero').offsetHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = document.querySelector('.hero').offsetHeight;
    });

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?{}[]|";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
      // Fade effect to show trails
      ctx.fillStyle = "rgba(10, 14, 23, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10b981"; // Accent Green
      ctx.font = fontSize + "px 'Fira Code', monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly to create stagger
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    // Render loop at ~30 FPS
    setInterval(drawMatrix, 33);
  }

  // 3. Header scroll effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(10, 14, 23, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
    } else {
      header.style.background = 'rgba(10, 14, 23, 0.85)';
      header.style.boxShadow = 'none';
    }
  });

  // 4. Typewriter Effect
  const texts = ["C Programmer", "Python Specialist"];
  let count = 0;
  let index = 0;
  let currentText = '';
  let letter = '';
  const typeTarget = document.querySelector('.typewriter');

  if (typeTarget) {
    (function type() {
      if (count === texts.length) {
        count = 0;
      }
      currentText = texts[count];
      letter = currentText.slice(0, ++index);

      typeTarget.textContent = letter;

      if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000);
      } else {
        setTimeout(type, 100);
      }
    })();
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Hacker Decode Logic
  const decodeLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
  
  function decodeText(element) {
    let iteration = 0;
    const originalText = element.getAttribute('data-value');
    let interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration || letter === ' ') {
            return originalText[index];
          }
          return decodeLetters[Math.floor(Math.random() * decodeLetters.length)];
        })
        .join("");
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 40);
  }

  // 5. Intersection Observer for Fade-ins & Animated Skill Bars
  const flexObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.classList.contains('decode-text')) {
        if (!entry.target.hasAttribute('data-decoded')) {
          decodeText(entry.target);
          entry.target.setAttribute('data-decoded', 'true');
        }
        flexObserver.unobserve(entry.target);
        return;
      }

      // General Fade In
      if (entry.isIntersecting && !entry.target.classList.contains('skill-fill')) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        flexObserver.unobserve(entry.target);
      }

      // Skill Bar Animations
      if (entry.isIntersecting && entry.target.classList.contains('skill-fill')) {
        const targetWidth = entry.target.getAttribute('data-width');
        setTimeout(() => {
          entry.target.style.width = targetWidth;
        }, 300); // Slight delay for smooth visual flow
        flexObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.project-card, .section-title, .skill-fill, .decode-text').forEach(el => {
    if (el.classList.contains('decode-text')) {
      flexObserver.observe(el);
      return;
    }
    if (!el.classList.contains('skill-fill')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
    }
    flexObserver.observe(el);
  });

  // 6. Interactive Terminal Logic
  const termWindow = document.getElementById('terminal-window');
  const termHeader = document.getElementById('term-header');
  const termClose = document.getElementById('term-close');
  const termMin = document.getElementById('term-min');
  const termMax = document.getElementById('term-max');
  const termRestoreFn = document.getElementById('restore-terminal-btn');
  const termInput = document.getElementById('term-input');
  const termHistory = document.getElementById('term-history');
  const termBody = document.getElementById('term-body');

  if (termWindow && !isMobile) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    termHeader.addEventListener('mousedown', (e) => {
      isDragging = true;
      termWindow.classList.add('is-dragging');
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseInt(termWindow.style.left || 0, 10);
      initialTop = parseInt(termWindow.style.top || 0, 10);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || termWindow.classList.contains('is-maximized')) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      termWindow.style.left = `${initialLeft + dx}px`;
      termWindow.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        termWindow.classList.remove('is-dragging');
      }
    });

    termClose.addEventListener('click', () => {
      termWindow.classList.add('is-closed');
      if (termRestoreFn) termRestoreFn.style.display = 'inline-block';
    });

    termMin.addEventListener('click', () => {
      termWindow.classList.toggle('is-minimized');
    });

    termMax.addEventListener('click', () => {
      termWindow.classList.toggle('is-maximized');
      if (termWindow.classList.contains('is-maximized')) {
        termWindow.style.left = '0px';
        termWindow.style.top = '0px';
      }
    });

    if (termRestoreFn) {
      termRestoreFn.addEventListener('click', () => {
        termWindow.classList.remove('is-closed');
        termWindow.style.left = '0px';
        termWindow.style.top = '0px';
        termRestoreFn.style.display = 'none';
      });
    }
  }

  if (termInput) {
    // Keep focus if clicking terminal
    termBody.addEventListener('click', () => {
      termInput.focus();
    });

    let audioCtx;
    function playTypingSound() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150 + Math.random() * 100, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }

    const commands = {
      'help': 'Available commands: <br> - <span class="highlight">whoami</span>: Displays my bio<br> - <span class="highlight">skills</span>: Lists my technical stack<br> - <span class="highlight">contact</span>: Shows contact details<br> - <span class="highlight">clear</span>: Clears terminal',
      'whoami': 'Nourdine Doulahiane<br>Software Developer @ Github: nourdine6002<br>Lover of the terminal, algorithmic efficiency, and low-level byte manipulation.',
      'skills': '[+] C<br>[+] Python Core & Backend<br>[+] Data Structures & Algorithms<br>[+] Bash / Shell Scripting<br>[+] Git',
      'contact': 'Email: contact@example.com (update me)<br>LinkedIn: /in/nourdine-doulahiane-9a6538390',
      'sudo': 'Nice try! This incident will be reported. 🚨'
    };

    termInput.addEventListener('keydown', function (e) {
      playTypingSound();
      if (e.key === 'Enter') {
        const val = this.value.trim().toLowerCase();
        this.value = '';

        if (!val) return;

        if (val === 'clear') {
          termHistory.innerHTML = '';
          return;
        }

        let output = commands[val];
        if (!output) {
          output = `bash: ${val}: command not found. Type 'help' for available commands.`;
        }

        const entry = document.createElement('div');
        entry.classList.add('term-history-entry');
        entry.innerHTML = `
          <span class="command-echo"><span class="prompt">nourdine@macbook:~$</span> ${val}</span>
          <div class="command-output">${output}</div>
        `;
        termHistory.appendChild(entry);
        termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

  // 7. GitHub Calendar Tracker
  if (typeof GitHubCalendar !== 'undefined') {
    GitHubCalendar(".calendar", "nourdine6002", { responsive: true, tooltips: true, global_stats: false });
  }

  // 7b. GitHub Live API Stats
  (async function loadGitHubStats() {
    const user = 'nourdine6002';
    const LANG_COLORS = {
      'C': '#555555', 'Python': '#3572A5', 'Shell': '#89e051',
      'Makefile': '#427819', 'JavaScript': '#f1e05a', 'TypeScript': '#2b7489',
      'HTML': '#e34c26', 'CSS': '#563d7c', 'C++': '#f34b7d'
    };
    function timeAgo(date) {
      const s = Math.floor((Date.now() - new Date(date)) / 1000);
      if (s < 60)    return 'just now';
      if (s < 3600)  return `${Math.floor(s/60)}m ago`;
      if (s < 86400) return `${Math.floor(s/3600)}h ago`;
      return `${Math.floor(s/86400)}d ago`;
    }
    try {
      const [uRes, rRes, eRes] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`),
        fetch(`https://api.github.com/users/${user}/events/public?per_page=20`)
      ]);
      if (!uRes.ok) throw new Error('rate limit');
      const [uData, repos, events] = await Promise.all([uRes.json(), rRes.json(), eRes.json()]);

      // Stats cards
      const rc = document.getElementById('repos-count');
      const sc = document.getElementById('stars-count');
      const fc = document.getElementById('followers-count');
      if (rc) rc.textContent = uData.public_repos;
      if (fc) fc.textContent = uData.followers;
      if (sc) sc.textContent = repos.reduce((a, r) => a + r.stargazers_count, 0);
      document.querySelectorAll('.stats-card').forEach(c => c.classList.remove('skeleton'));

      // Language bars
      const langCount = {};
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language]||0) + 1; });
      const sorted = Object.entries(langCount).sort((a,b) => b[1]-a[1]).slice(0, 5);
      const total  = sorted.reduce((s,[,v]) => s+v, 0);
      const langEl = document.getElementById('lang-bars');
      if (langEl && sorted.length) {
        langEl.innerHTML = sorted.map(([lang, cnt]) => {
          const pct = Math.round((cnt/total)*100);
          const color = LANG_COLORS[lang] || 'var(--accent-cyan)';
          return `<div class="lang-bar-row">
            <span class="lang-name">${lang}</span>
            <div class="lang-bar-track"><div class="lang-bar-fill" style="background:${color};"></div></div>
            <span class="lang-pct">${pct}%</span>
          </div>`;
        }).join('');
        // Animate bars after paint
        requestAnimationFrame(() => {
          sorted.forEach(([lang, cnt], i) => {
            const pct = Math.round((cnt/total)*100);
            const fill = langEl.querySelectorAll('.lang-bar-fill')[i];
            if (fill) setTimeout(() => { fill.style.width = pct + '%'; }, 100);
          });
        });
      }

      // Recent activity
      const pushes = events.filter(e => e.type === 'PushEvent').slice(0, 3);
      const actEl  = document.getElementById('activity-list');
      if (actEl) {
        if (!pushes.length) {
          actEl.innerHTML = '<p class="stats-error">No recent public activity.</p>';
        } else {
          actEl.innerHTML = pushes.map(e => {
            const commit = e.payload.commits?.[0];
            const msg  = (commit?.message || 'Pushed changes').split('\n')[0].slice(0, 72);
            const repo = e.repo.name.split('/')[1];
            return `<div class="activity-item">
              <span class="activity-dot"></span>
              <span class="activity-text">Pushed to <strong>${repo}</strong>: ${msg}</span>
              <span class="activity-time">${timeAgo(e.created_at)}</span>
            </div>`;
          }).join('');
        }
      }
    } catch {
      document.querySelectorAll('.stats-card').forEach(c => c.classList.remove('skeleton'));
      ['repos-count','stars-count','followers-count'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = '?';
      });
      const actEl = document.getElementById('activity-list');
      if (actEl) actEl.innerHTML = '<p class="stats-error">⚠ GitHub API limit reached. Refresh in a minute.</p>';
    }
  })();

  // 8. Secret Password Easter Egg ("matrix")
  let keySequence = '';
  const secretCode = 'matrix';
  window.addEventListener('keydown', (e) => {
    // Only capture single letters to build sequence safely
    if (e.key.length === 1) {
      keySequence += e.key.toLowerCase();
      if (keySequence.length > secretCode.length) {
        keySequence = keySequence.substring(keySequence.length - secretCode.length);
      }

      if (keySequence === secretCode) {
        document.body.classList.toggle('hacked-mode');
        keySequence = ''; // Reset sequence

        // Fun popup alert
        if (document.body.classList.contains('hacked-mode')) {
          setTimeout(() => alert('INITIATING HACKER PROTOCOL...'), 100);
        } else {
          setTimeout(() => alert('SYSTEM RESTORED.'), 100);
        }
      }
    }
  });



  // 9. Scroll Progress Bar
  const scrollBar = document.getElementById('scroll-bar');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollBar.style.width = scrolled + "%";
    });
  }

  // 10. Hack CV Modal — downloads PDF if available, falls back to cv.html
  const cvBtn = document.getElementById('cv-download-btn');
  const hackModal = document.getElementById('hack-modal');
  const hackText = document.getElementById('hack-text');
  if (cvBtn && hackModal && hackText) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hackModal.classList.add('active');
      const messages = [
        "INITIALIZING MAINFRAME CONNECTION...",
        "BYPASSING SECURITY FIREWALL [NODE: nourdine6002]...",
        "DECRYPTING PROFILE DATA BLOCKS...",
        "DOWNLOADING CLASSIFIED CV PAYLOAD...",
        "ACCESS GRANTED."
      ];
      hackText.innerHTML = '';
      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length) {
          hackText.innerHTML += `<div style="margin-bottom: 8px;">[+] ${messages[msgIndex]}</div>`;
          msgIndex++;
        } else {
          clearInterval(interval);
          setTimeout(async () => {
            hackModal.classList.remove('active');
            hackText.innerHTML = '';
            // Try PDF download first; fall back to cv.html
            try {
              const res = await fetch('Nourdine_CV.pdf', { method: 'HEAD' });
              if (res.ok) {
                const a = document.createElement('a');
                a.href = 'Nourdine_CV.pdf';
                a.download = 'Nourdine_CV.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else {
                window.open('cv.html', '_blank');
              }
            } catch {
              window.open('cv.html', '_blank');
            }
          }, 800);
        }
      }, 500);
    });
  }

  // 11. Particles JS Toggle
  const bgToggleBtn = document.getElementById('bg-toggle-btn');
  const matrixBg = document.getElementById('matrix-bg');
  const particlesJs = document.getElementById('particles-js');
  let isParticles = false;

  if (bgToggleBtn && typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#10b981" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: { enable: true, distance: 150, color: "#10b981", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2 }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 1 } } }
      },
      retina_detect: true
    });

    if (isMobile) {
      bgToggleBtn.style.display = 'none';
      particlesJs.style.display = 'none';
    } else {
      bgToggleBtn.addEventListener('click', () => {
        isParticles = !isParticles;
        if (isParticles) {
          matrixBg.style.opacity = '0';
          particlesJs.style.opacity = '1';
          particlesJs.style.pointerEvents = 'auto';
        } else {
          matrixBg.style.opacity = '0.08';
          particlesJs.style.opacity = '0';
          particlesJs.style.pointerEvents = 'none';
        }
      });
    }
  }

  // 12. Custom Context Menu
  const contextMenu = document.getElementById('custom-context-menu');
  if (contextMenu && !isMobile) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      
      const { clientX: mouseX, clientY: mouseY } = e;
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
      
      contextMenu.style.display = 'block';
      let menuWidth = contextMenu.offsetWidth;
      let menuHeight = contextMenu.offsetHeight;
      
      let x = e.pageX;
      let y = e.pageY;
      
      if (mouseX + menuWidth > windowWidth) {
        x -= menuWidth;
      }
      if (mouseY + menuHeight > windowHeight) {
        y -= menuHeight;
      }
      
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
      contextMenu.classList.add('show');
    });

    document.addEventListener('click', (e) => {
      if (!contextMenu.contains(e.target)) {
        contextMenu.classList.remove('show');
        contextMenu.style.display = 'none';
      }
    });

    document.getElementById('cm-terminal').addEventListener('click', () => {
      document.getElementById('terminal').scrollIntoView({ behavior: 'smooth' });
      contextMenu.style.display = 'none';
      contextMenu.classList.remove('show');
    });
    
    document.getElementById('cm-github').addEventListener('click', () => {
      window.open('https://github.com/nourdine6002', '_blank');
      contextMenu.style.display = 'none';
      contextMenu.classList.remove('show');
    });
    
    document.getElementById('cm-cv').addEventListener('click', () => {
      const cvBtn = document.getElementById('cv-download-btn');
      if (cvBtn) cvBtn.click();
      contextMenu.style.display = 'none';
      contextMenu.classList.remove('show');
    });
    
    document.getElementById('cm-matrix').addEventListener('click', () => {
      document.body.classList.toggle('hacked-mode');
      contextMenu.style.display = 'none';
      contextMenu.classList.remove('show');
      if (document.body.classList.contains('hacked-mode')) {
        setTimeout(() => alert('INITIATING HACKER PROTOCOL...'), 100);
      } else {
        setTimeout(() => alert('SYSTEM RESTORED.'), 100);
      }
    });
  }

  // 13. Contact Form — Formspree AJAX submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('form-submit-btn');
      const successMsg = document.getElementById('form-success');
      const originalLabel = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          contactForm.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
        } else {
          submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ERROR — RETRY';
          submitBtn.disabled = false;
          setTimeout(() => { submitBtn.innerHTML = originalLabel; }, 4000);
        }
      } catch {
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ERROR — RETRY';
        submitBtn.disabled = false;
        setTimeout(() => { submitBtn.innerHTML = originalLabel; }, 4000);
      }
    });
  }

  // 14. AI Chatbot Widget
  (function initChatbot() {
    const bubble   = document.getElementById('chatbot-bubble');
    const chatWin  = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const input    = document.getElementById('chatbot-input');
    const sendBtn  = document.getElementById('chatbot-send');
    const msgBox   = document.getElementById('chatbot-messages');
    const badge    = document.getElementById('chatbot-badge');
    if (!bubble || !chatWin) return;

    const kb = [
      {
        match: ['skill','tech','stack','language','know','good at','exper','proficien','capabilit'],
        reply: `Here's Nourdine's technical stack:\n\n💻 <strong>C</strong> — 95% &nbsp;(Systems programming, pointers, memory)\n🐍 <strong>Python</strong> — 90% &nbsp;(Backend, scripting, OOP)\n🧠 <strong>Algorithms & DS</strong> — 85%\n🐧 <strong>Linux / Bash</strong> — 80%\n🔀 <strong>Git</strong> — 85%`
      },
      {
        match: ['project','work','built','portfolio','repo','show'],
        reply: `Nourdine's key projects:\n\n🔧 <strong>Push_Swap</strong> — Optimized sorting in C with two stacks & minimal ops.\n🐍 <strong>Python Core Bootcamp</strong> — Deep OOP, data manipulation, modules.\n⚙️ <strong>Advanced Python Solutions</strong> — Clean backend architecture & design patterns.\n\n→ <a href="https://github.com/nourdine6002" target="_blank" style="color:var(--accent-cyan);">View all on GitHub ↗</a>`
      },
      {
        match: ['hire','freelanc','job','opport','work with','contact','reach','collab','availabl','partner'],
        reply: `Nourdine is <strong>open to freelance work, collaborations & new opportunities!</strong>\n\n📬 Use the contact form on this page\n💼 <a href="https://www.linkedin.com/in/nourdine-doulahiane-9a6538390/" target="_blank" style="color:var(--accent-cyan);">LinkedIn ↗</a>\n🐙 <a href="https://github.com/nourdine6002" target="_blank" style="color:var(--accent-cyan);">GitHub ↗</a>`
      },
      {
        match: ['who','about','nourdine','yourself','tell me','bio','introduc'],
        reply: `I'm an assistant for <strong>Nourdine Doulahiane</strong> — a passionate developer trained at 42 School.\n\nHe specializes in C systems programming & Python backend work. Clean code, efficient algorithms, and Linux are his home turf. 🐧`
      },
      {
        match: ['school','42','1337','educat','study','learn','train','peer'],
        reply: `Nourdine studied at <strong>42 School Network (1337)</strong> — an intensive, peer-to-peer software engineering program.\n\nNo lectures, no teachers — just hands-on projects, rigorous peer reviews, and real problem-solving from day one.`
      },
      {
        match: ['github','link','profile','social','linkedin'],
        reply: `Nourdine's profiles:\n\n🐙 <a href="https://github.com/nourdine6002" target="_blank" style="color:var(--accent-cyan);">github.com/nourdine6002</a>\n💼 <a href="https://www.linkedin.com/in/nourdine-doulahiane-9a6538390/" target="_blank" style="color:var(--accent-cyan);">LinkedIn</a>`
      },
      {
        match: ['cv','resume','download','pdf'],
        reply: `Click the <strong>"Download CV"</strong> button in the hero section to get Nourdine's CV! It triggers a cool hacker animation first 😄`
      },
      {
        match: ['hello','hi','hey','sup','yo','howdy','hiya'],
        reply: `Hey! 👋 I'm Nourdine's portfolio assistant. Ask me about his <strong>skills</strong>, <strong>projects</strong>, or how to <strong>hire him</strong>!`
      }
    ];

    const fallbacks = [
      "Not sure about that! Try: <em>\"What are your skills?\"</em> or <em>\"Show me your projects\"</em> 🚀",
      "That's outside my knowledge base. Use the contact form below to ask Nourdine directly! 📬",
      "Hmm, I don't have info on that. Check out his <strong>GitHub</strong> or drop him a message!"
    ];

    function getReply(msg) {
      const q = msg.toLowerCase();
      for (const item of kb) {
        if (item.match.some(kw => q.includes(kw))) return item.reply;
      }
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    function addMsg(text, sender) {
      const el = document.createElement('div');
      el.className = `chat-msg ${sender}`;
      el.innerHTML = `<div class="chat-bubble">${text.replace(/\n/g,'<br>')}</div>`;
      msgBox.appendChild(el);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'chat-msg bot chat-typing'; t.id = 'chat-typing';
      t.innerHTML = '<div class="chat-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
      msgBox.appendChild(t);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    function send(text) {
      const msg = text || input.value.trim();
      if (!msg) return;
      input.value = '';
      addMsg(msg, 'user');
      showTyping();
      setTimeout(() => {
        const t = document.getElementById('chat-typing'); if (t) t.remove();
        addMsg(getReply(msg), 'bot');
      }, 700 + Math.random() * 400);
    }

    bubble.addEventListener('click', () => {
      const isOpen = chatWin.style.display !== 'none' && chatWin.style.display !== '';
      chatWin.style.display = isOpen ? 'none' : 'flex';
      chatWin.style.flexDirection = 'column';
      if (!isOpen) { if (badge) badge.style.display = 'none'; input.focus(); }
    });
    closeBtn.addEventListener('click', () => { chatWin.style.display = 'none'; });
    sendBtn.addEventListener('click', () => send());
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => send(btn.getAttribute('data-q')));
    });
  })();

  // 15. Animated Skill Bars (Intersection Observer + stagger)
  (function initSkillBars() {
    const bars = document.querySelectorAll('.sbar-fill');
    const pcts = document.querySelectorAll('.sbar-pct');
    if (!bars.length) return;

    let fired = false;

    function animateBars() {
      if (fired) return;
      fired = true;
      bars.forEach((bar, i) => {
        const target = parseInt(bar.getAttribute('data-target'), 10);
        const pct    = pcts[i];
        setTimeout(() => {
          bar.style.width = target + '%';
          if (pct) {
            let start = 0;
            const step = () => {
              start += 2;
              if (start > target) start = target;
              pct.textContent = start + '%';
              if (start < target) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        }, i * 150);
      });
    }

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateBars(); obs.disconnect(); }
    }, { threshold: 0.3 });

    const section = document.getElementById('skills');
    if (section) obs.observe(section);
  })();

  // 16. Counter Animation (Intersection Observer)
  (function initCounters() {
    const cards = document.querySelectorAll('.counter-card');
    if (!cards.length) return;

    const DURATION = 1500;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCounter(el) {
      const target  = parseInt(el.getAttribute('data-target'), 10);
      const suffix  = el.getAttribute('data-suffix') || '';
      const start   = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const current  = Math.round(easeOutExpo(progress) * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target.querySelector('.counter-value');
          if (el && !el.dataset.done) {
            el.dataset.done = '1';
            animateCounter(el);
          }
        }
      });
    }, { threshold: 0.5 });

    cards.forEach(c => obs.observe(c));
  })();

  // 17. Timeline Scroll Reveal (Intersection Observer)
  (function initTimeline() {
    const items = document.querySelectorAll('.tl-item');
    if (!items.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('tl-hidden');
          entry.target.classList.add('tl-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    items.forEach(item => obs.observe(item));
  })();


});

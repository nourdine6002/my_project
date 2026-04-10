document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  if (isMobile) document.body.classList.add('mobile-browser');

  // Force scroll to top on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

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
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
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



  // 10. Scroll Progress Bar
  const scrollBar = document.getElementById('scroll-bar');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollBar.style.width = scrolled + "%";
    });
  }

  // 11. Hack CV Modal
  const cvBtn = document.getElementById('cv-download-btn');
  const hackModal = document.getElementById('hack-modal');
  const hackText = document.getElementById('hack-text');
  if (cvBtn && hackModal && hackText) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetHref = cvBtn.getAttribute('data-href') || 'cv.html';
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
          setTimeout(() => {
            hackModal.classList.remove('active');
            hackText.innerHTML = '';
            window.open(targetHref, '_blank');
          }, 800);
        }
      }, 500);
    });
  }

  // 12. Particles JS Toggle
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

  // 13. Custom Context Menu
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

});

// ── Init Lucide icons ──
  lucide.createIcons();

// ── Theme (Dark Mode Only) ──
  const html = document.documentElement;
  html.classList.add('dark');
  localStorage.removeItem('portfolio-theme');


  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ── Mobile menu ──
  let mobileMenuOpen = false;
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    if (mobileMenuOpen) {
      menu.classList.add('open');
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      menu.classList.remove('open');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    if (isSubmitting) return;

    isSubmitting = true;
    const btn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const sendIcon = document.getElementById('send-icon');

    btn.disabled = true;
    btnText.textContent = 'Sending...';
    sendIcon.style.display = 'none';

    // Submit form via AJAX fetch to prevent page reload
    const formData = new FormData(e.target);
    fetch(e.target.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      isSubmitting = false;
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      sendIcon.style.display = '';
      if (response.ok) {
        e.target.reset();
        showToast();
      } else {
        alert('Oops! There was a problem submitting your message.');
      }
    })
    .catch(error => {
      isSubmitting = false;
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      sendIcon.style.display = '';
      alert('Oops! There was a problem submitting your message.');
    });
  }

  // ── Custom Scroll helper with slow, smooth animation ──
  function customScrollTo(targetPosition, targetDuration) {
    const html = document.documentElement;
    const originalScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    if (distance === 0) {
      html.style.scrollBehavior = originalScrollBehavior;
      return;
    }

    // Proportional duration: 0.6ms per pixel, capped between 800ms and 1600ms, unless explicitly provided
    const duration = targetDuration || Math.min(1600, Math.max(800, Math.abs(distance) * 0.6));
    let startTime = null;

    // Quadratic easing in/out
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, targetPosition);
        html.style.scrollBehavior = originalScrollBehavior;
      }
    }

    requestAnimationFrame(animation);
  }

  // ── Smooth scroll ──
  function scrollToSection(e, selector) {
    if (e && e.preventDefault) e.preventDefault();
    const el = document.querySelector(selector);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      customScrollTo(top);
    }
  }

  function scrollToTop(e) {
    if (e && e.preventDefault) e.preventDefault();
    customScrollTo(0, 1600); // 1.6s scroll to top
  }

  // ── Footer year ──
  document.getElementById('footer-year').textContent =
    `© ${new Date().getFullYear()} Dhruv Developer. All rights reserved.`;

  // ── Intersection Observer for animations ──
  const animItems = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1, rootMargin: '-50px' });

  animItems.forEach(el => observer.observe(el));

  // ── Stat Counters Animation ──
  const counters = document.querySelectorAll('.about-stat-num');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetEl = entry.target;
        const targetValue = parseInt(targetEl.dataset.target, 10);
        const suffix = targetEl.dataset.suffix || '';
        
        if (isNaN(targetValue)) return;
        
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function easeOutExpo(x) {
          return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        }
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutExpo(progress);
          const currentValue = Math.floor(easedProgress * targetValue);
          
          targetEl.textContent = currentValue + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            targetEl.textContent = targetValue + suffix;
          }
        }
        
        requestAnimationFrame(updateCounter);
        observer.unobserve(targetEl);
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(counter => {
    const text = counter.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    if (match) {
      counter.dataset.target = match[1];
      counter.dataset.suffix = match[2] || '';
      counter.textContent = '0' + (match[2] || '');
      counterObserver.observe(counter);
    }
  });

  // Show about divider on md+
  const updateDivider = () => {
    const d = document.getElementById('about-divider');
    if (d) d.style.display = window.innerWidth >= 640 ? 'block' : 'none';
  };
  updateDivider();
  window.addEventListener('resize', updateDivider);

  // ── Contact form ──
  let isSubmitting = false;
  let toastTimeout = null;

  



  function showToast() {
    const toast = document.getElementById('toast');
    const bar = document.getElementById('toast-bar');

    if (toastTimeout) clearTimeout(toastTimeout);

    bar.classList.remove('animating');
    void bar.offsetWidth; // reflow

    toast.classList.add('show');
    bar.classList.add('animating');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
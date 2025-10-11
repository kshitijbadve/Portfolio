// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth anchor scroll with easing
(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function smoothScrollTo(targetY){
    if (prefersReduced) { window.scrollTo(0, targetY); return; }
    var startY = window.scrollY;
    var distance = targetY - startY;
    var duration = Math.min(2500, Math.max(900, Math.abs(distance) * 1.0));
    var startTime = null;
    function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
    function step(ts){
      if (!startTime) startTime = ts;
      var p = Math.min(1, (ts - startTime) / duration);
      var eased = easeOutCubic(p);
      window.scrollTo(0, startY + distance * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      var el = document.getElementById(targetId);
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.scrollY - 8; // slight top breathing room
      smoothScrollTo(y);
      setTimeout(function(){ el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }, 350);
    });
  });
})();

// IntersectionObserver reveals
var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  revealEls.forEach(function(el){ io.observe(el); });
} else {
  revealEls.forEach(function(el){ el.classList.add('is-visible'); });
}

// Parallax elements removed for light theme hero simplicity
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Removed JS tilt to avoid flicker; CSS hover handles subtle scale/shadow

// Active nav highlighting based on scroll position
(function(){
  var sections = [
    { id: 'work', link: document.querySelector('a[href="#work"][data-nav]') },
    { id: 'contact', link: document.querySelector('a[href="#contact"][data-nav]') }
  ];
  function onScroll(){
    var y = window.scrollY + window.innerHeight * 0.28;
    sections.forEach(function(section){
      var el = document.getElementById(section.id);
      if (!el || !section.link) return;
      var top = el.offsetTop; var bottom = top + el.offsetHeight;
      var active = y >= top && y < bottom;
      section.link.classList.toggle('active', active);
      if (active) {
        section.link.setAttribute('aria-current', 'page');
      } else {
        section.link.removeAttribute('aria-current');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// Gentle parallax on project thumbnails
(function(){
  if (reduceMotion) return;
  var mediaEls = Array.prototype.slice.call(document.querySelectorAll('.project-media'));
  function parallax(){
    var scrollY = window.scrollY;
    mediaEls.forEach(function(el){
      var rect = el.getBoundingClientRect();
      var offset = (rect.top + scrollY) * 0.0008; // subtle
      el.style.setProperty('--parallax', (offset * 12).toFixed(2) + 'px');
    });
  }
  window.addEventListener('scroll', parallax, { passive: true });
  window.addEventListener('resize', parallax);
  parallax();
})();

// Carro project video autoplay and loop handling
(function(){
  // Check if we're on the carro project page
  if (!document.body.classList.contains('carro-project')) return;
  
  var video = document.querySelector('.project-video-player');
  if (!video) return;
  
  // Ensure video attributes are set correctly
  video.setAttribute('autoplay', '');
  video.setAttribute('loop', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  
  // Force play on load and ensure it loops
  function ensureVideoBehavior() {
    if (video.paused) {
      video.play().catch(function(error) {
        console.log('Video autoplay prevented by browser:', error);
        // If autoplay fails, try again after user interaction
        document.addEventListener('click', function() {
          video.play();
        }, { once: true });
      });
    }
  }
  
  // Ensure video behavior on load
  if (video.readyState >= 2) {
    ensureVideoBehavior();
  } else {
    video.addEventListener('loadeddata', ensureVideoBehavior);
  }
  
  // Handle video end to ensure it loops
  video.addEventListener('ended', function() {
    video.currentTime = 0;
    video.play();
  });
  
  // Ensure video plays when it comes into view (for mobile)
  var videoObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && video.paused) {
        video.play().catch(function(error) {
          console.log('Video play prevented:', error);
        });
      }
    });
  }, { threshold: 0.5 });
  
  videoObserver.observe(video);
})();



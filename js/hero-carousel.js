(function () {
  var root = document.querySelector("[data-hero-carousel]");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-carousel-slide"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-carousel-dot"));
  var prevBtn = root.querySelector(".hero-carousel-prev");
  var nextBtn = root.querySelector(".hero-carousel-next");
  if (slides.length < 2) return;

  var index = slides.findIndex(function (slide) {
    return slide.classList.contains("is-active");
  });
  if (index < 0) index = 0;

  var timer = null;
  var intervalMs = 4000;

  function syncDots(from, to) {
    if (dots[from]) {
      dots[from].classList.remove("is-active");
      dots[from].setAttribute("aria-selected", "false");
    }
    if (dots[to]) {
      dots[to].classList.add("is-active");
      dots[to].setAttribute("aria-selected", "true");
    }
  }

  function goTo(next) {
    var target = ((next % slides.length) + slides.length) % slides.length;
    if (target === index) return;
    slides[index].classList.remove("is-active");
    slides[target].classList.add("is-active");
    syncDots(index, target);
    index = target;
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();
    if (document.hidden) return;
    timer = window.setInterval(next, intervalMs);
  }

  function restart() {
    stop();
    start();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      next();
      restart();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      prev();
      restart();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goTo(i);
      restart();
    });
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  start();
})();

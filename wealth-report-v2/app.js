// app.js — 数字滚动 + 进度条触发（零依赖，静态原型）
(function () {
  function isInView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight - 20 && r.bottom > 0;
  }

  function countUp(el) {
    var target = Number(el.getAttribute('data-v'));
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var t0 = null;
    var dur = 900;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function fire() {
    // 数字滚动（仅在可视区域触发一次）
    document.querySelectorAll('.cnum[data-v]').forEach(function (el) {
      if (isInView(el)) countUp(el);
    });
    // 进度条
    document.querySelectorAll('.src-bar i[style]').forEach(function (el) {
      if (!el.dataset.fired && isInView(el)) {
        el.dataset.fired = '1';
        var g = getComputedStyle(el).getPropertyValue('--g').trim();
        el.style.width = g || '0';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fire();
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        fire();
        ticking = false;
      });
    }, { passive: true });
  });
})();

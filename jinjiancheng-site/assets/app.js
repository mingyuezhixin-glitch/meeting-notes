/* 金渐成文章整理 —— 交互脚本 */
(function () {
  'use strict';

  /* ---- 主题切换 ---- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('jjc-theme'); } catch (e) {}
  if (saved) root.setAttribute('data-theme', saved);

  function currentIsDark() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentIsDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('jjc-theme', next); } catch (e) {}
    });
  }

  /* ---- 移动端菜单 ---- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      nav.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) nav.classList.remove('open');
    });
  }

  /* ---- 列表搜索 / 分栏筛选 ---- */
  var q = document.getElementById('q');
  var list = document.getElementById('list');
  var empty = document.getElementById('empty');
  if (q && list) {
    var rows = Array.prototype.slice.call(list.querySelectorAll('.row'));
    var rowsByChannel = rows.map(function (r) {
      var tag = r.querySelector('.tag');
      var txt = tag ? tag.textContent.trim() : '';
      return txt === '金渐成' ? 'jinjiancheng' : (txt === '天机奇谈' ? 'tianjiqitan' : '');
    });
    var channel = 'all';
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-ch]'));

    function apply() {
      var kw = (q.value || '').trim().toLowerCase();
      var shown = 0;
      var yearHeads = Array.prototype.slice.call(list.querySelectorAll('.year-head'));
      rows.forEach(function (r, i) {
        var hay = r.textContent.toLowerCase();
        var okKw = !kw || hay.indexOf(kw) !== -1;
        var okCh = channel === 'all' || rowsByChannel[i] === channel;
        var ok = okKw && okCh;
        r.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      // 年份标题在筛选时整体隐藏，避免出现空年份
      yearHeads.forEach(function (h) { h.style.display = (kw || channel !== 'all') ? 'none' : ''; });
      if (empty) empty.style.display = shown === 0 ? '' : 'none';
    }

    q.addEventListener('input', apply);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.classList.remove('on'); });
        c.classList.add('on');
        channel = c.getAttribute('data-ch');
        apply();
      });
    });
  }
})();

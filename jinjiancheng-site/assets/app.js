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
    var channel = 'all';
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-ch]'));

    function apply() {
      var kw = (q.value || '').trim().toLowerCase();
      var shown = 0;
      var yearHeads = Array.prototype.slice.call(list.querySelectorAll('.year-head'));
      rows.forEach(function (r) {
        var hay = r.textContent.toLowerCase();
        var okKw = !kw || hay.indexOf(kw) !== -1;
        var okCh = channel === 'all' || r.getAttribute('data-ch') === channel;
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

  /* ---- 目录抽屉 ---- */
  var tocData = document.getElementById('tocData');
  var tocBtn = document.getElementById('tocBtn');
  var tocPanel = document.getElementById('tocPanel');
  var tocMask = document.getElementById('tocMask');
  var tocClose = document.getElementById('tocClose');
  var tocBody = document.getElementById('tocBody');
  var tocSearch = document.getElementById('tocSearch');

  if (tocData && tocBtn && tocPanel && tocBody) {
    var channel = tocData.getAttribute('data-ch') || '';
    var cur = tocData.getAttribute('data-cur') || '';
    var raw = (tocData.textContent || '').trim();

    // 解析紧凑数据：年份单独成行，其余为「MM-DD|标题|后缀」
    var years = [];
    var curYear = null;
    raw.split('\n').forEach(function (line) {
      line = line.replace(/\r$/, '');
      if (!line) return;
      if (/^\d{4}$/.test(line)) {
        curYear = { year: line, items: [] };
        years.push(curYear);
        return;
      }
      var parts = line.split('|');
      if (!curYear || parts.length < 2) return;
      var md = parts[0];
      var title = parts[1];
      var suffix = parts[2] || '';
      var file = channel + '-' + curYear.year + '-' + md + (suffix ? '-' + suffix : '') + '.html';
      curYear.items.push({ date: md, title: title, url: file });
    });

    // 渲染
    var frag = document.createDocumentFragment();
    years.forEach(function (g) {
      var wrap = document.createElement('div');
      wrap.className = 'toc-year';
      var btn = document.createElement('button');
      btn.className = 'toc-y-btn';
      btn.innerHTML = g.year + '<span>' + g.items.length + ' 篇</span>';
      var box = document.createElement('div');
      box.className = 'toc-items';

      g.items.forEach(function (it) {
        var a = document.createElement('a');
        a.className = 'toc-item';
        a.href = it.url;
        a.setAttribute('data-hay', (it.date + ' ' + it.title).toLowerCase());
        if (it.url === cur) a.classList.add('is-cur');
        var d = document.createElement('span');
        d.className = 'ti-date';
        d.textContent = it.date;
        var t = document.createElement('span');
        t.className = 'ti-title';
        t.textContent = it.title;
        a.appendChild(d);
        a.appendChild(t);
        box.appendChild(a);
      });

      btn.addEventListener('click', function () { wrap.classList.toggle('open'); });
      wrap.appendChild(btn);
      wrap.appendChild(box);
      frag.appendChild(wrap);
    });

    var none = document.createElement('div');
    none.className = 'toc-none';
    none.textContent = '没有找到匹配的文章';
    none.style.display = 'none';
    frag.appendChild(none);
    tocBody.appendChild(frag);

    // 定位当前文章：默认展开它所在的年份
    var curItem = tocBody.querySelector('.toc-item.is-cur');
    if (curItem) {
      var y = curItem.closest('.toc-year');
      if (y) y.classList.add('open');
    } else if (years.length) {
      tocBody.querySelector('.toc-year').classList.add('open');
    }

    function openToc() {
      tocPanel.classList.add('on');
      tocMask.classList.add('on');
      tocPanel.setAttribute('aria-hidden', 'false');
      document.body.classList.add('toc-open');
      if (curItem) {
        window.setTimeout(function () {
          try { curItem.scrollIntoView({ block: 'center' }); } catch (e) { }
        }, 260);
      } else if (tocSearch) {
        tocSearch.focus();
      }
    }
    function closeToc() {
      tocPanel.classList.remove('on');
      tocMask.classList.remove('on');
      tocPanel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('toc-open');
    }

    tocBtn.addEventListener('click', openToc);
    if (tocClose) tocClose.addEventListener('click', closeToc);
    if (tocMask) tocMask.addEventListener('click', closeToc);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tocPanel.classList.contains('on')) closeToc();
    });

    // 搜索：命中即展开全部年份
    if (tocSearch) {
      tocSearch.addEventListener('input', function () {
        var kw = tocSearch.value.trim().toLowerCase();
        var shown = 0;
        Array.prototype.forEach.call(tocBody.querySelectorAll('.toc-year'), function (g) {
          var hit = 0;
          Array.prototype.forEach.call(g.querySelectorAll('.toc-item'), function (a) {
            var ok = !kw || (a.getAttribute('data-hay') || '').indexOf(kw) !== -1;
            a.style.display = ok ? '' : 'none';
            if (ok) hit++;
          });
          g.style.display = hit ? '' : 'none';
          if (kw) { if (hit) g.classList.add('open'); }
          else { g.classList.remove('open'); }
          shown += hit;
        });
        none.style.display = shown ? 'none' : '';
        if (!kw && curItem) {
          var y2 = curItem.closest('.toc-year');
          if (y2) y2.classList.add('open');
        }
      });
    }
  }
})();

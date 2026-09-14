(function () {
  'use strict';
  var DATA = window.__INDEX__ || [];
  var STEP = 60;
  var state = { q: '', year: 'all', album: 'all' };
  var shown = STEP;
  var cur = [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function terms() {
    return state.q.toLowerCase().split(/\s+/).filter(Boolean);
  }
  function hl(text, ts) {
    var out = esc(text);
    ts.forEach(function (t) {
      if (!t) return;
      out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }
  function fmtChars(n) {
    n = n || 0;
    return n >= 10000 ? (n / 10000).toFixed(1) + ' 万字' : n + ' 字';
  }
  function pad(n) {
    var s = String(n);
    while (s.length < 4) s = '0' + s;
    return s;
  }

  var listEl = document.getElementById('list');
  var statEl = document.getElementById('stat');
  var moreEl = document.getElementById('more');
  var qEl = document.getElementById('q');

  if (listEl) {
    function tagsOf(a) {
      return (a.albums && a.albums.length) ? a.albums : (a.category ? [a.category] : []);
    }
    var years = {}, cats = {};
    DATA.forEach(function (a) {
      if (a.year) years[a.year] = (years[a.year] || 0) + 1;
      tagsOf(a).forEach(function (t) { cats[t] = (cats[t] || 0) + 1; });
    });

    function fill(box, map, key, allLabel) {
      if (!box) return;
      var pairs = Object.keys(map).sort(function (a, b) {
        return key === 'year' ? b - a : map[b] - map[a];
      });
      var html = '<span class="chip" aria-pressed="true" data-k="' + key + '" data-v="all">' + allLabel + '</span>';
      pairs.forEach(function (k) {
        html += '<span class="chip" data-k="' + key + '" data-v="' + esc(k) + '">' + esc(k) + '</span>';
      });
      box.innerHTML = html;
      box.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        state[key] = chip.getAttribute('data-v');
        Array.prototype.forEach.call(box.querySelectorAll('.chip'), function (c) {
          c.setAttribute('aria-pressed', String(c === chip));
        });
        shown = STEP;
        render();
      });
    }
    fill(document.getElementById('fy'), years, 'year', '全部年份');
    fill(document.getElementById('fc'), cats, 'album', '全部专辑');

    function pick() {
      var ts = terms();
      var out = DATA.filter(function (a) {
        if (state.year !== 'all' && String(a.year) !== state.year) return false;
        if (state.album !== 'all' && tagsOf(a).indexOf(state.album) < 0) return false;
        if (!ts.length) return true;
        var hay = (a.title + ' ' + (a.excerpt || '')).toLowerCase();
        return ts.every(function (t) { return hay.indexOf(t) >= 0; });
      });
      out = out.slice().reverse();
      if (ts.length) {
        out.sort(function (a, b) {
          var at = a.title.toLowerCase(), bt = b.title.toLowerCase();
          var ah = ts.every(function (t) { return at.indexOf(t) >= 0; }) ? 0 : 1;
          var bh = ts.every(function (t) { return bt.indexOf(t) >= 0; }) ? 0 : 1;
          return ah - bh;
        });
      }
      return out;
    }

    function render() {
      var ts = terms();
      cur = pick();
      var slice = cur.slice(0, shown);
      if (!slice.length) {
        listEl.innerHTML = '<div class="empty">没有匹配的文章<br>换个关键词，或点「全部年份 / 全部专辑」重置</div>';
      } else {
        listEl.innerHTML = slice.map(function (a) {
          return '<a class="item" href="a/' + pad(a.id) + '.html">' +
            '<div class="t">' + hl(a.title, ts) + '</div>' +
            '<div class="meta"><span>' + esc(a.date) + '</span>' +
            '<span>' + esc(tagsOf(a)[0] || '') + '</span>' +
            '<span>' + fmtChars(a.chars) + '</span></div>' +
            (a.excerpt ? '<div class="ex">' + hl(a.excerpt, ts) + '</div>' : '') +
            '</a>';
        }).join('');
      }
      if (statEl) {
        statEl.innerHTML = '<span>共 ' + cur.length + ' 篇' +
          (cur.length !== DATA.length ? '（全库 ' + DATA.length + ' 篇）' : '') + '</span>' +
          '<span>' + (slice.length < cur.length ? '已显示 ' + slice.length + ' 篇' : '') + '</span>';
      }
      if (moreEl) {
        moreEl.style.display = slice.length < cur.length ? 'block' : 'none';
        moreEl.textContent = '继续加载（还有 ' + (cur.length - slice.length) + ' 篇）';
      }
    }

    if (moreEl) {
      moreEl.addEventListener('click', function () { shown += STEP; render(); });
    }
    if (qEl) {
      var t = null;
      qEl.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          state.q = qEl.value;
          shown = STEP;
          render();
        }, 160);
      });
      var m = /[?&]q=([^&]*)/.exec(location.search);
      if (m) { qEl.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); state.q = qEl.value; }
    }
    render();
  }

  var bs = document.getElementById('bs');
  if (bs) {
    bs.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && bs.value.trim()) {
        location.href = '../index.html?q=' + encodeURIComponent(bs.value.trim());
      }
    });
  }
})();

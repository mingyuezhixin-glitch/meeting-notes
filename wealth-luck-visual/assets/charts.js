/* 财运算势的量化与展现形式设计报告 - 图表逻辑 */
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var paper = style.getPropertyValue('--paper').trim();
  var gold = style.getPropertyValue('--gold').trim();
  var fontCJK = '"Noto Sans CJK SC","Microsoft YaHei","PingFang SC",sans-serif';

  var C_WARM = '#a8432f';   /* 旺 */
  var C_SEMI = '#c07a5a';   /* 次旺 */
  var C_MID = '#b07c2e';    /* 平 */
  var C_WEAK = '#a98b52';   /* 偏弱 */
  var C_COOL = '#7d8794';   /* 蓄 */
  var C_DEEP = '#8e241a';

  var baseText = { fontFamily: fontCJK, color: ink };

  /* F1 仪表盘 */
  var elGauge = document.getElementById('chart-gauge');
  if (elGauge) {
    var gauge = echarts.init(elGauge, null, { renderer: 'svg' });
    gauge.setOption({
      animation: false,
      textStyle: baseText,
      series: [{
        type: 'gauge',
        startAngle: 210, endAngle: -30,
        min: 0, max: 100,
        progress: { show: true, width: 16, itemStyle: { color: C_WARM } },
        axisLine: {
          lineStyle: {
            width: 16,
            color: [
              [0.40, C_COOL], [0.55, C_WEAK], [0.70, C_MID], [0.85, C_SEMI], [1, C_WARM]
            ]
          }
        },
        pointer: { length: '62%', width: 4, itemStyle: { color: ink } },
        axisTick: { distance: -20, length: 4, lineStyle: { color: paper } },
        splitLine: { distance: -24, length: 10, lineStyle: { color: paper, width: 2 } },
        axisLabel: { distance: 12, color: muted, fontFamily: fontCJK, fontSize: 11 },
        anchor: { show: true, size: 14, itemStyle: { color: paper, borderColor: C_WARM, borderWidth: 3 } },
        detail: {
          valueAnimation: false, offsetCenter: [0, '38%'],
          formatter: function (v) { return Math.round(v); },
          fontSize: 46, color: C_WARM, fontFamily: 'Crimson Pro', fontWeight: 700
        },
        title: { offsetCenter: [0, '68%'], fontSize: 14, color: muted, fontFamily: fontCJK },
        data: [{ value: 68, name: '财气综合指数 · 财局有成' }]
      }]
    });
    window.addEventListener('resize', function () { gauge.resize(); });
  }

  /* F2 六维雷达 */
  var elRadar = document.getElementById('chart-radar');
  if (elRadar) {
    var radar = echarts.init(elRadar, null, { renderer: 'svg' });
    var axes = [
      { name: '财源', max: 100 }, { name: '承载', max: 100 },
      { name: '收藏', max: 100 }, { name: '事业', max: 100 },
      { name: '窗口', max: 100 }, { name: '心态', max: 100 }
    ];
    var vals = [80, 74, 58, 60, 78, 52];
    radar.setOption({
      animation: false,
      textStyle: baseText,
      tooltip: { trigger: 'item', appendToBody: true },
      radar: {
        indicator: axes, radius: '64%', splitNumber: 4,
        axisName: { color: ink, fontFamily: fontCJK, fontSize: 13 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule } },
        splitArea: { areaStyle: { color: [paper, bg2] } }
      },
      series: [{
        type: 'radar',
        data: [{
          name: '演示命例六维画像', value: vals,
          lineStyle: { color: C_WARM, width: 2 },
          itemStyle: { color: C_DEEP },
          areaStyle: { color: C_WARM + '40' },
          label: { show: true, formatter: function (p) { return p.value; }, color: muted, fontFamily: fontCJK, fontSize: 11 }
        }]
      }]
    });
    window.addEventListener('resize', function () { radar.resize(); });
  }

  /* F3 一生财运曲线 */
  var elCurve = document.getElementById('chart-curve');
  if (elCurve) {
    var curve = echarts.init(elCurve, null, { renderer: 'svg' });
    var luck = [48, 56, 52, 66, 74, 78, 64, 70, 58, 62, 50];
    var labels = ['5-14', '15-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75-84', '85-94', '95-104', '105-114'];
    curve.setOption({
      animation: false,
      textStyle: baseText,
      grid: { left: 10, right: 24, top: 44, bottom: 10, containLabel: true },
      tooltip: { trigger: 'axis', appendToBody: true, valueFormatter: function (v) { return '助力 ' + v; } },
      legend: { data: ['行运助力分', '格局参考线 66'], textStyle: { color: muted, fontFamily: fontCJK }, top: 0, right: 0 },
      xAxis: { type: 'category', data: labels, name: '年龄（十年一大运）', nameTextStyle: { color: muted, fontFamily: fontCJK }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, fontFamily: fontCJK, fontSize: 11 } },
      yAxis: { type: 'value', min: 30, max: 100, axisLabel: { color: muted, fontFamily: fontCJK }, splitLine: { lineStyle: { color: rule, opacity: 0.6 } } },
      series: [
        {
          name: '行运助力分', type: 'line', data: luck, smooth: true,
          symbol: 'circle', symbolSize: 6,
          lineStyle: { color: C_WARM, width: 3 }, itemStyle: { color: C_WARM },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: C_WARM + '38' }, { offset: 1, color: C_WARM + '00' }] } },
          markArea: {
            silent: true,
            label: { color: C_MID, fontFamily: fontCJK, fontSize: 11, position: 'insideTop' },
            data: [
              [{ name: '主窗口 45-64', xAxis: '45-54', itemStyle: { color: C_WARM + '20' } }, { xAxis: '55-64' }],
              [{ name: '次窗口 75-84', xAxis: '75-84', itemStyle: { color: C_WARM + '14' } }, { xAxis: '75-84' }]
            ]
          }
        },
        {
          name: '格局参考线 66', type: 'line',
          data: luck.map(function () { return 66; }),
          symbol: 'none', lineStyle: { color: C_MID, width: 2, type: 'dashed' },
          tooltip: { show: false }
        }
      ]
    });
    window.addEventListener('resize', function () { curve.resize(); });
  }

  /* F4 流年热力条 */
  var elHeat = document.getElementById('chart-heat');
  if (elHeat) {
    var heat = echarts.init(elHeat, null, { renderer: 'svg' });
    var years = ['2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'];
    var hvals = [62, 70, 74, 66, 58, 72, 78, 64, 60, 68];
    heat.setOption({
      animation: false,
      textStyle: baseText,
      grid: { left: 8, right: 60, top: 12, bottom: 8, containLabel: true },
      tooltip: {
        trigger: 'item', appendToBody: true,
        formatter: function (p) { return years[p.data[0]] + ' 财气 ' + p.data[2]; }
      },
      xAxis: { type: 'category', data: years, axisLabel: { color: muted, fontFamily: fontCJK }, axisLine: { lineStyle: { color: rule } } },
      yAxis: { type: 'category', data: ['流年财气'], axisLabel: { color: ink, fontFamily: fontCJK }, axisLine: { lineStyle: { color: rule } }, splitLine: { show: false } },
      visualMap: {
        min: 50, max: 85, show: true, orient: 'vertical', right: 0, top: 'center',
        text: ['旺', '蓄'], textStyle: { color: muted, fontFamily: fontCJK },
        inRange: { color: [C_COOL, C_WEAK, C_MID, C_SEMI, C_WARM] },
        calculable: false
      },
      series: [{
        type: 'heatmap',
        data: hvals.map(function (v, i) { return [i, 0, v]; }),
        label: { show: true, formatter: function (p) { return p.value[2]; }, color: '#fff', fontFamily: 'Crimson Pro', fontWeight: 700 },
        itemStyle: { borderColor: paper, borderWidth: 4, borderRadius: 6 },
        emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,.2)' } }
      }]
    });
    window.addEventListener('resize', function () { heat.resize(); });
  }

  /* F5 结构环 */
  var elRing = document.getElementById('chart-ring');
  if (elRing) {
    var ring = echarts.init(elRing, null, { renderer: 'svg' });
    ring.setOption({
      animation: false,
      textStyle: baseText,
      tooltip: { trigger: 'item', appendToBody: true, formatter: '{b}：{c}%' },
      legend: { bottom: 0, textStyle: { color: muted, fontFamily: fontCJK }, itemWidth: 12, itemHeight: 12 },
      series: [{
        type: 'pie', radius: ['46%', '68%'], center: ['50%', '44%'],
        avoidLabelOverlap: false,
        itemStyle: { borderColor: paper, borderWidth: 3, borderRadius: 6 },
        label: { show: true, formatter: '{b}\n{d}%', color: ink, fontFamily: fontCJK, fontSize: 12, lineHeight: 16 },
        emphasis: { label: { fontWeight: 700 } },
        data: [
          { name: '先天格局', value: 40, itemStyle: { color: C_WARM } },
          { name: '行运窗口', value: 35, itemStyle: { color: C_MID } },
          { name: '现实转化', value: 25, itemStyle: { color: C_COOL } }
        ]
      }]
    });
    window.addEventListener('resize', function () { ring.resize(); });
  }

  /* F6 双轴四象限散点 */
  var elQuad = document.getElementById('chart-quadrant');
  if (elQuad) {
    var quad = echarts.init(elQuad, null, { renderer: 'svg' });
    quad.setOption({
      animation: false,
      textStyle: baseText,
      grid: { left: 10, right: 20, top: 16, bottom: 14, containLabel: true },
      tooltip: { trigger: 'item', appendToBody: true, formatter: '格局 66 × 窗口 78 → 借势象限 · 窗口红利' },
      xAxis: { type: 'value', min: 40, max: 100, name: '格局分（静态承载力）→', nameTextStyle: { color: muted, fontFamily: fontCJK }, axisLabel: { color: muted, fontFamily: fontCJK }, splitLine: { lineStyle: { color: rule, opacity: 0.5 } } },
      yAxis: { type: 'value', min: 40, max: 100, name: '行运助力（当下窗口）→', nameTextStyle: { color: muted, fontFamily: fontCJK }, axisLabel: { color: muted, fontFamily: fontCJK }, splitLine: { lineStyle: { color: rule, opacity: 0.5 } } },
      series: [{
        type: 'scatter',
        symbolSize: 22,
        data: [[66, 78]],
        itemStyle: { color: C_DEEP, borderColor: C_WARM, borderWidth: 3 },
        label: { show: true, position: 'top', formatter: '当前 66×78', color: C_DEEP, fontFamily: fontCJK, fontSize: 12, fontWeight: 700 },
        markArea: {
          silent: true,
          data: [
            [{ xAxis: 70, yAxis: 70, itemStyle: { color: C_WARM + '14' } }, { xAxis: 100, yAxis: 100 }],
            [{ xAxis: 40, yAxis: 70, itemStyle: { color: C_MID + '16' } }, { xAxis: 70, yAxis: 100 }],
            [{ xAxis: 70, yAxis: 40, itemStyle: { color: C_WEAK + '16' } }, { xAxis: 100, yAxis: 70 }],
            [{ xAxis: 40, yAxis: 40, itemStyle: { color: C_COOL + '16' } }, { xAxis: 70, yAxis: 70 }]
          ],
          label: { show: true, fontFamily: fontCJK, fontSize: 12, color: ink }
        }
      }],
      graphic: [
        { type: 'text', left: '30%', top: '12%', style: { text: '借势 · 窗口红利', font: '12px "Noto Sans CJK SC",sans-serif', fill: '#5c4a2a' } },
        { type: 'text', right: '22%', top: '12%', style: { text: '进取 · 顺势放大', font: '12px "Noto Sans CJK SC",sans-serif', fill: '#5c4a2a' } },
        { type: 'text', left: '30%', bottom: '10%', style: { text: '修炼 · 内功优先', font: '12px "Noto Sans CJK SC",sans-serif', fill: '#5c4a2a' } },
        { type: 'text', right: '22%', bottom: '10%', style: { text: '蓄力 · 守正练功', font: '12px "Noto Sans CJK SC",sans-serif', fill: '#5c4a2a' } }
      ]
    });
    window.addEventListener('resize', function () { quad.resize(); });
  }
})();

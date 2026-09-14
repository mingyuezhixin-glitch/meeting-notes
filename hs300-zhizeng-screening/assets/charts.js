/* 沪深300指数增强基金筛选报告 — 图表初始化
   所有颜色均从 :root 的 --chart-* 令牌读取，全报告共用一套调色板。 */
(function () {
  'use strict';

  var FUNDS = [
    { name: '博道沪深300增强A', short: '博道', code: '007044', dd: 14.84, ret: 13.44, calmar: 0.91, inst: 53.55 },
    { name: '西部利得沪深300指数增强A', short: '西部利得', code: '673100', dd: 13.20, ret: 10.05, calmar: 0.76, inst: 46.97 },
    { name: '汇添富沪深300指数增强A', short: '汇添富', code: '005530', dd: 14.27, ret: 8.91, calmar: 0.62, inst: 50.33 },
    { name: '南方沪深300增强A', short: '南方', code: '009059', dd: 13.17, ret: 11.41, calmar: 0.87, inst: 27.18 },
    { name: '招商沪深300指数增强A', short: '招商', code: '004190', dd: 14.11, ret: 7.22, calmar: 0.51, inst: 49.11 },
    { name: '国投瑞银沪深300指数量化增强A', short: '国投瑞银', code: '007143', dd: 16.19, ret: 10.05, calmar: 0.62, inst: 49.24 },
    { name: '安信量化沪深300增强A', short: '安信', code: '003957', dd: 16.93, ret: 12.62, calmar: 0.75, inst: 62.98 },
    { name: '富国沪深300指数增强A', short: '富国', code: '100038', dd: 15.40, ret: 8.27, calmar: 0.54, inst: 17.15 },
    { name: '建信沪深300指数增强(LOF)A', short: '建信', code: '165310', dd: 15.16, ret: 9.06, calmar: 0.60, inst: 0.00 },
    { name: '华夏沪深300指数增强A', short: '华夏', code: '001015', dd: 16.13, ret: 10.81, calmar: 0.67, inst: 33.30 },
    { name: '兴全沪深300指数增强(LOF)A', short: '兴全', code: '163407', dd: 13.77, ret: 5.56, calmar: 0.40, inst: 5.93 },
    { name: '天弘沪深300指数增强发起A', short: '天弘', code: '008592', dd: 15.53, ret: 9.58, calmar: 0.62, inst: 21.92 },
    { name: '宏利沪深300指数增强A', short: '宏利', code: '162213', dd: 14.63, ret: 9.72, calmar: 0.66, inst: 27.69 },
    { name: '万家沪深300指数增强A', short: '万家', code: '002670', dd: 19.41, ret: 6.84, calmar: 0.35, inst: 35.99 }
  ];

  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    v = (v || '').trim();
    return v || fallback;
  }

  function init() {
    var el = document.getElementById('chart-risk-return');
    if (!el) { return; }
    if (typeof echarts === 'undefined') {
      showEmpty('图表库未加载，数据暂不可用');
      return;
    }

    var series1 = token('--chart-series-1', '#0969DA');
    var grid = token('--chart-grid', 'rgba(31,35,40,0.12)');
    var axis = token('--chart-axis', '#636C76');
    var label = token('--chart-label', '#636C76');
    var tipBg = token('--chart-tooltip-bg', '#FFFFFF');
    var border = token('--page-border', '#D0D7DE');
    var ink = token('--page-text', '#1F2328');
    var muted = token('--page-text-muted', '#636C76');

    function size(v) {
      // 机构持仓 0%~65% 映射到 6px~22px 的直径
      return 6 + Math.max(0, Math.min(65, v)) * 0.24;
    }

    var points = FUNDS.map(function (f) {
      return {
        name: f.name,
        short: f.short,
        code: f.code,
        value: [f.dd, f.ret],
        calmar: f.calmar,
        inst: f.inst,
        symbolSize: size(f.inst)
      };
    });

    var chart = echarts.init(el, null, { renderer: 'svg' });

    chart.setOption({
      animation: false,
      textStyle: { fontFamily: 'WorkSans, PingFang SC, Microsoft YaHei, Noto Sans CJK SC, sans-serif' },
      grid: { left: 62, right: 28, top: 26, bottom: 56 },
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        backgroundColor: tipBg,
        borderColor: border,
        borderWidth: 1,
        textStyle: { color: ink, fontSize: 12 },
        formatter: function (p) {
          var d = p.data;
          return '<b>' + d.name + '</b>　' + d.code +
            '<br/>近三年最大回撤　' + d.value[0].toFixed(2) + '%' +
            '<br/>近三年年化收益　' + d.value[1].toFixed(2) + '%' +
            '<br/>卡玛比率　' + d.calmar.toFixed(2) +
            '<br/>机构持仓　' + d.inst.toFixed(2) + '%';
        }
      },
      xAxis: {
        type: 'value',
        name: '近三年最大回撤（%）',
        nameLocation: 'middle',
        nameGap: 32,
        nameTextStyle: { color: label, fontSize: 11 },
        min: 12,
        max: 20,
        splitLine: { lineStyle: { color: grid, width: 1 } },
        axisLine: { lineStyle: { color: axis } },
        axisLabel: { color: label, fontSize: 11, formatter: '{value}' },
        axisTick: { lineStyle: { color: axis } }
      },
      yAxis: {
        type: 'value',
        name: '近三年年化收益（%）',
        nameLocation: 'middle',
        nameGap: 42,
        nameTextStyle: { color: label, fontSize: 11 },
        min: 4,
        max: 14,
        splitLine: { lineStyle: { color: grid, width: 1 } },
        axisLine: { lineStyle: { color: axis } },
        axisLabel: { color: label, fontSize: 11, formatter: '{value}' },
        axisTick: { lineStyle: { color: axis } }
      },
      series: [{
        type: 'scatter',
        name: '沪深300指数增强基金',
        data: points,
        itemStyle: {
          color: series1,
          opacity: 0.78,
          borderColor: series1,
          borderWidth: 1
        },
        emphasis: {
          scale: 1.12,
          itemStyle: { opacity: 1 }
        },
        label: {
          show: true,
          position: 'top',
          distance: 4,
          color: muted,
          fontSize: 11,
          formatter: function (p) { return p.data.short; }
        }
      }]
    });

    var timer = null;
    window.addEventListener('resize', function () {
      if (timer) { clearTimeout(timer); }
      timer = setTimeout(function () { chart.resize(); }, 120);
    });

    function showEmpty(msg) {
      el.style.display = 'none';
      var box = document.getElementById('chart-risk-return-empty');
      if (box) {
        box.textContent = msg;
        box.style.display = 'flex';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

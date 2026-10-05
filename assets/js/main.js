(function () {
  'use strict';

  // One entry per application: adding an app means adding a row in index.html plus an entry here.
  var APPS = {
    daily: {
      name: 'Daily AI Intelligence',
      role: 'Automated MCP-driven intelligence pipeline',
      desc: 'An automated intelligence aggregation system built on Model Context Protocol (MCP), delivering curated AI news, research signals, and market developments through a structured daily pipeline. Demonstrates MCP-based workflow orchestration at production scale.',
      tags: ['MCP', 'Automation', 'Python'],
      url: 'https://rdexplore-daily-ai.static.hf.space', host: 'rdexplore-daily-ai.static.hf.space',
      img: 'assets/img/daily-ai-intelligence.png', w: 1876, h: 778, alt: 'Daily AI Intelligence screenshot',
      caps: ['mcp']
    },
    signal: {
      name: 'Signal',
      role: 'Multimodal and specialized model application',
      desc: 'A multimodal intelligence application leveraging specialized models to process and synthesize signals across different data modalities. Built to demonstrate applied model selection, prompt engineering, and output structuring at the intersection of finance and AI.',
      tags: ['Multimodal', 'HF Spaces', 'Gradio'],
      url: 'https://rdexplore-signal.hf.space', host: 'rdexplore-signal.hf.space',
      img: 'assets/img/signal.png', w: 1076, h: 902, alt: 'Signal app screenshot',
      caps: ['models']
    },
    govlens: {
      name: 'AI GovLens',
      role: 'Multi-agent governance validation system',
      desc: 'A multi-agent ecosystem where specialized AI agents validate each other’s outputs against responsible AI principles. Implements a validator-agent architecture with cross-model critique loops, grounded in ISO 42001 governance principles. Applied AI governance in practice.',
      tags: ['Multi-Agent', 'ISO 42001', 'Governance'],
      url: 'https://rdexplore-ai-govlens.hf.space', host: 'rdexplore-ai-govlens.hf.space',
      img: 'assets/img/govlens.png', w: 610, h: 618, alt: 'AI GovLens screenshot',
      caps: ['agents', 'gov']
    },
    mindmap: {
      name: 'Mindmap',
      role: 'AI-powered mindfulness and reflection tool',
      desc: 'An AI companion for mindful reflection and structured thinking, using generative AI to guide users through introspective exercises, thought organisation, and clarity-building. Demonstrates the application of AI in human-centred, non-commercial contexts.',
      tags: ['Generative AI', 'Wellbeing', 'HF Spaces'],
      url: 'https://rdexplore-mind-map.hf.space', host: 'rdexplore-mind-map.hf.space',
      img: 'assets/img/mindmap.png', w: 610, h: 834, alt: 'Mindmap screenshot',
      caps: ['genai']
    }
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var bar = $('#bar'), progress = $('#progress'), cur = $('#cur');
  var slides = $$('.slide');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Exhibit: capability filter + application detail ---- */
  var rows = $$('#matrix tbody tr');
  var detail = $('#detail');
  var capBtns = $$('.cap');
  var clearBtn = $('#clear');
  var selected = 'daily';
  var activeCap = null;

  function renderDetail(id, animate) {
    var a = APPS[id];
    if (!a) return;
    selected = id;
    $('#d-name').textContent = a.name;
    $('#d-role').textContent = a.role;
    $('#d-desc').textContent = a.desc;
    $('#d-host').textContent = a.host;
    var img = $('#d-img');
    img.src = a.img; img.width = a.w; img.height = a.h; img.alt = a.alt;
    var link = $('#d-link');
    link.href = a.url;
    var tags = $('#d-tags');
    tags.innerHTML = '';
    a.tags.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; tags.appendChild(li); });
    rows.forEach(function (r) {
      var on = r.getAttribute('data-app') === id;
      r.classList.toggle('is-selected', on);
      $('.app-pick', r).setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (animate && !reduce) {
      detail.classList.remove('swap');
      void detail.offsetWidth;
      detail.classList.add('swap');
    }
  }

  function applyCap(cap) {
    activeCap = cap;
    capBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cap') === cap ? 'true' : 'false'); });
    rows.forEach(function (r) {
      var id = r.getAttribute('data-app');
      r.classList.toggle('is-dim', !!cap && APPS[id].caps.indexOf(cap) === -1);
    });
    $$('#matrix td').forEach(function (td) { td.classList.toggle('col-on', !!cap && td.getAttribute('data-cap') === cap); });
    clearBtn.classList.toggle('show', !!cap);
    if (cap && APPS[selected].caps.indexOf(cap) === -1) {
      var first = Object.keys(APPS).filter(function (k) { return APPS[k].caps.indexOf(cap) > -1; })[0];
      if (first) renderDetail(first, true);
    }
  }

  capBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.getAttribute('data-cap');
      applyCap(activeCap === c ? null : c);
    });
  });
  clearBtn.addEventListener('click', function () { applyCap(null); });
  $$('.app-pick').forEach(function (b) {
    b.addEventListener('click', function () {
      renderDetail(b.getAttribute('data-pick'), true);
      history.replaceState(null, '', '#app-' + b.getAttribute('data-pick'));
    });
  });

  // Cross-link from other slides into the exhibit
  $$('[data-open-app]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-open-app'), f = b.getAttribute('data-filter');
      renderDetail(id, true);
      applyCap(f || null);
      $('#applications').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  var m = /^#app-(\w+)$/.exec(location.hash);
  if (m && APPS[m[1]]) {
    renderDetail(m[1], false);
    window.addEventListener('load', function () { $('#applications').scrollIntoView(); });
  } else {
    renderDetail('daily', false);
  }

  /* ---- Deck bar: counter, current slide, dark/light, progress ---- */
  var navLinks = $$('#bar-nav a');
  function setCurrent(slide) {
    var i = slides.indexOf(slide);
    cur.textContent = i + 1;
    bar.classList.toggle('on-dark', slide.classList.contains('dark'));
    navLinks.forEach(function (a) {
      a.setAttribute('aria-current', a.getAttribute('href') === '#' + slide.id ? 'true' : 'false');
    });
  }

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    slides.forEach(function (s) { spy.observe(s); });

    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); reveal.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    slides.forEach(function (s) { reveal.observe(s); });
  } else {
    slides.forEach(function (s) { s.classList.add('in-view'); });
  }
  setCurrent(slides[0]);
  // Cover marker-free; arm any marker in the first viewport immediately
  $$('.cover .mk').forEach(function (n) { n.classList.add('now'); });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile slide menu ---- */
  var menu = $('#bar-menu');
  menu.addEventListener('click', function () {
    var open = bar.classList.toggle('open');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.forEach(function (a) { a.addEventListener('click', function () { bar.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { bar.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
})();

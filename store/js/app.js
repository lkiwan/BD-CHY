/* ============================================================
   VirtualFit: Spatial Try-On — all logic (vanilla JS)
   Data comes from js/data.js (window.CATEGORIES). Each
   category has its own model sheet, garment sheet and items;
   the tab bar switches category and the arc is rebuilt from
   the active category's items (two copies of every item, so
   the arc loops seamlessly). Tops is the default category
   and behaves exactly as the original single-category build.
   The model can be zoomed (buttons / double-click / pinch)
   to inspect the fit; see the zoom section below.
   ============================================================ */
(function () {
  "use strict";

  var CATS = window.CATEGORIES || [];
  var cat = null;              // active category object
  var ITEMS = [], N = 0, CARDS = 0;
  var EASE = "cubic-bezier(.2,.8,.2,1)";
  var SCAN_EASE = "cubic-bezier(.65,0,.35,1)";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s) { return document.querySelector(s); }
  function mod(a, n) { return ((a % n) + n) % n; }

  var room = $(".room");
  var ghost = $(".ghost");
  var letters = Array.prototype.slice.call(ghost.querySelectorAll("span"));
  var stage = $("#stage");
  var arc = $("#arc");
  var modelEl = $(".model");
  var mCur = $("#mCur"), mNext = $("#mNext");
  var grid = $(".grid"), scan = $(".scan");
  var cur = $("#cur"), ring = cur.querySelector(".ring");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var pill = $("#tabPill");
  var nameLn = $("#nameLn"), priceLn = $("#priceLn"), colorLn = $("#colorLn");
  var thumb = $("#thumb"), thumbG = $("#thumbG"), dotsEl = $("#dots");
  var buyEl = $("#buy"), chevEl = $("#buyChev");
  var zoomInBtn = $("#zoomIn"), zoomOutBtn = $("#zoomOut");

  /* ---------------- state ---------------- */
  var W = window.innerWidth, H = window.innerHeight;
  var CW = 200, XSpx = [0, 0, 0, 0, 0, 0];
  var pos = 0, target = 0;
  var intro = reduced ? 1 : 0;
  var sx = 0, sy = 0, tx = 0, ty = 0;        // pointer parallax (smoothed / target)
  var mx = W / 2, my = H / 2, cx = mx, cy = my; // cursor (target / lerped)
  var dragging = false;
  var shown = -1;                             // item index currently on the model
  var activeTab = tabs[0];
  var cards = [];

  function isPhone() { return W <= 767; }

  /* ---------------- garment / figure painting ---------------- */
  function setGarmentBg(el, item) {
    if (item.img) {
      el.style.setProperty("background-image", "url(\"" + item.img + "\")");
      el.style.backgroundSize = "contain";
      el.style.backgroundPosition = "center";
      el.style.backgroundRepeat = "no-repeat";
    } else {
      el.style.setProperty("background-image", cat.garment.img);
      el.style.backgroundSize = cat.garment.size;
      el.style.backgroundPosition = item.g[0] + "% " + item.g[1] + "%";
      el.style.backgroundRepeat = "no-repeat";
    }
  }
  function setFigure(el, item) {
    el.style.backgroundPosition = (item.m != null ? item.m : 0) + "% 100%";
  }

  /* ---------------- model geometry (per category) ---------------- */
  function applyModelStyle() {
    if (!cat) return;
    var m = cat.model, ph = isPhone();
    modelEl.style.aspectRatio = m.aspect;
    var h = ph && m.heightPhone ? m.heightPhone : m.height;
    modelEl.style.height = h || "";
    var lift = ph && m.liftPhone != null ? m.liftPhone : m.lift;
    modelEl.style.bottom = lift || "";
    [mCur, mNext].forEach(function (el) {
      el.style.setProperty("background-image", m.img);
      el.style.backgroundSize = m.size;
    });
  }

  /* ---------------- cards ---------------- */
  function buildCards() {
    arc.innerHTML = "";
    cards = [];
    for (var k = 0; k < CARDS; k++) {
      (function (k) {
        var item = ITEMS[k % N];
        var card = document.createElement("div");
        card.className = "card glass";
        card.dataset.idx = k;
        var g = document.createElement("div");
        g.className = "g";
        setGarmentBg(g, item);
        var nm = document.createElement("div");
        nm.className = "cname";
        nm.textContent = item.n;
        var pr = document.createElement("div");
        pr.className = "cprice";
        pr.textContent = "$" + item.p;
        var sh = document.createElement("div");
        sh.className = "sheen";
        card.appendChild(g);
        card.appendChild(nm);
        card.appendChild(pr);
        card.appendChild(sh);
        card.addEventListener("mouseenter", function () {
          if (reduced) return;
          sh.animate(
            [{ transform: "translateX(-130%)" }, { transform: "translateX(130%)" }],
            { duration: 1000, easing: EASE }
          );
        });
        arc.appendChild(card);
        cards.push(card);
      })(k);
    }
  }

  /* ---------------- buy card ---------------- */
  function rollText(ln, text) {
    var stack = ln.firstElementChild;
    if (reduced) {
      stack.innerHTML = "";
      var s0 = document.createElement("span");
      s0.textContent = text;
      stack.appendChild(s0);
      return;
    }
    if (stack.dataset.rolling) {
      stack.getAnimations().forEach(function (a) { a.cancel(); });
      while (stack.children.length > 1) stack.removeChild(stack.firstElementChild);
      delete stack.dataset.rolling;
    }
    var nw = document.createElement("span");
    nw.textContent = text;
    stack.appendChild(nw);
    stack.dataset.rolling = "1";
    var anim = stack.animate(
      [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-ln.clientHeight) + "px)" }],
      { duration: 620, easing: EASE, fill: "forwards" }
    );
    anim.onfinish = function () {
      if (stack.firstElementChild && stack.children.length > 1) {
        stack.removeChild(stack.firstElementChild);
      }
      anim.cancel();
      delete stack.dataset.rolling;
    };
  }

  function buildDots(item) {
    dotsEl.innerHTML = "";
    item.c.forEach(function (pair, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "dot" + (i === 0 ? " act" : "");
      d.style.background = pair[1];
      d.setAttribute("aria-label", pair[0]);
      d.addEventListener("click", function () {
        Array.prototype.forEach.call(dotsEl.querySelectorAll(".dot"), function (x) {
          x.classList.remove("act");
        });
        d.classList.add("act");
        rollText(colorLn, "Color · " + pair[0]);
      });
      dotsEl.appendChild(d);
    });
  }

  function updateBuy(item) {
    rollText(nameLn, item.n);
    rollText(priceLn, "$" + item.p);
    rollText(colorLn, "Color · " + item.c[0][0]);
    setGarmentBg(thumbG, item);
    if (!reduced) {
      thumb.animate(
        [{ transform: "translateY(70%) scale(.8)" }, { transform: "translateY(0%) scale(1)" }],
        { duration: 650, easing: EASE }
      );
    }
    buildDots(item);
    measureBar();
    if (!barAnim) renderBar(barP);
  }

  /* ---------------- collapsible buy bar ----------------
     The buy card starts collapsed to a slim bar (thumbnail +
     name + price + chevron) so the model's outfit is fully
     visible. Tapping the slim bar or the chevron, or dragging
     the bar up, expands it to the full card (Size + Colour);
     tapping the chevron again, or dragging down, collapses
     it. barP is the 0..1 progress and renderBar() paints
     every in-between state, so drags follow the finger and
     releases snap with the project ease (~450ms). */
  var buyGrps = Array.prototype.slice.call(buyEl.querySelectorAll(".grp"));
  var barP = 0, barTarget = 0, barW = [0, 0], dragOff = 0, barAnim = null;

  function cubicEase(x1, y1, x2, y2) {
    function sx(t) { return 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t; }
    function sy(t) { return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t; }
    function dx(t) { return 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2); }
    return function (x) {
      var t = x, i, err, d;
      for (i = 0; i < 5; i++) {
        err = sx(t) - x;
        if (Math.abs(err) < 1e-4) return sy(t);
        d = dx(t);
        if (Math.abs(d) < 1e-4) break;
        t -= err / d;
      }
      var lo = 0, hi = 1;
      t = x;
      while (hi - lo > 1e-4) {
        if (sx(t) < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return sy(t);
    };
  }
  var easeFn = cubicEase(0.2, 0.8, 0.2, 1);

  function measureBar() {
    buyGrps.forEach(function (g, i) {
      var prev = g.style.maxWidth;
      g.style.maxWidth = "none";
      barW[i] = g.scrollWidth;
      g.style.maxWidth = prev;
    });
  }
  function renderBar(p) {
    barP = p;
    /* Calque (ordre d'Omar, 2026-11-07) : barre repliée DERRIÈRE le
       personnage (z 45 < .model 50, comme l'en-tête) ; dès qu'elle
       s'ouvre (clic ^), elle passe DEVANT (z 60). Le personnage est
       en pointer-events:none, donc les clics traversent vers la barre. */
    buyEl.style.zIndex = p <= 0.001 ? "45" : "60";
    buyEl.style.padding = (10 + 2 * p) + "px " + (12 + 10 * p) + "px " + (10 + 2 * p) + "px 12px";
    buyEl.style.gap = (14 + 8 * p) + "px";
    buyEl.style.borderRadius = (22 + 2 * p) + "px";
    var ts = (56 + 8 * p) + "px";
    thumb.style.width = ts;
    thumb.style.height = ts;
    buyGrps.forEach(function (g, i) {
      g.style.maxWidth = (barW[i] * p) + "px";
      g.style.opacity = String(p);
      g.style.visibility = p <= 0.001 ? "hidden" : "visible";
    });
    chevEl.style.transform = "rotate(" + (180 * p) + "deg)";
    buyEl.style.transform = "translateX(-50%) translateY(" + dragOff + "px)";
    chevEl.setAttribute("aria-expanded", p > 0.5 ? "true" : "false");
    chevEl.setAttribute("aria-label", p > 0.5 ? "Collapse" : "Expand");
  }
  function animateBar(to) {
    barTarget = to;
    if (barAnim) { cancelAnimationFrame(barAnim); barAnim = null; }
    if (reduced) { dragOff = 0; renderBar(to); return; }
    var from = barP, fromOff = dragOff, t0 = performance.now(), dur = 450;
    if (from === to && fromOff === 0) { renderBar(to); return; }
    function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = easeFn(k);
      dragOff = fromOff * (1 - e);
      renderBar(from + (to - from) * e);
      if (k < 1) barAnim = requestAnimationFrame(step);
      else { barAnim = null; dragOff = 0; renderBar(to); }
    }
    barAnim = requestAnimationFrame(step);
  }

  /* Tap + vertical drag on the bar itself. Drags that start
     on the Size/Colour controls or the chevron are left to
     those controls; the bar never reaches the stage drag. */
  var barDrag = null, barSuppressClick = false;
  buyEl.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest(".grp") || e.target.closest(".buyChev")) return;
    if (barAnim) { cancelAnimationFrame(barAnim); barAnim = null; }
    barDrag = { id: e.pointerId, y0: e.clientY, p0: barP, t0: barTarget, max: 0 };
    try { buyEl.setPointerCapture(e.pointerId); } catch (err) {}
  });
  buyEl.addEventListener("pointermove", function (e) {
    if (!barDrag || e.pointerId !== barDrag.id) return;
    var dy = barDrag.y0 - e.clientY; // up = positive = expand
    barDrag.max = Math.max(barDrag.max, Math.abs(dy));
    dragOff = Math.max(-16, Math.min(16, -dy * 0.35));
    renderBar(Math.min(1, Math.max(0, barDrag.p0 + dy / 120)));
  });
  function barDragEnd(e) {
    if (!barDrag || e.pointerId !== barDrag.id) return;
    var dy = barDrag.y0 - e.clientY, startTarget = barDrag.t0;
    var wasTap = barDrag.max < 6;
    barDrag = null;
    if (wasTap) { animateBar(startTarget); return; }
    barSuppressClick = true;
    if (dy > 30) animateBar(1);
    else if (dy < -30) animateBar(0);
    else animateBar(startTarget);
  }
  buyEl.addEventListener("pointerup", barDragEnd);
  buyEl.addEventListener("pointercancel", barDragEnd);
  buyEl.addEventListener("click", function (e) {
    if (barSuppressClick) { barSuppressClick = false; return; }
    if (e.target.closest(".grp") || e.target.closest(".buyChev")) return;
    if (barTarget < 0.5) animateBar(1);
  });
  chevEl.addEventListener("click", function () {
    if (barSuppressClick) { barSuppressClick = false; return; }
    animateBar(barTarget > 0.5 ? 0 : 1);
  });

  /* ---------------- try-on scan ---------------- */
  var scanAnims = [];
  function tryOn(idx) {
    shown = idx;
    var item = ITEMS[idx];
    resetZoom();
    updateBuy(item);
    /* Tenues libres : la sélection est écrite ici (app.js démarre
       avant outfits.js, le tout premier tryOn ne doit pas se perdre). */
    window.SURMOI_SEL = window.SURMOI_SEL || { tops: null, bottoms: null, shoes: null };
    if (cat && Object.prototype.hasOwnProperty.call(window.SURMOI_SEL, cat.id)) window.SURMOI_SEL[cat.id] = idx;
    if (window.SURMOI_OUTFIT_REFRESH) window.SURMOI_OUTFIT_REFRESH();
    scanAnims.forEach(function (a) { a.cancel(); });
    scanAnims = [];
    setFigure(mNext, item);
    if (reduced) {
      setFigure(mCur, item);
      mCur.style.opacity = "1";
      return;
    }
    var a1 = mNext.animate(
      [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
      { duration: 950, easing: SCAN_EASE, fill: "forwards" }
    );
    var a2 = grid.animate(
      [
        { clipPath: "inset(0 0 100% 0)", offset: 0 },
        { clipPath: "inset(0 0 0% 0)", offset: 0.5 },
        { clipPath: "inset(100% 0 0 0)", offset: 1 }
      ],
      { duration: 1092, easing: SCAN_EASE, fill: "forwards" }
    );
    var a3 = scan.animate(
      [
        { top: "0%", transform: "scaleX(.2)", opacity: "0", offset: 0 },
        { top: "6%", transform: "scaleX(1)", opacity: "1", offset: 0.08 },
        { top: "94%", offset: 0.92 },
        { top: "100%", transform: "scaleX(.2)", opacity: "0", offset: 1 }
      ],
      { duration: 950, easing: SCAN_EASE, fill: "forwards" }
    );
    var a4 = mNext.animate(
      [{ transform: "scale(1.012)" }, { transform: "scale(1)" }],
      { duration: 1250, easing: "ease-out", fill: "forwards" }
    );
    scanAnims = [a1, a2, a3, a4];
    a1.onfinish = function () {
      setFigure(mCur, item);
      mCur.style.opacity = "1";
      scanAnims.forEach(function (a) { a.cancel(); });
      scanAnims = [];
    };
  }

  /* ---------------- categories ---------------- */
  function catByLabel(label) {
    for (var i = 0; i < CATS.length; i++) {
      if (CATS[i].label === label) return CATS[i];
    }
    return null;
  }
  function setCategory(c) {
    cat = c;
    ITEMS = c.items;
    N = ITEMS.length;
    CARDS = N * 2;
    scanAnims.forEach(function (a) { a.cancel(); });
    scanAnims = [];
    mCur.style.opacity = "0";
    shown = -1;
    pos = 0;
    target = 0;
    resetZoom();
    applyModelStyle();
    buildCards();
    buildDots(ITEMS[0]);
    setGarmentBg(thumbG, ITEMS[0]);
    if (window.SURMOI_OUTFIT_REFRESH) window.SURMOI_OUTFIT_REFRESH();
  }
  function switchCategory(c) {
    if (c === cat) return;
    setCategory(c);
  }

  /* ---------------- tabs / arrows / chips ---------------- */
  function movePill(btn) {
    if (!btn) return;
    pill.style.width = btn.offsetWidth + "px";
    pill.style.height = btn.offsetHeight + "px";
    pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
  }
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabs.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeTab = btn;
      movePill(btn);
      var c = catByLabel(btn.textContent.trim());
      if (c && c !== cat) switchCategory(c);
      else target += N; // no category behind this tab yet (or same tab): full lap, lands back on the same garment
    });
  });
  $("#prevBtn").addEventListener("click", function () { target -= 1; });
  $("#nextBtn").addEventListener("click", function () { target += 1; });
  Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (chip) {
    chip.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (c) {
        c.classList.remove("act");
      });
      chip.classList.add("act");
    });
  });

  /* ---------------- model zoom ----------------
     Zoom 1x–2.5x on the model, around its bottom-centre.
     Buttons step x/÷ 1.25 (animated); double-click / double-
     tap on the model toggles 1x <-> 2x; pinch zooms freely;
     while zoomed, a drag that starts on the model pans it.
     Zoom resets whenever the outfit or category changes. */
  var zoom = 1, panX = 0, panY = 0;
  function clampPan() {
    var mw = modelEl.offsetWidth || 1, mh = modelEl.offsetHeight || 1;
    var maxX = (zoom - 1) * mw * 0.55;
    var maxUp = (zoom - 1) * mh * 0.55;
    var maxDown = (zoom - 1) * mh * 0.2 + 10;
    panX = Math.min(maxX, Math.max(-maxX, panX));
    panY = Math.min(maxDown, Math.max(-maxUp, panY));
  }
  function applyZoom(anim) {
    modelEl.classList.toggle("noanim", !anim);
    modelEl.style.transform =
      "translateX(-50%) translate(" + panX + "px, " + panY + "px) scale(" + zoom + ")";
    zoomInBtn.classList.toggle("off", zoom >= 2.5 - 1e-6);
    zoomOutBtn.classList.toggle("off", zoom <= 1 + 1e-6);
  }
  function setZoom(z, anim) {
    zoom = Math.min(2.5, Math.max(1, z));
    if (zoom === 1) { panX = 0; panY = 0; }
    clampPan();
    applyZoom(anim !== false);
  }
  function resetZoom() {
    if (zoom !== 1 || panX !== 0 || panY !== 0) setZoom(1, true);
  }
  function inModel(x, y) {
    var r = modelEl.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }
  function toggleZoom() { setZoom(zoom > 1 ? 1 : 2, true); }
  zoomInBtn.addEventListener("click", function () { setZoom(zoom * 1.25, true); });
  zoomOutBtn.addEventListener("click", function () { setZoom(zoom / 1.25, true); });
  stage.addEventListener("dblclick", function (e) {
    if (inModel(e.clientX, e.clientY)) toggleZoom();
  });

  /* ---------------- cursor ---------------- */
  var curState = "", pressed = false, curShown = false;
  function ringScale() {
    var b = curState === "try" ? 1.5 : curState === "drag" ? 1.2 : curState === "btn" ? 0.6 : 1;
    ring.style.transform = "scale(" + (b * (pressed ? 1.05 : 1)) + ")";
  }
  function setCurState(s) {
    if (s === curState) return;
    curState = s;
    cur.classList.remove("try", "drag", "btn");
    if (s) cur.classList.add(s);
    ringScale();
  }
  document.addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY;
    tx = e.clientX / W - 0.5;
    ty = e.clientY / H - 0.5;
    if (!curShown) {
      curShown = true;
      cx = mx; cy = my;
      cur.style.opacity = "1";
    }
    if (!dragging) {
      var t = e.target;
      if (t.closest && t.closest(".card")) setCurState("try");
      else if (t.closest && (t.closest("button") || t.closest(".buy"))) setCurState("btn");
      else if (t.closest && t.closest(".stage")) setCurState("drag");
      else setCurState("");
    }
  });
  document.addEventListener("pointerdown", function () { pressed = true; ringScale(); });
  document.addEventListener("pointerup", function () { pressed = false; ringScale(); });

  /* ---------------- drag / click / model pan ---------------- */
  var dragId = null, startX = 0, p0 = 0, lastX = 0, lastT = 0, vel = 0, moved = 0, downCard = null;
  var panning = false, panId = null, panStartX = 0, panStartY = 0, panBaseX = 0, panBaseY = 0;
  var lastTapT = 0, lastTapX = -999, lastTapY = -999;
  stage.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    // Pan the zoomed model: only when the pointer starts on it.
    if (zoom > 1 && inModel(e.clientX, e.clientY)) {
      panning = true;
      panId = e.pointerId;
      panStartX = e.clientX; panStartY = e.clientY;
      panBaseX = panX; panBaseY = panY;
      try { stage.setPointerCapture(panId); } catch (err) {}
      setCurState("drag");
      return;
    }
    dragId = e.pointerId;
    try { stage.setPointerCapture(dragId); } catch (err) {}
    dragging = true;
    startX = lastX = e.clientX;
    lastT = performance.now();
    p0 = pos;
    vel = 0;
    moved = 0;
    downCard = (e.target.closest && e.target.closest(".card")) || null;
    setCurState("drag");
  });
  stage.addEventListener("pointermove", function (e) {
    if (panning && e.pointerId === panId) {
      panX = panBaseX + (e.clientX - panStartX);
      panY = panBaseY + (e.clientY - panStartY);
      clampPan();
      applyZoom(false);
      return;
    }
    if (dragId !== e.pointerId) return;
    var now = performance.now();
    var dx = e.clientX - startX;
    if (Math.abs(dx) > moved) moved = Math.abs(dx);
    var inst = (e.clientX - lastX) / Math.max(1, now - lastT); // px per ms
    vel = vel * 0.7 + inst * 0.3;
    lastX = e.clientX;
    lastT = now;
    pos = p0 - dx / XSpx[1];
  });
  function endDrag(e) {
    if (panning && e.pointerId === panId) {
      panning = false;
      panId = null;
      return;
    }
    if (dragId !== e.pointerId) return;
    dragId = null;
    dragging = false;
    if (moved < 6) {
      // Double-tap on the model toggles zoom (touch only — the
      // mouse equivalent is the stage dblclick handler above).
      var nowT = performance.now();
      if (e.pointerType !== "mouse" && inModel(e.clientX, e.clientY) &&
          nowT - lastTapT < 350 &&
          Math.abs(e.clientX - lastTapX) < 40 && Math.abs(e.clientY - lastTapY) < 40) {
        lastTapT = 0;
        toggleZoom();
        downCard = null;
        return;
      }
      lastTapT = nowT; lastTapX = e.clientX; lastTapY = e.clientY;
      if (downCard) {
        var i = parseInt(downCard.dataset.idx, 10);
        target += mod(i - target + N, CARDS) - N;
      }
    } else {
      target = Math.round(pos - vel * 3.2);
    }
    downCard = null;
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  /* ---------------- pinch zoom (two fingers on the model) ---------------- */
  var pinchPtrs = new Map();
  var pinch = null;
  document.addEventListener("pointerdown", function (e) {
    if (e.target.closest && (e.target.closest("button") || e.target.closest(".buy"))) return;
    pinchPtrs.set(e.pointerId, { x: e.clientX, y: e.clientY, onModel: inModel(e.clientX, e.clientY) });
    if (pinchPtrs.size === 2 && !pinch) {
      var pts = Array.from(pinchPtrs.values());
      if (pts[0].onModel && pts[1].onModel) {
        pinch = {
          d0: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
          z0: zoom,
          mx: (pts[0].x + pts[1].x) / 2, my: (pts[0].y + pts[1].y) / 2,
          bx: panX, by: panY
        };
        if (dragging) { // hand the gesture over from the arc drag
          dragging = false;
          dragId = null;
          target = Math.round(pos);
        }
        panning = false;
      }
    }
  });
  document.addEventListener("pointermove", function (e) {
    if (!pinchPtrs.has(e.pointerId)) return;
    pinchPtrs.set(e.pointerId, { x: e.clientX, y: e.clientY, onModel: pinchPtrs.get(e.pointerId).onModel });
    if (!pinch || pinchPtrs.size !== 2) return;
    var pts = Array.from(pinchPtrs.values());
    var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
    zoom = Math.min(2.5, Math.max(1, pinch.z0 * d / pinch.d0));
    if (zoom === 1) { panX = 0; panY = 0; }
    else {
      panX = pinch.bx + ((pts[0].x + pts[1].x) / 2 - pinch.mx);
      panY = pinch.by + ((pts[0].y + pts[1].y) / 2 - pinch.my);
    }
    clampPan();
    applyZoom(false);
  });
  function pinchEnd(e) {
    pinchPtrs.delete(e.pointerId);
    if (pinchPtrs.size < 2) pinch = null;
  }
  document.addEventListener("pointerup", pinchEnd);
  document.addEventListener("pointercancel", pinchEnd);

  /* ---------------- wheel / keys ---------------- */
  var wAcc = 0, wLast = 0;
  window.addEventListener("wheel", function (e) {
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wAcc += d;
    var now = performance.now();
    if (Math.abs(wAcc) > 60 && now - wLast >= 260) {
      target += Math.sign(wAcc);
      wAcc = 0;
      wLast = now;
    }
  }, { passive: true });
  window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target += 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") target -= 1;
  });

  /* ---------------- layout ---------------- */
  function layout() {
    W = window.innerWidth;
    H = window.innerHeight;
    CW = isPhone() ? Math.min(W * 0.30, 170) : Math.min(W * 0.148, H * 0.33);
    document.documentElement.style.setProperty("--CW", CW + "px");
    var f = isPhone() ? [0, 0.36, 0.5, 0.56, 0.6, 0.62] : [0, 0.215, 0.345, 0.432, 0.49, 0.52];
    XSpx = f.map(function (v) { return v * W; });
    applyModelStyle();
    movePill(activeTab);
    measureBar();
    if (!barAnim) renderBar(barP);
  }
  window.addEventListener("resize", layout);

  function xAt(a) {
    if (a >= 5) return XSpx[5];
    var s = Math.floor(a), fr = a - s;
    return XSpx[s] + (XSpx[s + 1] - XSpx[s]) * fr;
  }

  /* ---------------- main loop — the arc maths ---------------- */
  function frame(now) {
    var t = now / 1000;

    if (!dragging) pos = reduced ? target : pos + (target - pos) * 0.11;
    if (intro < 1) intro = Math.min(1, intro + 0.012);
    var ie = reduced ? 1 : 1 - Math.pow(1 - intro, 3);

    sx += (tx - sx) * 0.06;
    sy += (ty - sy) * 0.06;

    room.style.transform =
      "translate3d(" + (-sx * 22) + "px, " + (-sy * 14) + "px, 0) scale(" + (1.08 - 0.03 * ie) + ")";
    ghost.style.transform =
      "translate(calc(-50% + " + (-sx * 40) + "px), " + (-sy * 16) + "px)";
    letters.forEach(function (el, i) {
      el.style.transform = "translateY(" + ((1 - ie) * (60 + 30 * i)) + "px)";
    });

    for (var i = 0; i < CARDS; i++) {
      var card = cards[i];
      var u = mod(i - pos + N, CARDS) - N;
      var a = Math.abs(u), sg = Math.sign(u);
      var s, z, ry, op, blur = 0;
      if (a < 1) {
        s = 0.55 + 0.45 * a;
        z = -260 * (1 - a);
        op = a;
        ry = -sg * 16 * a;
      } else {
        s = 1 / (1 + 0.3 * Math.pow(a - 1, 1.15));
        z = -110 * (a - 1);
        ry = -sg * (16 + 9 * Math.min(2, a - 1));
        blur = Math.max(0, a - 1.6) * 2.4;
        op = 1;
        if (a > 3.4) op = 1 - (a - 3.4) / 0.8;
      }
      var bob = reduced ? 0 : Math.sin(t * 1.1 + i * 1.37) * H * 0.006 * Math.min(1, a);
      var y = bob - (1 - s) * H * 0.04;
      ry += sx * 10;
      var x = sg * xAt(a) * ie;
      op *= ie;
      card.style.transform =
        "translate(" + x + "px, " + y + "px) perspective(1300px) translateZ(" + z + "px)" +
        " rotateY(" + ry + "deg) rotateX(" + (-sy * 6) + "deg) scale(" + (s * (0.6 + 0.4 * ie)) + ")";
      card.style.opacity = op;
      card.style.zIndex = a < 1 ? 1 : Math.round(100 - 10 * a);
      card.style.filter = blur > 0.01 ? "blur(" + blur + "px)" : "";
      card.style.visibility = op < 0.01 ? "hidden" : "visible";
    }

    cx += (mx - cx) * 0.22;
    cy += (my - cy) * 0.22;
    cur.style.transform = "translate3d(" + cx + "px, " + cy + "px, 0) translate(-50%, -50%)";

    if (!dragging && Math.abs(target - pos) < 0.02) {
      var idx = mod(Math.round(target), N);
      if (idx !== shown) tryOn(idx);
    }

    requestAnimationFrame(frame);
  }

  /* ---------------- init ---------------- */
  setCategory(CATS[0]);
  layout();
  applyZoom(false);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      movePill(activeTab);
      measureBar();
      if (!barAnim) renderBar(barP);
    });
  }
  requestAnimationFrame(frame);
})();

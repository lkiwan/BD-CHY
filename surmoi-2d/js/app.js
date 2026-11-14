/* ============================================================
   VirtualFit: Spatial Try-On — all logic (vanilla JS)
   Data comes from js/data.js (window.ITEMS).
   The arc is driven by ITEMS: two copies of every item are
   built as cards, so with the spec's 5 items there are the
   spec's 10 cards and every formula below is the spec's.
   ============================================================ */
(function () {
  "use strict";

  var ITEMS = window.ITEMS || [];
  var L = window.LANGS[window.LANG] || window.LANGS.fr;
  var N = ITEMS.length;      // garments (spec: 5)
  var CARDS = N * 2;         // arc cards (spec: 10)
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
  var mCur = $("#mCur"), mNext = $("#mNext");
  var grid = $(".grid"), scan = $(".scan");
  var cur = $("#cur"), ring = cur.querySelector(".ring");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var pill = $("#tabPill");
  var nameLn = $("#nameLn"), priceLn = $("#priceLn");
  var thumb = $("#thumb"), thumbG = $("#thumbG");
  var buyBtn = $("#buyBtn");
  var sheet = $("#sheet"), sheetName = $("#sheetName"), sheetPrice = $("#sheetPrice"),
      sheetDesc = $("#sheetDesc"), sheetBuy = $("#sheetBuy");

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

  function isPhone() { return W <= 767; }

  /* ---------------- garment / figure painting ---------------- */
  function setGarmentBg(el, item) {
    if (item.img) {
      el.style.backgroundImage = "url(\"" + item.img + "\")";
      el.style.backgroundSize = "contain";
      el.style.backgroundPosition = "center";
      el.style.backgroundRepeat = "no-repeat";
    } else {
      el.style.backgroundImage = "url(\"assets/garment-sheet.webp\")";
      el.style.backgroundSize = "320% 212.5%";
      el.style.backgroundPosition = item.g[0] + "% " + item.g[1] + "%";
      el.style.backgroundRepeat = "no-repeat";
    }
  }
  function setFigure(el, item) {
    el.style.backgroundPosition = (item.m != null ? item.m : 0) + "% 100%";
  }

  /* ---------------- cards ---------------- */
  var cards = [];
  var cardNames = [];
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
      nm.textContent = L.items[k % N].n;
      cardNames.push(nm);
      var pr = document.createElement("div");
      pr.className = "cprice";
      pr.textContent = item.p + " MAD";
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

  function updateBuy(item, idx) {
    var li = L.items[idx];
    rollText(nameLn, li.n);
    if (buyBtn) { buyBtn.href = item.u; }
    if (sheetBuy) { sheetBuy.href = item.u; }
    if (sheetName) { sheetName.textContent = li.n; sheetPrice.textContent = item.p + " MAD · " + li.c; sheetDesc.textContent = li.d || ""; }
    rollText(priceLn, item.p + " MAD · " + li.c);
    setGarmentBg(thumbG, item);
    if (!reduced) {
      thumb.animate(
        [{ transform: "translateY(70%) scale(.8)" }, { transform: "translateY(0%) scale(1)" }],
        { duration: 650, easing: EASE }
      );
    }
  }

  /* ---------------- try-on scan ---------------- */
  var scanAnims = [];
  function tryOn(idx) {
    zoomReset();
    shown = idx;
    var item = ITEMS[idx];
    updateBuy(item, idx);
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

  /* ---------------- front / back view ---------------- */
  var backView = false;
  var modelEl = $(".model");
  var fbOne = $("#fbOne"), fbOneTx = $("#fbOneTx");
  function flipView(toBack) {
    if (toBack === backView) return;
    zoomReset();
    backView = toBack;
    fbOneTx.textContent = backView ? L.ui.front : L.ui.back;
    fbOne.setAttribute("aria-label", backView ? L.ui.seeFront : L.ui.seeBack);
    var item = ITEMS[shown];
    scanAnims.forEach(function (a) { a.cancel(); });
    scanAnims = [];
    mNext.style.backgroundImage = "url(\"" + sheetFor(genderF, backView) + "\")";
    setFigure(mNext, item);
    if (reduced) {
      modelEl.classList.toggle("back", backView);
      mNext.style.backgroundImage = "";
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
      modelEl.classList.toggle("back", backView);
      mNext.style.backgroundImage = "";
      setFigure(mCur, item);
      mCur.style.opacity = "1";
      scanAnims.forEach(function (a) { a.cancel(); });
      scanAnims = [];
    };
  }
  fbOne.addEventListener("click", function () { flipView(!backView); });

  /* ---------------- gender switch (Homme / Femme) ---------------- */
  var genderF = false;
  var gHomme = $("#gHomme"), gFemme = $("#gFemme");
  /* The size button changes the character: each size is the same man
     at a different width (sheets model-sheet-size-<key>.webp). */
  var sizeKey = "m";
  var SIZE_KEYS = { S: "s", M: "m", L: "l", XL: "xl", XXL: "xxl" };
  function sheetFor(f, back) {
    if (f) return back ? "assets/model-sheet-f-back-full.webp" : "assets/model-sheet-f-full.webp";
    return "assets/model-sheet-size-" + sizeKey + (back ? "-back.webp" : ".webp");
  }
  function applySize() {
    modelEl.classList.remove("sz-s", "sz-m", "sz-l", "sz-xl", "sz-xxl");
    modelEl.classList.add("sz-" + sizeKey);
  }
  function swapSize() {
    zoomReset();
    var item = ITEMS[shown];
    scanAnims.forEach(function (x) { x.cancel(); });
    scanAnims = [];
    mNext.style.backgroundImage = "url(\"" + sheetFor(genderF, backView) + "\")";
    setFigure(mNext, item);
    if (reduced) {
      applySize();
      mNext.style.backgroundImage = "";
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
      applySize();
      mNext.style.backgroundImage = "";
      setFigure(mCur, item);
      mCur.style.opacity = "1";
      scanAnims.forEach(function (x) { x.cancel(); });
      scanAnims = [];
    };
  }
  function setGender(f) {
    if (f === genderF) return;
    zoomReset();
    genderF = f;
    gHomme.classList.toggle("act", !f);
    gFemme.classList.toggle("act", f);
    var item = ITEMS[shown];
    scanAnims.forEach(function (a) { a.cancel(); });
    scanAnims = [];
    mNext.style.backgroundImage = "url(\"" + sheetFor(genderF, backView) + "\")";
    setFigure(mNext, item);
    if (reduced) {
      modelEl.classList.toggle("f", genderF);
      mNext.style.backgroundImage = "";
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
      modelEl.classList.toggle("f", genderF);
      mNext.style.backgroundImage = "";
      setFigure(mCur, item);
      mCur.style.opacity = "1";
      scanAnims.forEach(function (a) { a.cancel(); });
      scanAnims = [];
    };
  }
  gHomme.addEventListener("click", function () { setGender(false); });
  gFemme.addEventListener("click", function () { setGender(true); });

  /* ---------------- size chips — the size changes the character ---------------- */
  function setSize(label, instant) {
    var key = SIZE_KEYS[label] || "m";
    Array.prototype.forEach.call(document.querySelectorAll(".sizeRow .chip"), function (c) {
      c.classList.toggle("act", c.textContent.trim() === label);
    });
    if (key === sizeKey) { applySize(); return; }
    sizeKey = key;
    if (instant || genderF) { applySize(); return; }
    swapSize();
  }
  Array.prototype.forEach.call(document.querySelectorAll(".sizeRow .chip"), function (ch) {
    ch.addEventListener("click", function () { setSize(ch.textContent.trim(), false); });
  });

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
      target += N; // full lap — lands back on the same garment
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (ch) {
    ch.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (x) { x.classList.remove("act"); });
      ch.classList.add("act");
    });
  });
  var infoBtn = $("#infoBtn");
  if (infoBtn) infoBtn.addEventListener("click", function () { sheet.hidden = false; });
  $("#sheetX").addEventListener("click", function () { sheet.hidden = true; });
  sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.hidden = true; });
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
    var t0 = e.target;
    cur.classList.toggle("dark", !!(t0.closest && t0.closest(".cartPage")));
    if (!dragging) {
      var t = e.target;
      if (t.closest && t.closest(".card")) setCurState("try");
      else if (t.closest && t.closest("button")) setCurState("btn");
      else if (t.closest && t.closest(".stage")) setCurState("drag");
      else setCurState("");
    }
  });
  document.addEventListener("pointerdown", function () { pressed = true; ringScale(); });
  document.addEventListener("pointerup", function () { pressed = false; ringScale(); });

  /* ---------------- drag / click ---------------- */
  var dragId = null, startX = 0, p0 = 0, lastX = 0, lastT = 0, vel = 0, moved = 0, downCard = null;
  stage.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
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
    if (dragId !== e.pointerId) return;
    dragId = null;
    dragging = false;
    if (moved < 6) {
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

  /* ---------------- wheel / keys ---------------- */
  var wAcc = 0, wLast = 0;
  window.addEventListener("wheel", function (e) {
    if (e.ctrlKey) return; // ctrl+wheel is the pinch-zoom gesture, handled below
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


  /* ---------------- character zoom (pinch / ctrl+wheel) ----------------
     Free zoom on the model only: two fingers pinch, ctrl+wheel zooms,
     and while zoomed in, one finger pans the character instead of
     turning the arc. Every switch (hoodie, front/back, Homme/Femme)
     resets the zoom to the default place (zoomReset, called above). */
  var zoomS = 1, zoomX = 0, zoomY = 0;
  var zPointers = new Map();
  var pinchD0 = 0, pinchS0 = 1, pinchMX = null, pinchMY = null;
  var panId = null, panLX = 0, panLY = 0;

  function zoomApply(anim) {
    modelEl.style.transition = anim ? "transform .45s cubic-bezier(.22,.9,.26,1)" : "none";
    modelEl.style.transform = "translateX(-50%) translate(" + zoomX + "px," + zoomY + "px) scale(" + zoomS + ")";
  }
  function zoomClamp() {
    if (zoomS <= 1) { zoomS = 1; zoomX = 0; zoomY = 0; return; }
    var mx = modelEl.offsetWidth * (zoomS - 1) * 0.55;
    var my = modelEl.offsetHeight * (zoomS - 1) * 0.55;
    zoomX = Math.min(mx, Math.max(-mx, zoomX));
    zoomY = Math.min(my, Math.max(-my, zoomY));
  }
  function zoomOriginAt(cx, cy) {
    var r = modelEl.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var fx = Math.min(1, Math.max(0, (cx - r.left) / r.width));
    var fy = Math.min(1, Math.max(0, (cy - r.top) / r.height));
    modelEl.style.transformOrigin = (fx * 100) + "% " + (fy * 100) + "%";
  }
  function zoomReset() {
    if (zoomS === 1 && zoomX === 0 && zoomY === 0) return;
    zoomS = 1; zoomX = 0; zoomY = 0;
    panId = null;
    modelEl.style.transformOrigin = "50% 50%";
    zoomApply(true);
    window.setTimeout(function () { modelEl.style.transition = "none"; }, 480);
  }

  stage.addEventListener("pointerdown", function (e) {
    zPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (zPointers.size === 2) {
      dragId = null; dragging = false; // pinch wins over the arc drag
      var pts = Array.from(zPointers.values());
      pinchD0 = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      pinchS0 = zoomS;
      pinchMX = (pts[0].x + pts[1].x) / 2;
      pinchMY = (pts[0].y + pts[1].y) / 2;
      zoomOriginAt(pinchMX, pinchMY);
    } else if (zPointers.size === 1 && zoomS > 1) {
      dragId = null; dragging = false; // zoomed: one finger pans the character
      panId = e.pointerId; panLX = e.clientX; panLY = e.clientY;
    }
  });
  stage.addEventListener("pointermove", function (e) {
    if (!zPointers.has(e.pointerId)) return;
    zPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (zPointers.size === 2) {
      var pts = Array.from(zPointers.values());
      var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      zoomS = Math.min(3, Math.max(1, pinchS0 * d / pinchD0));
      var mx2 = (pts[0].x + pts[1].x) / 2, my2 = (pts[0].y + pts[1].y) / 2;
      if (pinchMX !== null) { zoomX += mx2 - pinchMX; zoomY += my2 - pinchMY; }
      pinchMX = mx2; pinchMY = my2;
      zoomClamp(); zoomApply(false);
    } else if (panId === e.pointerId && zoomS > 1) {
      zoomX += e.clientX - panLX; zoomY += e.clientY - panLY;
      panLX = e.clientX; panLY = e.clientY;
      zoomClamp(); zoomApply(false);
    }
  });
  function zEnd(e) {
    zPointers.delete(e.pointerId);
    if (zPointers.size < 2) { pinchMX = null; pinchMY = null; }
    if (panId === e.pointerId) panId = null;
    if (zPointers.size === 1 && zoomS > 1) {
      var ent = Array.from(zPointers.entries())[0];
      panId = ent[0]; panLX = ent[1].x; panLY = ent[1].y; // remaining finger takes over the pan
      dragId = null; dragging = false;
    }
  }
  stage.addEventListener("pointerup", zEnd);
  stage.addEventListener("pointercancel", zEnd);
  window.addEventListener("wheel", function (e) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    zoomOriginAt(e.clientX, e.clientY);
    zoomS = Math.min(3, Math.max(1, zoomS * (e.deltaY < 0 ? 1.12 : 0.89)));
    zoomClamp(); zoomApply(false);
  }, { passive: false });

  /* ---------------- layout ---------------- */
  function layout() {
    W = window.innerWidth;
    H = window.innerHeight;
    CW = isPhone() ? Math.min(W * 0.30, 170) : Math.min(W * 0.148, H * 0.33);
    document.documentElement.style.setProperty("--CW", CW + "px");
    var f = isPhone() ? [0, 0.36, 0.5, 0.56, 0.6, 0.62] : [0, 0.215, 0.345, 0.432, 0.49, 0.52];
    XSpx = f.map(function (v) { return v * W; });
    movePill(activeTab);
  }
  window.addEventListener("resize", layout);

  function xAt(a) {
    if (a >= 5) return XSpx[5];
    var s = Math.floor(a), fr = a - s;
    return XSpx[s] + (XSpx[s + 1] - XSpx[s]) * fr;
  }

  /* ---------------- main loop — the arc maths ---------------- */
  var lastNow = 0;
  function r2(v) { return Math.round(v * 100) / 100; }
  function putT(el, str) { if (el._tf !== str) { el._tf = str; el.style.transform = str; } }
  function frame(now) {
    var t = now / 1000;

    /* cursor first, with frame-rate independent smoothing (same feel at 30/60/120 Hz) */
    var dtF = lastNow ? Math.min(3, Math.max(0.25, (now - lastNow) / 16.667)) : 1;
    lastNow = now;
    var ck = 1 - Math.pow(0.78, dtF);
    cx += (mx - cx) * ck;
    cy += (my - cy) * ck;
    putT(cur, "translate3d(" + r2(cx) + "px, " + r2(cy) + "px, 0) translate(-50%, -50%)");

    /* cart open: the home stage is fully hidden behind it — pause its animation
       so the cursor (and the cart itself) get the whole frame budget */
    if (cartPage && !cartPage.hidden) { requestAnimationFrame(frame); return; }

    if (!dragging) pos = reduced ? target : pos + (target - pos) * 0.11;
    if (intro < 1) intro = Math.min(1, intro + 0.012);
    var ie = reduced ? 1 : 1 - Math.pow(1 - intro, 3);

    sx += (tx - sx) * 0.06;
    sy += (ty - sy) * 0.06;

    putT(room, "translate3d(" + r2(-sx * 22) + "px, " + r2(-sy * 14) + "px, 0) scale(" + r2(1.08 - 0.03 * ie) + ")");
    putT(ghost, "translate(calc(-50% + " + r2(-sx * 40) + "px), " + r2(-sy * 16) + "px)");
    letters.forEach(function (el, i) {
      putT(el, "translateY(" + r2((1 - ie) * (60 + 30 * i)) + "px)");
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
      putT(card,
        "translate(" + r2(x) + "px, " + r2(y) + "px) perspective(1300px) translateZ(" + r2(z) + "px)" +
        " rotateY(" + r2(ry) + "deg) rotateX(" + r2(-sy * 6) + "deg) scale(" + r2(s * (0.6 + 0.4 * ie)) + ")");
      var opR = Math.round(op * 1000) / 1000;
      if (card._op !== opR) { card._op = opR; card.style.opacity = opR; }
      var zi = a < 1 ? 1 : Math.round(100 - 10 * a);
      if (card._z !== zi) { card._z = zi; card.style.zIndex = zi; }
      var fs = blur > 0.01 ? "blur(" + r2(blur) + "px)" : "";
      if (card._f !== fs) { card._f = fs; card.style.filter = fs; }
      var vs = op < 0.01 ? "hidden" : "visible";
      if (card._v !== vs) { card._v = vs; card.style.visibility = vs; }
    }

    if (!dragging && Math.abs(target - pos) < 0.02) {
      var idx = mod(Math.round(target), N);
      if (idx !== shown) tryOn(idx);
    }

    requestAnimationFrame(frame);
  }


  /* ---------------- language (all texts live in js/lang.js) ---------------- */
  var langTx = $("#langTx");
  function applyLang() {
    L = window.LANGS[window.LANG] || window.LANGS.fr;
    document.documentElement.lang = window.LANG;
    document.documentElement.dir = "ltr";
    document.title = L.ui.title;
    if (langTx) langTx.textContent = window.LANG === "ar" ? "عربي" : window.LANG.toUpperCase();
    gHomme.textContent = L.ui.homme;
    gFemme.textContent = L.ui.femme;
    tabs.forEach(function (b) { b.textContent = L.ui.tops; });
    var rl = document.querySelectorAll(".rail .rlabel");
    if (rl[0]) rl[0].textContent = L.ui.tops;
    if (rl[1]) rl[1].textContent = L.ui.cart;
    if (rl[2]) rl[2].textContent = L.ui.calendar;
    if (rl[3]) rl[3].textContent = L.ui.profile;
    var lbl = document.querySelector(".sizeRow .lbl");
    if (lbl) lbl.textContent = L.ui.size;
    if (buyBtn) buyBtn.textContent = L.ui.addToCart;
    if (sheetBuy) sheetBuy.textContent = L.ui.addToCart;
    var ib = $("#infoBtn");
    if (ib) ib.textContent = L.ui.moreInfo;
    fbOneTx.textContent = backView ? L.ui.front : L.ui.back;
    fbOne.setAttribute("aria-label", backView ? L.ui.seeFront : L.ui.seeBack);
    var ct = document.querySelector(".clab.try"), cd = document.querySelector(".clab.drag");
    if (ct) ct.textContent = L.ui.tryOn;
    if (cd) cd.textContent = L.ui.drag;
    cardNames.forEach(function (nm, k) { nm.textContent = L.items[k % N].n; });
    cartTexts();
    profTexts();
    var cur = shown < 0 ? 0 : shown;
    updateBuy(ITEMS[cur], cur);
    movePill(activeTab);
  }
  var langBtn = $("#langBtn");
  if (langBtn) langBtn.addEventListener("click", function () {
    window.LANG = window.LANG === "fr" ? "en" : window.LANG === "en" ? "ar" : "fr";
    try { window.localStorage.setItem("lbs-lang", window.LANG); } catch (e) {}
    applyLang();
  });


  /* ---------------- cart — the clothing rail ----------------
     Selected hoodies hang on a chrome rail (the cart page, opened
     from the top-bar Cart button). The checkout sends the order to
     Omar: WhatsApp if ORDER_WHATSAPP is set, otherwise by email. */
  var ORDER_WHATSAPP = ""; // e.g. "2126XXXXXXXX" — empty means orders arrive by email
  var ORDER_EMAIL = "arhouneo14@gmail.com";
  var cartPage = $("#cartPage"), cpRack = $("#cpRack"), cpCap = $("#cpCap"),
      cpCapName = $("#cpCapName"), cpCapSub = $("#cpCapSub"),
      cpBadge = $("#cartBadge"), cpDet = $("#cpDet"), cpBig = $("#cpBig"),
      cpForm = $("#cpForm"), cpRailView = $("#cpRailView");
  var cart = [];
  try { cart = JSON.parse(window.localStorage.getItem("lbs-cart") || "[]"); } catch (e) { cart = []; }
  if (!Array.isArray(cart)) cart = [];
  var cpHov = -1, cpOpen = -1, cpBoxW = 150, cpGarments = [];
  var cpBack = false, cpFlipping = false;

  function cartSave() { try { window.localStorage.setItem("lbs-cart", JSON.stringify(cart)); } catch (e) {} }
  function cartCount() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (s, l) { return s + l.qty * ITEMS[l.i].p; }, 0); }
  function selSize() { var c = document.querySelector(".sizeRow .chip.act"); return c ? c.textContent.trim() : "M"; }
  function paintHanger(el, idx) {
    // generated hanger pictures, background removed (transparent)
    el.style.backgroundImage = 'url("assets/cart-nobg-' + (idx + 1) + '.webp")';
    el.style.backgroundSize = "contain";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
  }
  function paintHangerBack(el, idx) {
    // generated back-view hanger pictures, background removed (transparent)
    el.style.backgroundImage = 'url("assets/cart-nobg-back-' + (idx + 1) + '.webp")';
    el.style.backgroundSize = "contain";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
  }
  function paintRailHanger(el, idx) {
    // new hanger pictures, registered so the hook lands on the rail
    el.style.backgroundImage = 'url("assets/cart-rail-' + (idx + 1) + '.webp")';
    el.style.backgroundSize = "contain";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
  }
  function paintGarment(el, item) {
    el.style.backgroundImage = 'url("assets/garment-sheet.webp")';
    el.style.backgroundSize = "320% 212.5%";
    el.style.backgroundPosition = item.g[0] + "% " + item.g[1] + "%";
    el.style.backgroundRepeat = "no-repeat";
  }
  function cartBadgeUpdate(pulse) {
    var n = cartCount();
    cpBadge.hidden = n === 0;
    cpBadge.textContent = n;
    if (pulse && n > 0) { cpBadge.classList.remove("pulse"); void cpBadge.offsetWidth; cpBadge.classList.add("pulse"); }
  }
  function addToCart(idx) {
    var sz = selSize(), found = null;
    cart.forEach(function (l) { if (l.i === idx && l.size === sz) found = l; });
    if (found) found.qty++; else cart.push({ i: idx, size: sz, qty: 1 });
    cartSave(); cartBadgeUpdate(true);
  }
  var buyBtnEl = $("#buyBtn"), sheetBuyEl = $("#sheetBuy");
  function flashAdded(btn) {
    if (!btn) return;
    btn.textContent = L.ui.addedMsg;
    window.setTimeout(function () { btn.textContent = L.ui.addToCart; }, 950);
  }
  if (buyBtnEl) buyBtnEl.addEventListener("click", function (e) {
    e.preventDefault();
    addToCart(shown < 0 ? 0 : shown);
    flashAdded(buyBtnEl);
  });
  if (sheetBuyEl) sheetBuyEl.addEventListener("click", function (e) {
    e.preventDefault();
    addToCart(shown < 0 ? 0 : shown);
    sheet.hidden = true;
    flashAdded(buyBtnEl);
  });

  function cartTexts() {
    if (!cartPage) return;
    $("#cpTitle").textContent = L.ui.cartTitle;
    $("#cpBackTx").textContent = L.ui.retour;
    $("#cpEmptyT").textContent = L.ui.emptyCart;
    $("#cpEmptyH").textContent = L.ui.emptyHint;
    $("#cpDiscover").textContent = L.ui.discover;
    $("#cpTotalLbl").textContent = L.ui.total;
    $("#cpCheckout").textContent = L.ui.checkout;
    $("#cpDeliv").textContent = L.ui.deliveryFree;
    $("#cpClose").textContent = L.ui.close;
    $("#cpRemove").textContent = L.ui.remove;
    $("#cpFormTitle").textContent = L.ui.formTitle;
    $("#cpLblName").textContent = L.ui.fName;
    $("#cpLblPhone").textContent = L.ui.fPhone;
    $("#cpLblCity").textContent = L.ui.fCity;
    $("#cpLblAddr").textContent = L.ui.fAddress;
    $("#cpConfirm").textContent = L.ui.confirm;
    $("#cpFormBack").textContent = L.ui.retour;
    var cpft = $("#cpFlipTx");
    if (cpft) cpft.textContent = cpBack ? L.ui.front : L.ui.back;
    var half = L.ui.marquee.repeat(6);
    $("#cpBandTrack").innerHTML = '<span class="cpHalf">' + half + '</span><span class="cpHalf">' + half + "</span>";
    if (cpOpen >= 0 && cart[cpOpen]) cpFill(cpOpen);
    if (!cartPage.hidden && cpForm.hidden) cpLayout();
  }

  function cartRender() {
    cpRack.innerHTML = ""; cpGarments = [];
    cart.forEach(function (line, k) {
      var g = document.createElement("div");
      g.className = "cg";
      var iEl = document.createElement("i");
      var gimg = document.createElement("div");
      gimg.className = "gimg rail";
      paintRailHanger(gimg, line.i);
      iEl.appendChild(gimg);
      g.appendChild(iEl);
      g.addEventListener("pointerenter", function () {
        if (cpOpen < 0 && cpHov !== k) { cpHov = k; cpLayout(); }
      });
      g.addEventListener("click", function () {
        if (cpOpen >= 0) return;
        if (cpHov !== k) { cpHov = k; cpLayout(); } else cpOpenDetail(k);
      });
      cpRack.appendChild(g);
      cpGarments.push(g);
    });
    var empty = cart.length === 0;
    $("#cpEmpty").hidden = !empty;
    $("#cpBar").style.visibility = empty ? "hidden" : "visible";
    cpLayout();
  }

  function cpLayout() {
    var n = cart.length;
    $("#cpTotal").textContent = cartTotal() + " MAD";
    $("#cpCount").textContent = cartCount() ? String(cartCount()) : "";
    if (!n) { cpCap.classList.remove("on"); return; }
    var W = cpRack.clientWidth || window.innerWidth;
    cpBoxW = n <= 2 ? 196 : n === 3 ? 180 : n === 4 ? 165 : n === 5 ? 150 : 138;
    var slot = n <= 1 ? 0 : Math.min(118, (W - 16 - cpBoxW) / (n - 1));
    var openGap = Math.min(46, cpBoxW * 0.26);
    cart.forEach(function (line, k) {
      var g = cpGarments[k]; if (!g) return;
      var cx = W / 2 + (k - (n - 1) / 2) * slot;
      if (cpHov >= 0 && k !== cpHov) cx += Math.sign(k - cpHov) * openGap;
      g.style.left = cx + "px";
      var phH = Math.round(cpBoxW * 1.22), phW = Math.round(phH * 2 / 3), phTop = 38 - Math.round(phH * 0.0604);
      var gim = g.querySelector(".gimg");
      if (gim) { gim.style.width = phW + "px"; gim.style.height = phH + "px"; gim.style.top = phTop + "px"; }
      g.dataset.pbottom = phTop + phH;
      g.style.width = cpBoxW + "px";
      g.style.height = cpBoxW + "px";
      g.style.zIndex = k === cpHov ? 5 : k;
      g.classList.toggle("face", k === cpHov);
      g.dataset.cx = cx;
    });
    if (cpHov >= 0 && cart[cpHov]) {
      var line = cart[cpHov];
      cpCapName.textContent = L.items[line.i].n;
      cpCapSub.textContent = ITEMS[line.i].p + " MAD · " + L.ui.size + " " + line.size + (line.qty > 1 ? " · ×" + line.qty : "");
      cpCap.style.left = cpGarments[cpHov].style.left;
      cpCap.style.top = (40 + (Number(cpGarments[cpHov].dataset.pbottom) || cpBoxW) + 16) + "px";
      cpCap.classList.add("on");
    } else cpCap.classList.remove("on");
  }

  function cpFill(k) {
    var line = cart[k];
    $("#cpNum").textContent = ("0" + (k + 1)).slice(-2) + " / " + ("0" + cart.length).slice(-2);
    $("#cpName").textContent = L.items[line.i].n;
    $("#cpPrice").textContent = ITEMS[line.i].p + " MAD";
    $("#cpSizeLine").textContent = L.ui.size + " : " + line.size;
    $("#cpQVal").textContent = line.qty;
  }
  var cpFlipBtn = $("#cpFlip");
  function cpPaintBig() {
    if (cpBack) paintHangerBack(cpBig, cart[cpOpen].i); else paintHanger(cpBig, cart[cpOpen].i);
    var tx = $("#cpFlipTx");
    if (tx) tx.textContent = cpBack ? L.ui.front : L.ui.back;
    if (cpFlipBtn) cpFlipBtn.setAttribute("aria-label", cpBack ? L.ui.seeFront : L.ui.seeBack);
  }
  function cpFlip() {
    if (cpOpen < 0 || cpFlipping) return;
    cpFlipping = true;
    try { cpBig.getAnimations().forEach(function (an) { an.cancel(); }); } catch (e) {}
    cpBig.style.opacity = "1";
    cpBig.animate([
      { transform: "rotateY(0deg)", opacity: 1 },
      { transform: "rotateY(88deg)", opacity: .3, offset: .45 },
      { transform: "rotateY(0deg)", opacity: 1 }
    ], { duration: 480, easing: "ease-in-out" });
    window.setTimeout(function () { cpBack = !cpBack; cpPaintBig(); }, 215);
    window.setTimeout(function () { cpFlipping = false; }, 500);
  }
  function cpOpenDetail(k) {
    cpOpen = k; cpHov = k; cpBack = false; cpLayout();
    cpFill(k);
    cpPaintBig();
    cpDet.hidden = false;
    cpRailView.classList.add("dimmed");
    var g = cpGarments[k];
    var gx = parseFloat(g.dataset.cx || window.innerWidth / 2);
    var bigW = cpBig.offsetWidth || 300;
    try { cpBig.getAnimations().forEach(function (an) { an.cancel(); }); } catch (e) {}
    cpBig.style.opacity = "1";
    cpBig.animate([
      { transform: "translate(" + (gx - window.innerWidth / 2) + "px, -10px) scale(" + (cpBoxW / bigW) + ")", opacity: 1 },
      { transform: "translate(0px, 0px) scale(1)", opacity: 1 }
    ], { duration: 750, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
    g.style.visibility = "hidden";
  }
  function cpStep(d) {
    if (cpOpen < 0 || cart.length < 2) return;
    var from = cpOpen;
    cpOpen = (cpOpen + d + cart.length) % cart.length;
    cpGarments[from].style.visibility = "";
    cpGarments[cpOpen].style.visibility = "hidden";
    cpHov = cpOpen; cpBack = false; cpLayout();
    cpFill(cpOpen);
    cpPaintBig();
    try { cpBig.getAnimations().forEach(function (an) { an.cancel(); }); } catch (e) {}
    cpBig.animate([
      { transform: "translate(" + (d * 110) + "px, 0px) scale(.94)", opacity: 0 },
      { transform: "translate(0px, 0px) scale(1)", opacity: 1 }
    ], { duration: 550, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
  }
  function cpCloseDetail() {
    if (cpOpen < 0) return;
    var k = cpOpen, g = cpGarments[k];
    var gx = parseFloat(g.dataset.cx || window.innerWidth / 2);
    var bigW = cpBig.offsetWidth || 300;
    cpRailView.classList.remove("dimmed");
    try { cpBig.getAnimations().forEach(function (an) { an.cancel(); }); } catch (e) {}
    cpBig.animate([
      { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
      { transform: "translate(" + (gx - window.innerWidth / 2) + "px, -10px) scale(" + (cpBoxW / bigW) + ")", opacity: 1 }
    ], { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
    window.setTimeout(function () {
      cpDet.hidden = true;
      g.style.visibility = "";
      cpOpen = -1; cpHov = -1; cpBack = false;
      cpLayout();
    }, 660);
  }
  $("#cpPrev").addEventListener("click", function () { cpStep(-1); });
  $("#cpNext").addEventListener("click", function () { cpStep(1); });
  if (cpFlipBtn) cpFlipBtn.addEventListener("click", cpFlip);
  $("#cpClose").addEventListener("click", cpCloseDetail);
  $("#cpHit").addEventListener("click", cpCloseDetail);
  $("#cpQPlus").addEventListener("click", function () {
    if (cpOpen < 0) return;
    cart[cpOpen].qty++; cartSave(); cpFill(cpOpen); cpLayout(); cartBadgeUpdate(false);
  });
  $("#cpQMinus").addEventListener("click", function () {
    if (cpOpen < 0) return;
    if (cart[cpOpen].qty > 1) cart[cpOpen].qty--;
    cartSave(); cpFill(cpOpen); cpLayout(); cartBadgeUpdate(false);
  });
  $("#cpRemove").addEventListener("click", function () {
    if (cpOpen < 0) return;
    cart.splice(cpOpen, 1);
    cartSave(); cartBadgeUpdate(false);
    cpDet.hidden = true;
    cpRailView.classList.remove("dimmed");
    cpOpen = -1; cpHov = -1;
    cartRender();
  });

  function cpShowView(which) {
    cpRailView.hidden = which !== "rail";
    cpForm.hidden = which !== "form";
  }
  $("#cartBtn").addEventListener("click", function () {
    cartPage.hidden = false;
    cpDet.hidden = true; cpOpen = -1; cpHov = -1;
    cpRailView.classList.remove("dimmed");
    cpShowView("rail");
    cartRender();
  });
  $("#cpBack").addEventListener("click", function () {
    if (!cpForm.hidden) { cpShowView("rail"); cartRender(); return; }
    if (cpOpen >= 0) { cpCloseDetail(); return; }
    cartPage.hidden = true;
  });
  $("#cpDiscover").addEventListener("click", function () { cartPage.hidden = true; });
  $("#cpCheckout").addEventListener("click", function () {
    if (!cart.length) return;
    var html = "";
    cart.forEach(function (l) {
      html += '<div class="cpSumLine"><span>' + L.items[l.i].n + " · " + l.size + " ×" + l.qty + "</span><b>" + (ITEMS[l.i].p * l.qty) + " MAD</b></div>";
    });
    html += '<div class="cpSumLine cpSumTotal"><span>' + L.ui.total + "</span><b>" + cartTotal() + " MAD</b></div>";
    html += '<div class="cpSumDeliv">' + L.ui.deliveryFree + "</div>";
    $("#cpSummary").innerHTML = html;
    cpShowView("form");
  });
  $("#cpFormBack").addEventListener("click", function () { cpShowView("rail"); cartRender(); });
  $("#cpConfirm").addEventListener("click", function () {
    var nameEl = $("#cpInName"), phoneEl = $("#cpInPhone");
    var name = nameEl.value.trim(), phone = phoneEl.value.trim();
    var city = $("#cpInCity").value.trim(), addr = $("#cpInAddr").value.trim();
    if (!name) { nameEl.focus(); return; }
    if (!phone) { phoneEl.focus(); return; }
    var lines = ["LBS — " + L.ui.cartTitle, ""];
    cart.forEach(function (l) {
      lines.push("• " + L.items[l.i].n + " — " + L.ui.size + " " + l.size + " ×" + l.qty + " — " + (ITEMS[l.i].p * l.qty) + " MAD");
    });
    lines.push("", L.ui.total + " : " + cartTotal() + " MAD", L.ui.deliveryFree, "",
      L.ui.fName + " : " + name, L.ui.fPhone + " : " + phone, L.ui.fCity + " : " + city, L.ui.fAddress + " : " + addr);
    var text = lines.join("\n");
    if (ORDER_WHATSAPP) window.open("https://wa.me/" + ORDER_WHATSAPP + "?text=" + encodeURIComponent(text), "_blank");
    else window.location.href = "mailto:" + ORDER_EMAIL + "?subject=" + encodeURIComponent("LBS — Commande / Order") + "&body=" + encodeURIComponent(text);
  });
  document.addEventListener("keydown", function (e) {
    if (cartPage.hidden) return;
    if (e.key === "Escape") { if (cpOpen >= 0) cpCloseDetail(); else cartPage.hidden = true; }
    else if (cpOpen >= 0 && e.key === "ArrowRight") cpStep(1);
    else if (cpOpen >= 0 && e.key === "ArrowLeft") cpStep(-1);
  });
  window.addEventListener("resize", function () { if (!cartPage.hidden) cpLayout(); });
  cartBadgeUpdate(false);


  /* ---------------- profile — phone profile + questions ----------------
     Saved on this device only (localStorage "lbs-profile"). The forme
     picks the character's body; taille + poids recommend the size
     chip. No account, no server. The Profile button reopens it. */
  var profPage = $("#profPage");
  var profile = null;
  try { profile = JSON.parse(window.localStorage.getItem("lbs-profile") || "null"); } catch (e) { profile = null; }
  if (profile && profile.sexe !== "f") profile.forme = "droit";
  var HEIGHTS = ["<160", "160\u2013170", "170\u2013180", "180\u2013190", ">190"];
  var WEIGHTS = ["<60", "60\u201375", "75\u201390", "90\u2013105", ">105"];
  var SIZE_TABLE = [["S", "S", "M", "L", "XL"], ["S", "M", "M", "L", "XL"], ["M", "M", "L", "L", "XXL"], ["M", "L", "L", "XL", "XXL"], ["L", "L", "XL", "XXL", "XXL"]];
  var draft = null;

  function profSetSize(animate) {
    if (!profile || profile.skip) return;
    var sz = SIZE_TABLE[profile.taille != null ? profile.taille : 2][profile.poids != null ? profile.poids : 1];
    setSize(sz, !animate);
  }
  function applyProfileInit() {
    if (!profile || profile.skip) return;
    if (profile.sexe === "f") {
      genderF = true;
      modelEl.classList.add("f");
      gHomme.classList.remove("act");
      gFemme.classList.add("act");
    }
    profSetSize();
  }
  function applyProfile() {
    if (!profile || profile.skip) return;
    if (profile.sexe === "f") {
      if (!genderF) setGender(true);
    } else {
      if (genderF) setGender(false);
    }
    profSetSize(true);
  }
  function chipRow(el, labels, curVal, onPick) {
    el.innerHTML = "";
    labels.forEach(function (lb, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pchip" + (i === curVal ? " act" : "");
      b.textContent = lb;
      b.addEventListener("click", function () { onPick(i); });
      el.appendChild(b);
    });
  }
  function renderProf() {
    if (!draft) return;
    chipRow($("#profSexe"), [L.ui.homme, L.ui.femme], draft.sexe === "f" ? 1 : 0, function (i) {
      draft.sexe = i === 1 ? "f" : "h";
      draft.forme = draft.sexe === "f" ? "sablier" : (draft.forme === "sablier" ? "droit" : draft.forme);
      renderProf();
    });
    if (draft.sexe === "f") {
      chipRow($("#profForme"), [L.ui.shSablier], 0, function () {});
      $("#profSoon").hidden = false;
    } else {
      var keys = ["droit"];
      var labels = [L.ui.shDroit];
      chipRow($("#profForme"), labels, Math.max(0, keys.indexOf(draft.forme)), function (i) {
        draft.forme = keys[i];
        renderProf();
      });
      $("#profSoon").hidden = true;
    }
    chipRow($("#profHeight"), HEIGHTS, draft.taille, function (i) { draft.taille = i; renderProf(); });
    chipRow($("#profWeight"), WEIGHTS, draft.poids, function (i) { draft.poids = i; renderProf(); });
  }
  function profTexts() {
    if (!profPage) return;
    $("#profTitle").textContent = L.ui.profTitle;
    $("#profSub").textContent = L.ui.profSub;
    $("#profNameLbl").textContent = L.ui.profName;
    $("#profSexeLbl").textContent = L.ui.homme + " / " + L.ui.femme;
    $("#profFormeLbl").textContent = L.ui.qForme;
    $("#profHeightLbl").textContent = L.ui.qHeight;
    $("#profWeightLbl").textContent = L.ui.qWeight;
    $("#profSoon").textContent = L.ui.profSoon;
    $("#profSave").textContent = L.ui.profSave;
    $("#profLater").textContent = L.ui.profLater;
    renderProf();
  }
  function openProf() {
    var p = (profile && !profile.skip) ? profile : null;
    draft = {
      sexe: p ? p.sexe : "h",
      forme: p ? (p.forme || "droit") : "droit",
      taille: p && p.taille != null ? p.taille : 2,
      poids: p && p.poids != null ? p.poids : 1
    };
    $("#profName").value = p ? (p.name || "") : "";
    profTexts();
    profPage.hidden = false;
  }
  function closeProf(skipMark) {
    profPage.hidden = true;
    if (skipMark && !profile) {
      profile = { skip: 1 };
      try { window.localStorage.setItem("lbs-profile", JSON.stringify(profile)); } catch (e) {}
    }
    draft = null;
  }
  $("#profBtn").addEventListener("click", openProf);
  $("#profX").addEventListener("click", function () { closeProf(!profile || !!profile.skip); });
  $("#profLater").addEventListener("click", function () { closeProf(true); });
  $("#profSave").addEventListener("click", function () {
    if (!draft) return;
    profile = {
      name: $("#profName").value.trim(),
      sexe: draft.sexe, forme: draft.forme, taille: draft.taille, poids: draft.poids
    };
    try { window.localStorage.setItem("lbs-profile", JSON.stringify(profile)); } catch (e) {}
    closeProf(false);
    applyProfile();
  });

  /* ---------------- init ---------------- */
  setGarmentBg(thumbG, ITEMS[0]);
  applyLang();
  applySize();
  applyProfileInit();
  if (!profile) window.setTimeout(openProf, 900);
  layout();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { movePill(activeTab); });
  }
  requestAnimationFrame(frame);
})();

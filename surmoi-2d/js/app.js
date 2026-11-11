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

  function updateBuy(item) {
    rollText(nameLn, item.n);
    if (buyBtn) { buyBtn.href = item.u; }
    if (sheetBuy) { sheetBuy.href = item.u; }
    if (sheetName) { sheetName.textContent = item.n; sheetPrice.textContent = item.p + " MAD · " + item.c[0][0]; sheetDesc.textContent = item.d || ""; }
    rollText(priceLn, item.p + " MAD · " + item.c[0][0]);
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
    shown = idx;
    var item = ITEMS[idx];
    updateBuy(item);
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
    backView = toBack;
    fbOneTx.textContent = backView ? "Front" : "Back";
    fbOne.setAttribute("aria-label", backView ? "See the front" : "See the back");
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
  function sheetFor(f, back) {
    if (f) return back ? "assets/model-sheet-f-back-test.webp" : "assets/model-sheet-f-test.webp"; /* TEST sheet until the real femme sheets land */
    return back ? "assets/model-sheet-back-6.webp" : "assets/model-sheet-6.webp";
  }
  function setGender(f) {
    if (f === genderF) return;
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
    movePill(activeTab);
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
  setGarmentBg(thumbG, ITEMS[0]);
  layout();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { movePill(activeTab); });
  }
  requestAnimationFrame(frame);
})();

(function(){
  "use strict";

  /* ---------------- DMC palette ---------------- */
  var PALETTE = window.KS_PALETTE;

  /* One mark per thread, for a black-and-white chart. Letters and the plain
     printer's symbols on purpose: the PDF is written with the standard PDF
     fonts, which know nothing of ● or ▲ and printed them as gibberish, and
     these are what bought charts use anyway. I, O, 0 and 1 are left out —
     too easy to confuse with each other at this size. */
  /* One mark per thread, for a black-and-white chart. They are drawn rather
     than typed: the PDF is written with the standard PDF fonts, which know
     nothing of ● or ▲ and print them as gibberish, so every symbol here is
     a little piece of line art that the screen, the PDF and the printed
     sheet all draw the same way.
     Each shape lives in a 0..1 box:
       ["c", cx, cy, r, "f"|"s"]   circle
       ["r", x, y, w, h, "f"|"s"]  rectangle
       ["p", [[x,y],...], "f"|"s"] closed polygon
       ["l", x1, y1, x2, y2]       line  */
  function starPoints(cx, cy, outer, inner, n){
    var pts = [];
    for (var i = 0; i < n*2; i++){
      var r = i % 2 ? inner : outer;
      var a = -Math.PI/2 + i*Math.PI/n;
      pts.push([cx + Math.cos(a)*r, cy + Math.sin(a)*r]);
    }
    return pts;
  }
  function ringPoints(cx, cy, r, n, turn){
    var pts = [];
    for (var i = 0; i < n; i++){
      var a = (turn || 0) + i*2*Math.PI/n;
      pts.push([cx + Math.cos(a)*r, cy + Math.sin(a)*r]);
    }
    return pts;
  }
  var STAR = starPoints(0.5, 0.5, 0.44, 0.18, 5);
  var HEX = ringPoints(0.5, 0.5, 0.42, 6, -Math.PI/2);
  var DIAMOND = [[0.5,0.1],[0.9,0.5],[0.5,0.9],[0.1,0.5]];
  var SYMBOLS = [
    [["c",0.5,0.5,0.34,"f"]],
    [["c",0.5,0.5,0.34,"s"]],
    [["r",0.18,0.18,0.64,0.64,"f"]],
    [["r",0.18,0.18,0.64,0.64,"s"]],
    [["p",[[0.5,0.14],[0.9,0.84],[0.1,0.84]],"f"]],
    [["p",[[0.5,0.14],[0.9,0.84],[0.1,0.84]],"s"]],
    [["p",[[0.1,0.16],[0.9,0.16],[0.5,0.86]],"f"]],
    [["p",[[0.1,0.16],[0.9,0.16],[0.5,0.86]],"s"]],
    [["p",DIAMOND,"f"]],
    [["p",DIAMOND,"s"]],
    [["l",0.15,0.15,0.85,0.85],["l",0.85,0.15,0.15,0.85]],
    [["l",0.5,0.12,0.5,0.88],["l",0.12,0.5,0.88,0.5]],
    [["c",0.5,0.5,0.36,"s"],["c",0.5,0.5,0.14,"f"]],
    [["r",0.18,0.18,0.64,0.64,"s"],["c",0.5,0.5,0.13,"f"]],
    [["r",0.38,0.1,0.24,0.8,"f"]],
    [["r",0.1,0.38,0.8,0.24,"f"]],
    [["l",0.18,0.85,0.82,0.15]],
    [["l",0.18,0.15,0.82,0.85]],
    [["p",[[0.16,0.5],[0.86,0.14],[0.86,0.86]],"f"]],
    [["p",[[0.84,0.5],[0.14,0.14],[0.14,0.86]],"f"]],
    [["r",0.18,0.18,0.32,0.64,"f"],["r",0.18,0.18,0.64,0.64,"s"]],
    [["r",0.18,0.5,0.64,0.32,"f"],["r",0.18,0.18,0.64,0.64,"s"]],
    [["p",STAR,"f"]],
    [["p",STAR,"s"]],
    [["p",HEX,"f"]],
    [["p",HEX,"s"]],
    [["c",0.5,0.5,0.36,"s"],["l",0.26,0.26,0.74,0.74],["l",0.74,0.26,0.26,0.74]],
    [["c",0.5,0.5,0.36,"s"],["l",0.5,0.16,0.5,0.84],["l",0.16,0.5,0.84,0.5]],
    [["r",0.18,0.18,0.64,0.64,"s"],["l",0.26,0.26,0.74,0.74],["l",0.74,0.26,0.26,0.74]],
    [["r",0.18,0.18,0.64,0.64,"s"],["l",0.5,0.2,0.5,0.8],["l",0.2,0.5,0.8,0.5]],
    [["c",0.31,0.5,0.15,"f"],["c",0.69,0.5,0.15,"f"]],
    [["c",0.5,0.25,0.14,"f"],["c",0.27,0.72,0.14,"f"],["c",0.73,0.72,0.14,"f"]],
    [["l",0.14,0.66,0.5,0.26],["l",0.5,0.26,0.86,0.66]],
    [["l",0.14,0.34,0.5,0.74],["l",0.5,0.74,0.86,0.34]],
    [["r",0.3,0.3,0.4,0.4,"f"]],
    [["r",0.3,0.3,0.4,0.4,"s"]],
    [["c",0.5,0.5,0.38,"s"],["c",0.5,0.5,0.2,"s"]],
    [["p",DIAMOND,"s"],["c",0.5,0.5,0.13,"f"]],
    [["l",0.5,0.12,0.5,0.88],["l",0.19,0.3,0.81,0.7],["l",0.19,0.7,0.81,0.3]],
    [["c",0.5,0.5,0.2,"f"]]
  ];

  /* ---------------- sample heart ---------------- */
  var HEART = [
    "..##...##..",
    ".####.####.",
    "###########",
    "###########",
    ".#########.",
    "..#######..",
    "...#####...",
    "....###....",
    ".....#....."
  ];

  function sampleCells(w, h){
    var cells = {};
    var hw = HEART[0].length, hh = HEART.length;
    var ox = Math.max(0, Math.floor((w - hw) / 2));
    var oy = Math.max(0, Math.floor((h - hh) / 2));
    for (var y = 0; y < hh && y + oy < h; y++){
      for (var x = 0; x < hw && x + ox < w; x++){
        if (HEART[y][x] === "#") cells[(x+ox) + "-" + (y+oy)] = "3350";
      }
    }
    return cells;
  }

  /* ---------------- ready-made motif library ---------------- */
  /* ---------------- state ---------------- */
  var state = {
    width: 60,
    height: 60,
    cells: {},
    name: "",
    currentPatternId: null,
    cellSize: 22,
    aidaCount: 14,
    tool: "draw",
    selectedColor: "3350",
    stitchView: false,
    // Saumahamur: the chart is being stitched from rather than drawn on, and
    // every square ticked off lives in `done` (same keys as `cells`).
    progressOn: false,
    done: {},
    symbolsOn: false,
    printOn: false,
    isSample: true,
    backstitches: [],
    showFloss: false,
    lang: "is",
    theme: "system",
    shape: "rect",
    hoopCm: 15,
    pxPerCm: 96 / 2.54,
    bgColor: "#ffffff",
    coordsOn: false,
    // stitches the hoop shape is currently hiding (see clipToCircle)
    clipped: {},
    clippedBack: [],
    // the chart size the hoop was put over, so going back to the rectangle
    // returns to it instead of keeping the hoop's square
    rectSize: null,
    // "off" | "h" | "v" | "both" — mirrors every stroke about the centre
    mirror: "off"
  };
  var undoStack = [], redoStack = [];
  var downloads = null;
  var savedDocs = [];
  // The source image behind a "Búa til úr mynd" pattern, kept around so that
  // changing the grid size or aida count afterwards can re-sample it at the
  // new dimensions instead of just cropping/padding the old stitch grid.
  var lastGenImage = null;
  // The picture lying under the grid while she traces it, kept only for this
  // visit — it is a guide, not part of any pattern.
  var traceImage = null;

  /* ---------------- dom refs ---------------- */
  var el = {};
  ["patternName","widthInput","heightInput","sizeGroup","aidaCount","fabricSize","marginInput","fabricCut","zoomOut","zoomIn","zoomInput","actualSizeBtn",
   "shapeSwitch","hoopSizeWrap","hoopSize","mirrorSwitch",
   "calibrateToggleBtn","calibrateBox","calibrateBar","calibrateInput","calibrateSaveBtn","calibrateStatus",
   "bgColorInput","coordsToggle",
   "symbolsToggle","printToggle","toolDraw","toolErase","toolBackstitch","undoBtn","redoBtn","clearBtn",
   "toolFill","toolLine","toolRect","toolPick","fitBtn","stitchViewBtn",
   "flipHBtn","flipVBtn","rotateBtn","centerBtn",
   "toolSelect","selectionBar","selectionRow","selectionHint","selCopyBtn","selCutBtn","selDeleteBtn",
   "pasteBtn","stampFlipHBtn","stampFlipVBtn","stampRotateBtn","stampPlaceBtn","selCancelBtn",
   "paletteGrid","selectedSwatch","selectedCode","selectedName",
   "palettePanel","summarySwatch","summaryCode",
   "canvasScroll","canvasStack","gridCanvas","rulerCanvas",
   "progressBtn","progressBox","progressLine","progressFill","progressResetBtn",
   "legendTotal","legendList","flossToggle","swapBox","swapFrom","swapTo","swapBtn","swapStatus","saveBtn","saveAsBtn","newBtn","exportBtn","exportPdfBtn",
   "savedList","dbStatus","exportFileBtn","importFileBtn","importFileInput","exportAllBtn",
   "genTabImage","genTabLetters","genImagePane","genLettersPane",
   "genImageFile","genImageBtn","genImageStatus","genMaxColors","genImageFit","genImageCrop","genCropWrap",
   "genBright","genContrast","genBrightVal","genContrastVal","genResetAdjBtn","genOwnOnly",
   "traceToggle","traceOpacity","traceOpacityVal",
   "genWidth","genHeight","genSizeField",
   "myThreadsOnly","myThreadsEditBtn","myThreadsCount",
   "lettersInput","lettersFont","lettersHeight","lettersLineGap","lettersStatus",
   "langSwitch","themeSwitch","helpBtn","helpOverlay","helpBody","helpCloseBtn","genToggleDetails","moreToggleDetails","saveToggleDetails"
   ].forEach(function(id){ el[id] = document.getElementById(id); });

  var ctx = el.gridCanvas.getContext("2d");
  var rulerCtx = el.rulerCanvas ? el.rulerCanvas.getContext("2d") : null;

  /* ---------------- language & theme ---------------- */
  var STRINGS = window.KS_STRINGS;
  function t(key, vars){
    var s = (STRINGS[state.lang] && STRINGS[state.lang][key]) || STRINGS.is[key] || key;
    if (vars) Object.keys(vars).forEach(function(k){ s = s.split("{"+k+"}").join(vars[k]); });
    return s;
  }
  function applyStaticI18n(){
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(function(node){
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function(node){
      node.title = t(node.getAttribute("data-i18n-title"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(node){
      node.placeholder = t(node.getAttribute("data-i18n-placeholder"));
    });
    // Icon-only buttons carry their name here instead of as visible text.
    document.querySelectorAll("[data-i18n-aria]").forEach(function(node){
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria")));
    });
  }
  function effectiveTheme(){
    if (state.theme === "light" || state.theme === "dark") return state.theme;
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch(e){}
    return "light";
  }
  function applyTheme(){
    var root = document.documentElement;
    if (state.theme === "light") root.setAttribute("data-theme","light");
    else if (state.theme === "dark") root.setAttribute("data-theme","dark");
    else root.removeAttribute("data-theme");
    if (el.themeSwitch){
      var eff = effectiveTheme();
      el.themeSwitch.querySelectorAll("button").forEach(function(b){
        b.classList.toggle("active", b.getAttribute("data-theme-choice") === eff);
      });
    }
  }
  function setLang(lang){
    if (lang !== "is" && lang !== "en") return;
    state.lang = lang;
    try { localStorage.setItem("reitasaumur_lang", lang); } catch(e){}
    if (el.langSwitch) el.langSwitch.querySelectorAll("button").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    applyStaticI18n();
    updateFabricSize();
    updateSelectedCard();
    updateThreadTools();
    updateZoomLabel();
    renderCanvas();
    renderSavedList();
    [el.dbStatus, el.genImageStatus, el.lettersStatus, el.swapStatus].forEach(function(node){
      if (node && node.dataset.i18nKey) node.textContent = t(node.dataset.i18nKey, node.dataset.i18nVars ? JSON.parse(node.dataset.i18nVars) : null);
    });
  }
  function setTheme(theme){
    if (theme !== "light" && theme !== "dark") return;
    state.theme = theme;
    try { localStorage.setItem("reitasaumur_theme", theme); } catch(e){}
    applyTheme();
    // The canvas grid reads its colors from CSS variables at draw time, so
    // it must be redrawn explicitly whenever the theme changes — otherwise
    // it keeps its old colors until the next stitch is drawn.
    renderCanvas();
  }
  function clearDbStatus(){
    if (!el.dbStatus) return;
    el.dbStatus.textContent = "";
    el.dbStatus.dataset.i18nKey = "";
    el.dbStatus.dataset.i18nVars = "";
  }
  function setDbStatus(key, vars){
    if (!el.dbStatus) return;
    el.dbStatus.dataset.i18nKey = key;
    el.dbStatus.dataset.i18nVars = vars ? JSON.stringify(vars) : "";
    el.dbStatus.textContent = t(key, vars);
  }

  if (el.langSwitch) el.langSwitch.querySelectorAll("button").forEach(function(b){
    b.addEventListener("click", function(){ setLang(b.getAttribute("data-lang")); });
  });
  if (el.themeSwitch) el.themeSwitch.querySelectorAll("button").forEach(function(b){
    b.addEventListener("click", function(){ setTheme(b.getAttribute("data-theme-choice")); });
  });
  // Until a theme is picked explicitly the page follows the system setting —
  // so when that flips (e.g. at sunset) the canvas has to be repainted too,
  // since its grid colors are read from the CSS variables at draw time.
  try {
    var schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var onSchemeChange = function(){
      if (state.theme === "light" || state.theme === "dark") return;
      applyTheme();
      renderCanvas();
    };
    if (schemeQuery.addEventListener) schemeQuery.addEventListener("change", onSchemeChange);
    else if (schemeQuery.addListener) schemeQuery.addListener(onSchemeChange);
  } catch(e){}

  // Only one of the two toolbar dropdowns (generate pattern, more settings)
  // should be open at a time — opening one closes the other instead of
  // letting them stack on top of each other.
  var allDropdowns = [el.genToggleDetails, el.moreToggleDetails, el.saveToggleDetails].filter(Boolean);
  // A panel hangs from the left edge of its button, which runs off the screen
  // for the buttons on the right. Nudge it back just far enough to fit,
  // never past the left edge of the window.
  function positionDropdown(d){
    var panel = d.querySelector(".settings-content, .gen-toggle-content");
    if (!panel) return;
    panel.style.left = "0px";
    var rect = panel.getBoundingClientRect();
    var overflow = rect.right - (window.innerWidth - 10);
    if (overflow > 0){
      var hostLeft = d.getBoundingClientRect().left;
      panel.style.left = (-Math.min(overflow, Math.max(0, hostLeft - 10))) + "px";
    }
  }
  allDropdowns.forEach(function(d){
    d.addEventListener("toggle", function(){
      if (!d.open) return;
      allDropdowns.forEach(function(other){ if (other !== d) other.open = false; });
      positionDropdown(d);
    });
  });
  window.addEventListener("resize", function(){
    allDropdowns.forEach(function(d){ if (d.open) positionDropdown(d); });
  });
  // Clicking anywhere outside an open dropdown closes it (clicking inside it,
  // including its own toggle button, is left alone).
  document.addEventListener("click", function(ev){
    allDropdowns.forEach(function(d){
      if (d.open && !d.contains(ev.target)) d.open = false;
    });
  });

  /* ---------------- helpers ---------------- */
  function hexToRgb(hex){
    var v = hex.replace("#","");
    return { r: parseInt(v.substr(0,2),16), g: parseInt(v.substr(2,2),16), b: parseInt(v.substr(4,2),16) };
  }
  // A lighter or darker cousin of a colour: f > 1 lifts it, f < 1 darkens it.
  function shade(hex, f){
    var c = hexToRgb(hex);
    var cl = function(v){ return Math.max(0, Math.min(255, Math.round(v))); };
    return "rgb(" + cl(c.r*f) + "," + cl(c.g*f) + "," + cl(c.b*f) + ")";
  }
  function luminance(hex){
    var c = hexToRgb(hex);
    return (0.299*c.r + 0.587*c.g + 0.114*c.b) / 255;
  }
  function colorFor(code){
    for (var i=0;i<PALETTE.length;i++) if (PALETTE[i].c === code) return PALETTE[i];
    return null;
  }
  // on the chart (and in every picture made from it)
  function drawSymbolCanvas(targetCtx, idx, x, y, size, color){
    var ops = SYMBOLS[idx % SYMBOLS.length];
    if (!ops) return;
    targetCtx.save();
    targetCtx.translate(x, y);
    targetCtx.scale(size, size);
    targetCtx.fillStyle = color;
    targetCtx.strokeStyle = color;
    targetCtx.lineWidth = Math.max(0.09, 1.3 / size);
    targetCtx.lineCap = "round";
    targetCtx.lineJoin = "round";
    ops.forEach(function(op){
      var kind = op[0];
      targetCtx.beginPath();
      if (kind === "c"){
        targetCtx.arc(op[1], op[2], op[3], 0, Math.PI*2);
        if (op[4] === "f") targetCtx.fill(); else targetCtx.stroke();
      } else if (kind === "r"){
        targetCtx.rect(op[1], op[2], op[3], op[4]);
        if (op[5] === "f") targetCtx.fill(); else targetCtx.stroke();
      } else if (kind === "p"){
        op[1].forEach(function(pt, i){
          if (i) targetCtx.lineTo(pt[0], pt[1]); else targetCtx.moveTo(pt[0], pt[1]);
        });
        targetCtx.closePath();
        if (op[2] === "f") targetCtx.fill(); else targetCtx.stroke();
      } else {
        targetCtx.moveTo(op[1], op[2]);
        targetCtx.lineTo(op[3], op[4]);
        targetCtx.stroke();
      }
    });
    targetCtx.restore();
  }
  // in the colour list beside the chart
  function symbolSvg(idx, size){
    var ops = SYMBOLS[idx % SYMBOLS.length];
    if (!ops) return "";
    var parts = ops.map(function(op){
      var kind = op[0];
      if (kind === "c"){
        return '<circle cx="'+op[1]+'" cy="'+op[2]+'" r="'+op[3]+'" fill="'+(op[4]==="f"?"currentColor":"none")+'"/>';
      }
      if (kind === "r"){
        return '<rect x="'+op[1]+'" y="'+op[2]+'" width="'+op[3]+'" height="'+op[4]+'" fill="'+(op[5]==="f"?"currentColor":"none")+'"/>';
      }
      if (kind === "p"){
        return '<polygon points="'+op[1].map(function(pt){ return pt[0]+","+pt[1]; }).join(" ")+
               '" fill="'+(op[2]==="f"?"currentColor":"none")+'"/>';
      }
      return '<line x1="'+op[1]+'" y1="'+op[2]+'" x2="'+op[3]+'" y2="'+op[4]+'"/>';
    }).join("");
    return '<svg class="sym" viewBox="0 0 1 1" width="'+size+'" height="'+size+'" aria-hidden="true" '+
           'stroke="currentColor" stroke-width="0.11" fill="none" stroke-linecap="round" stroke-linejoin="round">'+
           parts+'</svg>';
  }
  // and on the printed sheet
  function pdfSymbol(doc, idx, x, y, size){
    var ops = SYMBOLS[idx % SYMBOLS.length];
    if (!ops) return;
    doc.setDrawColor(20,20,20);
    doc.setFillColor(20,20,20);
    doc.setLineWidth(Math.max(0.12, size*0.1));
    var X = function(v){ return x + v*size; }, Y = function(v){ return y + v*size; };
    // A mark that will not draw must never take the whole sheet down with it.
    try {
    ops.forEach(function(op){
      var kind = op[0];
      if (kind === "c"){
        doc.circle(X(op[1]), Y(op[2]), op[3]*size, op[4] === "f" ? "F" : "S");
      } else if (kind === "r"){
        doc.rect(X(op[1]), Y(op[2]), op[3]*size, op[4]*size, op[5] === "f" ? "F" : "S");
      } else if (kind === "p"){
        var pts = op[1];
        if (op[2] !== "f"){
          // An outline is just its sides — the plainest call there is.
          for (var k = 0; k < pts.length; k++){
            var a = pts[k], bb = pts[(k+1) % pts.length];
            doc.line(X(a[0]), Y(a[1]), X(bb[0]), Y(bb[1]));
          }
        } else if (pts.length === 3 && typeof doc.triangle === "function"){
          doc.triangle(X(pts[0][0]), Y(pts[0][1]), X(pts[1][0]), Y(pts[1][1]),
                       X(pts[2][0]), Y(pts[2][1]), "F");
        } else if (typeof doc.lines === "function"){
          var segs = [];
          for (var i = 1; i < pts.length; i++){
            segs.push([(pts[i][0]-pts[i-1][0])*size, (pts[i][1]-pts[i-1][1])*size]);
          }
          doc.lines(segs, X(pts[0][0]), Y(pts[0][1]), [1,1], "F", true);
        } else if (typeof doc.triangle === "function"){
          // Every shape here is star-shaped about its middle, so a fan of
          // triangles from the centre fills it exactly.
          var mx = 0, my = 0;
          pts.forEach(function(pt){ mx += pt[0]; my += pt[1]; });
          mx /= pts.length; my /= pts.length;
          for (var f = 0; f < pts.length; f++){
            var p1 = pts[f], p2 = pts[(f+1) % pts.length];
            doc.triangle(X(mx), Y(my), X(p1[0]), Y(p1[1]), X(p2[0]), Y(p2[1]), "F");
          }
        }
      } else {
        doc.line(X(op[1]), Y(op[2]), X(op[3]), Y(op[4]));
      }
    });
    } catch(e){}
  }

  function computeSymbolMap(cells){
    var codes = Object.keys(cells).map(function(k){ return cells[k]; });
    var uniq = Array.from(new Set(codes)).sort();
    var map = {};
    uniq.forEach(function(c,i){ map[c] = i % SYMBOLS.length; });
    return map;
  }
  function fabricSizeText(w, h, count){
    var inW = w / count, inH = h / count;
    var cmW = inW * 2.54, cmH = inH * 2.54;
    return t("fabricSizeTemplate", {inW: inW.toFixed(1), inH: inH.toFixed(1), cmW: cmW.toFixed(1), cmH: cmH.toFixed(1), count: count});
  }
  // How big a piece to cut: the stitched area plus a margin on every side,
  // so there is cloth to hold in the hoop and to frame or hem afterwards.
  function fabricCutText(w, h, count, margin){
    var cmW = (w / count) * 2.54 + margin * 2;
    var cmH = (h / count) * 2.54 + margin * 2;
    return t("fabricCutTemplate", {
      cmW: cmW.toFixed(1), cmH: cmH.toFixed(1),
      inW: (cmW/2.54).toFixed(1), inH: (cmH/2.54).toFixed(1),
      m: String(margin)
    });
  }
  function marginCm(){
    if (!el.marginInput) return 5;
    var v = parseFloat(el.marginInput.value);
    if (isNaN(v) || v < 0) v = 0;
    return Math.min(20, v);
  }
  function updateFabricSize(){
    if (el.fabricSize) el.fabricSize.textContent = fabricSizeText(state.width, state.height, state.aidaCount);
    if (el.fabricCut) el.fabricCut.textContent = fabricCutText(state.width, state.height, state.aidaCount, marginCm());
    // The photo pane has its own pair of size boxes; they are the same
    // setting as the ones under "Fleiri stillingar", so they follow along
    // whatever changed the size — a hoop, a photo that reshaped the grid,
    // an opened pattern.
    if (el.genWidth) el.genWidth.value = state.width;
    if (el.genHeight) el.genHeight.value = state.height;
  }
  function relTime(iso){
    if (!iso) return "";
    var diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return t("relJustNow");
    if (diff < 3600) return t("relMinAgo", {n: Math.floor(diff/60)});
    if (diff < 86400) return t("relHourAgo", {n: Math.floor(diff/3600)});
    return t("relDayAgo", {n: Math.floor(diff/86400)});
  }

  /* ---------------- palette ---------------- */
  /* ---------------- the threads she actually owns ----------------
     A thread box is never the whole DMC range. Marking the ones she has lets
     the palette show only those, and lets a photo be converted into threads
     she can stitch tonight instead of ones she would have to buy. The list
     lives in this browser, like the saved patterns. */
  var THREADS_KEY = "reitasaumur_threads";
  var myThreads = {};
  var markingThreads = false;
  (function loadThreads(){
    try {
      var raw = localStorage.getItem(THREADS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) arr.forEach(function(c){ if (c) myThreads[String(c)] = true; });
    } catch(e){}
  })();
  function saveThreads(){
    try { localStorage.setItem(THREADS_KEY, JSON.stringify(Object.keys(myThreads))); } catch(e){}
  }
  function ownedCount(){ return Object.keys(myThreads).length; }
  function ownedPalette(){
    return PALETTE.filter(function(p){ return myThreads[p.c]; });
  }
  function updateThreadTools(){
    if (!el.myThreadsCount) return;
    var n = ownedCount();
    var hint = el.myThreadsCount.dataset.hint;
    var count = n ? t("myThreadsCount", {n: n}) : "";
    el.myThreadsCount.textContent = hint ? (t(hint) + (count ? " · " + count : "")) : count;
    el.myThreadsEditBtn.textContent = t(markingThreads ? "myThreadsDoneBtn" : "myThreadsEditBtn");
    el.paletteGrid.classList.toggle("marking", markingThreads);
  }

  function renderPalette(){
    el.paletteGrid.innerHTML = "";
    var onlyMine = el.myThreadsOnly && el.myThreadsOnly.checked && !markingThreads && ownedCount() > 0;
    var list = onlyMine ? ownedPalette() : PALETTE;
    list.forEach(function(p){
      var d = document.createElement("div");
      d.className = "swatch" + (state.selectedColor === p.c ? " selected" : "")
                  + (myThreads[p.c] ? " owned" : "");
      d.style.background = p.h;
      d.title = p.c + " — " + p.n;
      d.tabIndex = 0;
      d.setAttribute("role","option");
      d.setAttribute("aria-selected", state.selectedColor === p.c ? "true" : "false");
      d.addEventListener("click", function(){
        if (markingThreads){
          if (myThreads[p.c]) delete myThreads[p.c]; else myThreads[p.c] = true;
          saveThreads(); renderPalette(); updateThreadTools();
          return;
        }
        selectColor(p.c);
      });
      d.addEventListener("keydown", function(ev){
        if (ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); d.click(); }
      });
      el.paletteGrid.appendChild(d);
    });
    updateSelectedCard();
    updateThreadTools();
  }

  if (el.myThreadsEditBtn) el.myThreadsEditBtn.addEventListener("click", function(){
    markingThreads = !markingThreads;
    if (markingThreads) setPaletteHint("myThreadsHint");
    else setPaletteHint("");
    renderPalette();
  });
  if (el.myThreadsOnly) el.myThreadsOnly.addEventListener("change", function(){
    if (el.myThreadsOnly.checked && !ownedCount()){
      el.myThreadsOnly.checked = false;
      setPaletteHint("myThreadsNone");
      return;
    }
    setPaletteHint("");
    renderPalette();
  });
  // A one-line note under the thread buttons, in whichever language is on.
  function setPaletteHint(key){
    if (!el.myThreadsCount) return;
    el.myThreadsCount.dataset.hint = key || "";
    updateThreadTools();
  }
  function selectColor(code){
    state.selectedColor = code;
    if (isNarrow() && el.palettePanel && !markingThreads) el.palettePanel.open = false;
    // Picking a color should only take you out of erase mode (which has no
    // use for a color) — draw and backstitch both use the selected color,
    // so choosing one mid-backstitch should not silently switch tools.
    if (state.tool === "erase") setTool("draw");
    renderPalette();
    // Text waiting to be placed is written in the chosen thread, so it changes
    // colour with it rather than landing in the old one.
    if (pendingStamp && pendingStamp.fromText) refreshTextStamp(true);
  }
  function updateSelectedCard(){
    var p = colorFor(state.selectedColor);
    if (!p){
      el.selectedSwatch.style.background = "transparent";
      el.selectedCode.textContent = "—"; el.selectedName.textContent = t("selectAColor");
      if (el.summarySwatch) el.summarySwatch.style.background = "transparent";
      if (el.summaryCode) el.summaryCode.textContent = "—";
      return;
    }
    el.selectedSwatch.style.background = p.h;
    el.selectedCode.textContent = "DMC " + p.c;
    el.selectedName.textContent = p.n;
    // Shown on the folded-up header, so the chosen thread is visible even
    // when the box is closed.
    if (el.summarySwatch) el.summarySwatch.style.background = p.h;
    if (el.summaryCode) el.summaryCode.textContent = "DMC " + p.c;
  }

  // Narrow window: the thread box starts folded, and folds itself back up
  // once a thread is picked, so the chart is never pushed off the screen.
  var narrowScreen = window.matchMedia ? window.matchMedia("(max-width: 980px)") : null;
  function isNarrow(){ return !!(narrowScreen && narrowScreen.matches); }
  function syncPaletteFold(){
    if (el.palettePanel) el.palettePanel.open = !isNarrow();
  }
  if (narrowScreen){
    if (narrowScreen.addEventListener) narrowScreen.addEventListener("change", syncPaletteFold);
    else if (narrowScreen.addListener) narrowScreen.addListener(syncPaletteFold);
  }

  /* ---------------- canvas ---------------- */
  // Browsers cap how big a canvas may be (per side and in total pixels), and
  // an over-sized canvas doesn't error — it just renders nothing. A large
  // chart (up to 400×400 stitches) zoomed in blows past that easily, so the
  // backing store is scaled down to stay inside the limits. The CSS size is
  // never touched, so the chart keeps its correct on-screen measurements and
  // only gets slightly softer at extreme sizes.
  var MAX_CANVAS_SIDE = 8192, MAX_CANVAS_AREA = 32e6;
  function backingScale(w, h){
    var scale = window.devicePixelRatio || 1;
    if (w > 0 && h > 0){
      scale = Math.min(scale, MAX_CANVAS_SIDE / Math.max(w, h));
      scale = Math.min(scale, Math.sqrt(MAX_CANVAS_AREA / (w * h)));
    }
    return scale > 0 ? scale : 1;
  }
  var RULER_GUTTER = 24;
  function resizeCanvas(){
    var w = state.width * state.cellSize, h = state.height * state.cellSize;
    var scale = backingScale(w, h);
    el.gridCanvas.style.width = w + "px";
    el.gridCanvas.style.height = h + "px";
    el.gridCanvas.width = Math.max(1, Math.round(w * scale));
    el.gridCanvas.height = Math.max(1, Math.round(h * scale));
    ctx.setTransform(scale,0,0,scale,0,0);
    resizeRuler(w, h);
  }
  function resizeRuler(w, h){
    if (!el.rulerCanvas) return;
    var gutter = state.coordsOn ? RULER_GUTTER : 0;
    el.gridCanvas.style.marginLeft = gutter + "px";
    el.gridCanvas.style.marginTop = gutter + "px";
    if (!state.coordsOn){
      el.rulerCanvas.style.display = "none";
      return;
    }
    el.rulerCanvas.style.display = "block";
    var rw = w + gutter + 2, rh = h + gutter + 2;
    var scale = backingScale(rw, rh);
    el.rulerCanvas.style.width = rw + "px";
    el.rulerCanvas.style.height = rh + "px";
    el.rulerCanvas.width = Math.max(1, Math.round(rw * scale));
    el.rulerCanvas.height = Math.max(1, Math.round(rh * scale));
    rulerCtx.setTransform(scale,0,0,scale,0,0);
  }
  // Numbers every ten stitches along the top and left edge, thinned out
  // automatically when the stitches get too small for the labels to fit.
  function drawRuler(){
    if (!el.rulerCanvas || !state.coordsOn) return;
    var cs = state.cellSize, g = RULER_GUTTER;
    var w = state.width * cs, h = state.height * cs;
    rulerCtx.clearRect(0, 0, w + g + 2, h + g + 2);
    var ink = getComputedStyle(document.documentElement).getPropertyValue("--ink-soft").trim() || "#888";
    var everyX = 10, everyY = 10;
    while (everyX * cs < 26) everyX += 10;
    while (everyY * cs < 14) everyY += 10;
    rulerCtx.fillStyle = ink;
    rulerCtx.font = "10px 'IBM Plex Mono', monospace";
    rulerCtx.textAlign = "center";
    rulerCtx.textBaseline = "bottom";
    for (var x = everyX; x <= state.width; x += everyX){
      rulerCtx.fillText(String(x), g + x*cs - cs/2, g - 5);
    }
    rulerCtx.textAlign = "right";
    rulerCtx.textBaseline = "middle";
    for (var y = everyY; y <= state.height; y += everyY){
      rulerCtx.fillText(String(y), g - 6, g + y*cs - cs/2);
    }
  }
  // Same idea for the off-screen canvases behind the PNG/PDF exports: pick
  // the largest stitch size that still fits inside the canvas limits.
  function exportCellPx(preferred, w, h){
    w = w || state.width; h = h || state.height;
    var cs = Math.min(preferred, 8000 / Math.max(w, h), Math.sqrt(30e6 / (w * h)));
    return Math.max(4, Math.floor(cs));
  }
  /* Shared chart painter — used for the live canvas, PNG export and PDF export.
     opts: { printMode, forceSymbols, minorColor, majorColor, bgColor, ox, oy, fullW, fullH }
     ox/oy + fullW/fullH let this paint one tile (w×h stitches starting at
     column ox, row oy) of a larger chart, which is how a big pattern is split
     across several PDF sheets. They default to painting the whole chart. */
  /* ---------------- how it will look sewn ----------------
     The chart shows one flat square per stitch, which is what you need while
     you draw — but not what the work will look like. This draws the same
     pattern as real crosses on cloth: two strokes per stitch, the second one
     a shade darker where the threads cross, on an aida weave instead of a
     ruled grid. Nothing about the pattern changes; it is only a way of
     looking at it. */
  /* A square already sewn is veiled over and ticked, so what is left stands
     out. It is only a mark on the view — the stitch underneath is untouched,
     and nothing of this reaches the printed sheet. */
  function drawDoneMark(targetCtx, px, py, cs, bg){
    var pale = luminance(bg) > 0.5;
    targetCtx.save();
    targetCtx.fillStyle = pale ? "rgba(255,255,255,.72)" : "rgba(0,0,0,.6)";
    targetCtx.fillRect(px, py, cs, cs);
    if (cs >= 7){
      targetCtx.strokeStyle = pale ? "rgba(46,92,78,.85)" : "rgba(190,235,215,.9)";
      targetCtx.lineWidth = Math.max(1, cs*0.13);
      targetCtx.lineCap = "round";
      targetCtx.lineJoin = "round";
      targetCtx.beginPath();
      targetCtx.moveTo(px + cs*0.24, py + cs*0.52);
      targetCtx.lineTo(px + cs*0.43, py + cs*0.72);
      targetCtx.lineTo(px + cs*0.78, py + cs*0.29);
      targetCtx.stroke();
    }
    targetCtx.restore();
  }

  function paintStitched(targetCtx, w, h, cs, opts){
    var ox = opts.ox || 0, oy = opts.oy || 0;
    var bg = opts.bgColor || "#ffffff";
    var dark = luminance(bg) < 0.5;
    var showDone = !!opts.showDone;

    targetCtx.fillStyle = bg;
    targetCtx.fillRect(0, 0, w*cs, h*cs);

    // the weave: a hole at every corner, the way aida is woven
    if (cs >= 5){
      targetCtx.fillStyle = dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.07)";
      var r = Math.max(0.6, cs*0.07);
      for (var wy = 0; wy <= h; wy++){
        for (var wx = 0; wx <= w; wx++){
          targetCtx.beginPath();
          targetCtx.arc(wx*cs, wy*cs, r, 0, Math.PI*2);
          targetCtx.fill();
        }
      }
    }

    targetCtx.lineCap = "round";
    var inset = cs*0.12, lw = Math.max(1, cs*0.30);
    for (var y = 0; y < h; y++){
      for (var x = 0; x < w; x++){
        var code = state.cells[(x+ox)+"-"+(y+oy)];
        if (!code) continue;
        var p = colorFor(code);
        var hex = p ? p.h : "#999999";
        var x0 = x*cs + inset, x1 = (x+1)*cs - inset;
        var y0 = y*cs + inset, y1 = (y+1)*cs - inset;
        targetCtx.lineWidth = lw;
        targetCtx.strokeStyle = shade(hex, 1.06);
        targetCtx.beginPath();
        targetCtx.moveTo(x0, y0); targetCtx.lineTo(x1, y1);
        targetCtx.stroke();
        // the top thread of the cross sits a little darker
        targetCtx.strokeStyle = shade(hex, 0.9);
        targetCtx.beginPath();
        targetCtx.moveTo(x1, y0); targetCtx.lineTo(x0, y1);
        targetCtx.stroke();
        if (showDone && state.done[(x+ox)+"-"+(y+oy)]) drawDoneMark(targetCtx, x*cs, y*cs, cs, bg);
      }
    }

    if (state.backstitches.length){
      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.rect(0, 0, w*cs, h*cs);
      targetCtx.clip();
      targetCtx.translate(-ox*cs, -oy*cs);
      targetCtx.lineCap = "round";
      targetCtx.lineWidth = Math.max(1.4, cs*0.16);
      state.backstitches.forEach(function(sg){
        var bp = colorFor(sg.color);
        targetCtx.strokeStyle = bp ? shade(bp.h, 0.9) : "#111111";
        targetCtx.beginPath();
        targetCtx.moveTo(sg.x1*cs, sg.y1*cs);
        targetCtx.lineTo(sg.x2*cs, sg.y2*cs);
        targetCtx.stroke();
      });
      targetCtx.restore();
    }

    if (state.shape === "circle"){
      var fullW = opts.fullW || w, fullH = opts.fullH || h;
      var ccx = fullW*cs/2, ccy = fullH*cs/2;
      var crx = Math.min(fullW, fullH)*cs/2;
      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.rect(0,0,w*cs,h*cs);
      targetCtx.clip();
      targetCtx.translate(-ox*cs, -oy*cs);
      targetCtx.beginPath();
      targetCtx.rect(0,0,fullW*cs,fullH*cs);
      targetCtx.ellipse(ccx,ccy,crx,crx,0,0,Math.PI*2,true);
      targetCtx.closePath();
      targetCtx.fillStyle = "rgba(58,44,34,.4)";
      targetCtx.fill("evenodd");
      targetCtx.restore();
    }
  }

  function paintChart(targetCtx, w, h, cs, opts){
    opts = opts || {};
    var printMode = !!opts.printMode;
    // The stitched view is a way of looking at the chart, so it follows the
    // button — except where a readable chart is the whole point (the PDF).
    var stitched = opts.stitchView != null ? opts.stitchView : (state.stitchView && !printMode);
    if (stitched){
      targetCtx.clearRect(0,0, w*cs, h*cs);
      paintStitched(targetCtx, w, h, cs, opts);
      return;
    }
    var showDone = !!opts.showDone;
    var showSymbols = opts.forceSymbols != null ? opts.forceSymbols : (state.symbolsOn || printMode);
    var minorColor = opts.minorColor || "#ddd0b6";
    var majorColor = opts.majorColor || "#b7a37e";
    var bg = opts.bgColor || "#fbe1ea";
    var ox = opts.ox || 0, oy = opts.oy || 0;
    var fullW = opts.fullW || w, fullH = opts.fullH || h;

    var seeThrough = !!opts.transparentBg;
    if (!seeThrough) targetCtx.clearRect(0,0, w*cs, h*cs);
    var symMap = showSymbols ? computeSymbolMap(state.cells) : {};

    for (var y=0; y<h; y++){
      for (var x=0; x<w; x++){
        var code = state.cells[(x+ox)+"-"+(y+oy)];
        var px = x*cs, py = y*cs;
        if (code){
          var p = colorFor(code);
          if (printMode){
            targetCtx.fillStyle = "#ffffff";
            targetCtx.fillRect(px,py,cs,cs);
            targetCtx.strokeStyle = "#111111";
            targetCtx.lineWidth = 1;
            targetCtx.strokeRect(px+0.5,py+0.5,cs-1,cs-1);
            targetCtx.fillStyle = "#111111";
          } else {
            targetCtx.fillStyle = p ? p.h : bg;
            targetCtx.fillRect(px,py,cs,cs);
          }
          if (showSymbols && symMap[code] != null){
            var lum = p ? luminance(p.h) : 1;
            var inkColor = printMode ? "#111111" : (lum > 0.55 ? "#111111" : "#ffffff");
            var box = cs*0.68;
            drawSymbolCanvas(targetCtx, symMap[code], px + (cs-box)/2, py + (cs-box)/2, box, inkColor);
          }
          if (showDone && state.done[(x+ox)+"-"+(y+oy)]) drawDoneMark(targetCtx, px, py, cs, bg);
        } else if (!seeThrough){
          targetCtx.fillStyle = bg;
          targetCtx.fillRect(px,py,cs,cs);
        }
      }
    }

    // The thick marker lines are anchored on the chart's center (not the
    // edge) and repeat every 10 stitches outward from there, so the center
    // of the pattern is always marked by a thick line — the usual
    // cross-stitch-chart convention for finding the middle of the fabric.
    // Anchored on the WHOLE chart's center, so the thick lines land on the
    // same stitches no matter which tile is being painted.
    var centerX = Math.round(fullW/2), centerY = Math.round(fullH/2);
    function isMajorLine(i, center){ return ((i - center) % 10 + 10) % 10 === 0; }

    targetCtx.strokeStyle = minorColor;
    targetCtx.lineWidth = 1;
    for (var gx=0; gx<=w; gx++){
      if (isMajorLine(gx+ox, centerX)) continue;
      targetCtx.beginPath(); targetCtx.moveTo(gx*cs+0.5,0); targetCtx.lineTo(gx*cs+0.5, h*cs); targetCtx.stroke();
    }
    for (var gy=0; gy<=h; gy++){
      if (isMajorLine(gy+oy, centerY)) continue;
      targetCtx.beginPath(); targetCtx.moveTo(0, gy*cs+0.5); targetCtx.lineTo(w*cs, gy*cs+0.5); targetCtx.stroke();
    }
    targetCtx.strokeStyle = majorColor;
    targetCtx.lineWidth = 1.6;
    for (var gx2=0; gx2<=w; gx2++){
      if (!isMajorLine(gx2+ox, centerX)) continue;
      targetCtx.beginPath(); targetCtx.moveTo(gx2*cs+0.8,0); targetCtx.lineTo(gx2*cs+0.8, h*cs); targetCtx.stroke();
    }
    for (var gy2=0; gy2<=h; gy2++){
      if (!isMajorLine(gy2+oy, centerY)) continue;
      targetCtx.beginPath(); targetCtx.moveTo(0, gy2*cs+0.8); targetCtx.lineTo(w*cs, gy2*cs+0.8); targetCtx.stroke();
    }

    // The middle of the chart gets its own cross, darker and heavier than the
    // ten-stitch marker lines. That is where you start counting from the
    // middle of the fabric, so it should be findable at a glance. The colour
    // follows the fabric, not the theme, so it stays visible on a dark cloth.
    var centerColor = opts.centerColor ||
      (printMode ? "#111111" : (luminance(bg) > 0.5 ? "#2f2129" : "#ffe7f0"));
    targetCtx.strokeStyle = centerColor;
    targetCtx.lineWidth = Math.max(1.8, Math.min(3.2, cs*0.17));
    var cLineX = (centerX - ox)*cs, cLineY = (centerY - oy)*cs;
    if (cLineX >= 0 && cLineX <= w*cs){
      targetCtx.beginPath();
      targetCtx.moveTo(cLineX+0.8, 0); targetCtx.lineTo(cLineX+0.8, h*cs);
      targetCtx.stroke();
    }
    if (cLineY >= 0 && cLineY <= h*cs){
      targetCtx.beginPath();
      targetCtx.moveTo(0, cLineY+0.8); targetCtx.lineTo(w*cs, cLineY+0.8);
      targetCtx.stroke();
    }

    if (state.backstitches.length){
      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.rect(0,0,w*cs,h*cs);
      targetCtx.clip();
      targetCtx.translate(-ox*cs, -oy*cs);
      targetCtx.lineCap = "round";
      targetCtx.lineWidth = Math.max(1.4, cs*0.14);
      state.backstitches.forEach(function(s){
        var bp = colorFor(s.color);
        targetCtx.strokeStyle = printMode ? "#111111" : (bp ? bp.h : "#111111");
        targetCtx.beginPath();
        targetCtx.moveTo(s.x1*cs, s.y1*cs);
        targetCtx.lineTo(s.x2*cs, s.y2*cs);
        targetCtx.stroke();
      });
      targetCtx.restore();
    }

    if (state.shape === "circle"){
      var ccx = fullW*cs/2, ccy = fullH*cs/2;
      var crx = Math.min(fullW, fullH)*cs/2, cry = crx;
      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.rect(0,0,w*cs,h*cs);
      targetCtx.clip();
      targetCtx.translate(-ox*cs, -oy*cs);
      targetCtx.beginPath();
      targetCtx.rect(0,0,fullW*cs,fullH*cs);
      targetCtx.ellipse(ccx,ccy,crx,cry,0,0,Math.PI*2,true);
      targetCtx.closePath();
      targetCtx.fillStyle = printMode ? "rgba(255,255,255,.88)" : "rgba(58,44,34,.4)";
      targetCtx.fill("evenodd");
      targetCtx.beginPath();
      targetCtx.ellipse(ccx,ccy,crx,cry,0,0,Math.PI*2);
      targetCtx.strokeStyle = majorColor;
      targetCtx.lineWidth = 2.4;
      targetCtx.stroke();
      targetCtx.restore();
    }
  }

  /* ---------------- a photo to trace over ----------------
     The automatic conversion is one way to use a picture; the other is to
     have it lying faintly under the grid and pick every stitch yourself,
     which is how a drawn alphabet or a flower ends up looking like it was
     drawn rather than sampled. It is only a guide: it is never part of the
     pattern, and it stays out of every export. */
  function coverBox(img, w, h, crop){
    var srcRatio = img.width / img.height, dstRatio = w / h;
    var sx, sy, sw, sh;
    if (srcRatio > dstRatio){
      sh = img.height; sw = sh*dstRatio; sy = 0;
      sx = crop === "start" ? 0 : (crop === "end" ? img.width-sw : (img.width-sw)/2);
    } else {
      sw = img.width; sh = sw/dstRatio; sx = 0;
      sy = crop === "start" ? 0 : (crop === "end" ? img.height-sh : (img.height-sh)/2);
    }
    return { sx: sx, sy: sy, sw: sw, sh: sh };
  }
  function tracingNow(){
    return !!(traceImage && el.traceToggle && el.traceToggle.checked && !state.stitchView && !state.printOn);
  }
  function drawTrace(cs){
    var w = state.width*cs, h = state.height*cs;
    var crop = el.genImageCrop ? el.genImageCrop.value : "center";
    var box = coverBox(traceImage, state.width, state.height, crop);
    ctx.save();
    ctx.globalAlpha = Math.max(0.05, Math.min(0.9,
      (el.traceOpacity ? parseInt(el.traceOpacity.value, 10) : 35) / 100));
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = state.bgColor;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = Math.max(0.05, Math.min(0.9,
      (el.traceOpacity ? parseInt(el.traceOpacity.value, 10) : 35) / 100));
    ctx.drawImage(traceImage, box.sx, box.sy, box.sw, box.sh, 0, 0, w, h);
    ctx.restore();
  }

  function renderCanvas(skipLegend){
    var cs = state.cellSize;
    var minorColor = getComputedStyle(document.documentElement).getPropertyValue("--grid-minor").trim();
    var majorColor = getComputedStyle(document.documentElement).getPropertyValue("--grid-major").trim();
    var trace = tracingNow();
    if (trace){
      ctx.clearRect(0, 0, state.width*cs, state.height*cs);
      drawTrace(cs);
    }
    paintChart(ctx, state.width, state.height, cs, {
      printMode: state.printOn, forceSymbols: state.symbolsOn || state.printOn,
      minorColor: minorColor, majorColor: majorColor, bgColor: state.bgColor,
      transparentBg: trace, showDone: state.progressOn
    });
    // The line/box being dragged out right now — drawn on top of the live
    // chart only, so it never reaches the saved pattern or an export.
    if (shapePreview && shapePreview.length){
      var pv = colorFor(state.selectedColor);
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = pv ? pv.h : "#000000";
      shapePreview.forEach(function(c){
        if (!inShape(c.x, c.y)) return;
        ctx.fillRect(c.x*cs, c.y*cs, cs, cs);
      });
      ctx.restore();
    }
    // the marquee, and the piece hanging off the pointer
    var sel = selDrag
      ? { x: Math.min(selDrag.ax, selDrag.bx), y: Math.min(selDrag.ay, selDrag.by),
          w: Math.abs(selDrag.bx - selDrag.ax) + 1, h: Math.abs(selDrag.by - selDrag.ay) + 1 }
      : selection;
    if (sel){
      ctx.save();
      ctx.strokeStyle = "#2b6cb0";
      ctx.lineWidth = Math.max(1, cs * 0.12);
      ctx.setLineDash([cs * 0.6, cs * 0.4]);
      ctx.strokeRect(sel.x*cs, sel.y*cs, sel.w*cs, sel.h*cs);
      ctx.restore();
    }
    if (pendingStamp && pendingStamp.x !== null){
      ctx.save();
      ctx.globalAlpha = 0.8;
      Object.keys(pendingStamp.cells).forEach(function(k){
        var p = k.split("-"), x = pendingStamp.x + +p[0], y = pendingStamp.y + +p[1];
        if (x < 0 || y < 0 || x >= state.width || y >= state.height) return;
        var col = colorFor(pendingStamp.cells[k]);
        ctx.fillStyle = col ? col.h : "#000000";
        ctx.fillRect(x*cs, y*cs, cs, cs);
      });
      pendingStamp.back.forEach(function(sg){
        var col = colorFor(sg.color);
        ctx.strokeStyle = col ? col.h : "#000000";
        ctx.lineWidth = Math.max(1, cs*0.22);
        ctx.beginPath();
        ctx.moveTo((pendingStamp.x+sg.x1)*cs, (pendingStamp.y+sg.y1)*cs);
        ctx.lineTo((pendingStamp.x+sg.x2)*cs, (pendingStamp.y+sg.y2)*cs);
        ctx.stroke();
      });
      ctx.strokeStyle = "#2b6cb0";
      ctx.globalAlpha = 1;
      ctx.lineWidth = Math.max(1, cs*0.1);
      ctx.setLineDash([cs*0.6, cs*0.4]);
      ctx.strokeRect(pendingStamp.x*cs, pendingStamp.y*cs, pendingStamp.w*cs, pendingStamp.h*cs);
      ctx.restore();
    }
    drawRuler();
    if (!skipLegend){ renderLegend(); scheduleDraftSave(); }
  }
  // While dragging the mouse across the chart, repaint at most once per frame
  // and leave the (fairly expensive) legend rebuild until the stroke ends —
  // on a large chart, repainting and rebuilding the color list on every single
  // pointermove event made drawing feel sluggish.
  var renderQueued = false;
  function scheduleRender(){
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(function(){
      renderQueued = false;
      renderCanvas(true);
    });
  }

  /* ---------------- swapping one thread for another ----------------
     A thread you do not own, or two shades so alike that they are not worth
     two needles, can be changed everywhere in the pattern at once. Choosing
     a colour that is already in the pattern merges the two. */
  function refreshSwapLists(rows){
    if (!el.swapFrom || !el.swapTo) return;
    var used = rows.map(function(r){ return r.code; });
    state.backstitches.forEach(function(sg){
      if (sg.color && used.indexOf(sg.color) < 0) used.push(sg.color);
    });
    if (el.swapBox) el.swapBox.classList.toggle("gen-hidden", used.length === 0);
    var prevFrom = el.swapFrom.value, prevTo = el.swapTo.value;
    el.swapFrom.innerHTML = "";
    used.forEach(function(code){
      var p = colorFor(code);
      var o = document.createElement("option");
      o.value = code;
      o.textContent = "DMC " + code + (p ? " · " + p.n : "");
      el.swapFrom.appendChild(o);
    });
    if (used.indexOf(prevFrom) >= 0) el.swapFrom.value = prevFrom;
    if (!el.swapTo.options.length){
      PALETTE.forEach(function(p){
        var o = document.createElement("option");
        o.value = p.c;
        o.textContent = "DMC " + p.c + " · " + p.n;
        el.swapTo.appendChild(o);
      });
      el.swapTo.value = state.selectedColor;
    } else if (prevTo){
      el.swapTo.value = prevTo;
    }
  }
  function swapThread(from, to){
    var n = 0;
    Object.keys(state.cells).forEach(function(k){
      if (state.cells[k] === from){ state.cells[k] = to; n++; }
    });
    state.backstitches.forEach(function(sg){ if (sg.color === from){ sg.color = to; n++; } });
    // Stitches parked outside the hoop are changed too, so nothing comes
    // back in the old colour if the shape is switched back.
    Object.keys(state.clipped || {}).forEach(function(k){
      if (state.clipped[k] === from) state.clipped[k] = to;
    });
    (state.clippedBack || []).forEach(function(sg){ if (sg.color === from) sg.color = to; });
    return n;
  }
  if (el.swapBtn) el.swapBtn.addEventListener("click", function(){
    var from = el.swapFrom.value, to = el.swapTo.value;
    if (!from || !to || from === to){
      setGenStatus(el.swapStatus, "swapNothing", "error");
      return;
    }
    pushUndo();
    var n = swapThread(from, to);
    dismissSample();
    renderCanvas();
    setGenStatus(el.swapStatus, "swapDone", "ok", {n: n, from: from, to: to});
  });

  /* ---------------- saumahamur: keeping track of what is sewn ----------------
     The same chart, read rather than drawn on: a square that has been stitched
     is ticked off and veiled over, so what is left is what stands out. The
     ticks belong to the pattern (they are saved and come back with it) but
     they never reach the PNG or the PDF — those stay the clean working sheet. */
  function doneTotals(){
    var done = 0, total = 0;
    Object.keys(state.cells).forEach(function(k){ total++; if (state.done[k]) done++; });
    return { done: done, total: total };
  }
  // The ticks are kept by position, so anything that moves the pattern about
  // has to move them with it — otherwise they would end up on the wrong
  // squares. Returning null for a square drops its tick.
  function remapDone(fn){
    var moved = {};
    Object.keys(state.done).forEach(function(k){
      var p = k.split("-");
      var q = fn(+p[0], +p[1]);
      if (q) moved[q[0] + "-" + q[1]] = 1;
    });
    state.done = moved;
  }
  function updateProgressBox(){
    if (!el.progressBox) return;
    el.progressBox.classList.toggle("gen-hidden", !state.progressOn);
    if (!state.progressOn) return;
    var sum = doneTotals();
    var pct = sum.total ? Math.round((sum.done / sum.total) * 100) : 0;
    if (el.progressFill) el.progressFill.style.width = pct + "%";
    if (el.progressLine) el.progressLine.textContent = t("progressLine", {done: sum.done, total: sum.total, pct: pct});
  }
  function setProgressMode(on){
    state.progressOn = !!on;
    if (el.progressBtn) el.progressBtn.classList.toggle("active", state.progressOn);
    if (el.gridCanvas) el.gridCanvas.classList.toggle("marking-done", state.progressOn);
    // Nothing should be hanging off the pointer while squares are being ticked.
    if (state.progressOn){ cancelStamp(); clearSelection(); updateSelectionBar(); }
    renderCanvas();
  }
  function markDoneAt(cell, on){
    var key = cell.x + "-" + cell.y;
    if (!state.cells[key]) return false;          // an empty square is nothing to sew
    if (!!state.done[key] === !!on) return false; // already the way it should be
    if (on) state.done[key] = 1; else delete state.done[key];
    return true;
  }
  function setThreadDone(code, on){
    Object.keys(state.cells).forEach(function(k){
      if (state.cells[k] !== code) return;
      if (on) state.done[k] = 1; else delete state.done[k];
    });
    renderCanvas();
  }
  if (el.progressBtn) el.progressBtn.addEventListener("click", function(){
    setProgressMode(!state.progressOn);
  });
  if (el.progressResetBtn) el.progressResetBtn.addEventListener("click", function(){
    state.done = {};
    renderCanvas();
  });

  function renderLegend(){
    var counts = {};
    var doneCounts = {};
    var total = 0;
    Object.keys(state.cells).forEach(function(k){
      var code = state.cells[k];
      counts[code] = (counts[code]||0) + 1;
      if (state.done[k]) doneCounts[code] = (doneCounts[code]||0) + 1;
      total++;
    });
    updateProgressBox();
    el.legendTotal.textContent = t("stitchesAndColors", {total: total, colors: Object.keys(counts).length});
    var symMap = computeSymbolMap(state.cells);
    var rows = Object.keys(counts).map(function(c){ return {code:c, n:counts[c]}; })
      .sort(function(a,b){ return b.n - a.n; });
    refreshSwapLists(rows);
    if (!rows.length){
      el.legendList.innerHTML = '<p class="legend-empty"></p>';
      el.legendList.firstChild.textContent = t("legendEmpty");
      return;
    }
    el.legendList.innerHTML = "";
    var perStitchCm = stitchLenCm(state.aidaCount);
    var grandCm = 0;
    rows.forEach(function(r){
      var p = colorFor(r.code);
      var threadDone = doneCounts[r.code] || 0;
      var allDone = state.progressOn && threadDone >= r.n;
      var row = document.createElement("div");
      row.className = "legend-row" + (state.showFloss ? " has-floss" : "") +
                      (state.progressOn ? " has-progress" : "") + (allDone ? " thread-done" : "");
      // In saumahamur the number that matters is how many squares are left.
      var countText = state.progressOn
        ? (allDone ? t("progressDoneWord") : t("progressRemaining", {n: r.n - threadDone}))
        : String(r.n);
      var html =
        '<span class="legend-swatch" style="background:'+(p?p.h:"#ccc")+'"></span>' +
        '<span class="legend-symbol">'+(symMap[r.code] != null ? symbolSvg(symMap[r.code], 12) : "")+'</span>' +
        // In saumahamur the row has a tick button too, so the thread's English
        // name steps aside — the number is what is being read at the needle.
        '<span class="legend-name"><span class="code mono">'+r.code+'</span>' +
        (state.progressOn ? '' : ' <span class="en">'+(p?p.n:"")+'</span>') + '</span>' +
        '<span class="legend-count mono">'+countText+'</span>';
      if (state.showFloss){
        var cm = r.n * perStitchCm;
        grandCm += cm;
        var skeins = Math.max(1, Math.ceil(cm / 800));
        html += '<span class="legend-floss mono">'+t("flossLine", {cm: Math.round(cm), skeins: skeins})+'</span>';
      }
      if (state.progressOn){
        html += '<button type="button" class="legend-tick small' + (allDone ? " done" : "") + '">' +
                '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.6 7.4l3 3 5.8-6.6"/></svg></button>';
      }
      row.innerHTML = html;
      var tick = row.querySelector(".legend-tick");
      if (tick){
        tick.title = t("progressThreadTitle");
        tick.setAttribute("aria-label", t("progressThreadTitle"));
        tick.addEventListener("click", function(){ setThreadDone(r.code, !allDone); });
      }
      el.legendList.appendChild(row);
    });
    if (state.showFloss){
      var totalRow = document.createElement("div");
      totalRow.className = "legend-row has-floss legend-floss-total";
      totalRow.innerHTML = '<span></span><span></span><span class="legend-name"></span><span class="legend-count mono">'+Math.round(grandCm)+' cm</span><span></span>';
      totalRow.querySelector(".legend-name").textContent = t("totalFloss");
      el.legendList.appendChild(totalRow);
    }
  }

  /* ---------------- shape (rectangle / embroidery hoop) ---------------- */
  function inShape(x, y){
    if (state.shape !== "circle") return true;
    var r = Math.min(state.width, state.height) / 2;
    var dx = (x + 0.5) - state.width / 2;
    var dy = (y + 0.5) - state.height / 2;
    return (dx*dx + dy*dy) <= (r*r);
  }
  /* The hoop hides the corners of the chart rather than throwing them away:
     what falls outside the circle is set aside here, so switching back to the
     rectangle brings the whole pattern back instead of leaving it trimmed. */
  function clipToCircle(){
    if (state.shape !== "circle") return;
    var newCells = {};
    Object.keys(state.cells).forEach(function(k){
      var parts = k.split("-");
      if (inShape(+parts[0], +parts[1])) newCells[k] = state.cells[k];
      else state.clipped[k] = state.cells[k];
    });
    state.cells = newCells;
    state.backstitches = state.backstitches.filter(function(sg){
      if (inShape(sg.x1,sg.y1) && inShape(sg.x2,sg.y2)) return true;
      state.clippedBack.push(sg);
      return false;
    });
  }
  function restoreClipped(){
    var keys = Object.keys(state.clipped);
    keys.forEach(function(k){
      var parts = k.split("-"), x = +parts[0], y = +parts[1];
      if (x < state.width && y < state.height && state.cells[k] === undefined){
        state.cells[k] = state.clipped[k];
      }
    });
    state.clippedBack.forEach(function(sg){
      if (sg.x1 <= state.width && sg.y1 <= state.height && sg.x2 <= state.width && sg.y2 <= state.height){
        state.backstitches.push(sg);
      }
    });
    state.clipped = {};
    state.clippedBack = [];
  }
  function computeHoopStitches(hoopCm, aida){
    return Math.max(10, Math.min(400, Math.round((hoopCm/2.54) * aida)));
  }
  function applyHoopSize(){
    var n = computeHoopStitches(parseInt(el.hoopSize.value,10) || state.hoopCm, state.aidaCount);
    pushUndo();
    state.width = n; state.height = n;
    if (lastGenImage) regenerateFromImage();
    clipToCircle();
    el.widthInput.value = n; el.heightInput.value = n;
    resizeCanvas(); renderCanvas(); updateFabricSize();
  }
  // Keeps the shape controls in step with state.shape — used both by the
  // shape switch itself and when a saved pattern is loaded (a rectangular
  // pattern opened while the hoop shape was active used to keep the round
  // mask, which then blocked drawing outside the circle).
  function applyShapeUI(){
    if (el.shapeSwitch) el.shapeSwitch.querySelectorAll("button").forEach(function(bb){
      bb.classList.toggle("active", bb.getAttribute("data-shape") === state.shape);
    });
    if (el.hoopSizeWrap) el.hoopSizeWrap.classList.toggle("gen-hidden", state.shape !== "circle");
    if (el.sizeGroup) el.sizeGroup.classList.toggle("gen-hidden", state.shape === "circle");
    // In a hoop the size comes from the hoop itself, so the size boxes in the
    // photo pane step aside too.
    if (el.genSizeField) el.genSizeField.classList.toggle("gen-hidden", state.shape === "circle");
    if (el.hoopSize) el.hoopSize.value = String(state.hoopCm);
  }
  if (el.shapeSwitch) el.shapeSwitch.querySelectorAll("button").forEach(function(b){
    b.addEventListener("click", function(){
      var shape = b.getAttribute("data-shape");
      if (shape === state.shape) return;
      pushUndo();
      state.shape = shape;
      applyShapeUI();
      if (shape === "circle"){
        if (!state.rectSize) state.rectSize = { w: state.width, h: state.height };
        applyHoopSize();
      } else {
        // The hoop made the chart square; going back to the rectangle has to
        // return to the size it was before, or the stitches that were hidden
        // outside that square have nowhere to land and are lost.
        if (state.rectSize){
          state.width = state.rectSize.w; state.height = state.rectSize.h;
          state.rectSize = null;
          el.widthInput.value = state.width; el.heightInput.value = state.height;
        }
        // A photo pattern is simply re-rendered over the full grid; anything
        // else gets the stitches the circle was hiding handed back.
        if (lastGenImage) regenerateFromImage();
        else restoreClipped();
        resizeCanvas(); renderCanvas(); updateFabricSize();
      }
    });
  });
  if (el.hoopSize) el.hoopSize.addEventListener("change", function(){
    state.hoopCm = parseInt(el.hoopSize.value,10) || 15;
    if (state.shape === "circle") applyHoopSize();
  });

  /* ---------------- painting ---------------- */
  // A history entry covers the grid size too, so undoing a resize, a rotate
  // or a hoop change puts the chart back the way it was — not just its
  // stitches into a grid that stayed the new size.
  function snapshot(){
    return JSON.stringify({
      cells: state.cells, backstitches: state.backstitches, done: state.done,
      width: state.width, height: state.height,
      clipped: state.clipped, clippedBack: state.clippedBack,
      shape: state.shape, hoopCm: state.hoopCm, rectSize: state.rectSize
    });
  }
  function restoreSnapshot(str){
    var snap = JSON.parse(str);
    state.cells = snap.cells || {};
    state.backstitches = snap.backstitches || [];
    state.done = snap.done || {};
    state.clipped = snap.clipped || {};
    state.clippedBack = snap.clippedBack || [];
    state.rectSize = snap.rectSize || null;
    if (snap.width) state.width = snap.width;
    if (snap.height) state.height = snap.height;
    // The shape belongs to the history too, so undoing a switch to the hoop
    // puts the round mask back rather than leaving a mismatched chart.
    if (snap.shape){ state.shape = snap.shape; }
    if (snap.hoopCm){ state.hoopCm = snap.hoopCm; }
    applyShapeUI();
    el.widthInput.value = state.width; el.heightInput.value = state.height;
    resizeCanvas(); renderCanvas(); updateFabricSize();
  }
  function updateHistoryButtons(){
    if (el.undoBtn) el.undoBtn.disabled = !undoStack.length;
    if (el.redoBtn) el.redoBtn.disabled = !redoStack.length;
  }
  function pushUndo(){
    undoStack.push(snapshot());
    if (undoStack.length > 25) undoStack.shift();
    redoStack = [];   // a new change replaces whatever was undone
    updateHistoryButtons();
  }
  function undo(){
    if (!undoStack.length) return;
    redoStack.push(snapshot());
    if (redoStack.length > 25) redoStack.shift();
    restoreSnapshot(undoStack.pop());
    updateHistoryButtons();
  }
  function redo(){
    if (!redoStack.length) return;
    undoStack.push(snapshot());
    restoreSnapshot(redoStack.pop());
    updateHistoryButtons();
  }

  var painting = false;
  // Which way a run of ticks is going: the first square decides, the rest of
  // the drag follows it, so a finger dragged across a row does one thing.
  var doneStroke = true;
  var backstitchLast = null;
  // While a line or a box is being dragged out, the cells it would cover are
  // held here and drawn as a translucent preview instead of being committed.
  var shapeStart = null, shapePreview = null;
  function cellFromEvent(ev){
    var rect = el.gridCanvas.getBoundingClientRect();
    var x = Math.floor((ev.clientX - rect.left) / state.cellSize);
    var y = Math.floor((ev.clientY - rect.top) / state.cellSize);
    if (x<0||y<0||x>=state.width||y>=state.height) return null;
    if (!inShape(x,y)) return null;
    return {x:x,y:y};
  }
  /* Every square a stroke touches, plus its mirror images. Snowflakes,
     borders and wreaths are drawn once and come out symmetrical. */
  function mirrorsOf(x, y){
    var out = [[x, y]];
    var mx = state.width - 1 - x, my = state.height - 1 - y;
    if (state.mirror === "h" || state.mirror === "both") out.push([mx, y]);
    if (state.mirror === "v" || state.mirror === "both") out.push([x, my]);
    if (state.mirror === "both") out.push([mx, my]);
    return out;
  }
  function paintAt(cell, erase){
    mirrorsOf(cell.x, cell.y).forEach(function(p){
      if (p[0] < 0 || p[1] < 0 || p[0] >= state.width || p[1] >= state.height) return;
      if (!inShape(p[0], p[1])) return;
      var key = p[0] + "-" + p[1];
      // A square that is taken out takes its "already sewn" tick with it.
      if (erase){ delete state.cells[key]; delete state.done[key]; }
      else state.cells[key] = state.selectedColor;
    });
  }
  // A cell even if it falls outside the hoop shape — used by the shape tools,
  // which clamp to the grid and then let inShape() filter at paint time.
  function rawCellFromEvent(ev){
    var rect = el.gridCanvas.getBoundingClientRect();
    var x = Math.floor((ev.clientX - rect.left) / state.cellSize);
    var y = Math.floor((ev.clientY - rect.top) / state.cellSize);
    return {
      x: Math.min(state.width-1, Math.max(0, x)),
      y: Math.min(state.height-1, Math.max(0, y))
    };
  }

  /* Flood fill: replaces the connected run of same-coloured (or same-empty)
     stitches the click landed on, the way a paint bucket does. */
  function floodFill(startX, startY, color){
    var startKey = startX + "-" + startY;
    var target = state.cells[startKey];          // undefined = empty area
    if (target === color) return 0;              // nothing would change
    var stack = [[startX, startY]], seen = {}, filled = 0;
    while (stack.length){
      var p = stack.pop();
      var x = p[0], y = p[1];
      if (x < 0 || y < 0 || x >= state.width || y >= state.height) continue;
      var k = x + "-" + y;
      if (seen[k]) continue;
      seen[k] = 1;
      if (!inShape(x,y)) continue;
      if (state.cells[k] !== target) continue;
      if (color) state.cells[k] = color; else { delete state.cells[k]; delete state.done[k]; }
      filled++;
      stack.push([x+1,y]); stack.push([x-1,y]); stack.push([x,y+1]); stack.push([x,y-1]);
    }
    return filled;
  }

  /* The cells a straight line or a box covers, in grid coordinates. Used for
     the live preview while dragging and for the committed shape on release. */
  function lineCells(a, b){
    var out = [];
    var x0=a.x, y0=a.y, x1=b.x, y1=b.y;
    var dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
    var sx = x0<x1 ? 1 : -1, sy = y0<y1 ? 1 : -1;
    var err = dx - dy;
    while (true){
      out.push({x:x0, y:y0});
      if (x0===x1 && y0===y1) break;
      var e2 = 2*err;
      if (e2 > -dy){ err -= dy; x0 += sx; }
      if (e2 < dx){ err += dx; y0 += sy; }
    }
    return out;
  }
  function rectCells(a, b, filled){
    var x0 = Math.min(a.x,b.x), x1 = Math.max(a.x,b.x);
    var y0 = Math.min(a.y,b.y), y1 = Math.max(a.y,b.y);
    var out = [];
    for (var y=y0; y<=y1; y++){
      for (var x=x0; x<=x1; x++){
        if (filled || x===x0 || x===x1 || y===y0 || y===y1) out.push({x:x, y:y});
      }
    }
    return out;
  }
  function commitCells(cells){
    var n = 0;
    cells.forEach(function(c){
      mirrorsOf(c.x, c.y).forEach(function(p){
        if (p[0] < 0 || p[1] < 0 || p[0] >= state.width || p[1] >= state.height) return;
        if (!inShape(p[0], p[1])) return;
        state.cells[p[0] + "-" + p[1]] = state.selectedColor;
        n++;
      });
    });
    return n;
  }
  function pickColorAt(cell){
    var code = state.cells[cell.x + "-" + cell.y];
    if (!code) return false;
    state.selectedColor = code;
    renderPalette();
    return true;
  }

  function cornerFromEvent(ev){
    var rect = el.gridCanvas.getBoundingClientRect();
    var px = ev.clientX - rect.left, py = ev.clientY - rect.top;
    var cx = Math.round(px/state.cellSize), cy = Math.round(py/state.cellSize);
    cx = Math.min(state.width, Math.max(0,cx));
    cy = Math.min(state.height, Math.max(0,cy));
    var dist = Math.hypot(px-cx*state.cellSize, py-cy*state.cellSize);
    if (dist > state.cellSize*0.55) return null;
    return {x:cx,y:cy};
  }
  function segKey(a,b){
    var p1=a.x+","+a.y, p2=b.x+","+b.y;
    return p1<p2 ? p1+"|"+p2 : p2+"|"+p1;
  }
  function addOneBackstitch(a,b,color){
    if (a.x===b.x && a.y===b.y) return;
    if (a.x<0||a.y<0||b.x<0||b.y<0) return;
    if (a.x>state.width||a.y>state.height||b.x>state.width||b.y>state.height) return;
    var key = segKey(a,b);
    for (var i=0;i<state.backstitches.length;i++){
      var s = state.backstitches[i];
      if (segKey({x:s.x1,y:s.y1},{x:s.x2,y:s.y2}) === key) return;
    }
    state.backstitches.push({x1:a.x,y1:a.y,x2:b.x,y2:b.y,color:color});
  }
  // Backstitch lines run between the holes, so their mirror is about the
  // grid lines rather than the squares — width minus x, not width-1 minus x.
  function addBackstitchSegment(a,b,color){
    addOneBackstitch(a,b,color);
    var mx = function(p){ return { x: state.width - p.x, y: p.y }; };
    var my = function(p){ return { x: p.x, y: state.height - p.y }; };
    if (state.mirror === "h" || state.mirror === "both") addOneBackstitch(mx(a), mx(b), color);
    if (state.mirror === "v" || state.mirror === "both") addOneBackstitch(my(a), my(b), color);
    if (state.mirror === "both") addOneBackstitch(my(mx(a)), my(mx(b)), color);
  }
  function pointToSegDist(px,py,x1,y1,x2,y2){
    var dx=x2-x1, dy=y2-y1;
    var len2 = dx*dx+dy*dy;
    var t = len2 ? ((px-x1)*dx+(py-y1)*dy)/len2 : 0;
    t = Math.max(0,Math.min(1,t));
    var cx=x1+t*dx, cy=y1+t*dy;
    return Math.hypot(px-cx,py-cy);
  }
  // The mirror images of one backstitch line, about the same centre lines the
  // drawing uses — so rubbing a line out takes its reflections with it.
  function mirrorsOfSegment(sg){
    var out = [];
    var mx = function(x){ return state.width - x; };
    var my = function(y){ return state.height - y; };
    if (state.mirror === "h" || state.mirror === "both")
      out.push({x1: mx(sg.x1), y1: sg.y1, x2: mx(sg.x2), y2: sg.y2});
    if (state.mirror === "v" || state.mirror === "both")
      out.push({x1: sg.x1, y1: my(sg.y1), x2: sg.x2, y2: my(sg.y2)});
    if (state.mirror === "both")
      out.push({x1: mx(sg.x1), y1: my(sg.y1), x2: mx(sg.x2), y2: my(sg.y2)});
    return out;
  }
  function sameSegment(a, b){
    return (a.x1===b.x1 && a.y1===b.y1 && a.x2===b.x2 && a.y2===b.y2) ||
           (a.x1===b.x2 && a.y1===b.y2 && a.x2===b.x1 && a.y2===b.y1);
  }
  function removeNearestBackstitch(px,py){
    var best=-1, bestDist=Infinity;
    state.backstitches.forEach(function(s,i){
      var d = pointToSegDist(px,py, s.x1*state.cellSize, s.y1*state.cellSize, s.x2*state.cellSize, s.y2*state.cellSize);
      if (d<bestDist){ bestDist=d; best=i; }
    });
    if (best<0 || bestDist >= state.cellSize*0.4) return;
    var gone = state.backstitches[best];
    var twins = mirrorsOfSegment(gone);
    state.backstitches.splice(best,1);
    if (!twins.length) return;
    state.backstitches = state.backstitches.filter(function(s){
      return !twins.some(function(t){ return sameSegment(s, t); });
    });
  }

  // A touch screen announces itself the first time a finger lands.
  window.addEventListener("pointerdown", function(ev){
    if (ev.pointerType === "touch") document.documentElement.classList.add("touch-input");
  }, true);

  /* ---------------- two fingers ----------------
     A tablet has no space bar to hold down and no wheel to spin, so the
     second finger does that work: drag with two fingers to slide the chart
     about, spread or pinch them to zoom. The first of those fingers has
     usually just laid a stitch down, so whatever it started is taken back
     the moment the second one lands. */
  var touchPoints = {};
  var gesture = null;
  var gestureHolds = false;     // stays true until every finger is lifted
  var strokePushedUndo = false; // the stroke in progress can be taken back

  function touchCount(){ return Object.keys(touchPoints).length; }
  function beginGesture(){
    var ids = Object.keys(touchPoints);
    if (ids.length < 2) return;
    var a = touchPoints[ids[0]], b = touchPoints[ids[1]];
    gesture = {
      dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2,
      cell: state.cellSize,
      scrollLeft: el.canvasScroll.scrollLeft,
      scrollTop: el.canvasScroll.scrollTop
    };
    gestureHolds = true;
    ids.forEach(function(id){
      if (el.gridCanvas.hasPointerCapture && el.gridCanvas.hasPointerCapture(+id)){
        try { el.gridCanvas.releasePointerCapture(+id); } catch(e){}
      }
    });
    if (selDrag){ selDrag = null; updateSelectionBar(); }
    shapePreview = null; shapeStart = null;
    backstitchLast = null;
    painting = false;
    if (strokePushedUndo){ undo(); strokePushedUndo = false; }
    renderCanvas(true);
  }
  function moveGesture(){
    var ids = Object.keys(touchPoints);
    if (!gesture || ids.length < 2) return;
    var a = touchPoints[ids[0]], b = touchPoints[ids[1]];
    var dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    var ratio = dist / gesture.dist;
    if (Math.abs(ratio - 1) > 0.015) setZoom(gesture.cell * ratio);
    var rect = el.canvasScroll.getBoundingClientRect();
    var localX = gesture.mx - rect.left, localY = gesture.my - rect.top;
    var scale = state.cellSize / gesture.cell;
    el.canvasScroll.scrollLeft = (gesture.scrollLeft + localX) * scale - localX - (mx - gesture.mx);
    el.canvasScroll.scrollTop  = (gesture.scrollTop + localY) * scale - localY - (my - gesture.my);
  }
  function endGesture(id){
    delete touchPoints[id];
    if (touchCount() < 2) gesture = null;
    if (touchCount() === 0) gestureHolds = false;
  }

  el.gridCanvas.addEventListener("pointerdown", function(ev){
    if (ev.pointerType === "touch"){
      // If a finger was ever lifted somewhere the page did not hear about,
      // the first finger of the next touch clears whatever was left over —
      // otherwise drawing would stay blocked for good.
      if (ev.isPrimary){ touchPoints = {}; gesture = null; gestureHolds = false; }
      touchPoints[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
      if (touchCount() >= 2){ beginGesture(); return; }
    }
    if (gestureHolds) return;
    // A piece waiting to be placed takes the click before any tool does.
    if (pendingStamp){
      if (ev.button === 2){ cancelStamp(); updateSelectionBar(); renderCanvas(true); return; }
      // A finger has no hover: the first tap shows where the piece would
      // land, the next one puts it there. A mouse has been showing the
      // preview all along, so its click places straight away.
      if (ev.pointerType === "touch"){
        var tc = rawCellFromEvent(ev);
        var tx = tc.x - Math.floor(pendingStamp.w / 2);
        var ty = tc.y - Math.floor(pendingStamp.h / 2);
        var settled = pendingStamp.x !== null &&
                      Math.abs(tx - pendingStamp.x) <= 1 && Math.abs(ty - pendingStamp.y) <= 1;
        if (!settled){
          pendingStamp.x = tx; pendingStamp.y = ty;
          updateSelectionBar();
          renderCanvas(true);
          return;
        }
      }
      placeStamp();
      return;
    }
    // Saumahamur takes the click before any drawing tool: nothing is added to
    // the pattern here, the square is only ticked off as sewn (or un-ticked).
    if (state.progressOn){
      var doneCell = cellFromEvent(ev);
      if (!doneCell) return;
      doneStroke = !(ev.button === 2 || ev.ctrlKey || state.done[doneCell.x + "-" + doneCell.y]);
      markDoneAt(doneCell, doneStroke);
      painting = true;
      el.gridCanvas.setPointerCapture(ev.pointerId);
      scheduleRender();
      return;
    }
    if (state.tool === "select"){
      var sc = rawCellFromEvent(ev);
      selDrag = { ax: sc.x, ay: sc.y, bx: sc.x, by: sc.y };
      selection = null;
      painting = true;
      el.gridCanvas.setPointerCapture(ev.pointerId);
      updateSelectionBar();
      renderCanvas(true);
      return;
    }
    // Alt-click picks the color under the pointer whatever tool is active —
    // the usual shortcut in a pixel editor.
    if (ev.altKey || state.tool === "pick"){
      var pc = cellFromEvent(ev);
      if (pc) pickColorAt(pc);
      if (state.tool === "pick") setTool("draw");
      return;
    }
    if (state.tool === "fill"){
      var fc = cellFromEvent(ev);
      if (!fc) return;
      pushUndo();
      strokePushedUndo = true;
      dismissSample();
      // With mirroring on, the same area is filled on the other side too —
      // each mirrored point is filled in its own right, since the shape
      // there is a mirror image, not the same run of squares.
      var fillColor = ev.button === 2 ? null : state.selectedColor;
      mirrorsOf(fc.x, fc.y).forEach(function(p){
        if (p[0] < 0 || p[1] < 0 || p[0] >= state.width || p[1] >= state.height) return;
        floodFill(p[0], p[1], fillColor);
      });
      renderCanvas();
      return;
    }
    if (state.tool === "line" || state.tool === "rect"){
      shapeStart = rawCellFromEvent(ev);
      shapePreview = [shapeStart];
      painting = true;
      el.gridCanvas.setPointerCapture(ev.pointerId);
      renderCanvas(true);
      return;
    }
    if (state.tool === "backstitch"){
      pushUndo();
      strokePushedUndo = true;
      dismissSample();
      var rect = el.gridCanvas.getBoundingClientRect();
      var px = ev.clientX-rect.left, py = ev.clientY-rect.top;
      if (ev.button === 2){
        // Keep the button down and drag to rub out a whole run of lines,
        // the way the eraser works on the squares.
        removeNearestBackstitch(px,py);
        backstitchLast = null;
        painting = true;
        el.gridCanvas.setPointerCapture(ev.pointerId);
        renderCanvas();
        return;
      }
      var c = cornerFromEvent(ev);
      if (!c) return;
      painting = true;
      el.gridCanvas.setPointerCapture(ev.pointerId);
      backstitchLast = c;
      return;
    }
    var cell = cellFromEvent(ev);
    var erasing = ev.button === 2 || state.tool === "erase";
    if (!cell && !erasing) return;
    painting = true;
    el.gridCanvas.setPointerCapture(ev.pointerId);
    pushUndo();
    strokePushedUndo = true;
    dismissSample();
    if (cell) paintAt(cell, erasing);
    // The "Eyða" tool (and a right-click anywhere) also removes the nearest
    // backstitch line under the pointer, so erasing isn't limited to a
    // separate right-click-while-in-backstitch-mode gesture.
    if (erasing){
      var rect = el.gridCanvas.getBoundingClientRect();
      removeNearestBackstitch(ev.clientX-rect.left, ev.clientY-rect.top);
    }
    renderCanvas();
  });
  el.gridCanvas.addEventListener("pointermove", function(ev){
    if (ev.pointerType === "touch" && touchPoints[ev.pointerId]){
      touchPoints[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
      if (gesture){ moveGesture(); return; }
    }
    if (gestureHolds) return;
    if (pendingStamp){
      var pc = rawCellFromEvent(ev);
      var nx = pc.x - Math.floor(pendingStamp.w / 2);
      var ny = pc.y - Math.floor(pendingStamp.h / 2);
      if (pendingStamp.x !== nx || pendingStamp.y !== ny){
        pendingStamp.x = nx; pendingStamp.y = ny;
        scheduleRender();
      }
      return;
    }
    if (!painting) return;
    if (state.progressOn){
      var dragDone = cellFromEvent(ev);
      if (dragDone && markDoneAt(dragDone, doneStroke)) scheduleRender();
      return;
    }
    if (state.tool === "select" && selDrag){
      var dc = rawCellFromEvent(ev);
      selDrag.bx = dc.x; selDrag.by = dc.y;
      scheduleRender();
      return;
    }
    if (state.tool === "line" || state.tool === "rect"){
      if (!shapeStart) return;
      var end = rawCellFromEvent(ev);
      shapePreview = state.tool === "line"
        ? lineCells(shapeStart, end)
        : rectCells(shapeStart, end, ev.shiftKey);
      scheduleRender();
      return;
    }
    if (state.tool === "backstitch"){
      var rect = el.gridCanvas.getBoundingClientRect();
      var px = ev.clientX-rect.left, py = ev.clientY-rect.top;
      if (ev.buttons === 2){ removeNearestBackstitch(px,py); scheduleRender(); return; }
      var c = cornerFromEvent(ev);
      if (!c || !backstitchLast) return;
      if (c.x !== backstitchLast.x || c.y !== backstitchLast.y){
        addBackstitchSegment(backstitchLast, c, state.selectedColor);
        backstitchLast = c;
        scheduleRender();
      }
      return;
    }
    var cell = cellFromEvent(ev);
    var erasing2 = ev.buttons === 2 || state.tool === "erase";
    if (!cell && !erasing2) return;
    if (cell) paintAt(cell, erasing2);
    if (erasing2){
      var rect2 = el.gridCanvas.getBoundingClientRect();
      removeNearestBackstitch(ev.clientX-rect2.left, ev.clientY-rect2.top);
    }
    scheduleRender();
  });
  ["pointerup","pointercancel","pointerleave"].forEach(function(evtName){
    el.gridCanvas.addEventListener(evtName, function(ev){
      if (ev && ev.pointerType === "touch") endGesture(ev.pointerId);
      strokePushedUndo = false;
      if (gestureHolds){ painting = false; return; }
      var wasPainting = painting;
      if (selDrag){
        var x1 = Math.min(selDrag.ax, selDrag.bx), x2 = Math.max(selDrag.ax, selDrag.bx);
        var y1 = Math.min(selDrag.ay, selDrag.by), y2 = Math.max(selDrag.ay, selDrag.by);
        selection = (x2 > x1 || y2 > y1)
          ? { x: x1, y: y1, w: x2 - x1 + 1, h: y2 - y1 + 1 } : null;
        selDrag = null;
        painting = false;
        updateSelectionBar();
        renderCanvas(true);
        return;
      }
      // A line or a box is only written into the pattern when the drag ends,
      // so the whole drag can be previewed and adjusted first.
      if (shapePreview && shapeStart){
        if (evtName === "pointerup" && shapePreview.length){
          pushUndo();
          dismissSample();
          commitCells(shapePreview);
        }
        shapePreview = null; shapeStart = null;
      }
      painting = false; backstitchLast = null;
      // Catch the legend (and any frame still queued) up with the finished stroke.
      if (wasPainting) renderCanvas();
    });
  });
  el.gridCanvas.addEventListener("contextmenu", function(ev){ ev.preventDefault(); });

  /* ---------------- selecting, copying and stamping ----------------
     A marquee picks out a piece of the chart; copying keeps it in a small
     clipboard of its own, and pasting hangs it off the pointer until a click
     puts it down. The same "pending stamp" is what the text tool uses, so a
     word can be placed where you want it instead of landing in a fixed spot. */
  var selection = null;          // {x, y, w, h} in squares
  var selDrag = null;            // the marquee being dragged out right now
  var clipboard = null;          // {w, h, cells:{}, back:[]}
  var pendingStamp = null;       // {w, h, cells, back, x, y} following the pointer

  function clearSelection(){ selection = null; selDrag = null; }
  function cancelStamp(){ pendingStamp = null; }

  function updateSelectionBar(){
    if (!el.selectionBar) return;
    var show = !!(selection || pendingStamp || clipboard);
    // The bar has a line of its own, so showing it never pushes the menus
    // off the end of the row above.
    if (el.selectionRow) el.selectionRow.classList.toggle("gen-hidden", !show);
    el.selectionBar.classList.toggle("gen-hidden", !show);
    if (!show) return;
    var placing = !!pendingStamp, area = !!selection && !placing;
    el.selCopyBtn.classList.toggle("gen-hidden", !area);
    el.selCutBtn.classList.toggle("gen-hidden", !area);
    el.selDeleteBtn.classList.toggle("gen-hidden", !area);
    el.pasteBtn.classList.toggle("gen-hidden", placing || !clipboard);
    el.stampFlipHBtn.classList.toggle("gen-hidden", !placing);
    el.stampFlipVBtn.classList.toggle("gen-hidden", !placing);
    if (el.stampRotateBtn) el.stampRotateBtn.classList.toggle("gen-hidden", !placing);
    if (el.stampPlaceBtn) el.stampPlaceBtn.classList.toggle("gen-hidden", !placing);
    el.selectionHint.textContent = t(placing ? "selHintPlace" : (area ? "selHintArea" : "selHintClip"));
  }

  // Lift the squares (and backstitch lines) inside the marquee out into a
  // little pattern of its own, with its top left corner as the origin.
  function grabSelection(sel){
    var out = { w: sel.w, h: sel.h, cells: {}, back: [] };
    for (var y = 0; y < sel.h; y++){
      for (var x = 0; x < sel.w; x++){
        var code = state.cells[(sel.x + x) + "-" + (sel.y + y)];
        if (code) out.cells[x + "-" + y] = code;
      }
    }
    state.backstitches.forEach(function(sg){
      if (Math.min(sg.x1, sg.x2) >= sel.x && Math.max(sg.x1, sg.x2) <= sel.x + sel.w &&
          Math.min(sg.y1, sg.y2) >= sel.y && Math.max(sg.y1, sg.y2) <= sel.y + sel.h){
        out.back.push({ x1: sg.x1 - sel.x, y1: sg.y1 - sel.y,
                        x2: sg.x2 - sel.x, y2: sg.y2 - sel.y, color: sg.color });
      }
    });
    return out;
  }
  function eraseSelection(sel){
    for (var y = 0; y < sel.h; y++){
      for (var x = 0; x < sel.w; x++){
        var k = (sel.x + x) + "-" + (sel.y + y);
        delete state.cells[k];
        delete state.done[k];
      }
    }
    state.backstitches = state.backstitches.filter(function(sg){
      return !(Math.min(sg.x1, sg.x2) >= sel.x && Math.max(sg.x1, sg.x2) <= sel.x + sel.w &&
               Math.min(sg.y1, sg.y2) >= sel.y && Math.max(sg.y1, sg.y2) <= sel.y + sel.h);
    });
  }
  function flipStamp(axis){
    if (!pendingStamp) return;
    var src = pendingStamp, cells = {};
    Object.keys(src.cells).forEach(function(k){
      var p = k.split("-"), x = +p[0], y = +p[1];
      var nx = axis === "h" ? src.w - 1 - x : x;
      var ny = axis === "v" ? src.h - 1 - y : y;
      cells[nx + "-" + ny] = src.cells[k];
    });
    src.cells = cells;
    src.back = src.back.map(function(sg){
      return {
        x1: axis === "h" ? src.w - sg.x1 : sg.x1, y1: axis === "v" ? src.h - sg.y1 : sg.y1,
        x2: axis === "h" ? src.w - sg.x2 : sg.x2, y2: axis === "v" ? src.h - sg.y2 : sg.y2,
        color: sg.color
      };
    });
    renderCanvas(true);
  }
  // A quarter turn clockwise: the piece keeps the middle it had, so it does
  // not jump out from under the pointer, and its width and height swap.
  function rotateStamp(){
    if (!pendingStamp) return;
    var src = pendingStamp, cells = {};
    Object.keys(src.cells).forEach(function(k){
      var p = k.split("-"), x = +p[0], y = +p[1];
      cells[(src.h - 1 - y) + "-" + x] = src.cells[k];
    });
    var back = src.back.map(function(sg){
      return { x1: src.h - sg.y1, y1: sg.x1, x2: src.h - sg.y2, y2: sg.x2, color: sg.color };
    });
    var newW = src.h, newH = src.w;
    if (src.x !== null){
      src.x = src.x + Math.floor(src.w / 2) - Math.floor(newW / 2);
      src.y = src.y + Math.floor(src.h / 2) - Math.floor(newH / 2);
    }
    src.cells = cells; src.back = back; src.w = newW; src.h = newH;
    renderCanvas(true);
  }
  function startStamp(piece){
    pendingStamp = { w: piece.w, h: piece.h, cells: piece.cells, back: piece.back, x: null, y: null };
    clearSelection();
    updateSelectionBar();
    renderCanvas(true);
  }
  function placeStamp(){
    if (!pendingStamp || pendingStamp.x === null) return;
    pushUndo();
    // Writing a name over the little sample heart means replacing it, not
    // stitching on top of it.
    if (state.isSample && pendingStamp.fromText){ state.cells = {}; state.backstitches = []; }
    dismissSample();
    var ox = pendingStamp.x, oy = pendingStamp.y;
    Object.keys(pendingStamp.cells).forEach(function(k){
      var p = k.split("-"), x = ox + +p[0], y = oy + +p[1];
      if (x < 0 || y < 0 || x >= state.width || y >= state.height) return;
      if (!inShape(x, y)) return;
      state.cells[x + "-" + y] = pendingStamp.cells[k];
    });
    pendingStamp.back.forEach(function(sg){
      addOneBackstitch({ x: sg.x1 + ox, y: sg.y1 + oy }, { x: sg.x2 + ox, y: sg.y2 + oy }, sg.color);
    });
    pendingStamp = null;
    updateSelectionBar();
    renderCanvas();
  }

  // A fresh copy of what is on the clipboard, so placing it once does not
  // spend it — the same piece can be put down again and again.
  function stampFromClipboard(){
    if (!clipboard) return;
    startStamp({ w: clipboard.w, h: clipboard.h,
                 cells: JSON.parse(JSON.stringify(clipboard.cells)),
                 back: JSON.parse(JSON.stringify(clipboard.back)) });
  }
  function copySelection(){
    if (!selection) return;
    clipboard = grabSelection(selection);
    stampFromClipboard();
  }
  function cutSelection(){
    if (!selection) return;
    clipboard = grabSelection(selection);
    pushUndo();
    eraseSelection(selection);
    renderCanvas();
    stampFromClipboard();
  }
  function deleteSelection(){
    if (!selection) return;
    pushUndo();
    eraseSelection(selection);
    clearSelection();
    updateSelectionBar();
    renderCanvas();
  }
  /* "Hætta við" means done with the whole business: the piece stops following
     the pointer, the marquee goes, and the kept copy is thrown away — so the
     bar leaves the screen instead of sitting there offering to paste. */
  function dropSelectionWork(){
    cancelStamp();
    clearSelection();
    clipboard = null;
    updateSelectionBar();
    renderCanvas(true);
  }
  if (el.selCopyBtn) el.selCopyBtn.addEventListener("click", copySelection);
  if (el.selCutBtn) el.selCutBtn.addEventListener("click", cutSelection);
  if (el.selDeleteBtn) el.selDeleteBtn.addEventListener("click", deleteSelection);
  if (el.pasteBtn) el.pasteBtn.addEventListener("click", stampFromClipboard);
  if (el.stampRotateBtn) el.stampRotateBtn.addEventListener("click", rotateStamp);
  if (el.stampPlaceBtn) el.stampPlaceBtn.addEventListener("click", function(){
    if (!pendingStamp) return;
    // Nowhere chosen yet (a finger has not tapped): drop it in the middle of
    // what is on screen.
    if (pendingStamp.x === null){
      var sc = el.canvasScroll;
      var cx = Math.round((sc.scrollLeft + sc.clientWidth/2) / state.cellSize);
      var cy = Math.round((sc.scrollTop + sc.clientHeight/2) / state.cellSize);
      pendingStamp.x = Math.max(0, Math.min(state.width - 1, cx - Math.floor(pendingStamp.w/2)));
      pendingStamp.y = Math.max(0, Math.min(state.height - 1, cy - Math.floor(pendingStamp.h/2)));
    }
    placeStamp();
  });
  if (el.stampFlipHBtn) el.stampFlipHBtn.addEventListener("click", function(){ flipStamp("h"); });
  if (el.stampFlipVBtn) el.stampFlipVBtn.addEventListener("click", function(){ flipStamp("v"); });
  if (el.selCancelBtn) el.selCancelBtn.addEventListener("click", dropSelectionWork);

  /* ---------------- dragging the chart around ----------------
     Zoomed in, the chart is bigger than its frame and reaching a far corner
     with the scrollbars is fiddly. Holding space (or the middle button) turns
     the pointer into a hand: drag and the view follows, without a stitch
     being laid down. */
  var spaceHeld = false, panFrom = null;
  function setPanCursor(on){
    if (el.canvasScroll) el.canvasScroll.classList.toggle("panning", on);
  }
  window.addEventListener("keydown", function(ev){
    if (ev.code !== "Space") return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((ev.target && ev.target.tagName) || "")) return;
    if (!spaceHeld){ spaceHeld = true; setPanCursor(true); }
    ev.preventDefault();
  });
  window.addEventListener("keyup", function(ev){
    if (ev.code === "Space"){ spaceHeld = false; if (!panFrom) setPanCursor(false); }
  });
  window.addEventListener("blur", function(){ spaceHeld = false; panFrom = null; setPanCursor(false); });
  el.canvasScroll.addEventListener("pointerdown", function(ev){
    if (!spaceHeld && ev.button !== 1) return;
    ev.preventDefault();
    ev.stopPropagation();
    panFrom = { x: ev.clientX, y: ev.clientY,
                left: el.canvasScroll.scrollLeft, top: el.canvasScroll.scrollTop };
    setPanCursor(true);
    el.canvasScroll.setPointerCapture(ev.pointerId);
  }, true);
  el.canvasScroll.addEventListener("pointermove", function(ev){
    if (!panFrom) return;
    ev.preventDefault();
    ev.stopPropagation();
    el.canvasScroll.scrollLeft = panFrom.left - (ev.clientX - panFrom.x);
    el.canvasScroll.scrollTop = panFrom.top - (ev.clientY - panFrom.y);
  }, true);
  ["pointerup","pointercancel"].forEach(function(name){
    el.canvasScroll.addEventListener(name, function(ev){
      if (!panFrom) return;
      panFrom = null;
      setPanCursor(spaceHeld);
      if (el.canvasScroll.hasPointerCapture && el.canvasScroll.hasPointerCapture(ev.pointerId)){
        el.canvasScroll.releasePointerCapture(ev.pointerId);
      }
    }, true);
  });

  /* ---------------- toolbar wiring ---------------- */
  var TOOL_BUTTONS = [
    ["draw", "toolDraw"], ["fill", "toolFill"], ["line", "toolLine"],
    ["rect", "toolRect"], ["backstitch", "toolBackstitch"],
    ["erase", "toolErase"], ["pick", "toolPick"], ["select", "toolSelect"]
  ];
  function setTool(name){
    // Reaching for a drawing tool means she is back to designing.
    if (state.progressOn) setProgressMode(false);
    if (name !== "select"){ clearSelection(); updateSelectionBar(); }
    state.tool = name;
    TOOL_BUTTONS.forEach(function(pair){
      var btn = el[pair[1]];
      if (btn) btn.classList.toggle("active", pair[0] === name);
    });
  }
  TOOL_BUTTONS.forEach(function(pair){
    var btn = el[pair[1]];
    if (btn) btn.addEventListener("click", function(){ setTool(pair[0]); });
  });
  if (el.stitchViewBtn) el.stitchViewBtn.addEventListener("click", function(){
    state.stitchView = !state.stitchView;
    el.stitchViewBtn.classList.toggle("active", state.stitchView);
    renderCanvas();
  });
  el.undoBtn.addEventListener("click", undo);
  if (el.redoBtn) el.redoBtn.addEventListener("click", redo);
  el.clearBtn.addEventListener("click", function(){ pushUndo(); state.cells = {}; state.backstitches = []; state.done = {}; state.clipped = {}; state.clippedBack = []; state.rectSize = null; lastGenImage = null; dismissSample(); renderCanvas(); });
  window.addEventListener("keydown", function(ev){
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((ev.target && ev.target.tagName) || "");
    if ((ev.ctrlKey||ev.metaKey) && ev.key.toLowerCase() === "z"){
      ev.preventDefault();
      if (ev.shiftKey) redo(); else undo();
      return;
    }
    if ((ev.ctrlKey||ev.metaKey) && ev.key.toLowerCase() === "y"){ ev.preventDefault(); redo(); return; }
    // The usual copy, cut and paste keys work on the chart too — but only
    // when a text box is not the one wanting them.
    if ((ev.ctrlKey||ev.metaKey) && !typing && !helpOpen()){
      var clipKey = ev.key.toLowerCase();
      if (clipKey === "c" && selection){ ev.preventDefault(); copySelection(); return; }
      if (clipKey === "x" && selection){ ev.preventDefault(); cutSelection(); return; }
      if (clipKey === "v" && clipboard){ ev.preventDefault(); stampFromClipboard(); return; }
    }
    // Escape is heard even mid-word: with the text hanging off the pointer as
    // she types, the way out has to work without leaving the text box first.
    if (ev.key === "Escape"){
      if (helpOpen()){ ev.preventDefault(); closeHelp(); return; }
      if (pendingStamp || selection || clipboard){
        ev.preventDefault();
        dropSelectionWork();
      }
      return;
    }
    if (typing || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    // Single-key tool shortcuts, as in any drawing app.
    var arrows = { ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1] };
    if (arrows[ev.key]){
      ev.preventDefault();
      var step = ev.shiftKey ? 10 : 1;
      nudge(arrows[ev.key][0]*step, arrows[ev.key][1]*step);
      return;
    }
    // Delete (or Backspace) empties the squares inside the marquee — the same
    // thing the "Eyða" button in the bar does, and just as undoable.
    if ((ev.key === "Delete" || ev.key === "Backspace") && selection && !helpOpen()){
      ev.preventDefault();
      deleteSelection();
      return;
    }
    if (helpOpen()) return;
    var shortcuts = {b:"draw", g:"fill", l:"line", r:"rect", e:"erase", i:"pick", s:"backstitch", v:"select"};
    var pick = shortcuts[ev.key.toLowerCase()];
    if (pick){ ev.preventDefault(); setTool(pick); }
  });

  /* ---------------- transform: mirror / rotate ---------------- */
  function flipHorizontal(){
    pushUndo();
    var newCells = {};
    Object.keys(state.cells).forEach(function(k){
      var p = k.split("-"); var x=+p[0], y=+p[1];
      newCells[(state.width-1-x)+"-"+y] = state.cells[k];
    });
    state.cells = newCells;
    remapDone(function(x, y){ return [state.width-1-x, y]; });
    state.backstitches = state.backstitches.map(function(s){
      return { x1: state.width-s.x1, y1: s.y1, x2: state.width-s.x2, y2: s.y2, color: s.color };
    });
    renderCanvas();
  }
  function flipVertical(){
    pushUndo();
    var newCells = {};
    Object.keys(state.cells).forEach(function(k){
      var p = k.split("-"); var x=+p[0], y=+p[1];
      newCells[x+"-"+(state.height-1-y)] = state.cells[k];
    });
    state.cells = newCells;
    remapDone(function(x, y){ return [x, state.height-1-y]; });
    state.backstitches = state.backstitches.map(function(s){
      return { x1: s.x1, y1: state.height-s.y1, x2: s.x2, y2: state.height-s.y2, color: s.color };
    });
    renderCanvas();
  }
  function rotate90(){
    pushUndo();
    var newW = state.height, newH = state.width;
    var newCells = {};
    Object.keys(state.cells).forEach(function(k){
      var p = k.split("-"); var x=+p[0], y=+p[1];
      var nx = state.height-1-y, ny = x;
      newCells[nx+"-"+ny] = state.cells[k];
    });
    var newBack = state.backstitches.map(function(s){
      return { x1: state.height-s.y1, y1: s.x1, x2: state.height-s.y2, y2: s.x2, color: s.color };
    });
    remapDone(function(x, y){ return [state.height-1-y, x]; });
    state.width = newW; state.height = newH; state.cells = newCells; state.backstitches = newBack;
    el.widthInput.value = state.width; el.heightInput.value = state.height;
    resizeCanvas(); renderCanvas(); updateFabricSize(); updateZoomLabel();
  }
  el.flipHBtn.addEventListener("click", flipHorizontal);
  el.flipVBtn.addEventListener("click", flipVertical);
  el.rotateBtn.addEventListener("click", rotate90);

  /* ---------------- moving the whole pattern ----------------
     Stitches are keyed by position, so moving the design means rewriting the
     keys. Anything pushed past an edge is dropped, which is what the arrow
     keys should do — but the hoop's hidden corners move along too, so a
     nudge while the hoop is on does not quietly lose them. */
  function shiftPattern(dx, dy){
    if (!dx && !dy) return;
    var moved = {}, w = state.width, h = state.height;
    Object.keys(state.cells).forEach(function(k){
      var p = k.split("-"), x = +p[0] + dx, y = +p[1] + dy;
      if (x >= 0 && y >= 0 && x < w && y < h) moved[x + "-" + y] = state.cells[k];
    });
    state.cells = moved;
    remapDone(function(x, y){
      var nx = x + dx, ny = y + dy;
      return (nx >= 0 && ny >= 0 && nx < w && ny < h) ? [nx, ny] : null;
    });
    var movedClipped = {};
    Object.keys(state.clipped).forEach(function(k){
      var p = k.split("-"), x = +p[0] + dx, y = +p[1] + dy;
      if (x >= 0 && y >= 0 && x < w && y < h) movedClipped[x + "-" + y] = state.clipped[k];
    });
    state.clipped = movedClipped;
    var shiftSeg = function(sg){
      return { x1: sg.x1+dx, y1: sg.y1+dy, x2: sg.x2+dx, y2: sg.y2+dy, color: sg.color };
    };
    var inside = function(sg){
      return sg.x1 >= 0 && sg.y1 >= 0 && sg.x2 >= 0 && sg.y2 >= 0 &&
             sg.x1 <= w && sg.y1 <= h && sg.x2 <= w && sg.y2 <= h;
    };
    state.backstitches = state.backstitches.map(shiftSeg).filter(inside);
    state.clippedBack = state.clippedBack.map(shiftSeg).filter(inside);
  }
  // The smallest box that holds everything drawn, hidden hoop corners included.
  function patternBounds(){
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, any = false;
    var eat = function(x, y){
      any = true;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    };
    [state.cells, state.clipped].forEach(function(map){
      Object.keys(map).forEach(function(k){
        var p = k.split("-"); eat(+p[0], +p[1]);
      });
    });
    state.backstitches.concat(state.clippedBack).forEach(function(sg){
      eat(Math.min(sg.x1, sg.x2), Math.min(sg.y1, sg.y2));
      eat(Math.max(sg.x1, sg.x2) - 1, Math.max(sg.y1, sg.y2) - 1);
    });
    return any ? { minX: minX, minY: minY, maxX: maxX, maxY: maxY } : null;
  }
  function nudge(dx, dy){
    var b = patternBounds();
    if (!b) return;
    // Don't let a keypress push the design off the edge.
    dx = Math.max(-b.minX, Math.min(state.width - 1 - b.maxX, dx));
    dy = Math.max(-b.minY, Math.min(state.height - 1 - b.maxY, dy));
    if (!dx && !dy) return;
    pushUndo();
    dismissSample();
    shiftPattern(dx, dy);
    renderCanvas();
  }
  function centerPattern(){
    var b = patternBounds();
    if (!b) return;
    var dx = Math.round((state.width - 1 - b.maxX - b.minX) / 2);
    var dy = Math.round((state.height - 1 - b.maxY - b.minY) / 2);
    if (!dx && !dy) return;
    pushUndo();
    dismissSample();
    shiftPattern(dx, dy);
    renderCanvas();
  }
  if (el.centerBtn) el.centerBtn.addEventListener("click", centerPattern);
  if (el.mirrorSwitch) el.mirrorSwitch.querySelectorAll("button").forEach(function(b){
    b.addEventListener("click", function(){
      state.mirror = b.getAttribute("data-mirror");
      el.mirrorSwitch.querySelectorAll("button").forEach(function(o){
        o.classList.toggle("active", o === b);
      });
    });
  });

  function applySize(){
    var w = Math.min(400, Math.max(10, parseInt(el.widthInput.value,10) || state.width));
    var h = Math.min(400, Math.max(10, parseInt(el.heightInput.value,10) || state.height));
    if (w === state.width && h === state.height) return;
    pushUndo();
    state.width = w; state.height = h;
    if (lastGenImage){
      // Pattern came from a photo — re-sample it at the new grid size so the
      // picture keeps filling the chart instead of getting cropped/padded.
      regenerateFromImage();
    } else {
      var newCells = {};
      Object.keys(state.cells).forEach(function(k){
        var parts = k.split("-"); var x = +parts[0], y = +parts[1];
        if (x < w && y < h) newCells[k] = state.cells[k];
      });
      state.cells = newCells;
      remapDone(function(x, y){ return (x < w && y < h) ? [x, y] : null; });
    }
    state.backstitches = state.backstitches.filter(function(s){
      return s.x1<=w && s.y1<=h && s.x2<=w && s.y2<=h;
    });
    el.widthInput.value = w; el.heightInput.value = h;
    resizeCanvas(); renderCanvas(); updateFabricSize();
  }
  // The size applies live — on losing focus, the spinner arrows, or Enter —
  // there is no separate "apply" step.
  [el.widthInput, el.heightInput].forEach(function(inp){
    inp.addEventListener("change", applySize);
    inp.addEventListener("keydown", function(ev){
      if (ev.key === "Enter"){ ev.preventDefault(); applySize(); inp.blur(); }
    });
  });
  function applyGenSize(){
    if (!el.genWidth) return;
    el.widthInput.value = el.genWidth.value;
    el.heightInput.value = el.genHeight.value;
    applySize();
    // applySize clamps what it was given, so read the result back.
    el.genWidth.value = state.width; el.genHeight.value = state.height;
  }
  [el.genWidth, el.genHeight].forEach(function(inp){
    if (!inp) return;
    inp.addEventListener("change", applyGenSize);
    inp.addEventListener("keydown", function(ev){
      if (ev.key === "Enter"){ ev.preventDefault(); applyGenSize(); inp.blur(); }
    });
  });

  el.aidaCount.addEventListener("change", function(){
    // Aida count changes what one stitch measures in real life, so the
    // on-screen zoom (in % of true size) would silently drift unless we
    // rescale cellSize here to keep the same zoom percentage relative to
    // the new actual size (e.g. staying at 100% = raunstærð).
    var pctBefore = state.cellSize / actualCellPx();
    state.aidaCount = parseInt(el.aidaCount.value, 10) || 14;
    if (state.shape === "circle") applyHoopSize();
    setZoom(actualCellPx() * pctBefore);
    updateFabricSize();
  });

  function actualCellPx(){
    // state.pxPerCm is calibrated (by default assumes the 96 CSS px/inch
    // reference) — converted here into px per stitch cell at this aida count.
    var cmPerStitch = 2.54 / state.aidaCount;
    return state.pxPerCm * cmPerStitch;
  }
  function zoomPercent(){
    var actual = actualCellPx();
    var pct = Math.round((state.cellSize / actual) * 100);
    // cellSize is exact (never rounded to a whole pixel), so "actual size" is
    // exactly 100% — this is only insurance against floating-point drift.
    if (Math.abs(state.cellSize - actual) < 0.01) pct = 100;
    return pct;
  }
  function updateZoomLabel(){
    // While she is typing in the box, the zoom she is halfway through writing
    // must not be overwritten by the one the chart is still at.
    if (!el.zoomInput || document.activeElement === el.zoomInput) return;
    el.zoomInput.value = String(zoomPercent());
  }
  /* The percentage is not only a reading: type one in and the chart goes
     there. Anything the zoom limits will not allow is pulled back inside
     them, and the box then shows where it actually landed. */
  function applyZoomInput(){
    if (!el.zoomInput) return;
    var typed = String(el.zoomInput.value).replace(",", ".").replace(/[%\s]/g, "");
    var pct = parseFloat(typed);
    if (!isFinite(pct) || pct <= 0){
      el.zoomInput.value = String(zoomPercent());   // nonsense: put the old number back
      return;
    }
    setZoom(actualCellPx() * (pct / 100));
    el.zoomInput.value = String(zoomPercent());
  }
  if (el.zoomInput){
    el.zoomInput.addEventListener("focus", function(){ el.zoomInput.select(); });
    el.zoomInput.addEventListener("change", applyZoomInput);
    el.zoomInput.addEventListener("keydown", function(ev){
      if (ev.key === "Enter"){
        ev.preventDefault();
        applyZoomInput();
        el.zoomInput.blur();
      } else if (ev.key === "Escape"){
        ev.preventDefault();
        el.zoomInput.value = String(zoomPercent());
        el.zoomInput.blur();
      }
    });
  }
  function setZoom(v){
    // Keep cellSize as an exact (fractional) value rather than rounding to a
    // whole pixel — rounding "Raunstærð" to the nearest px compounds across
    // every stitch (e.g. 60 stitches × a 0.1px rounding error = 6px, enough
    // to make a "13 cm" pattern measure closer to 12.8 cm with a ruler).
    // Canvases render fine at fractional widths, so there's no downside.
    // The limits stretch to include true size, so "Raunstærð" is always
    // reachable — on fine fabric (25/28-count) one stitch is barely 3.5px,
    // which a fixed 4px floor used to clamp away into a false 100%.
    var actual = actualCellPx();
    var minCell = Math.min(2, actual), maxCell = Math.max(60, actual);
    state.cellSize = Math.min(maxCell, Math.max(minCell, v));
    updateZoomLabel();
    resizeCanvas(); renderCanvas();
  }
  el.zoomOut.addEventListener("click", function(){ setZoom(state.cellSize - 2); });
  el.zoomIn.addEventListener("click", function(){ setZoom(state.cellSize + 2); });
  el.actualSizeBtn.addEventListener("click", function(){ setZoom(actualCellPx()); });

  // Fit the whole chart inside the visible frame — the way to get an
  // overview of a large pattern without clicking "−" twenty times.
  function fitToScreen(){
    if (!el.canvasScroll) return;
    var box = el.canvasScroll.getBoundingClientRect();
    // The frame is only as tall as whatever it currently holds, so measuring
    // its height would shrink the chart a bit more on every click. Measure
    // the room actually available on screen instead: down to the bottom of
    // the window, capped at the frame's own 88vh limit.
    var pad = 60 + (state.coordsOn ? RULER_GUTTER : 0);
    var roomBelow = window.innerHeight - box.top - 24;
    var maxH = Math.min(window.innerHeight * 0.88, Math.max(260, roomBelow));
    var availW = Math.max(60, box.width - pad);
    var availH = Math.max(60, maxH - pad);
    var fitCell = Math.min(availW / state.width, availH / state.height);
    // When the chart very nearly fills the frame at true size, land on
    // exactly 100% rather than an odd 105% — it still fits, and true size is
    // the number that means something when you hold a ruler to the screen.
    var actual = actualCellPx();
    if (fitCell > actual && fitCell <= actual * 1.25) fitCell = actual;
    setZoom(fitCell);
  }
  if (el.fitBtn) el.fitBtn.addEventListener("click", fitToScreen);

  // Ctrl/⌘ + wheel zooms the chart (plain wheel keeps scrolling the frame),
  // keeping the stitch under the pointer roughly in place.
  el.canvasScroll.addEventListener("wheel", function(ev){
    if (!(ev.ctrlKey || ev.metaKey)) return;
    ev.preventDefault();
    var rect = el.gridCanvas.getBoundingClientRect();
    var relX = (ev.clientX - rect.left) / Math.max(1, rect.width);
    var relY = (ev.clientY - rect.top) / Math.max(1, rect.height);
    var before = state.cellSize;
    setZoom(state.cellSize * (ev.deltaY < 0 ? 1.12 : 1/1.12));
    if (state.cellSize !== before){
      var grew = state.width * state.cellSize - state.width * before;
      var grewY = state.height * state.cellSize - state.height * before;
      el.canvasScroll.scrollLeft += grew * relX;
      el.canvasScroll.scrollTop += grewY * relY;
    }
  }, {passive:false});

  if (el.calibrateToggleBtn && el.calibrateBox){
    el.calibrateToggleBtn.addEventListener("click", function(){
      el.calibrateBox.classList.toggle("gen-hidden");
      // Prefill with what the bar measures under the current calibration, so
      // it is clear what is stored and an adjustment starts from there.
      if (!el.calibrateBox.classList.contains("gen-hidden") && el.calibrateInput && el.calibrateBar){
        var barPx = el.calibrateBar.getBoundingClientRect().width;
        if (barPx > 0) el.calibrateInput.value = (barPx / state.pxPerCm).toFixed(1);
      }
    });
  }
  if (el.calibrateSaveBtn){
    el.calibrateSaveBtn.addEventListener("click", function(){
      var measured = parseFloat(el.calibrateInput.value);
      if (!measured || measured <= 0){
        el.calibrateStatus.textContent = t("calibrateInvalid");
        return;
      }
      var barPx = el.calibrateBar.getBoundingClientRect().width;
      state.pxPerCm = barPx / measured;
      try { localStorage.setItem("reitasaumur_pxPerCm", String(state.pxPerCm)); } catch(e){}
      el.calibrateStatus.textContent = t("calibrateSaved");
      updateZoomLabel();
      if (Math.abs(state.cellSize - actualCellPx()) < 3) setZoom(actualCellPx());
    });
  }

  el.symbolsToggle.addEventListener("change", function(){ state.symbolsOn = el.symbolsToggle.checked; renderCanvas(); });
  el.printToggle.addEventListener("change", function(){ state.printOn = el.printToggle.checked; renderCanvas(); });
  if (el.bgColorInput) el.bgColorInput.addEventListener("input", function(){
    state.bgColor = el.bgColorInput.value;
    try { localStorage.setItem("reitasaumur_bgColor", state.bgColor); } catch(e){}
    renderCanvas();
  });
  if (el.coordsToggle) el.coordsToggle.addEventListener("change", function(){
    state.coordsOn = el.coordsToggle.checked;
    try { localStorage.setItem("reitasaumur_coords", state.coordsOn ? "1" : "0"); } catch(e){}
    resizeCanvas(); renderCanvas();
  });

  if (el.marginInput) el.marginInput.addEventListener("input", function(){
    try { localStorage.setItem("reitasaumur_margin", String(marginCm())); } catch(e){}
    updateFabricSize();
  });

  el.flossToggle.addEventListener("change", function(){ state.showFloss = el.flossToggle.checked; renderLegend(); });

  function dismissSample(){
    if (!state.isSample) return;
    state.isSample = false;
  }

  el.newBtn.addEventListener("click", function(){
    clearDraft();
    state.cells = {};
    state.backstitches = [];
    state.done = {};
    state.name = "";
    state.currentPatternId = null;
    el.patternName.value = "";
    state.isSample = false;
    lastGenImage = null;
    state.clipped = {}; state.clippedBack = []; state.rectSize = null;
    // Both stacks go, or "redo" could pull the old pattern into the new one.
    undoStack = []; redoStack = [];
    updateHistoryButtons();
    renderCanvas();
    renderSavedList();
  });

  /* ---------------- persistence (this browser) ----------------
     Patterns live in this browser's own storage, not in a shared store, so
     they stay on the machine they were made on — and stay private even if
     the page itself is shared with someone else. Browser storage is small
     (a few MB), so a pattern is kept in a compact form: one short string per
     row, with the DMC codes listed once, instead of one entry per stitch.
     That is roughly fifteen times smaller for a big chart. */
  var STORE_KEY = "reitasaumur_patterns";
  var CELL_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+,/:;<=>?@[]^_{|}~";

  function readStore(){
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch(e){ return []; }
  }
  function writeStore(list){
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; }
    catch(e){ return false; }
  }
  function encodeCells(){
    var codes = [], index = {};
    Object.keys(state.cells).forEach(function(k){
      var c = state.cells[k];
      if (index[c] === undefined){ index[c] = codes.length; codes.push(c); }
    });
    if (codes.length > CELL_CHARS.length) return { cells: state.cells };  // very rare
    var rows = [];
    for (var y=0; y<state.height; y++){
      var row = "";
      for (var x=0; x<state.width; x++){
        var code = state.cells[x+"-"+y];
        row += code === undefined ? "." : CELL_CHARS.charAt(index[code]);
      }
      rows.push(row);
    }
    return { colors: codes, rows: rows };
  }
  function decodeCells(entry){
    if (entry && entry.rows && entry.colors){
      var cells = {};
      for (var y=0; y<entry.rows.length; y++){
        var row = entry.rows[y];
        if (typeof row !== "string") continue;
        for (var x=0; x<row.length; x++){
          var ch = row.charAt(x);
          if (ch === ".") continue;
          var idx = CELL_CHARS.indexOf(ch);
          var code = entry.colors[idx];
          if (code) cells[x+"-"+y] = code;
        }
      }
      return cells;
    }
    return (entry && entry.cells) || {};
  }
  /* The "already sewn" ticks travel with the pattern, in the same compact
     one-string-per-row shape as the stitches themselves. */
  function encodeDone(){
    if (!Object.keys(state.done).length) return null;
    var rows = [];
    for (var y=0; y<state.height; y++){
      var row = "";
      for (var x=0; x<state.width; x++) row += state.done[x+"-"+y] ? "#" : ".";
      rows.push(row);
    }
    return rows;
  }
  function decodeDone(entry){
    var out = {};
    if (!entry || !Array.isArray(entry.done)) return out;
    for (var y=0; y<entry.done.length; y++){
      var row = entry.done[y];
      if (typeof row !== "string") continue;
      for (var x=0; x<row.length; x++) if (row.charAt(x) === "#") out[x+"-"+y] = 1;
    }
    return out;
  }
  /* ---------------- the working draft ----------------
     Patterns are only in the saved list once you press save, so anything
     drawn since then would be lost if the browser closed. A copy of the work
     in progress is kept quietly on the side and picked up again next time
     the page opens. */
  var DRAFT_KEY = "reitasaumur_draft";
  var draftTimer = null;
  function writeDraft(){
    draftTimer = null;
    if (state.isSample) return;
    try {
      var doc = patternEntry(state.currentPatternId || "");
      doc.savedId = state.currentPatternId || null;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(doc));
    } catch(e){}
  }
  function scheduleDraftSave(){
    if (state.isSample) return;
    if (draftTimer) clearTimeout(draftTimer);
    draftTimer = setTimeout(writeDraft, 1200);
  }
  function clearDraft(){
    if (draftTimer){ clearTimeout(draftTimer); draftTimer = null; }
    try { localStorage.removeItem(DRAFT_KEY); } catch(e){}
  }
  function readDraft(){
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      var doc = JSON.parse(raw);
      if (!doc || typeof doc.width !== "number" || typeof doc.height !== "number") return null;
      var any = (doc.rows && doc.rows.length) || (doc.cells && Object.keys(doc.cells).length) ||
                (doc.backstitches && doc.backstitches.length);
      return any ? doc : null;
    } catch(e){ return null; }
  }
  // A last chance to write the draft when the tab is being closed, since the
  // timer above may not have fired yet.
  window.addEventListener("pagehide", function(){ if (draftTimer) writeDraft(); });
  document.addEventListener("visibilitychange", function(){
    if (document.visibilityState === "hidden" && draftTimer) writeDraft();
  });

  function patternEntry(id){
    var packed = encodeCells();
    var doc = {
      id: id,
      name: (el.patternName.value || t("unnamedPattern")).trim(),
      width: state.width,
      height: state.height,
      aidaCount: state.aidaCount,
      shape: state.shape,
      hoopCm: state.hoopCm,
      bgColor: state.bgColor,
      backstitches: state.backstitches,
      stitches: Object.keys(state.cells).length,
      updatedAt: new Date().toISOString()
    };
    if (packed.rows){ doc.colors = packed.colors; doc.rows = packed.rows; }
    else doc.cells = packed.cells;
    var doneRows = encodeDone();
    if (doneRows) doc.done = doneRows;
    return doc;
  }

  el.saveBtn.addEventListener("click", function(){ savePattern(false); });
  el.saveAsBtn.addEventListener("click", function(){ savePattern(true); });

  function savePattern(forceNew){
    var list = readStore();
    var id = (!forceNew && state.currentPatternId) ? state.currentPatternId
           : "p" + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    var doc = patternEntry(id);
    if (!el.patternName.value.trim()) el.patternName.value = doc.name;
    var at = -1;
    for (var i=0;i<list.length;i++) if (list[i] && list[i].id === id){ at = i; break; }
    if (at >= 0) list[at] = doc; else list.unshift(doc);
    if (!writeStore(list)){
      setDbStatus("storageFull");
      return;
    }
    state.currentPatternId = id;
    savedDocs = list;
    renderSavedList();
    setDbStatus(at >= 0 ? "savedNotice" : "savedAsNewNotice", {name: doc.name});
  }

  function loadPattern(id, data){
    pushUndo();
    lastGenImage = null;
    state.clipped = {}; state.clippedBack = []; state.rectSize = null;
    state.width = data.width; state.height = data.height;
    state.cells = decodeCells(data);
    state.done = decodeDone(data);
    state.backstitches = data.backstitches || [];
    state.aidaCount = data.aidaCount || 14;
    // Older saved patterns have no shape — those are rectangular.
    state.shape = data.shape === "circle" ? "circle" : "rect";
    if (data.hoopCm) state.hoopCm = data.hoopCm;
    if (data.bgColor && /^#[0-9a-fA-F]{6}$/.test(data.bgColor)){
      state.bgColor = data.bgColor;
      if (el.bgColorInput) el.bgColorInput.value = state.bgColor;
    }
    state.currentPatternId = id;
    state.name = data.name;
    state.isSample = false;
    el.patternName.value = data.name || "";
    el.widthInput.value = state.width; el.heightInput.value = state.height;
    el.aidaCount.value = String(state.aidaCount);
    applyShapeUI();
    // Keep the chart at true size for the loaded pattern's fabric count.
    setZoom(actualCellPx());
    resizeCanvas(); renderCanvas(); renderSavedList(); updateFabricSize();
  }

  function deletePattern(id){
    var list = readStore().filter(function(d){ return d && d.id !== id; });
    writeStore(list);
    savedDocs = list;
    if (state.currentPatternId === id) state.currentPatternId = null;
    renderSavedList();
    clearDbStatus();
  }

  function renderSavedList(){
    if (!savedDocs.length){
      el.savedList.innerHTML = '<p class="legend-empty">' + t("noSavedPatterns") + '</p>';
      return;
    }
    el.savedList.innerHTML = "";
    savedDocs.forEach(function(data){
      if (!data || !data.id) return;
      var row = document.createElement("div");
      row.className = "saved-row" + (data.id === state.currentPatternId ? " current" : "");
      var stitchCount = data.stitches != null ? data.stitches
        : (data.cells ? Object.keys(data.cells).length : 0);
      var fsize = fabricSizeText(data.width, data.height, data.aidaCount || 14);
      var meta = t("savedRowMeta", {w:data.width, h:data.height, n:stitchCount, fsize:fsize, rel:relTime(data.updatedAt)});
      row.innerHTML =
        '<div class="saved-info"><div class="n"></div>' +
        '<div class="m mono"></div></div>' +
        '<div class="saved-actions"><button class="small" data-act="open"></button><button class="small ghost-danger" data-act="del"></button></div>';
      row.querySelector(".n").textContent = data.name || t("unnamedPattern");
      row.querySelector(".m").textContent = meta;
      row.querySelector('[data-act="open"]').textContent = t("openBtn");
      row.querySelector('[data-act="del"]').textContent = t("delBtn");
      row.querySelector('[data-act="open"]').addEventListener("click", function(){ loadPattern(data.id, data); });
      row.querySelector('[data-act="del"]').addEventListener("click", function(){ deletePattern(data.id); });
      el.savedList.appendChild(row);
    });
  }

  /* ---------------- export ---------------- */
  function safeFileName(fallback){
    return ((el.patternName.value||fallback).trim().replace(/[^\w\-\.æöþáéíóúýÆÖÞÁÉÍÓÚÝð ]/g,"") || fallback);
  }

  el.exportBtn.addEventListener("click", function(){
    if (!downloads){ setDbStatus("downloadImageUnavailable"); return; }
    var cs = exportCellPx(30);
    var off = document.createElement("canvas");
    off.width = state.width*cs; off.height = state.height*cs;
    var octx = off.getContext("2d");
    paintChart(octx, state.width, state.height, cs, {
      printMode: state.printOn, forceSymbols: state.symbolsOn || state.printOn,
      minorColor: "rgba(0,0,0,.12)", majorColor: "rgba(0,0,0,.3)", bgColor: state.bgColor
    });
    off.toBlob(function(blob){
      var fname = safeFileName("mynstur") + ".png";
      downloads.save({filename: fname, data: blob})
        .then(function(){ setDbStatus("imageSaved"); })
        .catch(function(e){ if (e && e.code !== "declined") setDbStatus("imageSaveFailed"); });
    }, "image/png");
  });

  /* ---------------- the pattern as a file ----------------
     The saved list lives in this browser alone, so a pattern would be lost
     with the browser. Downloading it writes the pattern itself — squares,
     backstitch, size, fabric and all — into a small file that can be kept
     somewhere safe, moved to another computer, or sent to someone else. */
  function patternFileDoc(){
    var doc = patternEntry(state.currentPatternId || "p" + Date.now().toString(36));
    return { app: "krosssaumur", kind: "pattern", version: 1, pattern: doc };
  }
  el.exportFileBtn.addEventListener("click", function(){
    if (!downloads){ setDbStatus("downloadFileUnavailable"); return; }
    var text = JSON.stringify(patternFileDoc());
    var blob = new Blob([text], {type: "application/json"});
    var fname = safeFileName("mynstur") + ".krosssaumur.json";
    downloads.save({filename: fname, data: blob})
      .then(function(){ setDbStatus("fileSaved"); })
      .catch(function(e){ if (e && e.code !== "declined") setDbStatus("fileSaveFailed"); });
  });

  // Every saved pattern in one file — a backup of the whole list, or a way
  // to carry it to another computer.
  if (el.exportAllBtn) el.exportAllBtn.addEventListener("click", function(){
    if (!downloads){ setDbStatus("downloadFileUnavailable"); return; }
    var list = readStore().filter(function(d){ return d && d.id; });
    if (!list.length){ setDbStatus("libraryNone", null); return; }
    var text = JSON.stringify({ app: "krosssaumur", kind: "library", version: 1, patterns: list });
    var blob = new Blob([text], {type: "application/json"});
    downloads.save({filename: "krosssaumur-safn.json", data: blob})
      .then(function(){ setDbStatus("librarySaved", {n: list.length}); })
      .catch(function(e){ if (e && e.code !== "declined") setDbStatus("fileSaveFailed"); });
  });

  el.importFileBtn.addEventListener("click", function(){ el.importFileInput.click(); });
  el.importFileInput.addEventListener("change", function(){
    var file = el.importFileInput.files && el.importFileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      var doc = null;
      try { doc = JSON.parse(String(reader.result)); } catch(e){ doc = null; }
      // A whole library goes straight into the saved list instead of onto
      // the chart; patterns with the same id are replaced by the newer copy.
      if (doc && Array.isArray(doc.patterns)){
        var incoming = doc.patterns.filter(function(d){
          return d && typeof d.width === "number" && typeof d.height === "number";
        });
        if (!incoming.length){ setDbStatus("fileBad"); el.importFileInput.value = ""; return; }
        var list = readStore();
        incoming.forEach(function(d){
          if (!d.id) d.id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
          if (!Array.isArray(d.backstitches)) d.backstitches = [];
          var at = -1;
          for (var i=0;i<list.length;i++) if (list[i] && list[i].id === d.id){ at = i; break; }
          if (at >= 0) list[at] = d; else list.unshift(d);
        });
        if (!writeStore(list)){ setDbStatus("storageFull"); el.importFileInput.value = ""; return; }
        savedDocs = list;
        renderSavedList();
        setDbStatus("libraryOpened", {n: incoming.length});
        el.importFileInput.value = "";
        return;
      }
      var pat = doc && (doc.pattern || (doc.width && doc.height ? doc : null));
      var okSize = pat && typeof pat.width === "number" && typeof pat.height === "number" &&
                   pat.width > 0 && pat.height > 0 && pat.width <= 400 && pat.height <= 400;
      if (!okSize){ setDbStatus("fileBad"); el.importFileInput.value = ""; return; }
      if (!Array.isArray(pat.backstitches)) pat.backstitches = [];
      // Opened as a new, unsaved pattern: nothing here is overwritten until
      // she presses save herself.
      loadPattern(null, pat);
      setDbStatus("fileOpened", {name: pat.name || t("unnamedPattern")});
      el.importFileInput.value = "";
    };
    reader.onerror = function(){ setDbStatus("fileBad"); el.importFileInput.value = ""; };
    reader.readAsText(file);
  });

  /* The PDF is written with the standard PDF fonts, which only know the
     Latin-1 letters — Icelandic included, but nothing beyond. Anything else
     (an emoji in a pattern name, say) would come out as gibberish, so it is
     swapped for a plain dot before it ever reaches the page. */
  function pdfSafe(text){
    return String(text == null ? "" : text).replace(/[^\u0000-\u00ff\u20ac\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\u017e\u0178]/g, "·");
  }

  function stitchLenCm(count){
    // ~2 diagonals per full cross stitch, plus ~50% extra for take-up/travel on the back
    return 2 * Math.SQRT2 * (2.54/count) * 1.5;
  }

  // jsPDF is only needed for the PDF export, so it is fetched on demand
  // (and warmed up quietly once the page is idle) instead of blocking load.
  var JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  var jspdfPromise = null;
  function loadJsPdf(){
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve();
    if (!jspdfPromise){
      jspdfPromise = new Promise(function(resolve, reject){
        var s = document.createElement("script");
        s.src = JSPDF_URL; s.async = true;
        s.onload = function(){ resolve(); };
        s.onerror = function(){ jspdfPromise = null; reject(); };
        document.head.appendChild(s);
      });
    }
    return jspdfPromise;
  }
  (window.requestIdleCallback || function(fn){ setTimeout(fn, 2000); })(function(){
    loadJsPdf().catch(function(){});
  });

  el.exportPdfBtn.addEventListener("click", function(){
    if (!downloads){ setDbStatus("downloadPdfUnavailable"); return; }
    loadJsPdf().then(exportPdf, function(){ setDbStatus("pdfLibFailed"); });
  });
  function exportPdf(){
    if (!window.jspdf || !window.jspdf.jsPDF){ setDbStatus("pdfLibFailed"); return; }
    var counts = {};
    Object.keys(state.cells).forEach(function(k){ var c = state.cells[k]; counts[c]=(counts[c]||0)+1; });
    var rows = Object.keys(counts).map(function(c){ return {code:c, n:counts[c]}; }).sort(function(a,b){ return b.n-a.n; });
    var symMap = computeSymbolMap(state.cells);

    var orientation = state.width >= state.height ? "landscape" : "portrait";
    var doc = new window.jspdf.jsPDF({ orientation: orientation, unit: "mm", format: "a4" });
    var pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight();
    var margin = 12;
    var name = pdfSafe((el.patternName.value || t("unnamedPattern")).trim());
    var stitchWord = t("wordStitches");
    var colorsWord = t("wordColors");

    doc.setFont("helvetica","bold"); doc.setFontSize(16);
    doc.text(name, margin, margin);
    doc.setFont("helvetica","normal"); doc.setFontSize(9);
    var totalStitches = Object.keys(state.cells).length;
    var info = state.width+"×"+state.height+" "+stitchWord+" · "+fabricSizeText(state.width,state.height,state.aidaCount)+" · "+totalStitches+" "+stitchWord+" · "+rows.length+" "+colorsWord;
    doc.text(info, margin, margin+6);

    // How the chart is split across sheets: a stitch has to stay big enough
    // on paper to actually stitch from — 2.6 mm is the classic printed-chart
    // scale of ten squares to the inch. A pattern that fits on one sheet at
    // that scale is not split at all; a bigger one is tiled, and the first
    // page keeps the whole chart as an overview map with the sheet numbers.
    var MIN_STITCH_MM = 2.6;
    var numberGutter = 7;           // room for the row/column numbers
    var sheetHeaderH = 12;          // room for the sheet's heading line
    var tileAvailW = pageW - margin*2 - numberGutter;
    var tileAvailH = pageH - margin*2 - numberGutter - sheetHeaderH;
    function tileStep(avail, total){
      var fits = Math.floor(avail / MIN_STITCH_MM);
      if (fits >= total) return total;
      // Whole groups of 10 stitches per sheet keep the thick grid lines (and
      // the numbering) landing predictably on every sheet.
      return Math.max(10, Math.floor(fits / 10) * 10);
    }
    var stepX = tileStep(tileAvailW, state.width);
    var stepY = tileStep(tileAvailH, state.height);
    var tilesX = Math.ceil(state.width / stepX);
    var tilesY = Math.ceil(state.height / stepY);
    var tileCount = tilesX * tilesY;

    var cs = exportCellPx(16);
    var off = document.createElement("canvas");
    off.width = state.width*cs; off.height = state.height*cs;
    var octx = off.getContext("2d");
    paintChart(octx, state.width, state.height, cs, {
      printMode: state.printOn, forceSymbols: true, stitchView: false,
      minorColor: "rgba(0,0,0,.15)", majorColor: "rgba(0,0,0,.4)", bgColor: state.bgColor
    });
    var dataUrl = off.toDataURL("image/png");
    var availW = pageW - margin*2;
    var availH = pageH - margin*2 - 14 - 40; // room for header + legend below
    var imgW = availW, imgH = imgW * (off.height/off.width);
    if (imgH > availH){ imgH = availH; imgW = imgH * (off.width/off.height); }
    var imgX = margin + (availW-imgW)/2;
    var imgY = margin + 10;
    doc.addImage(dataUrl, "PNG", imgX, imgY, imgW, imgH);

    if (tileCount > 1){
      // Draw the sheet grid over the overview so it is obvious which sheet
      // covers which part of the pattern.
      doc.setDrawColor(190,40,90);
      doc.setLineWidth(0.5);
      doc.setTextColor(190,40,90);
      doc.setFont("helvetica","bold"); doc.setFontSize(10);
      for (var ty0=0; ty0<tilesY; ty0++){
        for (var tx0=0; tx0<tilesX; tx0++){
          var rx = imgX + (tx0*stepX/state.width)*imgW;
          var ry = imgY + (ty0*stepY/state.height)*imgH;
          var rw = (Math.min(stepX, state.width - tx0*stepX)/state.width)*imgW;
          var rh = (Math.min(stepY, state.height - ty0*stepY)/state.height)*imgH;
          doc.rect(rx, ry, rw, rh);
          doc.text(String(ty0*tilesX + tx0 + 1), rx + rw/2, ry + rh/2 + 1.5, {align:"center"});
        }
      }
      doc.setTextColor(0,0,0);
      doc.setFont("helvetica","normal"); doc.setFontSize(9);
      doc.text(t("pdfOverviewNote", {n: tileCount}), margin, imgY + imgH + 5);
      imgH += 5;
    }

    var legendY = imgY + imgH + 8;
    if (legendY > pageH - margin - 10){ doc.addPage(); legendY = margin; }
    doc.setFont("helvetica","bold"); doc.setFontSize(11);
    doc.text(t("pdfLegendHeading"), margin, legendY);
    legendY += 5;
    doc.setFont("helvetica","normal"); doc.setFontSize(9);
    // Size legend columns to the actual (measured) label width instead of a
    // fixed guess — a long DMC color name would otherwise overflow into the
    // next column and overlap it.
    var legendLabels = rows.map(function(r){
      var p = colorFor(r.code);
      return pdfSafe("DMC "+r.code+" "+(p?p.n:"")+" × "+r.n);
    });
    var maxLabelW = legendLabels.reduce(function(m,l){ return Math.max(m, doc.getTextWidth(l)); }, 0);
    var availLegendW = pageW - margin*2;
    var numCols = Math.max(1, Math.min(3, Math.floor(availLegendW / (maxLabelW + 11))));
    var colWidth = availLegendW / numCols;
    // Order the entries down each column first, then across — so the
    // (already count-sorted) color list reads top-to-bottom in a column
    // instead of jumping left-to-right across the row. Rows/colors are laid
    // out one page's worth of items at a time (rather than tracking one
    // running index across page breaks) — with many DMC colors, indexing
    // straight off the original array position after an overflow page used
    // to immediately overflow again on the very next item, spawning a new
    // near-empty page for almost every remaining color.
    var firstPageRows = Math.max(1, Math.floor((pageH - margin - legendY) / 5) + 1);
    var fullPageRows = Math.max(1, Math.floor((pageH - margin*2) / 5) + 1);
    doc.setDrawColor(90,80,70);
    doc.setLineWidth(0.15);
    var idx = 0, firstPage = true;
    while (idx < rows.length){
      var pageRowsCap = firstPage ? firstPageRows : fullPageRows;
      var pageStartY = firstPage ? legendY : margin;
      var remaining = rows.length - idx;
      var rowsThisPage = Math.min(pageRowsCap, Math.ceil(remaining / numCols));
      var chunkSize = Math.min(remaining, rowsThisPage * numCols);
      for (var j = 0; j < chunkSize; j++){
        var r = rows[idx + j];
        var col = Math.floor(j / rowsThisPage);
        var rowInCol = j % rowsThisPage;
        var y = pageStartY + rowInCol*5;
        var p = colorFor(r.code);
        var cx = margin + col*colWidth;
        if (p){ var rgb = hexToRgb(p.h); doc.setFillColor(rgb.r,rgb.g,rgb.b); } else { doc.setFillColor(200,200,200); }
        doc.setDrawColor(90,80,70);
        doc.setLineWidth(0.15);
        doc.rect(cx, y-3, 3.2, 3.2, "FD");
        // the same mark that stands in this thread's squares on the chart
        if (symMap[r.code] != null) pdfSymbol(doc, symMap[r.code], cx+4.4, y-3.1, 3.4);
        doc.setTextColor(40,32,28);
        doc.text(legendLabels[idx + j], cx+9.2, y);
      }
      idx += chunkSize;
      legendY = pageStartY + rowsThisPage*5;
      if (idx < rows.length){
        doc.addPage();
        firstPage = false;
      }
    }

    if (state.showFloss){
      legendY += 3;
      if (legendY > pageH - margin - 10){ doc.addPage(); legendY = margin; }
      var lenCm = stitchLenCm(state.aidaCount);
      var totalM = (lenCm * totalStitches) / 100;
      doc.setFont("helvetica","italic"); doc.setFontSize(8.5);
      doc.text(t("pdfFlossLine", {m: totalM.toFixed(1), count: state.aidaCount}), margin, legendY);
    }

    // One sheet per tile, at a size you can actually stitch from, with the
    // real column/row numbers of the full chart along the top and left edge.
    if (tileCount > 1){
      var tileCs = exportCellPx(22, stepX, stepY);
      for (var ty=0; ty<tilesY; ty++){
        for (var tx=0; tx<tilesX; tx++){
          var sheetNo = ty*tilesX + tx + 1;
          var x0 = tx*stepX, y0 = ty*stepY;
          var tw = Math.min(stepX, state.width - x0), th = Math.min(stepY, state.height - y0);
          doc.addPage();

          doc.setFont("helvetica","bold"); doc.setFontSize(11);
          doc.text(name, margin, margin);
          doc.setFont("helvetica","normal"); doc.setFontSize(9);
          doc.text(t("pdfSheetHeader", {
            k: sheetNo, n: tileCount,
            x1: x0+1, x2: x0+tw, y1: y0+1, y2: y0+th
          }), margin, margin+5);

          var tile = document.createElement("canvas");
          tile.width = tw*tileCs; tile.height = th*tileCs;
          var tctx = tile.getContext("2d");
          paintChart(tctx, tw, th, tileCs, {
            printMode: state.printOn, forceSymbols: true, stitchView: false,
            minorColor: "rgba(0,0,0,.18)", majorColor: "rgba(0,0,0,.5)", bgColor: state.bgColor,
            ox: x0, oy: y0, fullW: state.width, fullH: state.height
          });

          // Scale so a stitch is the same size on every sheet.
          var stitchMm = Math.min(tileAvailW/stepX, tileAvailH/stepY);
          var tileW = tw*stitchMm, tileH = th*stitchMm;
          var tileX = margin + numberGutter, tileY = margin + sheetHeaderH;
          doc.addImage(tile.toDataURL("image/png"), "PNG", tileX, tileY, tileW, tileH);
          doc.setDrawColor(60,60,60); doc.setLineWidth(0.3);
          doc.rect(tileX, tileY, tileW, tileH);

          doc.setFontSize(6.5); doc.setTextColor(90,90,90);
          for (var cxn = 0; cxn <= tw; cxn++){
            var absC = x0 + cxn;
            if (absC % 10 !== 0) continue;
            doc.text(String(absC), tileX + cxn*stitchMm, tileY - 1.5, {align:"center"});
          }
          for (var cyn = 0; cyn <= th; cyn++){
            var absR = y0 + cyn;
            if (absR % 10 !== 0) continue;
            doc.text(String(absR), tileX - 1.5, tileY + cyn*stitchMm + 1, {align:"right"});
          }
          doc.setTextColor(0,0,0);
        }
      }
    }

    var blob = doc.output("blob");
    var fname = safeFileName("mynstur") + ".pdf";
    downloads.save({filename: fname, data: blob})
      .then(function(){ setDbStatus("pdfSaved"); })
      .catch(function(e){ if (e && e.code !== "declined") setDbStatus("pdfSaveFailed"); });
  }

  /* ---------------- pattern generators ---------------- */
  function setGenStatus(el2, key, kind, vars){
    el2.textContent = key ? t(key, vars) : "";
    el2.className = "gen-status" + (kind ? " " + kind : "");
    el2.dataset.i18nKey = key || "";
    el2.dataset.i18nVars = vars ? JSON.stringify(vars) : "";
  }

  var genTabs = [
    {btn: el.genTabImage, pane: el.genImagePane},
    {btn: el.genTabLetters, pane: el.genLettersPane},
  ];
  // Note: never name a loop variable "t" here — that is the i18n lookup.
  function selectGenTab(active){
    genTabs.forEach(function(tab){
      var isActive = tab === active;
      tab.btn.classList.toggle("active", isActive);
      tab.btn.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.pane.classList.toggle("gen-hidden", !isActive);
    });
  }
  genTabs.forEach(function(tab){ tab.btn.addEventListener("click", function(){ selectGenTab(tab); }); });

  /* ---------------- generate from an uploaded photo ---------------- */
  function nearestDmc(r,g,b,list){
    list = (list && list.length) ? list : PALETTE;
    var best = null, bestDist = Infinity;
    for (var i=0;i<list.length;i++){
      var c = hexToRgb(list[i].h);
      var dr=c.r-r, dg=c.g-g, db2=c.b-b;
      var dist = dr*dr+dg*dg+db2*db2;
      if (dist < bestDist){ bestDist = dist; best = list[i]; }
    }
    return best;
  }

  el.genImageFile.addEventListener("change", function(){
    el.genImageBtn.disabled = !el.genImageFile.files.length;
    setGenStatus(el.genImageStatus, "", "");
    if (el.traceToggle && el.traceToggle.checked) loadTraceImage();
  });

  function loadTraceImage(){
    var file = el.genImageFile.files && el.genImageFile.files[0];
    if (!file){
      traceImage = null;
      if (el.traceToggle) el.traceToggle.checked = false;
      setGenStatus(el.genImageStatus, "traceNoFile", "error");
      renderCanvas();
      return;
    }
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function(){
      URL.revokeObjectURL(url);
      traceImage = img;
      setGenStatus(el.genImageStatus, "", "");
      renderCanvas();
    };
    img.onerror = function(){
      URL.revokeObjectURL(url);
      traceImage = null;
      setGenStatus(el.genImageStatus, "imgReadFailed", "error");
    };
    img.src = url;
  }
  if (el.traceToggle) el.traceToggle.addEventListener("change", function(){
    if (el.traceToggle.checked) loadTraceImage();
    else renderCanvas();
  });
  if (el.traceOpacity) el.traceOpacity.addEventListener("input", function(){
    if (el.traceOpacityVal) el.traceOpacityVal.textContent = el.traceOpacity.value + "%";
    if (tracingNow()) renderCanvas(true);
  });

  /* Groups the image's colors into at most k representative shades (k-means
     over RGB), so a photo becomes a pattern you can actually stitch instead
     of a hundred barely-different DMC numbers. Deterministic: the starting
     shades are the ones furthest apart, not random. */
  function nearestCentroid(r, g, b, centroids){
    var best = 0, bestD = Infinity;
    for (var i=0;i<centroids.length;i++){
      var dr = r-centroids[i][0], dg = g-centroids[i][1], db = b-centroids[i][2];
      var d = dr*dr + dg*dg + db*db;
      if (d < bestD){ bestD = d; best = i; }
    }
    return best;
  }
  function clusterColors(points, k){
    if (points.length <= k) return points.map(function(p){ return p.slice(); });
    // Fit on at most ~8000 pixels — plenty for finding the main shades, and
    // it keeps a 400×400 photo from taking seconds.
    var step = Math.max(1, Math.floor(points.length / 8000));
    var sample = [];
    for (var i=0;i<points.length;i+=step) sample.push(points[i]);

    var centroids = [sample[Math.floor(sample.length/2)].slice()];
    var nearestD = new Float64Array(sample.length);
    for (var n=0;n<sample.length;n++) nearestD[n] = Infinity;
    while (centroids.length < k){
      var last = centroids[centroids.length-1];
      var bestIdx = -1, bestD = -1;
      for (var j=0;j<sample.length;j++){
        var dr = sample[j][0]-last[0], dg = sample[j][1]-last[1], db = sample[j][2]-last[2];
        var d = dr*dr + dg*dg + db*db;
        if (d < nearestD[j]) nearestD[j] = d;
        if (nearestD[j] > bestD){ bestD = nearestD[j]; bestIdx = j; }
      }
      if (bestIdx < 0 || bestD <= 0) break;
      centroids.push(sample[bestIdx].slice());
    }
    for (var iter=0; iter<8; iter++){
      var sums = [], counts = [];
      for (var c=0;c<centroids.length;c++){ sums.push([0,0,0]); counts.push(0); }
      for (var q=0;q<sample.length;q++){
        var ci = nearestCentroid(sample[q][0], sample[q][1], sample[q][2], centroids);
        sums[ci][0] += sample[q][0]; sums[ci][1] += sample[q][1]; sums[ci][2] += sample[q][2];
        counts[ci]++;
      }
      for (var c2=0;c2<centroids.length;c2++){
        if (!counts[c2]) continue;
        centroids[c2][0] = sums[c2][0]/counts[c2];
        centroids[c2][1] = sums[c2][1]/counts[c2];
        centroids[c2][2] = sums[c2][2]/counts[c2];
      }
    }
    return centroids;
  }

  /* opts: { crop: "center"|"start"|"end", maxColors: number (0 = no limit) } */
  function cellsFromImage(img, w, h, opts){
    opts = opts || {};
    var crop = opts.crop || "center";
    var maxColors = opts.maxColors || 0;
    var off = document.createElement("canvas");
    off.width = w; off.height = h;
    var octx = off.getContext("2d");
    octx.imageSmoothingEnabled = true;
    var box = coverBox(img, w, h, crop);
    octx.drawImage(img, box.sx, box.sy, box.sw, box.sh, 0, 0, w, h);
    var data = octx.getImageData(0,0,w,h).data;

    /* Brightness and contrast, done on the little grid-sized copy before any
       thread is chosen — a dark photo picks nothing but dark greys otherwise,
       and lifting it afterwards would only shift whole threads around. */
    var bright = opts.bright || 0, contrast = opts.contrast || 0;
    if (bright || contrast){
      var cc = contrast * 2.55;
      var f = (259 * (cc + 255)) / (255 * (259 - cc));
      var add = bright * 1.28;
      var lut = new Uint8ClampedArray(256);
      for (var v=0; v<256; v++) lut[v] = f * (v + add - 128) + 128;
      for (var q=0; q<data.length; q+=4){
        data[q] = lut[data[q]]; data[q+1] = lut[data[q+1]]; data[q+2] = lut[data[q+2]];
      }
    }
    var pal = opts.own ? ownedPalette() : null;

    var cells = {};
    var keys = [], points = [];
    for (var y=0;y<h;y++){
      for (var x=0;x<w;x++){
        var i2 = (y*w+x)*4;
        if (data[i2+3] < 64) continue;          // transparent stays empty
        keys.push(x+"-"+y);
        points.push([data[i2], data[i2+1], data[i2+2]]);
      }
    }
    if (maxColors > 0 && points.length > maxColors){
      var centroids = clusterColors(points, maxColors);
      // Each group is matched to a DMC thread once, not once per stitch.
      var codes = centroids.map(function(c){
        var m = nearestDmc(Math.round(c[0]), Math.round(c[1]), Math.round(c[2]), pal);
        return m ? m.c : null;
      });
      for (var i=0;i<points.length;i++){
        var code = codes[nearestCentroid(points[i][0], points[i][1], points[i][2], centroids)];
        if (code) cells[keys[i]] = code;
      }
    } else {
      for (var i3=0;i3<points.length;i3++){
        var match = nearestDmc(points[i3][0], points[i3][1], points[i3][2], pal);
        if (match) cells[keys[i3]] = match.c;
      }
    }
    return cells;
  }
  function imageOptions(){
    return {
      crop: el.genImageCrop ? el.genImageCrop.value : "center",
      maxColors: el.genMaxColors ? (parseInt(el.genMaxColors.value, 10) || 0) : 0,
      bright: el.genBright ? (parseInt(el.genBright.value, 10) || 0) : 0,
      contrast: el.genContrast ? (parseInt(el.genContrast.value, 10) || 0) : 0,
      own: !!(el.genOwnOnly && el.genOwnOnly.checked && ownedCount() > 0)
    };
  }

  /* The sliders work on the picture that is already on the chart: move one
     and the photo is laid out again at once, so she can see what a lighter
     or harder version looks like in thread instead of guessing. */
  var adjTimer = null;
  function showAdjValues(){
    if (el.genBrightVal) el.genBrightVal.textContent = el.genBright.value;
    if (el.genContrastVal) el.genContrastVal.textContent = el.genContrast.value;
  }
  function reapplyImage(){
    if (!lastGenImage) return;
    if (adjTimer) clearTimeout(adjTimer);
    adjTimer = setTimeout(function(){
      adjTimer = null;
      pushUndo();
      regenerateFromImage();
      renderCanvas();
    }, 140);
  }
  if (el.genBright) el.genBright.addEventListener("input", function(){ showAdjValues(); reapplyImage(); });
  if (el.genContrast) el.genContrast.addEventListener("input", function(){ showAdjValues(); reapplyImage(); });
  if (el.genResetAdjBtn) el.genResetAdjBtn.addEventListener("click", function(){
    el.genBright.value = "0"; el.genContrast.value = "0";
    showAdjValues(); reapplyImage();
  });
  if (el.genOwnOnly) el.genOwnOnly.addEventListener("change", function(){
    if (el.genOwnOnly.checked && !ownedCount()){
      el.genOwnOnly.checked = false;
      setGenStatus(el.genImageStatus, "myThreadsNone", "error");
      return;
    }
    reapplyImage();
  });

  // Re-samples the last "Búa til úr mynd" source image at the current grid
  // size — called whenever the stitch/aida settings change afterwards, so
  // the picture keeps filling the whole chart instead of getting cropped.
  function regenerateFromImage(){
    if (!lastGenImage) return false;
    state.cells = cellsFromImage(lastGenImage, state.width, state.height, imageOptions());
    // Every square is laid out afresh, so old ticks would mean nothing.
    state.done = {};
    setGenStatus(el.genImageStatus, "imgReady", "ok", {n: Object.keys(state.cells).length});
    return true;
  }

  // With "Laga netið að myndinni", the grid takes the photo's proportions
  // (longest side keeps its current length) so nothing is cropped away.
  // A hoop pattern always stays square, so it crops instead.
  function fitGridToImage(img){
    if (state.shape === "circle") return false;
    var ratio = img.width / img.height;
    if (!isFinite(ratio) || ratio <= 0) return false;
    var longest = Math.max(state.width, state.height);
    var w, h;
    if (ratio >= 1){ w = longest; h = Math.round(longest / ratio); }
    else { h = longest; w = Math.round(longest * ratio); }
    w = Math.min(400, Math.max(10, w));
    h = Math.min(400, Math.max(10, h));
    if (w === state.width && h === state.height) return false;
    state.width = w; state.height = h;
    el.widthInput.value = w; el.heightInput.value = h;
    return true;
  }

  el.genImageBtn.addEventListener("click", function(){
    var file = el.genImageFile.files[0];
    if (!file) return;
    setGenStatus(el.genImageStatus, "imgBusy", "busy");
    el.genImageBtn.disabled = true;
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function(){
      URL.revokeObjectURL(url);
      pushUndo();
      if (el.genImageFit && el.genImageFit.value === "fit") fitGridToImage(img);
      var cells = cellsFromImage(img, state.width, state.height, imageOptions());
      state.cells = cells;
      state.backstitches = [];
      state.done = {};
      state.clipped = {}; state.clippedBack = []; state.rectSize = null;
      state.currentPatternId = null;
      state.isSample = false;
      lastGenImage = img;
      resizeCanvas(); renderCanvas(); updateFabricSize();
      setGenStatus(el.genImageStatus, "imgReady", "ok", {n: Object.keys(cells).length});
      el.genImageBtn.disabled = false;
    };
    img.onerror = function(){
      URL.revokeObjectURL(url);
      setGenStatus(el.genImageStatus, "imgReadFailed", "error");
      el.genImageBtn.disabled = false;
    };
    img.src = url;
  });

  // Changing the color count or the crop re-renders the photo pattern right
  // away, so you can try "12 colors" against "20" without picking the file
  // again. The crop selector only matters when the grid size is kept.
  function syncImageControls(){
    if (el.genCropWrap && el.genImageFit){
      el.genCropWrap.classList.toggle("gen-hidden", el.genImageFit.value !== "crop");
    }
  }
  [el.genMaxColors, el.genImageCrop, el.genImageFit].forEach(function(sel){
    if (!sel) return;
    sel.addEventListener("change", function(){
      syncImageControls();
      if (!lastGenImage) return;
      pushUndo();
      if (el.genImageFit.value === "fit") fitGridToImage(lastGenImage);
      regenerateFromImage();
      resizeCanvas(); renderCanvas(); updateFabricSize();
    });
  });
  syncImageControls();

  /* ---------------- write text in a cross-stitch alphabet ----------------
     Pixel alphabet digitized cell-by-cell from a real charted cross-stitch
     alphabet chart (not font rendering + downsampling, which produced blurry,
     broken letters). Each glyph is a fixed 10-row-tall bitmap: row 0 carries
     any accent mark, rows 1-7 the cap-height/ascender letterform, rows 8-9 the
     descender zone (g, j, p, q, y, Þ-style tails). '#' = stitched, '.' = empty.
     Icelandic letters and punctuation are original additions matching the style. */
  var GLYPH_H = 10;
  var GLYPHS = {
    " ": ["...", "...", "...", "...", "...", "...", "...", "...", "...", "..."],
    "A": ["....", ".##.", "#..#", "#..#", "####", "#..#", "#..#", "#..#", "....", "...."],
    "B": ["....", "###.", "#..#", "#..#", "###.", "#..#", "#..#", "###.", "....", "...."],
    "C": ["....", ".###", "#...", "#...", "#...", "#...", "#...", ".###", "....", "...."],
    "D": ["....", "###.", "#..#", "#..#", "#..#", "#..#", "#..#", "###.", "....", "...."],
    "E": ["....", "####", "#...", "#...", "###.", "#...", "#...", "####", "....", "...."],
    "F": ["....", "####", "#...", "#...", "####", "#...", "#...", "#...", "....", "...."],
    "G": ["....", ".###", "#...", "#...", "#.##", "#..#", "#..#", "####", "....", "...."],
    "H": ["....", "#..#", "#..#", "#..#", "####", "#..#", "#..#", "#..#", "....", "...."],
    "I": ["...", "###", ".#.", ".#.", ".#.", ".#.", ".#.", "###", "...", "..."],
    "J": ["....", "...#", "...#", "...#", "...#", "#..#", "#..#", ".##.", "....", "...."],
    "K": ["....", "#..#", "#..#", "#.#.", "##..", "#.#.", "#..#", "#..#", "....", "...."],
    "L": ["....", "#...", "#...", "#...", "#...", "#...", "#...", "####", "....", "...."],
    "M": [".....", "#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#", ".....", "....."],
    "N": [".....", "#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#", ".....", "....."],
    "O": ["....", ".##.", "#..#", "#..#", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "P": ["....", "###.", "#..#", "#..#", "###.", "#...", "#...", "#...", "....", "...."],
    "Q": [".....", ".###.", "#...#", "#...#", "#...#", "#...#", "#.#.#", ".###.", "....#", "....."],
    "R": ["....", "###.", "#..#", "#..#", "###.", "#..#", "#..#", "#..#", "....", "...."],
    "S": ["....", ".###", "#...", "#...", "####", "...#", "...#", "###.", "....", "...."],
    "T": [".....", "#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#..", ".....", "....."],
    "U": ["....", "#..#", "#..#", "#..#", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "V": [".....", "#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#..", ".....", "....."],
    "W": [".......", "#.....#", "#..#..#", "#..#..#", "#..#..#", "#..#..#", "#..#..#", ".#####.", ".......", "......."],
    "X": [".....", "#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#", ".....", "....."],
    "Y": [".....", "#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#..", ".....", "....."],
    "Z": [".....", "#####", "....#", "...#.", "..#..", ".#...", "#....", "#####", ".....", "....."],
    "a": ["....", "....", "....", ".##.", "...#", "####", "#..#", "####", "....", "...."],
    "b": ["....", "#...", "#...", "###.", "#..#", "#..#", "#..#", "###.", "....", "...."],
    "c": ["....", "....", "....", ".###", "#...", "#...", "#...", ".###", "....", "...."],
    "d": ["....", "...#", "...#", ".###", "#..#", "#..#", "#..#", ".###", "....", "...."],
    "e": ["....", "....", "....", ".##.", "#..#", "###.", "#...", ".##.", "....", "...."],
    "f": ["....", "..##", ".#..", "###.", ".#..", ".#..", ".#..", ".#..", "....", "...."],
    "g": ["....", "....", "....", ".##.", "#..#", "#..#", "#..#", ".###", "...#", "###."],
    "h": ["....", "#...", "#...", "#...", "###.", "#..#", "#..#", "#..#", "....", "...."],
    "i": [".", ".", "#", ".", "#", "#", "#", "#", ".", "."],
    "j": ["..", "..", ".#", "..", ".#", ".#", ".#", ".#", ".#", "#."],
    "k": ["....", "#...", "#...", "#..#", "#.#.", "##..", "#.#.", "#..#", "....", "...."],
    "l": [".", "#", "#", "#", "#", "#", "#", "#", ".", "."],
    "m": [".......", ".......", ".......", "######.", "#..#..#", "#..#..#", "#..#..#", "#..#..#", ".......", "......."],
    "n": ["....", "....", "....", "###.", "#..#", "#..#", "#..#", "#..#", "....", "...."],
    "o": ["....", "....", "....", ".##.", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "p": ["....", "....", "....", "###.", "#..#", "#..#", "#..#", "###.", "#...", "#..."],
    "q": ["....", "....", "....", ".##.", "#..#", "#..#", "#..#", ".###", "...#", "...#"],
    "r": ["....", "....", "....", "#.##", "##..", "#...", "#...", "#...", "....", "...."],
    "s": ["....", "....", "....", ".###", "#...", "####", "...#", "###.", "....", "...."],
    "t": ["...", "...", ".#.", "###", ".#.", ".#.", ".#.", ".##", "...", "..."],
    "u": ["....", "....", "....", "#..#", "#..#", "#..#", "#..#", ".###", "....", "...."],
    "v": [".....", ".....", ".....", "#...#", "#...#", ".#.#.", ".#.#.", "..#..", ".....", "....."],
    "w": [".....", ".....", ".....", "#...#", "#.#.#", "#.#.#", "#.#.#", ".###.", ".....", "....."],
    "x": [".....", ".....", ".....", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", ".....", "....."],
    "y": ["....", "....", "....", "#..#", "#..#", "#..#", "#..#", ".###", "...#", ".##."],
    "z": ["....", "....", "....", "####", "...#", "..#.", ".#..", "####", "....", "...."],
    "ö": ["....", "....", "#..#", ".##.", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "æ": ["......", "......", "......", ".##.##", "...#.#", ".#####", "#.#...", ".##.##", "......", "......"],
    "ð": [".....", "...##", ".###.", "..##.", ".#..#", "#...#", "#...#", ".###.", ".....", "....."],
    "þ": ["....", "#...", "#...", "###.", "#..#", "#..#", "###.", "#...", "#...", "...."],
    "ý": ["....", "....", "..#.", "#..#", "#..#", "#..#", "#..#", ".###", "...#", ".##."],
    "ú": ["....", "....", "..#.", "#..#", "#..#", "#..#", "#..#", ".###", "....", "...."],
    "ó": ["....", "....", "..#.", ".##.", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "í": ["..", "..", ".#", "..", "#.", "#.", "#.", "#.", "..", ".."],
    "é": ["....", "....", "..#.", ".##.", "#..#", "###.", "#...", ".##.", "....", "...."],
    "á": ["....", "....", "..#.", ".##.", "...#", "####", "#..#", "####", "....", "...."],
    "0": ["....", ".##.", "#..#", "#..#", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "1": ["..", ".#", "##", ".#", ".#", ".#", ".#", ".#", "..", ".."],
    "2": ["....", "###.", "...#", "...#", "..#.", ".#..", "#...", "####", "....", "...."],
    "3": ["....", "###.", "...#", "...#", "###.", "...#", "...#", "###.", "....", "...."],
    "4": ["....", "#..#", "#..#", "#..#", ".###", "...#", "...#", "...#", "....", "...."],
    "5": ["....", "####", "#...", "#...", "###.", "...#", "...#", "###.", "....", "...."],
    "6": ["....", ".##.", "#...", "#...", "###.", "#..#", "#..#", ".##.", "....", "...."],
    "7": ["....", "####", "...#", "...#", "..#.", ".#..", ".#..", ".#..", "....", "...."],
    "8": ["....", ".##.", "#..#", "#..#", ".##.", "#..#", "#..#", ".##.", "....", "...."],
    "9": ["....", ".##.", "#..#", "#..#", ".###", "...#", "...#", ".##.", "....", "...."],
    ".": [".....", ".....", ".....", ".....", ".....", ".....", ".....", ".##..", ".##..", "....."],
    ",": [".....", ".....", ".....", ".....", ".....", ".....", ".....", "..#..", ".#...", "....."],
    "!": [".....", "..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#..", ".....", "....."],
    "?": [".....", ".###.", "#...#", "....#", "..##.", "..#..", ".....", "..#..", ".....", "....."],
    "'": [".....", ".....", ".#...", ".#...", ".....", ".....", ".....", ".....", ".....", "....."],
    "-": [".....", ".....", ".....", ".....", ".....", "#####", ".....", ".....", ".....", "....."],
    ":": [".....", ".....", ".....", "..#..", ".....", ".....", "..#..", ".....", ".....", "....."],
    "Á": ["..#.", ".##.", "#..#", "#..#", "####", "#..#", "#..#", "#..#", "....", "...."],
    "É": ["..#.", "####", "#...", "#...", "###.", "#...", "#...", "####", "....", "...."],
    "Í": [".#.", "###", ".#.", ".#.", ".#.", ".#.", ".#.", "###", "...", "..."],
    "Ó": ["..#.", ".##.", "#..#", "#..#", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "Ú": ["..#.", "#..#", "#..#", "#..#", "#..#", "#..#", "#..#", ".##.", "....", "...."],
    "Ý": ["..#..", "#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#..", ".....", "....."],
    "Ð": [".....", ".###.", ".#..#", ".#..#", "###.#", ".#..#", ".#..#", ".###.", ".....", "....."],
    "Þ": ["....", "#...", "###.", "#..#", "#..#", "###.", "#...", "#...", "....", "...."],
    "Æ": [".......", "..#####", "..#....", ".##....", ".#.####", "####...", "#..#...", "#..####", ".......", "......."],
    "Ö": ["#..#", ".##.", "#..#", "#..#", "#..#", "#..#", "#..#", ".##.", "....", "...."]
  };
  /* A serif "sampler" alphabet drawn for this app: eight rows of cap height
     with flared feet, row 0 free for the Icelandic accents and row 9 for
     descenders — the same ten-row box as the plain alphabet, so the sizing
     and spacing code needs no special case. Capitals only, which is how
     charted sampler alphabets normally come. */
  var SERIF_GLYPHS = {
    " ": ["...", "...", "...", "...", "...", "...", "...", "...", "...", "..."],
    "A": [".......", "...#...", "..###..", "..#.#..", ".##.##.", ".#####.", ".#...#.", ".#...#.", "###.###", "......."],
    "B": [".......", "#####..", ".#...#.", ".#...#.", ".####..", ".#...#.", ".#...#.", ".#...#.", "#####..", "......."],
    "C": [".......", "..####.", ".#....#", "##.....", ".#.....", ".#.....", "##.....", ".#....#", "..####.", "......."],
    "D": [".......", "#####..", ".#...#.", ".#....#", ".#....#", ".#....#", ".#....#", ".#...#.", "#####..", "......."],
    "E": [".......", "######.", ".#....#", ".#.....", ".####..", ".#.....", ".#.....", ".#....#", "######.", "......."],
    "F": [".......", "######.", ".#....#", ".#.....", ".####..", ".#.....", ".#.....", ".#.....", "###....", "......."],
    "G": [".......", "..####.", ".#....#", "##.....", ".#.....", ".#..###", "##...#.", ".#...#.", "..###..", "......."],
    "H": [".......", "###.###", ".#...#.", ".#...#.", ".#####.", ".#...#.", ".#...#.", ".#...#.", "###.###", "......."],
    "I": [".....", "#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#..", "#####", "....."],
    "J": ["......", "..####", "....#.", "....#.", "....#.", "....#.", "#...#.", "#...#.", ".###..", "......"],
    "K": [".......", "###.###", ".#...#.", ".#..#..", ".###...", ".#..#..", ".#...#.", ".#...#.", "###.###", "......."],
    "L": [".......", "###....", ".#.....", ".#.....", ".#.....", ".#.....", ".#.....", ".#....#", "######.", "......."],
    "M": [".......", "##...##", ".##.##.", ".##.##.", ".#.#.#.", ".#.#.#.", ".#...#.", ".#...#.", "###.###", "......."],
    "N": [".......", "##..###", ".##..#.", ".##..#.", ".#.#.#.", ".#.#.#.", ".#..##.", ".#..##.", "###..##", "......."],
    "O": [".......", "..###..", ".#...#.", "#.....#", "#.....#", "#.....#", "#.....#", ".#...#.", "..###..", "......."],
    "P": [".......", "#####..", ".#...#.", ".#...#.", ".####..", ".#.....", ".#.....", ".#.....", "###....", "......."],
    "Q": [".......", "..###..", ".#...#.", "#.....#", "#.....#", "#.....#", "#...#.#", ".#...#.", "..###.#", "....#.."],
    "R": [".......", "#####..", ".#...#.", ".#...#.", ".####..", ".#..#..", ".#...#.", ".#...#.", "###.###", "......."],
    "S": [".......", "..####.", ".#....#", ".#.....", "..###..", ".....#.", "#.....#", "#.....#", ".####..", "......."],
    "T": [".......", "#######", "#..#..#", "...#...", "...#...", "...#...", "...#...", "...#...", "..###..", "......."],
    "U": [".......", "###.###", ".#...#.", ".#...#.", ".#...#.", ".#...#.", ".#...#.", "..#.#..", "..###..", "......."],
    "V": [".......", "###.###", ".#...#.", ".#...#.", "..#.#..", "..#.#..", "..#.#..", "...#...", "...#...", "......."],
    "W": [".........", "###...###", ".#.....#.", ".#..#..#.", ".#.#.#.#.", ".#.#.#.#.", ".##...##.", ".#.....#.", "..#...#..", "........."],
    "X": [".......", "###.###", ".#...#.", "..#.#..", "...#...", "...#...", "..#.#..", ".#...#.", "###.###", "......."],
    "Y": [".......", "###.###", ".#...#.", "..#.#..", "...#...", "...#...", "...#...", "...#...", "..###..", "......."],
    "Z": [".......", "######.", "#....#.", "....#..", "...#...", "..#....", ".#....#", ".#....#", "######.", "......."],
    "Á": ["....#..", "...#...", "..###..", "..#.#..", ".##.##.", ".#####.", ".#...#.", ".#...#.", "###.###", "......."],
    "Ð": [".......", "#####..", ".#...#.", ".#....#", "####..#", ".#....#", ".#....#", ".#...#.", "#####..", "......."],
    "É": ["...#...", "######.", ".#....#", ".#.....", ".####..", ".#.....", ".#.....", ".#....#", "######.", "......."],
    "Í": ["...#.", "#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#..", "#####", "....."],
    "Ó": ["....#..", "..###..", ".#...#.", "#.....#", "#.....#", "#.....#", "#.....#", ".#...#.", "..###..", "......."],
    "Ú": ["....#..", "###.###", ".#...#.", ".#...#.", ".#...#.", ".#...#.", ".#...#.", "..#.#..", "..###..", "......."],
    "Ý": ["....#..", "###.###", ".#...#.", "..#.#..", "...#...", "...#...", "...#...", "...#...", "..###..", "......."],
    "Þ": [".......", "###....", ".#.....", ".####..", ".#...#.", ".#...#.", ".####..", ".#.....", "###....", "......."],
    "Æ": ["........", "..######", ".##.#...", ".#..#...", ".#..####", "#####...", "#...#...", "#...#...", "#...####", "........"],
    "Ö": [".......", ".#...#.", "..###..", "#.....#", "#.....#", "#.....#", "#.....#", ".#...#.", "..###..", "......."],
    "0": [".......", "..###..", ".#...#.", "#....##", "#...#.#", "#..#..#", "##....#", ".#...#.", "..###..", "......."],
    "1": [".......", "..##...", ".###...", "..##...", "..##...", "..##...", "..##...", "..##...", "######.", "......."],
    "2": [".......", "..###..", ".#...#.", "......#", ".....#.", "...##..", "..#....", ".#.....", "#######", "......."],
    "3": [".......", "..###..", ".#...#.", "......#", "...###.", "......#", "......#", ".#...#.", "..###..", "......."],
    "4": [".......", "....##.", "...###.", "..#.##.", ".#..##.", "#######", "....##.", "....##.", "..#####", "......."],
    "5": [".......", "#######", "#......", "#......", "#####..", "......#", "......#", "#....#.", ".####..", "......."],
    "6": [".......", "...##..", "..#....", ".#.....", ".####..", "#....#.", "#....#.", "#....#.", ".####..", "......."],
    "7": [".......", "#######", "#....#.", "....#..", "...#...", "...#...", "..#....", "..#....", "..#....", "......."],
    "8": [".......", "..###..", ".#...#.", ".#...#.", "..###..", ".#...#.", "#.....#", "#.....#", ".#####.", "......."],
    "9": [".......", "..###..", ".#...#.", "#....#.", "#....#.", "..####.", ".....#.", "....#..", "..##...", "......."],
    ".": ["..", "..", "..", "..", "..", "..", "..", "##", "##", ".."],
    ",": ["..", "..", "..", "..", "..", "..", "..", "##", "##", ".#"],
    "!": [".", "#", "#", "#", "#", "#", ".", "#", "#", "."],
    "?": [".....", ".###.", "#...#", "....#", "...#.", "..#..", "..#..", ".....", "..#..", "....."],
    "'": [".", "#", "#", ".", ".", ".", ".", ".", ".", "."],
    "-": ["....", "....", "....", "....", "####", "....", "....", "....", "....", "...."],
    "&": [".......", "..##...", ".#..#..", ".#..#..", "..##...", ".###.#.", "#...##.", "#....#.", ".####.#", "......."]
  };

  /* A slanted script alphabet, drawn as pen strokes and rasterised onto the
     grid so the curves and the lean survive. Fifteen rows: room for the
     Icelandic accents at the top, the capitals below them, and descenders
     under the baseline. */
  /* Hafrun's own cursive hand ("skrautskrift"), traced cell-for-cell off her
     two chart sheets.  Sixteen rows: accents in rows 0-2, the body in rows
     3-12 (baseline row 12, cap height ten rows, x-height rows 7-12) and
     descenders in rows 13-15. */
  var SCRIPT_GLYPHS = {
    "a": [".......", ".......", ".......", ".......", ".......", ".......", ".......", "..##.#.", ".#..#..", "#...#..", "#..#..#", "#..#.#.", ".##.#..", ".......", ".......", "......."],
    "b": ["......", "......", "......", "..#...", ".#.#..", ".#.#..", "#..#..", "#.#...", "##....", "#..##.", "#...##", "#..#..", ".##...", "......", "......", "......"],
    "c": ["......", "......", "......", "......", "......", "......", "......", "..#...", ".#.#..", "#.....", "#....#", "#...#.", ".###..", "......", "......", "......"],
    "d": [".......", ".......", ".......", "......#", ".....#.", ".....#.", ".....#.", "..##.#.", ".#..#..", "#...#..", "#...#..", "#..##.#", ".##.##.", ".......", ".......", "......."],
    "e": [".....", ".....", ".....", ".....", ".....", ".....", ".....", ".###.", "#..#.", "#.#..", "##..#", "#..#.", ".##..", ".....", ".....", "....."],
    "f": [".....", ".....", ".....", "...##", "..#.#", "..#.#", "..##.", "..#..", ".##..", "#.#.#", ".###.", "..#..", ".##..", ".#...", "##...", "#...."],
    "g": ["......", "......", "......", "......", "......", "......", "......", "..###.", ".#..#.", "#...#.", "#..#.#", ".#.##.", "..##..", ".##...", "#.#...", ".#...."],
    "h": [".......", ".......", ".......", "...#...", "..#.#..", "..#.#..", ".#..#..", ".#.#...", ".###...", "##..#..", "#...#..", "#..#..#", "#..###.", ".......", ".......", "......."],
    "i": ["....", "....", "....", "....", "....", "..#.", "....", ".#..", ".#..", "#...", "#..#", "#.#.", "##..", "....", "....", "...."],
    "j": [".....", ".....", ".....", ".....", ".....", "...#.", ".....", "...#.", "..##.", ".#.#.", "#..##", "..##.", ".##..", "#.#..", "#.#..", ".#..."],
    "k": ["......", "......", "......", "...#..", "..#.#.", "..#.#.", ".#.#..", ".##...", ".#.##.", "####..", "#.#..#", "#.#.#.", "#..#..", "......", "......", "......"],
    "l": [".....", ".....", ".....", "...#.", "..#.#", "..#.#", ".#.#.", ".#.#.", "#.#..", "##...", "#...#", "#..#.", ".##..", ".....", ".....", "....."],
    "m": [".........", ".........", ".........", ".........", ".........", ".........", ".........", ".#.#.....", ".##.#.#..", "##..##.#.", "#...#..#.", "#..#..#.#", "#..#..##.", ".........", ".........", "........."],
    "n": [".......", ".......", ".......", ".......", ".......", ".......", ".......", ".#.#...", ".##.#..", "##..#..", "#..#..#", "#..#.#.", "#...#..", ".......", ".......", "......."],
    "o": ["......", "......", "......", "......", "......", "......", "......", "..##..", ".#..#.", "#...##", "#..#..", "#..#..", ".##...", "......", "......", "......"],
    "p": [".......", ".......", ".......", ".......", ".......", ".......", "..#....", "..###..", ".##..#.", "##...#.", ".#...##", ".#.##..", ".#.....", "#......", "#......", "#......"],
    "q": ["......", "......", "......", "......", "......", "......", "......", "..#.#.", ".#.##.", "#...#.", "#..#..", "#.##.#", ".#.##.", "...#..", "..#...", "..#..."],
    "r": ["......", "......", "......", "......", "......", "......", "......", ".#....", ".###..", "#..#..", "..#..#", "..#.#.", "...#..", "......", "......", "......"],
    "s": [".....", ".....", ".....", ".....", ".....", ".....", ".....", "..#..", ".##..", "#.#..", "..#.#", ".###.", "##...", ".....", ".....", "....."],
    "t": ["....", "....", "....", "....", "....", ".#..", "##..", ".##.", ".#..", "#...", "#..#", "#.#.", ".#..", "....", "....", "...."],
    "u": [".......", ".......", ".......", ".......", ".......", ".......", ".......", ".#..#..", ".#..#..", "#..#...", "#..#..#", "#.##.#.", "##.##..", ".......", ".......", "......."],
    "v": ["......", "......", "......", "......", "......", "......", "......", ".#.#..", ".#..#.", "#...#.", "#..#.#", "#.#...", ".#....", "......", "......", "......"],
    "w": [".........", ".........", ".........", ".........", ".........", ".........", ".........", "..#...#..", ".#..#..#.", ".#..#..##", "#..#...#.", "#..#..#..", ".##.##...", ".........", ".........", "........."],
    "x": ["........", "........", "........", "........", "........", "........", "........", ".##..#..", "#.#.#...", "...#....", "...#...#", "..#.#.#.", ".#..##..", "........", "........", "........"],
    "y": ["......", "......", "......", "......", "......", "......", "......", ".#..#.", "#...#.", "#..#..", "#..#.#", ".#.##.", "..##..", ".#.#..", "#.#...", ".#...."],
    "z": [".......", ".......", ".......", ".......", ".......", ".......", ".......", "..#..#.", ".#.###.", "#...#..", "...#...", "..###.#", ".##..#.", ".......", ".......", "......."],
    "á": [".......", ".......", ".......", ".......", "....#..", "...#...", ".......", "..##.#.", ".#..#..", "#...#..", "#..#..#", "#..#.#.", ".##.#..", ".......", ".......", "......."],
    "é": [".....", ".....", ".....", ".....", "....#", "...#.", ".....", ".###.", "#..#.", "#.#..", "##..#", "#..#.", ".##..", ".....", ".....", "....."],
    "í": ["....", "....", "....", "....", "..#.", ".#..", "....", ".#..", ".#..", "#...", "#..#", "#.#.", "##..", "....", "....", "...."],
    "ó": ["......", "......", "......", "......", "...#..", "..#...", "......", "..##..", ".#..#.", "#...##", "#..#..", "#..#..", ".##...", "......", "......", "......"],
    "ú": [".......", ".......", ".......", ".......", "...#...", "..#....", ".......", ".#..#..", ".#..#..", "#..#...", "#..#..#", "#.##.#.", "##.##..", ".......", ".......", "......."],
    "ý": ["......", "......", "......", "......", "...#..", "..#...", "......", ".#..#.", "#...#.", "#..#..", "#..#.#", ".#.##.", "..##..", ".#.#..", "#.#...", ".#...."],
    "ä": [".......", ".......", ".......", ".......", ".......", "..#.#..", ".......", "..##.#.", ".#..#..", "#...#..", "#..#..#", "#..#.#.", ".##.#..", ".......", ".......", "......."],
    "ö": ["......", "......", "......", "......", "......", "..#..#", "......", "..##..", ".#..#.", "#...##", "#..#..", "#..#..", ".##...", "......", "......", "......"],
    "ü": [".......", ".......", ".......", ".......", ".......", ".#.#...", ".......", ".#..#..", ".#..#..", "#..#...", "#..#..#", "#.##.#.", "##.##..", ".......", ".......", "......."],
    "þ": ["........", "........", "........", "..#.....", "..#.....", "..#.....", "..#####.", "..#....#", "..#....#", "..#....#", "..#####.", "..#.....", ".##.....", ".#......", ".#......", "........"],
    "ð": ["......", "......", "......", "....##", "..####", "...#..", "..#...", "..##..", ".#..#.", "#...##", "#..#..", "#..#..", ".##...", "......", "......", "......"],
    "æ": [".........", ".........", ".........", ".........", ".........", ".........", ".........", "..#####..", ".#..#..#.", "#...#.#..", "#...##..#", "#..##..##", ".##.###..", ".........", ".........", "........."],
    "A": ["..........", "..........", "..........", ".......###", "......#.#.", ".....#..#.", ".....#.#..", "....#..#..", "...####...", "...#..#...", "...#..#..#", "..#...#.#.", "##.....#..", "..........", "..........", ".........."],
    "B": [".......", ".......", ".......", "..#.##.", "..##..#", "..#...#", ".#...#.", ".#.##..", ".#...#.", "#....#.", "#.#..#.", "##..#..", "#.##...", ".......", ".......", "......."],
    "C": [".......", ".......", ".......", "....##.", "...#..#", "..#...#", ".#...#.", ".#.....", "#......", "#......", "#.....#", ".#...#.", "..###..", ".......", ".......", "......."],
    "D": ["........", "........", "........", "..####..", ".#....#.", ".#.#...#", ".#.#...#", "..###..#", "..#....#", "..#...#.", ".#....#.", ".#..##..", "####....", "........", "........", "........"],
    "E": [".......", ".......", ".......", "....##.", "...#..#", "..#..#.", "..#....", "..###..", ".#.....", "#......", "#.....#", "#...##.", ".###...", ".......", ".......", "......."],
    "F": ["........", "........", "........", ".###....", "...#####", "....#...", ".#..#...", "..#####.", "....#...", "....#...", "...#....", "#..#....", ".##.....", "........", "........", "........"],
    "G": ["......", "......", "......", "...##.", "..#..#", ".#..#.", ".#....", "#.....", "#...#.", "#..##.", ".##.#.", "....#.", "#..#..", ".##...", "......", "......"],
    "H": [".........", ".........", ".........", "..##.....", ".#.#...#.", "...#..#..", "..#...#..", "#.#..#...", ".##..#.#.", "..#####..", ".#...#...", ".#...#..#", "#.....##.", ".........", ".........", "........."],
    "I": ["......", "......", "......", ".#..##", ".###.#", ".....#", "....#.", "....#.", "....#.", ".#..#.", "#..#..", "#..#..", ".##...", "......", "......", "......"],
    "J": [".......", ".......", ".......", ".#..##.", ".###..#", "......#", ".....#.", ".....#.", ".....#.", ".....#.", ".#..#..", "#.#.#..", "#...#..", "#..#...", "#..#...", "......."],
    "K": [".........", ".........", ".........", ".#.##....", "..#.#...#", "....#..#.", "...#..#..", "...#.#...", "...##.#..", "...#..#..", "..#..#...", "#.#..#..#", ".#....##.", ".........", ".........", "........."],
    "L": [".......", ".......", ".......", "....#..", "...#.#.", "..#..#.", "..#..#.", "#.#.#..", ".###...", "..#....", "..#....", ".###..#", "##..##.", ".......", ".......", "......."],
    "M": ["...........", "...........", "...........", ".##..##....", "#.#.#.#.###", "..##..##..#", "..#...#...#", "..#..#....#", ".#...#...#.", ".#...#...#.", ".#..#...#..", "#...#...#.#", "#...#....#.", "...........", "...........", "..........."],
    "N": ["........", "........", "........", ".##..##.", "#.#.#..#", "..##...#", "..#....#", "..#...#.", ".#....#.", ".#...#..", ".#...#..", "#....#.#", "#.....#.", "........", "........", "........"],
    "O": ["........", "........", "........", "..#..#..", ".#..#.#.", ".#.#..##", "#...###.", "#.....#.", "#.....#.", "#....#..", "#....#..", ".#..#...", "..##....", "........", "........", "........"],
    "P": [".......", ".......", ".......", "..###..", ".#...#.", "#..#..#", ".#.#..#", "...#..#", "..#..#.", "..###..", "..#....", "#.#....", ".#.....", ".......", ".......", "......."],
    "Q": ["........", "........", "........", "..#..#..", ".#..#.#.", ".#...###", "#.....#.", "#.....#.", "#..#..#.", "#..#.#..", "#..#.#..", ".#..#..#", "..##.##.", "........", "........", "........"],
    "R": ["........", "........", "........", ".##.##..", "#.##..#.", "..#...#.", "..#..#..", "..###...", ".#...#..", ".#...#..", ".#..#..#", "#...#.#.", "#....#..", "........", "........", "........"],
    "S": [".......", ".......", ".......", ".##.##.", "...#..#", "..#.#.#", "..#..#.", "..#....", "...#...", ".#..#..", "#...#..", "#..#...", ".##....", ".......", ".......", "......."],
    "T": ["........", "........", "........", ".###....", "...#####", ".....#..", ".....#..", "....#...", "....#...", "....#...", ".#.#....", "#..#....", ".##.....", "........", "........", "........"],
    "U": ["........", "........", "........", "#.##....", ".##....#", "..#....#", ".#....#.", ".#....#.", "#....#..", "#....#..", "#...##..", "#..#.#.#", ".##...#.", "........", "........", "........"],
    "V": ["........", "........", "........", "...#....", "..##.#..", "###...##", "..#...#.", "..#..#..", ".#...#..", ".#..#...", ".#..#...", ".#.#....", "..#.....", "........", "........", "........"],
    "W": ["...........", "...........", "...........", "...##......", "####....##.", "..#...#..##", ".#....#..#.", ".#...#...#.", "#....#...#.", "#...#...#..", "#...#...#..", "#..#.#.#...", ".##..##....", "...........", "...........", "..........."],
    "X": ["..........", "..........", "..........", "..#.......", ".#.#....##", "...#...#..", "...#..#...", "....##....", "....#.....", "...#.#....", "...#.#...#", "..#...#.#.", "##.....#..", "..........", "..........", ".........."],
    "Y": [".......", ".......", ".......", "..#....", ".#....#", "##....#", ".#...#.", ".#...#.", ".#...#.", "..#.#..", "...##..", "....#..", "...#...", "#..#...", "#.#....", "......."],
    "Z": [".......", ".......", ".......", "..#####", ".#....#", ".....#.", ".....#.", "....#..", "...#...", "..#....", ".##....", "##.#..#", "#...##.", ".......", ".......", "......."],
    "Á": [".........#", "........#.", "..........", ".......###", "......#.#.", ".....#..#.", ".....#.#..", "....#..#..", "...####...", "...#..#...", "...#..#..#", "..#...#.#.", "##.....#..", "..........", "..........", ".........."],
    "É": [".....#.", "....#..", ".......", "....##.", "...#..#", "..#..#.", "..#....", "..###..", ".#.....", "#......", "#.....#", "#...##.", ".###...", ".......", ".......", "......."],
    "Í": ["....#.", "...#..", "......", ".#..##", ".###.#", ".....#", "....#.", "....#.", "....#.", ".#..#.", "#..#..", "#..#..", ".##...", "......", "......", "......"],
    "Ó": ["....#...", "...#....", "........", "..#..#..", ".#..#.#.", ".#.#..##", "#...###.", "#.....#.", "#.....#.", "#....#..", "#....#..", ".#..#...", "..##....", "........", "........", "........"],
    "Ú": ["....#...", "...#....", "........", "#.##....", ".##....#", "..#....#", ".#....#.", ".#....#.", "#....#..", "#....#..", "#...##..", "#..#.#.#", ".##...#.", "........", "........", "........"],
    "Ý": ["....#..", "...#...", ".......", "..#....", ".#....#", "##....#", ".#...#.", ".#...#.", ".#...#.", "..#.#..", "...##..", "....#..", "...#...", "#..#...", "#.#....", "......."],
    "Ä": ["..........", "......#.#.", "..........", ".......###", "......#.#.", ".....#..#.", ".....#.#..", "....#..#..", "...####...", "...#..#...", "...#..#..#", "..#...#.#.", "##.....#..", "..........", "..........", ".........."],
    "Ö": ["........", "....#.#.", "........", "..#..#..", ".#..#.#.", ".#.#..##", "#...###.", "#.....#.", "#.....#.", "#....#..", "#....#..", ".#..#...", "..##....", "........", "........", "........"],
    "Ü": ["........", "..#.#...", "........", "#.##....", ".##....#", "..#....#", ".#....#.", ".#....#.", "#....#..", "#....#..", "#...##..", "#..#.#.#", ".##...#.", "........", "........", "........"],
    "Þ": ["..........", "..........", "..........", ".....###..", "....#...#.", "...#....#.", "...#....#.", "...#####..", "..#.......", "..#.......", "..#.......", ".#.......#", "#........#", "....#####.", "..........", ".........."],
    "Ð": ["........", "........", "........", "..####..", ".#....#.", ".#.#...#", "...#...#", ".#####.#", "..#....#", "..#...#.", ".#....#.", ".#..##..", "####....", "........", "........", "........"],
    "Æ": ["...........", "...........", "...........", "......##.##", ".....#..#..", "....#..#...", "....#..#...", "...#..####.", "..#####....", "..#..#.....", "..#..#....#", ".#...#...#.", "#.....###..", "...........", "...........", "..........."],
    "1": ["...", "...", "...", "..#", ".##", "#.#", "..#", ".#.", ".#.", ".#.", "#..", "#..", "#..", "...", "...", "..."],
    "2": ["......", "......", "......", "...##.", "..#..#", ".....#", ".....#", "....#.", "...#..", "..#...", ".#....", "#.....", "#####.", "......", "......", "......"],
    "3": ["......", "......", "......", "...##.", "..#..#", ".....#", "....#.", "...#..", "....#.", ".....#", "#....#", "#...#.", ".###..", "......", "......", "......"],
    "4": ["......", "......", "......", "...#..", "...#..", "..#...", "..#...", ".#..#.", "#...#.", "######", "...#..", "..#...", "..#...", "......", "......", "......"],
    "5": ["......", "......", "......", "...###", "..#...", "..#...", ".#....", ".###..", "....#.", "....#.", "....#.", "#..#..", ".##...", "......", "......", "......"],
    "6": [".....", ".....", ".....", "....#", "...#.", "..#..", ".#...", ".###.", "##..#", "#...#", "#...#", "#..#.", ".##..", ".....", ".....", "....."],
    "7": ["......", "......", "......", "..####", ".#..#.", "....#.", "...#..", ".####.", "..#...", ".#....", ".#....", "#.....", "#.....", "......", "......", "......"],
    "8": [".....", ".....", ".....", "..##.", ".#..#", ".#..#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#", "#..#.", ".##..", ".....", ".....", "....."],
    "9": [".....", ".....", ".....", "..##.", ".#..#", "#...#", "#...#", "#..##", ".###.", "...#.", "..#..", ".#...", "#....", ".....", ".....", "....."],
    "0": ["......", "......", "......", "...##.", "..#..#", ".#...#", ".#...#", "#....#", "#....#", "#...#.", "#...#.", "#..#..", ".##...", "......", "......", "......"],
    " ": ["....", "....", "....", "....", "....", "....", "....", "....", "....", "....", "....", "....", "....", "....", "....", "...."],
    ".": [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "#", ".", ".", "."],
    ",": ["..", "..", "..", "..", "..", "..", "..", "..", "..", "..", "..", ".#", ".#", "#.", "..", ".."],
    "-": ["...", "...", "...", "...", "...", "...", "...", "...", "...", "###", "...", "...", "...", "...", "...", "..."],
    "!": ["...", "...", "...", "..#", "..#", "..#", ".#.", ".#.", ".#.", ".#.", "...", "#..", "#..", "...", "...", "..."],
    "?": ["....", "....", "....", "....", ".##.", ".#.#", "...#", "...#", "..#.", ".#..", ".#..", "....", "#...", "....", "....", "...."],
    "'": ["..", "..", "..", ".#", ".#", "#.", "..", "..", "..", "..", "..", "..", "..", "..", "..", ".."],
    ":": ["..", "..", "..", "..", "..", "..", "..", ".#", ".#", "..", "..", "#.", "#.", "..", "..", ".."],
    "=": ["....", "....", "....", "....", "....", "....", "....", "....", ".###", "....", "###.", "....", "....", "....", "....", "...."],
    "+": ["......", "......", "......", "......", "......", "......", "...#..", "...#..", "####..", "..####", "..#...", "..#...", "......", "......", "......", "......"],
    "×": [".....", ".....", ".....", ".....", ".....", ".....", ".....", ".....", ".#..#", ".#.#.", "..#..", ".#.#.", "#..#.", ".....", ".....", "....."],
    ";": ["...", "...", "...", "...", "...", "...", "...", "..#", "..#", "...", "...", ".#.", ".#.", "#..", "...", "..."],
    "*": ["......", "......", "......", "..#...", "..#.##", "..#.#.", "...#..", "######", "..##..", ".#.#..", "......", "......", "......", "......", "......", "......"],
    "/": ["....", "....", "....", "....", "....", "...#", "...#", "..#.", "..#.", ".#..", ".#..", "#...", "#...", "....", "....", "...."],
    "&": ["........", "........", "........", "........", ".....##.", "....#.#.", "...#.#..", "...##...", "..##..##", ".#.#.#..", "#...#...", "#..##...", ".##..###", "........", "........", "........"],
    "@": ["........", "........", "........", "........", "...###..", "..#...#.", ".#..##.#", "#..#.#.#", "#.#..#.#", "#.#..#.#", "#..##.#.", ".#......", "..####..", "........", "........", "........"]
  };


  /* Hafrun's narrow block alphabet, traced cell-for-cell off her chart.
     Ten rows: accents in rows 0-1, the body in rows 2-7 (baseline row 7,
     cap height six rows, x-height rows 4-7) and descenders in rows 8-9.
     Her chart has no Q or T and no Icelandic letters; those are drawn from
     her own shapes. */
  var SIENA_GLYPHS = {
    "a": ["...", "...", "...", "...", ".##", "#.#", "#.#", "###", "...", "..."],
    "b": ["...", "...", "#..", "#..", "##.", "#.#", "#.#", "###", "...", "..."],
    "c": ["...", "...", "...", "...", ".##", "#..", "#..", "###", "...", "..."],
    "d": ["...", "...", "..#", "..#", ".##", "#.#", "#.#", "###", "...", "..."],
    "e": ["...", "...", "...", "...", ".#.", "###", "#..", "###", "...", "..."],
    "f": ["..", "..", ".#", "#.", "##", "#.", "#.", "#.", "..", ".."],
    "g": ["...", "...", "...", "...", ".##", "#.#", "#.#", "###", "..#", "##."],
    "h": ["...", "...", "#..", "#..", "##.", "#.#", "#.#", "#.#", "...", "..."],
    "i": [".", ".", "#", ".", "#", "#", "#", "#", ".", "."],
    "j": ["..", "..", ".#", "..", ".#", ".#", ".#", ".#", ".#", "#."],
    "k": ["...", "...", "#..", "#..", "#.#", "##.", "#.#", "#.#", "...", "..."],
    "l": [".", ".", "#", "#", "#", "#", "#", "#", ".", "."],
    "m": [".....", ".....", ".....", ".....", "##.#.", "#.#.#", "#.#.#", "#.#.#", ".....", "....."],
    "n": ["...", "...", "...", "...", "##.", "#.#", "#.#", "#.#", "...", "..."],
    "o": ["...", "...", "...", "...", ".##", "#.#", "#.#", "##.", "...", "..."],
    "p": ["...", "...", "...", "...", "##.", "#.#", "#.#", "###", "#..", "#.."],
    "q": ["...", "...", "...", "...", ".##", "#.#", "#.#", "###", "..#", "..#"],
    "r": ["...", "...", "...", "...", "#.#", "##.", "#..", "#..", "...", "..."],
    "s": ["....", "....", "....", "....", ".###", "##..", "..##", "###.", "....", "...."],
    "t": ["...", "...", ".#.", ".#.", "###", ".#.", ".#.", ".#.", "...", "..."],
    "u": ["...", "...", "...", "...", "#.#", "#.#", "#.#", ".##", "...", "..."],
    "v": ["...", "...", "...", "...", "#.#", "#.#", ".#.", ".#.", "...", "..."],
    "w": [".....", ".....", ".....", ".....", "#.#.#", "#.#.#", "#.#.#", "##.#.", ".....", "....."],
    "x": ["...", "...", "...", "...", "#.#", ".#.", ".#.", "#.#", "...", "..."],
    "y": ["...", "...", "...", "...", "#.#", "#.#", "#.#", ".##", "..#", "##."],
    "z": ["....", "....", "....", "....", "####", "..#.", ".#..", "####", "....", "...."],
    "á": ["...", "..#", "...", "...", ".##", "#.#", "#.#", "###", "...", "..."],
    "é": ["...", "..#", "...", "...", ".#.", "###", "#..", "###", "...", "..."],
    "í": [".", "#", ".", ".", "#", "#", "#", "#", ".", "."],
    "ó": ["...", "..#", "...", "...", ".##", "#.#", "#.#", "##.", "...", "..."],
    "ú": ["...", "..#", "...", "...", "#.#", "#.#", "#.#", ".##", "...", "..."],
    "ý": ["...", "..#", "...", "...", "#.#", "#.#", "#.#", ".##", "..#", "##."],
    "ä": ["...", "#.#", "...", "...", ".##", "#.#", "#.#", "###", "...", "..."],
    "ö": ["...", "#.#", "...", "...", ".##", "#.#", "#.#", "##.", "...", "..."],
    "ü": ["...", "#.#", "...", "...", "#.#", "#.#", "#.#", ".##", "...", "..."],
    "þ": ["...", "...", "#..", "#..", "##.", "#.#", "#.#", "##.", "#..", "#.."],
    "ð": ["....", "....", "..#.", ".###", ".##.", "#..#", "#..#", ".##.", "....", "...."],
    "æ": ["......", "......", "......", "......", ".##.##", "#.##.#", "#####.", ".##.##", "......", "......"],
    "A": ["...", "...", "##.", "#.#", "#.#", "###", "#.#", "#.#", "...", "..."],
    "B": ["...", "...", "##.", "#.#", "##.", "#.#", "#.#", "###", "...", "..."],
    "C": ["...", "...", ".##", "#..", "#..", "#..", "#..", "###", "...", "..."],
    "D": ["...", "...", "##.", "#.#", "#.#", "#.#", "#.#", "###", "...", "..."],
    "E": ["...", "...", "###", "#..", "##.", "#..", "#..", "###", "...", "..."],
    "F": ["...", "...", "###", "#..", "##.", "#..", "#..", "#..", "...", "..."],
    "G": ["...", "...", "###", "#..", "#..", "#.#", "#.#", "###", "...", "..."],
    "H": ["...", "...", "#.#", "#.#", "###", "#.#", "#.#", "#.#", "...", "..."],
    "I": [".", ".", "#", "#", "#", "#", "#", "#", ".", "."],
    "J": ["...", "...", "..#", "..#", "..#", "..#", "..#", "##.", "...", "..."],
    "K": ["...", "...", "#.#", "#.#", "##.", "#.#", "#.#", "#.#", "...", "..."],
    "L": ["...", "...", "#..", "#..", "#..", "#..", "#..", "###", "...", "..."],
    "M": [".....", ".....", "#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", ".....", "....."],
    "N": ["....", "....", "#..#", "##.#", "#.##", "#..#", "#..#", "#..#", "....", "...."],
    "O": ["...", "...", ".##", "#.#", "#.#", "#.#", "#.#", "##.", "...", "..."],
    "P": ["...", "...", "##.", "#.#", "#.#", "###", "#..", "#..", "...", "..."],
    "Q": [".....", ".....", ".###.", "#...#", "#...#", "#...#", "#.#.#", ".###.", "....#", "....."],
    "R": ["...", "...", "##.", "#.#", "#.#", "##.", "#.#", "#.#", "...", "..."],
    "S": ["...", "...", ".##", "#..", ".#.", "..#", "..#", "##.", "...", "..."],
    "T": [".....", ".....", "#####", "..#..", "..#..", "..#..", "..#..", "..#..", ".....", "....."],
    "U": ["...", "...", "#.#", "#.#", "#.#", "#.#", "#.#", ".##", "...", "..."],
    "V": ["...", "...", "#.#", "#.#", "#.#", "#.#", ".#.", ".#.", "...", "..."],
    "W": [".....", ".....", "#...#", "#...#", "#...#", "#.#.#", "##.##", "#...#", ".....", "....."],
    "X": ["....", "....", "#..#", ".##.", "..#.", ".#..", ".##.", "#..#", "....", "...."],
    "Y": ["...", "...", "#.#", "#.#", "#.#", ".#.", ".#.", ".#.", "...", "..."],
    "Z": ["...", "...", "###", "..#", ".#.", ".#.", "#..", "###", "...", "..."],
    "Á": ["..#", "...", "##.", "#.#", "#.#", "###", "#.#", "#.#", "...", "..."],
    "É": ["..#", "...", "###", "#..", "##.", "#..", "#..", "###", "...", "..."],
    "Í": ["#", ".", "#", "#", "#", "#", "#", "#", ".", "."],
    "Ó": ["..#", "...", ".##", "#.#", "#.#", "#.#", "#.#", "##.", "...", "..."],
    "Ú": ["..#", "...", "#.#", "#.#", "#.#", "#.#", "#.#", ".##", "...", "..."],
    "Ý": ["..#", "...", "#.#", "#.#", "#.#", ".#.", ".#.", ".#.", "...", "..."],
    "Ä": ["#.#", "...", "##.", "#.#", "#.#", "###", "#.#", "#.#", "...", "..."],
    "Ö": ["#.#", "...", ".##", "#.#", "#.#", "#.#", "#.#", "##.", "...", "..."],
    "Ü": ["#.#", "...", "#.#", "#.#", "#.#", "#.#", "#.#", ".##", "...", "..."],
    "Þ": ["...", "...", "#..", "##.", "#.#", "##.", "#..", "#..", "...", "..."],
    "Ð": ["....", "....", ".##.", ".#.#", "##.#", ".#.#", ".#.#", ".###", "....", "...."],
    "Æ": ["......", "......", ".#####", "##....", "#.####", "#.#...", "#.#...", "#.####", "......", "......"],
    "1": ["..", "..", ".#", "##", ".#", ".#", ".#", ".#", "..", ".."],
    "2": ["...", "...", "##.", "..#", ".#.", "#..", "#..", "###", "...", "..."],
    "3": ["...", "...", "##.", "..#", ".#.", "..#", "..#", "###", "...", "..."],
    "4": ["....", "....", "..#.", ".##.", "#.#.", "####", "..#.", "..#.", "....", "...."],
    "5": ["...", "...", "###", "#..", "##.", "..#", "..#", "###", "...", "..."],
    "6": ["...", "...", ".##", "#..", "###", "#.#", "#.#", ".#.", "...", "..."],
    "7": ["...", "...", "###", "..#", "..#", ".#.", ".#.", ".#.", "...", "..."],
    "8": ["...", "...", ".##", "#.#", ".#.", "#.#", "#.#", "##.", "...", "..."],
    "9": ["...", "...", ".#.", "#.#", "#.#", "###", "..#", "##.", "...", "..."],
    "0": ["...", "...", ".##", "#.#", "#.#", "#.#", "#.#", "##.", "...", "..."],
    " ": ["..", "..", "..", "..", "..", "..", "..", "..", "..", ".."],
    ".": [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    ",": ["..", "..", "..", "..", "..", "..", "..", ".#", "#.", ".."],
    "-": ["..", "..", "..", "..", "..", "##", "..", "..", "..", ".."],
    "!": [".", ".", "#", "#", "#", "#", ".", "#", ".", "."],
    "?": ["....", "....", ".##.", "#..#", "..#.", ".#..", "....", ".#..", "....", "...."],
    "'": [".", ".", "#", "#", ".", ".", ".", ".", ".", "."],
    ":": [".", ".", ".", ".", ".", "#", ".", "#", ".", "."],
    "=": ["...", "...", "...", "...", "###", "...", "###", "...", "...", "..."],
    "+": ["...", "...", "...", "...", ".#.", "###", ".#.", "...", "...", "..."]
  };

  function glyphFor(ch, style){
    if (style === "siena"){
      return SIENA_GLYPHS[ch] || SIENA_GLYPHS[ch.toLowerCase()] || SIENA_GLYPHS[ch.toUpperCase()] || SIENA_GLYPHS["?"] || SIENA_GLYPHS[" "];
    }
    if (style === "script"){
      return SCRIPT_GLYPHS[ch] || SCRIPT_GLYPHS[ch.toLowerCase()] || SCRIPT_GLYPHS[ch.toUpperCase()] || SCRIPT_GLYPHS[" "];
    }
    if (style === "serif"){
      var up = ch.toUpperCase();
      return SERIF_GLYPHS[up] || SERIF_GLYPHS[ch] || SERIF_GLYPHS["?"] || SERIF_GLYPHS[" "];
    }
    return GLYPHS[ch] || GLYPHS[ch.toUpperCase()] || GLYPHS[ch.toLowerCase()] || GLYPHS["?"] || GLYPHS[" "];
  }
  function scaleGlyph(rows, factor){
    var nativeH = rows.length, nativeW = rows[0].length;
    var outH = Math.max(1, Math.round(nativeH*factor));
    var outW = Math.max(1, Math.round(nativeW*factor));
    var out = [];
    for (var y=0; y<outH; y++){
      var sy = Math.min(nativeH-1, Math.floor(y/factor));
      var line = "";
      for (var x=0; x<outW; x++){
        var sx = Math.min(nativeW-1, Math.floor(x/factor));
        line += rows[sy][sx];
      }
      out.push(line);
    }
    return out;
  }
  // Height of a plain capital in each alphabet. The glyph box is ten rows,
  // but three of them are headroom for accents and descenders — scaling by
  // the box made "10 stitches tall" come out as a 7-stitch letter.
  // The cursive hand is joined up: its letters are meant to touch, so no
  // blank square is put between them.
  function letterGapFor(style, factor){
    if (style === "script") return 0;
    return Math.max(1, Math.round(factor));
  }
  function capRowsFor(style){
    if (style === "script") return 10;
    if (style === "siena") return 6;
    return style === "serif" ? 8 : 7;
  }
  function textToStitchGrid(text, stitchHeight, style){
    var factor = stitchHeight / capRowsFor(style);
    var chars = text.split("");
    var glyphRowsList = chars.map(function(ch){ return scaleGlyph(glyphFor(ch, style), factor); });
    var gap = letterGapFor(style, factor);
    var cells = {};
    var any = false;
    var xOffset = 0;
    var minY = Infinity, maxY = -1;
    glyphRowsList.forEach(function(gr){
      var w = gr[0].length;
      for (var y=0; y<gr.length; y++){
        for (var x=0; x<w; x++){
          if (gr[y][x] === "#"){
            cells[(xOffset+x)+"-"+y] = true;
            any = true;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      xOffset += w + gap;
    });
    // Drop the blank rows the box left above and below, so the block is
    // exactly as tall as the letters actually are — a word with no accents
    // comes out at the height that was asked for.
    if (!any) return { width: 0, height: 0, cells: {}, any: false };
    var trimmed = {};
    Object.keys(cells).forEach(function(k){
      var parts = k.split("-");
      trimmed[parts[0] + "-" + (+parts[1] - minY)] = true;
    });
    return {
      width: Math.max(0, xOffset - gap),
      height: maxY - minY + 1,
      cells: trimmed,
      any: any
    };
  }

  /* ---------------- block backstitch (line) alphabet ----------------
     Square-cornered capitals drawn as backstitch lines rather than filled
     stitches: flat tops, straight stems, and only the round letters getting
     clipped corners. Every endpoint lands on a grid intersection, which is
     where a backstitch can actually start and finish.
     Unit grid: 0,0 = top-left of the capital, y grows downward, baseline at
     y=8; accents sit above at y=-2..-1 and tails below at y=9.
     {w: advance width in units, segs: [[x1,y1,x2,y2], ...]} */
  /* Hafrun's own backstitch alphabet, traced off her chart: the strokes are
     read straight off the lattice, so they run exactly where she drew them,
     including the ones that are not at forty-five degrees.
     Unit grid: cap top y=0, baseline y=5, descenders to y=7, accents above
     at y=-2..-1.  {w: advance width, segs: [[x1,y1,x2,y2], ...]} */
  var STITCH_H = 5;
  var STITCH_GLYPHS = {
    "a": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 3], [2, 2, 2, 5], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5]]},
    "b": {w:3, segs:[[0, 0, 0, 5], [1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 4], [2, 4, 1, 5], [0, 5, 1, 5]]},
    "c": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 3], [0, 3, 0, 4], [0, 4, 1, 5], [1, 5, 2, 5]]},
    "d": {w:3, segs:[[2, 0, 2, 5], [0, 2, 0, 4], [0, 2, 1, 2], [1, 2, 2, 3], [0, 4, 1, 5], [1, 5, 2, 5]]},
    "e": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 3], [0, 3, 0, 4], [2, 3, 1, 4], [0, 4, 1, 4], [0, 4, 1, 5], [1, 5, 2, 5]]},
    "f": {w:3, segs:[[2, 0, 1, 1], [1, 1, 1, 5], [0, 2, 2, 2]]},
    "g": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 3], [2, 2, 2, 6], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5], [2, 6, 1, 7], [0, 7, 1, 7]]},
    "h": {w:3, segs:[[0, 0, 0, 5], [1, 2, 0, 3], [1, 2, 2, 3], [2, 3, 2, 5]]},
    "i": {w:1, segs:[[0, 0, 0, 1], [0, 2, 0, 5]]},
    "j": {w:2, segs:[[1, 0, 1, 1], [1, 2, 1, 6], [1, 6, 0, 7]]},
    "k": {w:3, segs:[[0, 0, 0, 5], [2, 2, 0, 3], [0, 3, 2, 5]]},
    "l": {w:2, segs:[[0, 0, 0, 4], [0, 4, 1, 5]]},
    "m": {w:5, segs:[[0, 2, 0, 5], [1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 5], [3, 2, 2, 3], [3, 2, 4, 2], [4, 2, 4, 5]]},
    "n": {w:3, segs:[[0, 2, 0, 5], [1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 5]]},
    "o": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 4], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5]]},
    "p": {w:3, segs:[[0, 2, 0, 7], [1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 4], [2, 4, 1, 5], [0, 5, 1, 5]]},
    "q": {w:4, segs:[[0, 2, 0, 4], [0, 2, 1, 2], [1, 2, 2, 3], [2, 2, 2, 7], [0, 4, 1, 5], [1, 5, 2, 5], [3, 6, 2, 7]]},
    "r": {w:3, segs:[[0, 2, 0, 5], [1, 2, 0, 3], [1, 2, 2, 3]]},
    "s": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 2], [0, 3, 2, 4], [2, 4, 1, 5], [0, 5, 1, 5]]},
    "t": {w:3, segs:[[1, 1, 1, 4], [0, 2, 2, 2], [1, 4, 2, 5]]},
    "u": {w:3, segs:[[0, 2, 0, 4], [2, 2, 2, 5], [0, 4, 1, 5], [1, 5, 2, 5]]},
    "v": {w:3, segs:[[0, 2, 0, 4], [2, 2, 1, 5], [2, 2, 2, 3], [2, 3, 1, 5], [0, 4, 1, 5]]},
    "w": {w:5, segs:[[0, 2, 1, 5], [1, 5, 2, 2], [2, 2, 3, 5], [3, 5, 4, 2]]},
    "x": {w:3, segs:[[0, 2, 1, 3], [2, 2, 1, 3], [1, 3, 1, 4], [1, 4, 0, 5], [1, 4, 2, 5]]},
    "y": {w:3, segs:[[0, 2, 0, 3], [2, 2, 2, 6], [0, 3, 1, 5], [2, 4, 1, 5], [2, 6, 1, 7]]},
    "z": {w:3, segs:[[0, 2, 2, 2], [2, 2, 0, 5], [2, 2, 1, 4], [1, 4, 0, 5], [0, 5, 2, 5]]},
    "á": {w:3, segs:[[2, 0, 1, 1], [1, 2, 0, 3], [1, 2, 2, 3], [2, 2, 2, 5], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5]]},
    "é": {w:3, segs:[[2, 0, 1, 1], [1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 3], [0, 3, 0, 4], [2, 3, 1, 4], [0, 4, 1, 4], [0, 4, 1, 5], [1, 5, 2, 5]]},
    "í": {w:1, segs:[[0, 2, 0, 5], [1, 0, 0, 1]]},
    "ó": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 4], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5], [2, 0, 1, 1]]},
    "ú": {w:3, segs:[[0, 2, 0, 4], [2, 2, 2, 5], [0, 4, 1, 5], [1, 5, 2, 5], [2, 0, 1, 1]]},
    "ý": {w:3, segs:[[0, 2, 0, 3], [2, 2, 2, 6], [0, 3, 1, 5], [2, 4, 1, 5], [2, 6, 1, 7], [2, 0, 1, 1]]},
    "ä": {w:3, segs:[[1, 2, 0, 3], [1, 2, 2, 3], [2, 2, 2, 5], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5], [0, 0, 0, 1], [1, 0, 1, 1]]},
    "ö": {w:3, segs:[[0, 0, 0, 1], [1, 0, 1, 1], [1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 4], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5]]},
    "ü": {w:3, segs:[[0, 2, 0, 4], [2, 2, 2, 5], [0, 4, 1, 5], [1, 5, 2, 5], [0, 0, 0, 1], [1, 0, 1, 1]]},
    "þ": {w:4, segs:[[0, 0, 0, 7], [0, 2, 3, 2], [3, 2, 4, 3], [4, 3, 3, 4], [0, 4, 3, 4]]},
    "ð": {w:4, segs:[[1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 2, 4], [0, 3, 0, 5], [2, 4, 1, 5], [0, 5, 1, 5], [2, 2, 3, 0], [1, 1, 3, 1]]},
    "æ": {w:5, segs:[[1, 2, 0, 3], [1, 2, 2, 3], [2, 2, 2, 4], [3, 2, 2, 3], [3, 2, 4, 2], [4, 2, 4, 3], [0, 3, 0, 5], [4, 3, 3, 4], [2, 4, 1, 5], [2, 4, 3, 4], [2, 4, 3, 5], [0, 5, 1, 5], [3, 5, 4, 5]]},
    "A": {w:4, segs:[[1, 0, 0, 2], [1, 0, 2, 0], [2, 0, 3, 2], [0, 2, 0, 5], [3, 2, 3, 5], [0, 3, 3, 3]]},
    "B": {w:4, segs:[[0, 0, 0, 5], [0, 0, 1, 0], [1, 0, 2, 1], [2, 1, 2, 2], [0, 2, 2, 2], [2, 2, 3, 3], [3, 3, 3, 4], [3, 4, 2, 5], [0, 5, 2, 5]]},
    "C": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "D": {w:4, segs:[[0, 0, 0, 5], [0, 0, 1, 0], [1, 0, 3, 2], [3, 2, 3, 4], [3, 4, 2, 5], [0, 5, 2, 5]]},
    "E": {w:3, segs:[[0, 0, 0, 5], [0, 0, 2, 0], [0, 2, 2, 2], [0, 5, 2, 5]]},
    "F": {w:3, segs:[[0, 0, 0, 5], [0, 0, 2, 0], [0, 2, 2, 2]]},
    "G": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 4], [2, 3, 3, 3], [3, 3, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "H": {w:4, segs:[[0, 0, 0, 5], [3, 0, 3, 5], [0, 2, 3, 2]]},
    "I": {w:3, segs:[[0, 0, 2, 0], [1, 0, 1, 5], [0, 5, 2, 5]]},
    "J": {w:4, segs:[[0, 0, 3, 0], [2, 0, 2, 5], [2, 5, 0, 7]]},
    "K": {w:4, segs:[[0, 0, 0, 5], [3, 0, 0, 3], [1, 2, 3, 4], [3, 4, 3, 5]]},
    "L": {w:3, segs:[[0, 0, 0, 5], [0, 5, 2, 5]]},
    "M": {w:5, segs:[[0, 0, 0, 5], [0, 0, 2, 4], [4, 0, 2, 4], [4, 0, 4, 5]]},
    "N": {w:4, segs:[[0, 0, 0, 5], [0, 0, 1, 1], [3, 0, 3, 5], [1, 1, 3, 5], [2, 4, 3, 4]]},
    "O": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 4], [3, 1, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "P": {w:4, segs:[[0, 0, 0, 5], [0, 0, 2, 0], [2, 0, 3, 1], [3, 1, 3, 2], [3, 2, 2, 3], [0, 3, 2, 3]]},
    "Q": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 4], [3, 1, 3, 4], [1, 3, 3, 5], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "R": {w:4, segs:[[0, 0, 0, 5], [0, 0, 2, 0], [2, 0, 3, 1], [3, 1, 3, 2], [3, 2, 2, 3], [0, 3, 2, 3], [1, 3, 3, 5]]},
    "S": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 2], [0, 2, 1, 2], [1, 2, 2, 3], [2, 3, 3, 3], [3, 3, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "T": {w:4, segs:[[0, 0, 3, 0], [1, 0, 1, 5]]},
    "U": {w:4, segs:[[0, 0, 0, 4], [3, 0, 3, 5], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "V": {w:5, segs:[[0, 0, 1, 2], [0, 0, 2, 5], [4, 0, 2, 5], [1, 2, 1, 3], [3, 2, 3, 3], [3, 3, 2, 5]]},
    "W": {w:5, segs:[[0, 0, 0, 3], [4, 0, 4, 3], [2, 1, 2, 3], [2, 2, 1, 5], [4, 2, 3, 5], [0, 3, 1, 5], [2, 3, 1, 5], [2, 3, 3, 5], [4, 3, 3, 5]]},
    "X": {w:5, segs:[[0, 0, 2, 2], [4, 0, 2, 2], [2, 2, 2, 3], [2, 3, 0, 5], [2, 3, 4, 5]]},
    "Y": {w:5, segs:[[0, 0, 1, 1], [4, 0, 3, 1], [1, 1, 1, 2], [3, 1, 3, 2], [1, 2, 2, 3], [3, 2, 2, 3], [2, 3, 2, 5]]},
    "Z": {w:4, segs:[[0, 0, 3, 0], [3, 0, 1, 3], [3, 0, 2, 2], [2, 2, 1, 3], [1, 3, 0, 5], [0, 5, 3, 5]]},
    "Á": {w:4, segs:[[2, -2, 1, -1], [1, 0, 0, 2], [1, 0, 2, 0], [2, 0, 3, 2], [0, 2, 0, 5], [3, 2, 3, 5], [0, 3, 3, 3]]},
    "É": {w:3, segs:[[0, 0, 0, 5], [0, 0, 2, 0], [0, 2, 2, 2], [0, 5, 2, 5], [2, -2, 1, -1]]},
    "Í": {w:3, segs:[[0, 0, 2, 0], [1, 0, 1, 5], [0, 5, 2, 5], [2, -2, 1, -1]]},
    "Ó": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 4], [3, 1, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5], [2, -2, 1, -1]]},
    "Ú": {w:4, segs:[[0, 0, 0, 4], [3, 0, 3, 5], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5], [2, -2, 1, -1]]},
    "Ý": {w:5, segs:[[0, 0, 1, 1], [4, 0, 3, 1], [1, 1, 1, 2], [3, 1, 3, 2], [1, 2, 2, 3], [3, 2, 2, 3], [2, 3, 2, 5], [2, -2, 1, -1]]},
    "Ä": {w:4, segs:[[1, 0, 0, 2], [1, 0, 2, 0], [2, 0, 3, 2], [0, 2, 0, 5], [3, 2, 3, 5], [0, 3, 3, 3], [1, -2, 1, -1], [2, -2, 2, -1]]},
    "Ö": {w:4, segs:[[1, -2, 1, -1], [2, -2, 2, -1], [1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 4], [3, 1, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "Ü": {w:4, segs:[[0, 0, 0, 4], [3, 0, 3, 5], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5], [1, -2, 1, -1], [2, -2, 2, -1]]},
    "Þ": {w:4, segs:[[0, 0, 0, 5], [0, 1, 3, 1], [3, 1, 4, 2], [4, 2, 3, 3], [0, 3, 3, 3]]},
    "Ð": {w:4, segs:[[0, 0, 0, 5], [0, 0, 1, 0], [1, 0, 3, 2], [3, 2, 3, 4], [0, 3, 2, 3], [3, 4, 2, 5], [0, 5, 2, 5]]},
    "Æ": {w:6, segs:[[1, 0, 0, 2], [1, 0, 2, 0], [2, 0, 3, 2], [3, 0, 3, 5], [3, 0, 5, 0], [2, 1, 3, 1], [0, 2, 0, 5], [3, 2, 5, 2], [0, 3, 3, 3], [3, 5, 5, 5]]},
    "1": {w:2, segs:[[1, 0, 0, 1], [1, 0, 1, 5]]},
    "2": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [3, 1, 3, 2], [3, 2, 0, 5], [0, 5, 3, 5]]},
    "3": {w:4, segs:[[0, 0, 3, 0], [3, 0, 1, 2], [1, 2, 2, 2], [2, 2, 3, 3], [3, 3, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "4": {w:4, segs:[[2, 0, 0, 2], [0, 2, 0, 3], [2, 2, 2, 5], [0, 3, 3, 3]]},
    "5": {w:4, segs:[[0, 0, 0, 2], [0, 0, 3, 0], [0, 2, 2, 2], [2, 2, 3, 3], [3, 3, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "6": {w:4, segs:[[2, 0, 0, 2], [0, 2, 0, 4], [1, 2, 2, 2], [2, 2, 3, 3], [3, 3, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "7": {w:4, segs:[[0, 0, 3, 0], [3, 0, 3, 1], [3, 1, 1, 3], [1, 3, 0, 5]]},
    "8": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 1, 2], [3, 1, 2, 2], [1, 2, 0, 3], [1, 2, 2, 2], [2, 2, 3, 3], [0, 3, 0, 4], [3, 3, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    "9": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 2], [3, 1, 3, 3], [0, 2, 1, 3], [1, 3, 2, 3], [3, 3, 1, 5]]},
    "0": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 0], [2, 0, 3, 1], [0, 1, 0, 4], [3, 1, 3, 4], [0, 4, 1, 5], [3, 4, 2, 5], [1, 5, 2, 5]]},
    ".": {w:1, segs:[[0, 4, 0, 5]]},
    ",": {w:2, segs:[[1, 5, 0, 6]]},
    "-": {w:3, segs:[[0, 3, 2, 3]]},
    "!": {w:1, segs:[[0, 0, 0, 3], [0, 4, 0, 5]]},
    "?": {w:2, segs:[[0, 0, 0, 1], [0, 0, 1, 0], [1, 0, 1, 2], [1, 2, 0, 3], [0, 4, 0, 5]]},
    "'": {w:1, segs:[[0, 0, 0, 1]]},
    ":": {w:1, segs:[[0, 2, 0, 3], [0, 4, 0, 5]]},
    "=": {w:3, segs:[[0, 2, 2, 2], [0, 3, 2, 3]]},
    "+": {w:3, segs:[[1, 2, 1, 4], [0, 3, 2, 3]]},
    "×": {w:3, segs:[[0, 2, 2, 4], [2, 2, 0, 4]]},
    ";": {w:2, segs:[[1, 3, 1, 4], [1, 5, 0, 6]]},
    "*": {w:3, segs:[[0, 0, 2, 2], [0, 0, 1, 2], [0, 0, 2, 1], [1, 0, 0, 2], [1, 0, 1, 2], [2, 0, 0, 1], [2, 0, 0, 2], [0, 1, 2, 1]]},
    "/": {w:3, segs:[[2, 1, 0, 5]]},
    "\\": {w:3, segs:[[0, 1, 2, 5]]},
    "&": {w:4, segs:[[1, 0, 0, 1], [1, 0, 2, 1], [0, 1, 1, 3], [2, 1, 0, 3], [0, 2, 1, 2], [0, 2, 3, 5], [0, 3, 0, 4], [3, 3, 1, 5], [0, 4, 1, 5]]},
    "@": {w:5, segs:[[1, 1, 0, 2], [1, 1, 3, 1], [3, 1, 4, 2], [0, 2, 0, 4], [2, 2, 1, 3], [2, 2, 3, 2], [3, 2, 3, 4], [4, 2, 4, 3], [1, 3, 2, 4], [4, 3, 3, 4], [0, 4, 1, 5], [2, 4, 3, 4], [1, 5, 3, 5]]},
    "©": {w:5, segs:[[1, 1, 0, 2], [1, 1, 3, 1], [3, 1, 4, 2], [0, 2, 0, 4], [2, 2, 1, 3], [2, 2, 3, 2], [4, 2, 4, 4], [1, 3, 2, 4], [0, 4, 1, 5], [2, 4, 3, 4], [4, 4, 3, 5], [1, 5, 3, 5]]}
  };
  function stitchGlyphFor(ch){
    return STITCH_GLYPHS[ch] || STITCH_GLYPHS[ch.toUpperCase()] || null;
  }
  /* Composes text into backstitch segments, scaled/positioned in stitch-grid
     units. Returns {width, height, segs:[{x1,y1,x2,y2}], any}. */
  function textToStitchSegments(text, stitchHeight){
    var factor = stitchHeight / STITCH_H;
    var gap = letterGapFor("stitch", factor);
    var segsOut = [];
    var xOffset = 0;
    var any = false;
    var minY = 0, maxY = stitchHeight;
    text.split("").forEach(function(ch){
      if (ch === " "){ xOffset += Math.round(2*factor) + gap; return; }
      var g = stitchGlyphFor(ch);
      if (!g){ xOffset += Math.round(2*factor) + gap; return; }
      g.segs.forEach(function(sg){
        // A backstitch runs between two holes in the fabric, so every end
        // point is rounded onto a grid intersection — at fractional sizes
        // (say 12 stitches tall, which is 1.5×) it would otherwise land in
        // the middle of a square, where no stitch can start.
        var seg = {
          x1: xOffset + Math.round(sg[0]*factor), y1: Math.round(sg[1]*factor),
          x2: xOffset + Math.round(sg[2]*factor), y2: Math.round(sg[3]*factor)
        };
        minY = Math.min(minY, seg.y1, seg.y2);
        maxY = Math.max(maxY, seg.y1, seg.y2);
        segsOut.push(seg);
        any = true;
      });
      xOffset += Math.round(g.w*factor) + gap;
    });
    // Accents reach above the capital (negative rows), so the whole line is
    // pushed down far enough to sit inside the chart.
    if (minY < 0){
      var shift = Math.ceil(-minY);
      segsOut.forEach(function(seg){ seg.y1 += shift; seg.y2 += shift; });
      maxY += shift;
    }
    return { width: Math.max(0, xOffset - gap), height: Math.ceil(maxY), segs: segsOut, any: any };
  }

  // Each traced alphabet has one true size — the height it was drawn at.
  // Anything else has to stretch whole rows and the letters stop looking like
  // the chart, so picking a font drops the height back to its own.
  function naturalHeightFor(style){
    return style === "stitch" ? STITCH_H : capRowsFor(style);
  }
  el.lettersFont.addEventListener("change", function(){
    el.lettersHeight.value = naturalHeightFor(el.lettersFont.value);
    // The letters change under the pointer the moment the alphabet is picked.
    refreshTextStamp(true);
  });

  /* Builds what she typed into a little piece of pattern — one line of the
     text box is one line on the chart. The bitmap alphabets give filled
     squares, the outline one gives backstitch lines, and the lines are
     centred over each other with a settable gap between them. The same piece
     is used both by "add" and by the click-to-place button. */
  function buildTextPiece(text, style, stitchHeight, lineGap){
    var lines = text.split("\n").map(function(l){ return l.trim(); });
    while (lines.length && lines[lines.length-1] === "") lines.pop();
    while (lines.length && lines[0] === "") lines.shift();
    var blank = Math.max(1, Math.round(stitchHeight));
    var parts = lines.map(function(line){
      if (line === "") return { width: 0, height: blank, cells: {}, segs: [], any: false };
      if (style === "stitch"){
        var sg = textToStitchSegments(line, stitchHeight);
        return { width: sg.width, height: sg.height, cells: {}, segs: sg.segs, any: sg.any };
      }
      var g = textToStitchGrid(line, stitchHeight, style);
      return { width: g.width, height: g.height, cells: g.cells, segs: [], any: g.any };
    });
    if (!parts.some(function(p){ return p.any; })) return { w: 0, h: 0, cells: {}, back: [], any: false };
    var maxW = 0;
    parts.forEach(function(p){ if (p.width > maxW) maxW = p.width; });
    var cells = {}, back = [], y0 = 0;
    parts.forEach(function(p, i){
      var dx = Math.floor((maxW - p.width) / 2);
      Object.keys(p.cells).forEach(function(k){
        var q = k.split("-");
        cells[(dx + +q[0]) + "-" + (y0 + +q[1])] = state.selectedColor;
      });
      p.segs.forEach(function(sg){
        back.push({ x1: dx+sg.x1, y1: y0+sg.y1, x2: dx+sg.x2, y2: y0+sg.y2,
                    color: state.selectedColor });
      });
      y0 += p.height + (i < parts.length - 1 ? lineGap : 0);
    });
    return { w: Math.ceil(maxW), h: Math.ceil(y0), cells: cells, back: back, any: true };
  }

  function textSettings(){
    var text = el.lettersInput.value.replace(/\r/g, "");
    // "Á" can arrive as A + a combining accent (macOS keyboards do this);
    // normalising joins them back into the single character the alphabet has.
    if (text.normalize) text = text.normalize("NFC");
    if (!text.trim()) return null;
    var style = el.lettersFont.value;
    var stitchHeight = Math.min(30, Math.max(5, parseInt(el.lettersHeight.value,10) || 10));
    // Scaling a bitmap alphabet below its own size breaks the strokes, so
    // each style has its natural height as a floor.
    if (style !== "stitch"){
      var floor = capRowsFor(style);
      if (stitchHeight < floor){ stitchHeight = floor; el.lettersHeight.value = floor; }
    }
    var lineGap = parseInt(el.lettersLineGap.value, 10);
    if (isNaN(lineGap)) lineGap = 2;
    lineGap = Math.min(12, Math.max(0, lineGap));
    return { text: text, style: style, height: stitchHeight, lineGap: lineGap };
  }
  /* ---------------- the text follows along as it is written ----------------
     No "add" step: whatever is in the box is already hanging off the pointer,
     and changing the alphabet, the letter height, the line spacing or the
     thread rebuilds it on the spot. A click on the chart puts it down. The
     grid is never resized to make room — she chose that size, so text that is
     too big is simply reported as too big. */
  var textTimer = null;
  function lettersPaneOpen(){
    return !!(el.genLettersPane && !el.genLettersPane.classList.contains("gen-hidden"));
  }
  function dropTextStamp(){
    if (pendingStamp && pendingStamp.fromText){
      cancelStamp();
      updateSelectionBar();
      renderCanvas(true);
    }
  }
  function buildTextStamp(){
    textTimer = null;
    if (!lettersPaneOpen()) return;
    var cfg = textSettings();
    if (!cfg){                       // nothing written: nothing to carry around
      dropTextStamp();
      setGenStatus(el.lettersStatus, "", "");
      return;
    }
    var piece = buildTextPiece(cfg.text, cfg.style, cfg.height, cfg.lineGap);
    if (!piece.any){
      dropTextStamp();
      setGenStatus(el.lettersStatus, cfg.style === "stitch" ? "lettersStitchEmpty" : "lettersEmpty", "error");
      return;
    }
    // Keep the spot the last version was hovering over, so changing the
    // alphabet does not make the text jump away from where she was aiming.
    var wasAt = (pendingStamp && pendingStamp.fromText && pendingStamp.x !== null)
      ? { x: pendingStamp.x, y: pendingStamp.y } : null;
    startStamp({ w: piece.w, h: piece.h, cells: piece.cells, back: piece.back });
    pendingStamp.fromText = true;
    if (wasAt){ pendingStamp.x = wasAt.x; pendingStamp.y = wasAt.y; }
    if (piece.w > state.width || piece.h > state.height){
      setGenStatus(el.lettersStatus, "lettersTooBig", "error");
    } else {
      setGenStatus(el.lettersStatus, "lettersFollow", "ok");
    }
    renderCanvas(true);
  }
  function refreshTextStamp(immediate){
    if (textTimer){ clearTimeout(textTimer); textTimer = null; }
    if (immediate) buildTextStamp();
    else textTimer = setTimeout(buildTextStamp, 200);
  }
  if (el.lettersInput) el.lettersInput.addEventListener("input", function(){ refreshTextStamp(); });
  [el.lettersHeight, el.lettersLineGap].forEach(function(inp){
    if (!inp) return;
    inp.addEventListener("input", function(){ refreshTextStamp(); });
    inp.addEventListener("change", function(){ refreshTextStamp(true); });
  });
  // Opening the text tab with something already written picks it up again.
  if (el.genTabLetters) el.genTabLetters.addEventListener("click", function(){ refreshTextStamp(true); });
  if (el.genTabImage) el.genTabImage.addEventListener("click", dropTextStamp);

  /* ---------------- the "i" panel ----------------
     Everything that used to be written in small print around the page —
     what the arrow keys do, how to pan, which letter picks which tool —
     lives here instead, one button away. */
  var HELP_SECTIONS = [
    { h: "helpSecTools", rows: [
      ["B", "helpDraw"], ["G", "helpFill"], ["L", "helpLine"], ["R", "helpRect"],
      ["S", "helpBack"], ["E", "helpErase"], ["I", "helpPick"], ["V", "helpSelectTool"],
      ["$helpKeyRight", "helpRightClick"], ["$helpKeyAlt", "helpAltClick"]
    ]},
    { h: "helpSecChart", rows: [
      ["$helpKeyStitchView", "helpStitchView"],
      ["$helpKeyArrows", "helpArrows"], ["$helpKeyShiftArrows", "helpArrowsBig"],
      ["$helpKeySpace", "helpPan"], ["$helpKeyEsc", "helpEsc"]
    ], text: "helpChartFlow" },
    { h: "helpSecTouch", text: "helpTouchFlow" },
    { h: "helpSecUndo", rows: [
      ["$helpKeyUndo", "helpUndo"], ["$helpKeyRedo", "helpRedo"]
    ]},
    { h: "helpSecSelect", rows: [
      ["$helpKeyDelete", "helpDeleteKey"], ["$helpKeyClip", "helpClipKeys"]
    ], text: "helpSelectFlow" },
    { h: "helpSecText", text: "helpTextFlow" },
    { h: "helpSecMirror", text: "helpMirrorFlow" },
    { h: "helpSecImage", text: "helpImageFlow" },
    { h: "helpSecThreads", text: "helpThreadsFlow" },
    { h: "helpSecProgress", text: "helpProgressFlow" },
    { h: "helpSecSize", text: "helpSizeFlow" },
    { h: "helpSecSheet", text: "helpSheetFlow" },
    { h: "helpSecSave", text: "helpSaveFlow" },
    { h: "helpSecPdf", text: "helpPdfFlow" }
  ];;
  function buildHelp(){
    if (!el.helpBody) return;
    el.helpBody.innerHTML = "";
    HELP_SECTIONS.forEach(function(sec){
      var h = document.createElement("h3");
      h.textContent = t(sec.h);
      el.helpBody.appendChild(h);
      (sec.rows || []).forEach(function(row){
        var line = document.createElement("div");
        line.className = "help-row";
        var k = document.createElement("span");
        k.className = "k";
        var kb = document.createElement("kbd");
        kb.textContent = row[0].charAt(0) === "$" ? t(row[0].slice(1)) : row[0];
        k.appendChild(kb);
        var d = document.createElement("span");
        d.className = "d";
        d.textContent = t(row[1]);
        line.appendChild(k); line.appendChild(d);
        el.helpBody.appendChild(line);
      });
      if (sec.text){
        var para = document.createElement("p");
        para.className = "help-text";
        para.textContent = t(sec.text);
        el.helpBody.appendChild(para);
      }
    });
    var note = document.createElement("p");
    note.className = "help-note";
    note.textContent = t("helpColorNote");
    el.helpBody.appendChild(note);
  }
  function openHelp(){
    if (!el.helpOverlay) return;
    buildHelp();
    el.helpOverlay.classList.remove("gen-hidden");
    if (el.helpCloseBtn) el.helpCloseBtn.focus();
  }
  function closeHelp(){
    if (el.helpOverlay) el.helpOverlay.classList.add("gen-hidden");
    if (el.helpBtn) el.helpBtn.focus();
  }
  function helpOpen(){
    return !!(el.helpOverlay && !el.helpOverlay.classList.contains("gen-hidden"));
  }
  if (el.helpBtn) el.helpBtn.addEventListener("click", openHelp);
  if (el.helpCloseBtn) el.helpCloseBtn.addEventListener("click", closeHelp);
  if (el.helpOverlay) el.helpOverlay.addEventListener("click", function(ev){
    if (ev.target === el.helpOverlay) closeHelp();
  });

  /* ---------------- capability wiring ---------------- */
  // Handing a finished file to the user. Inside Claude the host does it; on a
  // copy of this page living at its own address — a home-screen app, say —
  // the browser's own download does the same job.
  function browserDownloads(){
    return { save: function(opts){
      return new Promise(function(resolve, reject){
        try {
          var url = URL.createObjectURL(opts.data);
          var a = document.createElement("a");
          a.href = url;
          a.download = opts.filename;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          setTimeout(function(){
            if (a.parentNode) a.parentNode.removeChild(a);
            URL.revokeObjectURL(url);
          }, 4000);
          resolve(true);
        } catch(e){ reject(e); }
      });
    }};
  }
  function initCapabilities(){
    // Saving no longer needs anything from the host — only downloading does.
    if (window.claude && window.claude.use){
      window.claude.use("downloads").then(function(ns){ downloads = ns || browserDownloads(); });
      return;
    }
    downloads = browserDownloads();
  }

  /* ---------------- boot ---------------- */
  function start(){
    var savedLang = null, savedTheme = null, savedPxPerCm = null, savedBgColor = null;
    try { savedLang = localStorage.getItem("reitasaumur_lang"); } catch(e){}
    try { savedTheme = localStorage.getItem("reitasaumur_theme"); } catch(e){}
    try { savedPxPerCm = parseFloat(localStorage.getItem("reitasaumur_pxPerCm")); } catch(e){}
    try { savedBgColor = localStorage.getItem("reitasaumur_bgColor"); } catch(e){}
    try { state.coordsOn = localStorage.getItem("reitasaumur_coords") === "1"; } catch(e){}
    try {
      var savedMargin = parseFloat(localStorage.getItem("reitasaumur_margin"));
      if (el.marginInput && !isNaN(savedMargin)) el.marginInput.value = String(savedMargin);
    } catch(e){}
    if (savedPxPerCm && isFinite(savedPxPerCm) && savedPxPerCm > 0){ state.pxPerCm = savedPxPerCm; }
    if (savedBgColor && /^#[0-9a-fA-F]{6}$/.test(savedBgColor)){ state.bgColor = savedBgColor; }
    if (savedLang === "is" || savedLang === "en"){
      state.lang = savedLang;
      if (el.langSwitch) el.langSwitch.querySelectorAll("button").forEach(function(b){
        b.classList.toggle("active", b.getAttribute("data-lang") === savedLang);
      });
    }
    if (savedTheme === "light" || savedTheme === "dark"){
      state.theme = savedTheme;
    }
    applyTheme();
    applyStaticI18n();

    state.cells = sampleCells(state.width, state.height);
    state.isSample = true;
    el.widthInput.value = state.width;
    el.heightInput.value = state.height;
    el.symbolsToggle.checked = state.symbolsOn;
    el.printToggle.checked = state.printOn;
    el.aidaCount.value = String(state.aidaCount);
    if (el.bgColorInput) el.bgColorInput.value = state.bgColor;
    if (el.coordsToggle) el.coordsToggle.checked = state.coordsOn;

    renderPalette();
    syncPaletteFold();
    savedDocs = readStore();
    renderSavedList();
    // Pick up whatever was on the chart when the page was last closed.
    var draft = readDraft();
    if (draft){
      loadPattern(draft.savedId || null, draft);
      setDbStatus("draftRestored", {name: draft.name || t("unnamedPattern")});
    }
    setZoom(actualCellPx()); // start at 100% zoom (actual size)
    updateFabricSize();
    updateHistoryButtons();
    initCapabilities();
  }

  start();
})();

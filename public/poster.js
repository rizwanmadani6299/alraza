/* Al Raza Travel poster. Uses the approved flyer (poster-base.jpg) as the design and writes the live details on top. */
(function () {
  var W = 1024, CX = 46, CY = 322, CW = 466, CH = 484, GAP = 12, HEAD = 322, FY0 = 1290, FH = 246, BAND = 78;
  var ADDRESS = "DHA Branch: Shop No. 1, Building 3C, Lane 10, Khayaban-e-Sehar, Near Faizan Islam Masjid, Phase 7, DHA, Karachi, Pakistan";
  var MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var SANS = "'Segoe UI', Roboto, Arial, Helvetica, sans-serif", SERIF = "Cambria, Georgia, 'Times New Roman', serif";
  var base = new Image(), logo = new Image(); base.src = "/poster-base.jpg"; logo.src = "/logo-final.png";
  function ld(i) { return new Promise(function (r) { if (i.complete && i.naturalWidth) return r(); i.onload = i.onerror = function () { r(); }; }); }
  function num(n) { return Number(n).toLocaleString("en-US"); }
  function ds(i) { var a = String(i).split("-"); return (+a[2]) + " " + MON[a[1] - 1]; }
  function ph(p) { p = String(p || "").replace(/\D/g, ""); return p.length === 11 ? p.slice(0, 4) + "-" + p.slice(4) : p; }
  function dist(d) { return d ? "(" + String(d).replace(/\s+m$/i, "m") + ")" : ""; }
  // cover a zone with the colours around it (row by row), so the old text disappears
  function patch(c, x, y, w, h, lx, rx) {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h); if (lx !== undefined) lx = Math.round(lx); if (rx !== undefined) rx = Math.round(rx);
    var L = c.getImageData(lx === undefined ? x - 3 : lx, y, 1, h).data, R = c.getImageData(rx === undefined ? x + w + 2 : rx, y, 1, h).data;
    for (var r = 0; r < h; r++) {
      var g = c.createLinearGradient(x, 0, x + w, 0), i = r * 4;
      g.addColorStop(0, "rgb(" + L[i] + "," + L[i + 1] + "," + L[i + 2] + ")"); g.addColorStop(1, "rgb(" + R[i] + "," + R[i + 1] + "," + R[i + 2] + ")");
      c.fillStyle = g; c.fillRect(x, y + r, w, 1.2);
    }
  }
  function soft(c, x, y, w, h, lx, rx) {
    var m = 14, o = document.createElement("canvas"); o.width = w + 2 * m; o.height = h + 2 * m; var q = o.getContext("2d");
    q.drawImage(c.canvas, x - m, y - m, w + 2 * m, h + 2 * m, 0, 0, o.width, o.height);
    var L = c.getImageData(lx, y - m, 1, h + 2 * m).data, R = c.getImageData(rx, y - m, 1, h + 2 * m).data;
    for (var r = 0; r < h + 2 * m; r++) { var g = q.createLinearGradient(0, 0, o.width, 0), i = r * 4; g.addColorStop(0, "rgb(" + L[i] + "," + L[i + 1] + "," + L[i + 2] + ")"); g.addColorStop(1, "rgb(" + R[i] + "," + R[i + 1] + "," + R[i + 2] + ")"); q.fillStyle = g; q.fillRect(0, r, o.width, 1.2); }
    var mk = document.createElement("canvas"); mk.width = o.width; mk.height = o.height; var k = mk.getContext("2d"); k.fillStyle = "#000"; k.fillRect(m, m, w, h);
    if ("filter" in k) { var t2 = document.createElement("canvas"); t2.width = mk.width; t2.height = mk.height; var k2 = t2.getContext("2d"); k2.filter = "blur(7px)"; k2.drawImage(mk, 0, 0); mk = t2; }
    q.globalCompositeOperation = "destination-in"; q.drawImage(mk, 0, 0); c.drawImage(o, x - m, y - m);
  }
  function fit(c, t, maxW, size, min, wt, fam) { var s = size; for (; ;) { c.font = wt + " " + s + "px " + fam; if (c.measureText(t).width <= maxW || s <= min) break; s -= 1; } return s; }
  function wrap(c, t, maxW) { var w = String(t).split(" "), l = [], cur = ""; w.forEach(function (x) { var n = cur ? cur + " " + x : x; if (c.measureText(n).width > maxW && cur) { l.push(cur); cur = x; } else cur = n; }); if (cur) l.push(cur); return l; }
  function crescent(c, cx, cy, r) {
    var g = c.createLinearGradient(cx - r, cy - r, cx + r, cy + r); g.addColorStop(0, "#fff0b0"); g.addColorStop(.5, "#e8b93c"); g.addColorStop(1, "#b8860b"); c.fillStyle = g;
    c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.arc(cx + r * .42, cy - r * .12, r * .82, 0, Math.PI * 2, true); c.fill("evenodd");
    c.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .13 : r * .3; c.lineTo(cx + r * .62 + Math.cos(a) * rr, cy - r * .28 + Math.sin(a) * rr); } c.closePath(); c.fill();
  }
  function bus(c, x, y, s) { c.fillStyle = "#0d3b2b"; c.beginPath(); c.moveTo(x, y + s * .2); c.arcTo(x, y, x + s * .2, y, s * .15); c.lineTo(x + s * .8, y); c.arcTo(x + s, y, x + s, y + s * .2, s * .15); c.lineTo(x + s, y + s * .75); c.lineTo(x, y + s * .75); c.closePath(); c.fill(); c.fillStyle = "#f3dc9b"; c.fillRect(x + s * .1, y + s * .12, s * .8, s * .3); c.fillStyle = "#0d3b2b"; c.beginPath(); c.arc(x + s * .27, y + s * .78, s * .12, 0, 7); c.arc(x + s * .73, y + s * .78, s * .12, 0, 7); c.fill(); }
  function T(c, t, x, y, font, color, al) { c.font = font; c.fillStyle = color; c.textAlign = al || "left"; c.textBaseline = "alphabetic"; c.fillText(t, x, y); }
  function flyTxt(p) { var a = String(p.airline || "").toUpperCase(); return /^TBC$/.test(a) ? "AIRLINE TBC" : (/^FLY\b/.test(a) ? a : "FLY " + a); }
  function flights(p) {
    var a = String(p.flight_out || "").trim().split(/\s+/), b = String(p.flight_back || "").trim().split(/\s+/);
    if (!a[0]) return "";
    if (!p.flight_back) return a.join("-");
    if (a.length > 1 && b.length > 1 && a[0] === b[0]) return a[0] + "-" + a[1] + "/" + b[1];
    return a.join("-") + "/" + b.join("-");
  }
  function hotelBlock(c, ox, oy, name, d, shuttle, zy, zh) {
    patch(c, 162 + ox, zy + oy, 184, zh, 159 + ox, 349 + ox);
    var f = 20, lines; for (; ;) { c.font = "600 " + f + "px " + SANS; lines = wrap(c, name, 178); if ((lines.length <= 2 && lines.every(function (l) { return c.measureText(l).width <= 180; })) || f <= 14) break; f--; }
    var dl = dist(d) ? dist(d) + (shuttle ? "  · Shuttle" : "") : (shuttle ? "Shuttle service" : ""), n = lines.length + (dl ? 1 : 0), lh = f + 2;
    if (n * lh > zh + 6) { f = 14; lh = 16; lines = wrap(c, name, 178).slice(0, 2); }
    var y = zy + f; lines.forEach(function (l) { T(c, l, 164 + ox, y + oy, "600 " + f + "px " + SANS, "#16372c"); y += lh; });
    if (dl) T(c, dl, 164 + ox, y + oy, "600 " + Math.max(f - 2, 14) + "px " + SANS, "#16372c");
  }
  function card(c, x, y, p, h) {
    c.drawImage(base, CX, CY, CW, CH, x, y, CW, CH);
    var ox = x - CX, oy = y - CY;
    var P = function (a, b, w, hh, l, r) { patch(c, a + ox, b + oy, w, hh, l === undefined ? undefined : l + ox, r === undefined ? undefined : r + ox); };
    var t = function (s, a, b, font, color, al) { T(c, s, a + ox, b + oy, font, color, al); };
    // badge (no package number)
    P(238, 330, 86, 62, 233, 330); t("AL RAZA", 281, 343, "bold 12px " + SANS, "#f3dc9b", "center"); crescent(c, 281 + ox, 369 + oy, 17);
    // walking / shuttle strip
    var sh = h.makkah_shuttle || h.madinah_shuttle; P(188, 423, 207, 25, 185, 398);
    if (sh) { P(143, 423, 40, 25, 139, 186); bus(c, 148 + ox, 427 + oy, 26); }
    t(sh ? "SHUTTLE SERVICE" : "WALKING DISTANCE", 292, 443, "800 21px " + SERIF, "#0f3a2c", "center");
    hotelBlock(c, ox, oy, h.makkah, h.makkah_distance, h.makkah_shuttle, 483, 50);
    hotelBlock(c, ox, oy, h.madinah, h.madinah_distance, h.madinah_shuttle, 566, 50);
    // fly strip
    P(205, 622, 222, 27, 202, 430);
    var ft = flyTxt(p), fl = flights(p); c.font = "bold 21px " + SANS; var w1 = c.measureText(ft).width; c.font = "600 15px " + SANS; var w2 = fl ? c.measureText(fl).width + 10 : 0, sx = 313 - (w1 + w2) / 2;
    t(ft, sx, 642, "bold 21px " + SANS, "#f4efe3"); if (fl) t(fl, sx + w1 + 10, 641, "600 15px " + SANS, "#f4efe3");
    // rate rows
    var ys = [671.5, 703.5, 737, 769.5];
    for (var i = 0; i < 4; i++) {
      var room = p.rooms[i], v = room ? h.rates[room] : null, cy = ys[i];
      P(135, cy - 12, 113, 24, 131, 250); if (room) t(room.toUpperCase(), 147, cy + 7, "600 19px " + SANS, "#f4efe3");
      P(292, cy - 13, 160, 26, 289, 456);
      if (room && v) { t("PKR", 300, cy + 7, "600 16px " + SANS, "#16372c"); t(num(v), 436, cy + 9, "bold 26px " + SERIF, "#12382d", "right"); }
      else if (room) t("--", 392, cy + 8, "bold 24px " + SANS, "#16372c", "center");
    }
  }
  async function render(o) {
    await Promise.all([ld(base), ld(logo)]);
    var p = o.pkg, hs = o.picks, n = hs.length, rows = n <= 2 ? 1 : 2;
    var bodyH = rows * CH + (rows - 1) * GAP + 14, fy = HEAD + bodyH, H = fy + FH + BAND;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H; var c = cv.getContext("2d", { willReadFrequently: true });
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#08381f"); g.addColorStop(1, "#06301c"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.drawImage(base, 0, 0, W, HEAD, 0, 0, W, HEAD);
    c.drawImage(base, 0, HEAD, 46, 40, 0, HEAD, 46, 40); c.drawImage(base, 976, HEAD, 48, 40, 976, HEAD, 48, 40);
    // header: logo, city, date bar
    var lc = c.createRadialGradient(176, 115, 10, 176, 115, 96); lc.addColorStop(0, "#124a35"); lc.addColorStop(1, "#08291d");
    c.fillStyle = lc; c.beginPath(); c.arc(176, 115, 97, 0, 7); c.fill();
    c.lineWidth = 5; c.strokeStyle = "#d9a93a"; c.beginPath(); c.arc(176, 115, 92, 0, 7); c.stroke(); c.lineWidth = 1.5; c.strokeStyle = "#f0cf72"; c.beginPath(); c.arc(176, 115, 84, 0, 7); c.stroke();
    if (logo.naturalWidth) { var lh = 150, lw = lh * logo.naturalWidth / logo.naturalHeight; c.drawImage(logo, 176 - lw / 2, 115 - lh / 2, lw, lh); }
    soft(c, 272, 142, 470, 52, 262, 262);
    var city = p.city.toUpperCase() + " UMRAH PACKAGES"; fit(c, city, 462, 46, 26, "bold", SERIF); c.shadowColor = "rgba(0,0,0,.6)"; c.shadowBlur = 4; c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "alphabetic"; c.fillText(city, 507, 183); c.shadowBlur = 0; c.textAlign = "left";
    var nights = Math.max(p.days - 1, 0), d1 = ds(p.departure_date), d2 = ds(p.return_date) + " " + p.return_date.slice(0, 4), dt = d1 + " – " + d2;
    patch(c, 160, 256, 192, 50, 156, 356); T(c, dt, 255, 277, "bold " + fit(c, dt, 186, 19, 13, "bold", SANS) + "px " + SANS, "#fff", "center"); T(c, "(" + p.days + " DAYS)", 255, 298, "600 14px " + SANS, "#f4efe3", "center");
    patch(c, 468, 256, 134, 50, 464, 606); T(c, p.days + " Days", 536, 277, "bold 19px " + SANS, "#fff", "center"); T(c, "(" + nights + " NIGHTS)", 536, 298, "600 14px " + SANS, "#f4efe3", "center");
    patch(c, 742, 256, 140, 50, 738, 886); T(c, flyTxt(p), 812, 277, "bold " + fit(c, flyTxt(p), 134, 18, 12, "bold", SANS) + "px " + SANS, "#fff", "center"); T(c, flights(p), 812, 298, "600 14px " + SANS, "#f4efe3", "center");
    // cards
    hs.forEach(function (h, i) {
      var x, y;
      if (n === 1) { x = (W - CW) / 2; y = HEAD; }
      else if (n === 3 && i === 2) { x = (W - CW) / 2; y = HEAD + CH + GAP; }
      else { x = i % 2 ? CX + 469 : CX; y = HEAD + Math.floor(i / 2) * (CH + GAP); }
      card(c, x, y, p, h);
    });
    // footer
    c.drawImage(base, 0, FY0, W, FH, 0, fy, W, FH);
    var oy = fy - FY0, ag = o.agent || {}, office = String(o.office || "").replace(/\D/g, ""), main = String(ag.phone || "").replace(/\D/g, "") || office || "03186299894";
    patch(c, 124, 1398 + oy, 280, 60, 120, 406); var name = (ag.phone && ag.name) ? ag.name.toUpperCase() : "";
    fit(c, ph(main), 268, 46, 28, "bold", SANS); c.fillStyle = "#fff"; c.textAlign = "left"; c.textBaseline = "alphabetic"; c.fillText(ph(main), 128, 1436 + oy - (name ? 4 : -4));
    if (name) { fit(c, name, 268, 17, 11, "bold", SANS); c.fillStyle = "#f0cf72"; c.fillText(name, 130, 1456 + oy); }
    patch(c, 488, 1420 + oy, 274, 28, 484, 766); T(c, "www.alrazatravelhub.com", 492, 1441 + oy, "bold 17px " + SANS, "#fff");
    // address band (office number is optional)
    var by = fy + FH, bg = c.createLinearGradient(0, by, 0, by + BAND); bg.addColorStop(0, "#0a3624"); bg.addColorStop(1, "#06261a"); c.fillStyle = bg; c.fillRect(0, by, W, BAND);
    c.fillStyle = "#d9a93a"; c.fillRect(40, by, W - 80, 2);
    fit(c, ADDRESS, 940, 17, 12, "600", SANS); c.fillStyle = "#f4efe3"; c.textAlign = "center"; c.fillText(ADDRESS, W / 2, by + 30);
    if (office && office !== String(ag.phone || "").replace(/\D/g, "")) { c.font = "bold 18px " + SANS; c.fillStyle = "#f0cf72"; c.fillText("Office: " + ph(office), W / 2, by + 58); }
    else { c.font = "600 15px " + SANS; c.fillStyle = "#f0cf72"; c.fillText("Instagram · Facebook · TikTok: Al Raza Travel", W / 2, by + 58); }
    c.textAlign = "left";
    return cv;
  }
  window.AlRazaPoster = { render: render };
})();

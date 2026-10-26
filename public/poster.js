/* Al Raza Travel poster renderer. One design for every post. */
(function () {
  var W = 1080, GOLD = "#e8c565", GOLD2 = "#b8923a", DK = "#0b3326", MID = "#145a42", CREAM = "#fbf6e9";
  var MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var CODE = { Karachi: "KHI", Islamabad: "ISB", Multan: "MUX", Lahore: "LHE" };
  var logo = new Image(); logo.src = "/logo-final.png";
  function ready() { return new Promise(function (r) { if (logo.complete && logo.naturalWidth) return r(); logo.onload = logo.onerror = function () { r(); }; }); }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function font(c, t, maxW, size, min, wt, fam) { var s = size; for (; ;) { c.font = wt + " " + s + "px " + fam; if (c.measureText(t).width <= maxW || s <= min) break; s -= 2; } return s; }
  function wrap(c, t, maxW) { var w = String(t).split(" "), l = [], cur = ""; w.forEach(function (x) { var n = cur ? cur + " " + x : x; if (c.measureText(n).width > maxW && cur) { l.push(cur); cur = x; } else cur = n; }); if (cur) l.push(cur); return l; }
  function num(n) { return Number(n).toLocaleString("en-US"); }
  function ds(i) { var a = String(i).split("-"); return (+a[2]) + " " + MON[a[1] - 1]; }
  function flyT(p) { return /^tbc$/i.test(p.airline) ? "AIRLINE: TBC" : "FLY " + String(p.airline).toUpperCase() + (p.flight_out ? " " + p.flight_out + "/" + String(p.flight_back || "").replace(/^\D+/, "") : ""); }
  function phone(p) { p = String(p || "").replace(/\D/g, ""); return p.length === 11 ? p.slice(0, 4) + "-" + p.slice(4) : p; }
  var SANS = "Arial, Helvetica, sans-serif", SERIF = "Georgia, 'Times New Roman', serif";
  function kaaba(c, x, y, s) { c.fillStyle = "#111"; rr(c, x, y + s * .08, s, s * .86, 6); c.fill(); c.fillStyle = GOLD; c.fillRect(x, y + s * .3, s, s * .1); c.fillStyle = GOLD2; c.fillRect(x + s * .62, y + s * .5, s * .18, s * .44); }
  function dome(c, x, y, s) { c.fillStyle = "#1c8f4f"; c.beginPath(); c.arc(x + s / 2, y + s * .62, s * .42, Math.PI, 0); c.fill(); c.fillStyle = "#e9e2cc"; c.fillRect(x + s * .06, y + s * .62, s * .88, s * .3); c.fillStyle = GOLD; c.fillRect(x + s / 2 - 2, y, 4, s * .24); }
  function strip(c, x, y, w, h, txt, size) { c.fillStyle = DK; rr(c, x, y, w, h, h / 2); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 3; c.stroke(); var s = font(c, txt, w - h, size, 12, "bold", SANS); c.fillStyle = GOLD; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(txt, x + w / 2, y + h / 2 + 1); c.textAlign = "left"; c.textBaseline = "alphabetic"; }
  function hotel(c, x, y, w, f, kind, name, dist, shuttle) {
    var ic = 58 * f; (kind === "m" ? kaaba : dome)(c, x, y, ic);
    var tx = x + ic + 12 * f, tw = w - ic - 12 * f; c.fillStyle = "#333"; c.font = "bold " + 17 * f + "px " + SANS; c.fillText(kind === "m" ? "MAKKAH HOTEL:" : "MADINAH HOTEL:", tx, y + 14 * f);
    c.fillStyle = DK; c.font = "bold " + 23 * f + "px " + SANS; var ln = wrap(c, String(name).toUpperCase(), tw).slice(0, 3), yy = y + 40 * f;
    ln.forEach(function (t) { c.fillText(t, tx, yy); yy += 26 * f; });
    if (dist) { c.font = "bold " + 21 * f + "px " + SANS; c.fillText("(" + dist + ")", tx, yy); yy += 24 * f; }
    if (shuttle) { c.fillStyle = "#1c8f4f"; c.beginPath(); c.arc(tx + 6 * f, yy - 6 * f, 5 * f, 0, 7); c.fill(); c.fillStyle = "#444"; c.font = "bold " + 17 * f + "px " + SANS; c.fillText("Shuttle service", tx + 18 * f, yy); }
  }
  function card(c, x, y, cw, ch, p, h, months, f) {
    c.fillStyle = CREAM; rr(c, x, y, cw, ch, 26); c.fill(); c.strokeStyle = GOLD2; c.lineWidth = 5; c.stroke();
    strip(c, x + 14, y + 16, cw - 28, 58 * f, months + " UMRAH PACKAGE", 25 * f);
    hotel(c, x + 20 * f, y + 100 * f, cw - 40 * f, f, "m", h.makkah, h.makkah_distance, h.makkah_shuttle);
    c.strokeStyle = "rgba(11,51,38,.2)"; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 20 * f, y + 262 * f); c.lineTo(x + cw - 20 * f, y + 262 * f); c.stroke();
    hotel(c, x + 20 * f, y + 280 * f, cw - 40 * f, f, "d", h.madinah, h.madinah_distance, h.madinah_shuttle);
    var fy = y + 442 * f; strip(c, x + 14, fy, cw - 28, 48 * f, flyT(p), 22 * f);
    var ry = fy + 62 * f, rh = 46 * f;
    p.rooms.forEach(function (r) {
      var v = h.rates[r]; if (!v) return;
      c.fillStyle = DK; rr(c, x + 14, ry, (cw - 28) * .46, rh, rh / 2); c.fill();
      c.fillStyle = GOLD; c.font = "bold " + 20 * f + "px " + SANS; c.textBaseline = "middle"; c.fillText(r.toUpperCase(), x + 14 + 18 * f, ry + rh / 2 + 1);
      c.fillStyle = "#f6edc9"; rr(c, x + 14 + (cw - 28) * .44, ry, (cw - 28) * .56, rh, rh / 2); c.fill(); c.strokeStyle = GOLD2; c.lineWidth = 2; c.stroke();
      c.fillStyle = DK; c.textAlign = "right"; c.font = "bold " + 23 * f + "px " + SANS; c.fillText("PKR " + num(v), x + cw - 14 - 18 * f, ry + rh / 2 + 1); c.textAlign = "left"; c.textBaseline = "alphabetic";
      ry += rh + 9 * f;
    });
  }
  async function render(o) {
    await ready();
    var p = o.pkg, hs = o.picks, n = hs.length, cols = n <= 3 ? n : 2, rows = n <= 3 ? 1 : 2;
    var hasFl = !!(p.flight_out || p.flight_back), cw = cols === 1 ? 560 : cols === 2 ? 480 : 320, F = n === 4 ? 1 : cols === 1 ? 1.3 : cols === 2 ? 1.2 : .8, CH = Math.ceil(F * 735) + 24, gap = 22, y0 = hasFl ? 560 : 500;
    var fy = y0 + rows * (CH + gap) + 6, H = fy + 462;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H; var c = cv.getContext("2d");
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0f4a37"); g.addColorStop(.5, "#0c3b2c"); g.addColorStop(1, "#08281d"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.strokeStyle = GOLD2; c.lineWidth = 6; rr(c, 14, 14, W - 28, H - 28, 30); c.stroke();
    // header
    if (logo.naturalWidth) { var lh = 300, lw = lh * logo.naturalWidth / logo.naturalHeight; c.drawImage(logo, 62, 46, lw, lh); }
    c.fillStyle = GOLD; c.textBaseline = "alphabetic"; c.font = "bold 124px " + SERIF; c.fillText("AL RAZA", 300, 160);
    c.font = "bold 88px " + SERIF; c.fillText("TRAVEL", 330, 245);
    c.fillStyle = "#fff"; var s1 = font(c, p.city.toUpperCase() + " UMRAH PACKAGES", 700, 54, 28, "bold", SANS); c.fillText(p.city.toUpperCase() + " UMRAH PACKAGES", 300, 312);
    c.fillStyle = GOLD; c.font = "italic 27px " + SERIF; c.fillText("Spiritual Journey  ·  Blessed Experience  ·  With Al Raza Travel", 300, 354);
    // date bar
    c.fillStyle = DK; rr(c, 40, 384, W - 80, 78, 39); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 3; c.stroke();
    c.fillStyle = "#fff"; c.textBaseline = "middle"; c.textAlign = "center";
    var d1 = ds(p.departure_date), d2 = ds(p.return_date) + " " + p.return_date.slice(0, 4), nights = Math.max(p.days - 1, 0);
    var T1 = d1 + " – " + d2, T2 = p.days + " DAYS (" + nights + " NIGHTS)", T3 = flyT(p);
    font(c, T1, 290, 30, 16, "bold", SANS); c.fillText(T1, 205, 424);
    font(c, T2, 290, 30, 16, "bold", SANS); c.fillText(T2, W / 2, 424);
    font(c, T3, 290, 30, 16, "bold", SANS); c.fillText(T3, W - 205, 424);
    c.strokeStyle = "rgba(232,197,101,.5)"; c.lineWidth = 2; [370, 710].forEach(function (x) { c.beginPath(); c.moveTo(x, 398); c.lineTo(x, 448); c.stroke(); });
    c.textAlign = "left"; c.textBaseline = "alphabetic";
    // flight details
    var cc = CODE[p.city] || "", L1 = [], L2 = [];
    if (p.flight_out) L1 = ["DEPARTURE", p.flight_out, ds(p.departure_date), cc + " → JED", p.out_time];
    if (p.flight_back) L2 = ["RETURN", p.flight_back, ds(p.return_date), "JED → " + cc, p.back_time];
    c.fillStyle = "#f4efe3"; c.textAlign = "center"; c.font = "bold 24px " + SANS;
    if (L1.length) c.fillText(L1.filter(Boolean).join("  ·  "), W / 2, 500);
    if (L2.length) c.fillText(L2.filter(Boolean).join("  ·  ") + (p.baggage ? "  ·  BAGGAGE " + p.baggage : ""), W / 2, 534);
    c.textAlign = "left";
    // cards
    var m1 = MON[+p.departure_date.split("-")[1] - 1], m2 = MON[+p.return_date.split("-")[1] - 1], months = m1 === m2 ? m1 : m1 + " & " + m2;
    hs.forEach(function (h, i) {
      var col = n <= 3 ? i : i % 2, row = n <= 3 ? 0 : Math.floor(i / 2), tot = cols * cw + (cols - 1) * gap, sx = (W - tot) / 2;
      card(c, sx + col * (cw + gap), y0 + row * (CH + gap), cw, CH, p, h, months, F);
    });
    // footer
    c.fillStyle = DK; rr(c, 40, fy, W - 80, 84, 42); c.fill(); c.strokeStyle = GOLD; c.lineWidth = 3; c.stroke();
    c.fillStyle = GOLD; c.font = "bold 30px " + SANS; c.fillText("INCLUDES:", 70, fy + 54);
    c.fillStyle = "#fff"; font(c, "RETURN TICKET  ·  UMRAH VISA  ·  HOTELS  ·  TRANSPORT  ·  24/7 SUPPORT", 690, 25, 14, "bold", SANS); c.fillText("RETURN TICKET  ·  UMRAH VISA  ·  HOTELS  ·  TRANSPORT  ·  24/7 SUPPORT", 290, fy + 52);
    var gifts = (p.includes || []).filter(function (x) { return /ziyarat|ziarat/i.test(x); }).join(", ");
    if (gifts) { c.fillStyle = GOLD; c.font = "bold 30px " + SANS; c.fillText("FREE GIFTS:", 70, fy + 136); c.fillStyle = "#fff"; font(c, gifts.toUpperCase(), 680, 25, 14, "bold", SANS); c.fillText(gifts.toUpperCase(), 300, fy + 134); }
    var cy = fy + 190, ag = o.agent && o.agent.phone;
    function numBlock(cx, label, nm, name) {
      c.textAlign = "center"; c.fillStyle = "#cfe9d8"; c.font = "bold 22px " + SANS; c.fillText(label, cx, cy + 18);
      c.fillStyle = GOLD; font(c, nm, 440, 62, 30, "bold", SANS); c.fillText(nm, cx, cy + 80);
      if (name) { c.fillStyle = "#fff"; font(c, name.toUpperCase(), 440, 30, 16, "bold", SANS); c.fillText(name.toUpperCase(), cx, cy + 118); }
      c.textAlign = "left";
    }
    if (ag) { numBlock(W * .27, "WHATSAPP / CALL", "0318-6299894", ""); numBlock(W * .73, "WHATSAPP / CALL", phone(o.agent.phone), o.agent.name || ""); c.strokeStyle = "rgba(232,197,101,.4)"; c.lineWidth = 2; c.beginPath(); c.moveTo(W / 2, cy); c.lineTo(W / 2, cy + 120); c.stroke(); }
    else numBlock(W / 2, "WHATSAPP / CALL", "0318-6299894", "");
    c.textAlign = "center"; c.fillStyle = "#fff"; c.font = "bold 24px " + SANS; c.fillText("Instagram: @alrazatravel   ·   Facebook: Al Raza Travel   ·   TikTok: @alrazatravel", W / 2, fy + 366);
    c.fillStyle = GOLD; c.font = "bold 26px " + SANS; c.fillText("www.alrazatravelhub.com", W / 2, fy + 402); c.fillStyle = "#cfe9d8"; c.font = "20px " + SANS; c.fillText("A Area Rizwan Family Park, Sindhi Hotel, Liaquatabad, Karachi", W / 2, fy + 434); c.textAlign = "left";
    return cv;
  }
  window.AlRazaPoster = { render: render };
})();

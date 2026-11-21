/* Al Raza: Cheapest dates calendar and the AI Finder quiz (website toolkit). */
(function () {
  var $ = function (i) { return document.getElementById(i); }, M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], MF = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var CS = null, PC = {};
  function cities() { return CS ? Promise.resolve(CS) : fetch("/api/packages?cities=1").then(function (r) { return r.json(); }).then(function (c) { return (CS = c); }).catch(function () { return []; }); }
  function city(c) { return PC[c] ? Promise.resolve(PC[c]) : fetch("/api/packages?city=" + encodeURIComponent(c)).then(function (r) { return r.json(); }).then(function (d) { return (PC[c] = d); }).catch(function () { return []; }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function rs(n) { return "Rs. " + Number(n).toLocaleString("en-US"); }
  function kk(n) { return Math.round(n / 1000) + "k"; }
  function dm(t) { var n = parseInt(t, 10); return isNaN(n) ? 0 : n; }
  function tier(h) { var d = dm(h.makkah_distance); if (h.makkah_shuttle || d > 900 || !d) return ["STANDARD", "std"]; if (d <= 400) return ["👑 PREMIUM", "pre"]; return ["DELUXE", "del"]; }
  function wa(t) { return "https://wa.me/923006299894?text=" + encodeURIComponent(t); }
  function dl(i) { var a = i.split("-"); return +a[2] + " " + M[a[1] - 1] + " " + a[0]; }
  function opts(l) { return l.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join(""); }
  function minRate(p, room) { var v = p.hotels.map(function (h) { return h.rates[room]; }).filter(Boolean); return v.length ? Math.min.apply(null, v) : 0; }
  /* ---------- cheapest dates calendar ---------- */
  function initCal() {
    var el = $("tk-y"); if (!el || el.dataset.ok) return; el.dataset.ok = 1;
    el.innerHTML = '<div class="tkr"><select id="yc"></select><select id="yr">' + opts(["Sharing", "Quad", "Triple", "Double"]) + '</select></div><div id="yo" class="mut">Loading…</div>';
    $("yr").value = "Quad";
    cities().then(function (cs) { $("yc").innerHTML = opts(cs); calShow(); });
    $("yc").onchange = $("yr").onchange = calShow;
  }
  function calShow() {
    var c = $("yc").value, r = $("yr").value, o = $("yo"); o.innerHTML = "Loading…";
    city(c).then(function (list) {
      var items = list.map(function (p) { return { p: p, v: minRate(p, r) }; }).filter(function (x) { return x.v > 0; });
      if (!items.length) { o.innerHTML = "No departures for this room type. Try another."; return; }
      var sorted = items.slice().sort(function (a, b) { return a.v - b.v; }), best = sorted.slice(0, 3).map(function (x) { return x.p.id; }), by = {};
      items.forEach(function (x) { by[x.p.departure_date] = x; });
      var first = items[0].p.departure_date.slice(0, 7), last = items[items.length - 1].p.departure_date.slice(0, 7), months = [], y = +first.slice(0, 4), m = +first.slice(5, 7);
      for (; ;) { var k = y + "-" + ("0" + m).slice(-2); months.push(k); if (k >= last || months.length >= 9) break; m++; if (m > 12) { m = 1; y++; } }
      var h = '<div class="cal-s">⭐ <b>Cheapest dates:</b> ' + sorted.slice(0, 3).map(function (x) { return dl(x.p.departure_date) + " (" + rs(x.v) + ")"; }).join(" &nbsp;·&nbsp; ") + '</div><small class="mut">' + esc(r) + ", price per person. Tap a date.</small>";
      months.forEach(function (k) {
        var yy = +k.slice(0, 4), mm = +k.slice(5, 7), days = new Date(yy, mm, 0).getDate(), lead = (new Date(yy, mm - 1, 1).getDay() + 6) % 7;
        h += '<div class="cal-m"><h4>' + MF[mm - 1] + " " + yy + '</h4><div class="cal-g">' + WD.map(function (w) { return '<span class="cal-w">' + w + "</span>"; }).join("");
        for (var i = 0; i < lead; i++) h += "<span></span>";
        for (var d = 1; d <= days; d++) { var ds = k + "-" + ("0" + d).slice(-2), x = by[ds]; h += x ? '<button type="button" class="cal-d' + (best.indexOf(x.p.id) >= 0 ? " best" : "") + '" data-d="' + ds + '"><b>' + d + "</b><small>" + kk(x.v) + "</small></button>" : '<span class="cal-e">' + d + "</span>"; }
        h += "</div></div>";
      });
      h += '<div id="yd" class="cal-x" hidden></div>'; o.innerHTML = h;
      o.onclick = function (e) {
        var b = e.target.closest(".cal-d"); if (!b) return; var x = by[b.dataset.d], p = x.p, dd = $("yd"); dd.hidden = false;
        dd.innerHTML = "<b>" + dl(p.departure_date) + "</b> · " + esc(p.airline) + (p.flight_out ? " · " + esc(p.flight_out) : "") + " · " + p.days + " days<br>" + esc(r) + " from <b>" + rs(x.v) + '</b> per person<div style="margin-top:8px"><a class="btn sm" target="_blank" rel="noopener" href="' + wa("Assalam o Alaikum, I am interested in the " + c + " Umrah departure " + dl(p.departure_date) + " (" + r + " from " + rs(x.v) + " per person). Please share the details.") + '">Book on WhatsApp</a> <button type="button" class="btn o sm" id="ysee">See hotels &amp; rates</button></div>';
        dd.scrollIntoView({ block: "nearest", behavior: "smooth" });
        $("ysee").onclick = function () {
          var d = b.dataset.d, lab = (+d.slice(8)) + " " + M[+d.slice(5, 7) - 1].toUpperCase(), t = document.getElementById("packages"); if (t) t.scrollIntoView({ behavior: "smooth" });
          setTimeout(function () { var c2 = [].slice.call(document.querySelectorAll("#dch button")).filter(function (z) { var tx = z.textContent.replace(/\s+/g, " ").trim().toUpperCase(); return tx.indexOf(lab) === 0 && tx.indexOf(c.toUpperCase()) > 0; })[0]; if (c2) c2.click(); }, 700);
        };
      };
    });
  }
  /* ---------- AI Finder quiz ---------- */
  var Q = {};
  function initQ() { var el = $("tk-z"); if (!el || el.dataset.ok) return; el.dataset.ok = 1; Q = {}; step(0); }
  function btns(arr) { return '<div class="qz-b">' + arr.map(function (a, i) { return '<button type="button" data-i="' + i + '">' + a + "</button>"; }).join("") + "</div>"; }
  function ask(txt, arr, n, fn) { var el = $("tk-z"); el.innerHTML = '<div class="qz-p">Step ' + (n + 1) + " of 5</div><h4 class=\"qz-q\">" + txt + "</h4>" + btns(arr) + (n ? '<p><button type="button" class="qz-r" id="zb">‹ Back</button></p>' : ""); el.onclick = function (e) { var b = e.target.closest(".qz-b button"); if (b) fn(+b.dataset.i); if (e.target.id === "zb") step(n - 1); }; }
  function step(n) {
    if (n === 0) cities().then(function (cs) { ask("Which city are you travelling from?", cs, 0, function (i) { Q.city = cs[i]; step(1); }); });
    else if (n === 1) ask("How many travellers?", ["1", "2", "3", "4", "5 or more"], 1, function (i) { Q.n = i + 1; Q.room = ["Single", "Double", "Triple", "Quad", "Quad"][i]; step(2); });
    else if (n === 2) ask("Budget per person?", ["Any budget", "Up to Rs. 250,000", "Rs. 250,000 – 300,000", "Above Rs. 300,000"], 2, function (i) { Q.b = [[0, 1e9], [0, 250000], [250000, 300000], [300000, 1e9]][i]; step(3); });
    else if (n === 3) ask("What matters most to you?", ["Lowest price", "Closest to the Haram", "A balance of both"], 3, function (i) { Q.pr = i; step(4); });
    else if (n === 4) city(Q.city).then(function (list) { var ms = []; list.forEach(function (p) { var k = p.departure_date.slice(0, 7); if (ms.indexOf(k) < 0) ms.push(k); }); var labels = ["Any date", "Next 30 days"].concat(ms.map(function (k) { return MF[+k.slice(5) - 1] + " " + k.slice(0, 4); })); ask("When do you want to travel?", labels, 4, function (i) { Q.w = i === 0 ? null : i === 1 ? "30" : ms[i - 2]; result(list); }); });
  }
  function result(list) {
    var el = $("tk-z"), rooms = [Q.room].concat(["Quad", "Triple", "Double", "Sharing", "Single"]), room = null, c = [], lim = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    for (var ri = 0; ri < rooms.length && !c.length; ri++) {
      room = rooms[ri];
      list.forEach(function (p) {
        if (Q.w === "30" && p.departure_date > lim) return; if (Q.w && Q.w !== "30" && p.departure_date.slice(0, 7) !== Q.w) return;
        p.hotels.forEach(function (h) { var v = h.rates[room]; if (v && v >= Q.b[0] && v <= Q.b[1]) c.push({ p: p, h: h, v: v, d: dm(h.makkah_distance) || (h.makkah_shuttle ? 2500 : 9999) }); });
      });
    }
    if (!c.length) { el.innerHTML = '<h4 class="qz-q">No exact match</h4><p class="mut">Try a bigger budget or another month. Our team can also make a custom package for you.</p><a class="btn sm" target="_blank" rel="noopener" href="' + wa("Assalam o Alaikum, I need an Umrah package from " + Q.city + " for " + Q.n + " traveller(s). Please suggest options.") + '">Ask on WhatsApp</a> <button type="button" class="btn o sm" id="zr">Start again</button>'; el.onclick = null; $("zr").onclick = function () { Q = {}; step(0); }; return; }
    var byP = c.slice().sort(function (a, b) { return a.v - b.v; }), byD = c.slice().sort(function (a, b) { return a.d - b.d || a.v - b.v; });
    c.forEach(function (x) { x.s = Q.pr === 0 ? x.v : Q.pr === 1 ? x.d * 1000 + x.v / 1000 : byP.indexOf(x) + byD.indexOf(x); });
    c.sort(function (a, b) { return a.s - b.s; });
    var out = [], cnt = {}; c.forEach(function (x) { if (out.length >= 3) return; if ((cnt[x.p.id] || 0) >= 2) return; cnt[x.p.id] = (cnt[x.p.id] || 0) + 1; out.push(x); });
    var n = Q.n, h = '<h4 class="qz-q">Your best ' + out.length + " packages</h4>" + (room !== Q.room ? '<p class="mut">' + esc(Q.room) + " is not offered here, so these are for " + esc(room) + ".</p>" : "");
    out.forEach(function (x, i) {
      var t = tier(x.h), msg = "Assalam o Alaikum, I want this Umrah package: " + Q.city + " departure " + dl(x.p.departure_date) + " (" + x.p.airline + "), Makkah: " + x.h.makkah + ", Madinah: " + x.h.madinah + ", " + room + " " + rs(x.v) + " per person, " + n + " traveller(s). Please confirm availability.";
      h += '<div class="it qz-c"><div><span class="tier ' + t[1] + '">' + t[0] + "</span> <b>#" + (i + 1) + " · " + dl(x.p.departure_date) + "</b> · " + esc(x.p.airline) + " · " + x.p.days + " days<br><small>Makkah: " + esc(x.h.makkah) + (x.h.makkah_distance ? " (" + esc(x.h.makkah_distance) + ")" : "") + (x.h.makkah_shuttle ? " · shuttle" : "") + "<br>Madinah: " + esc(x.h.madinah) + (x.h.madinah_distance ? " (" + esc(x.h.madinah_distance) + ")" : "") + '</small></div><div style="text-align:right"><div class="big">' + rs(x.v) + "</div><small>" + esc(room) + " per person</small><br><small><b>" + rs(x.v * n) + "</b> for " + n + (Q.n === 5 ? "+" : "") + '</small><br><a class="btn sm" target="_blank" rel="noopener" href="' + wa(msg) + '">Book on WhatsApp</a></div></div>';
    });
    h += '<p><button type="button" class="btn o sm" id="zr">Start again</button></p>'; el.innerHTML = h; el.onclick = null; $("zr").onclick = function () { Q = {}; step(0); };
  }
  function boot() { var n = document.getElementById("tcg"); if (!n) return; n.addEventListener("click", function (e) { var c = e.target.closest(".tc"); if (!c) return; if (c.dataset.t === "y") setTimeout(initCal, 30); if (c.dataset.t === "z") setTimeout(initQ, 30); }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();

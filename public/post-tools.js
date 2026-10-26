/* Post maker inside the app (uses the same poster design as the website). */
(function () {
  var PK = null, MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function $(i) { return document.getElementById(i); }
  function e2(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pk() { return PK ? Promise.resolve(PK) : fetch("/api/packages").then(function (r) { return r.json(); }).then(function (d) { return (PK = d); }); }
  function dl(i) { var a = i.split("-"); return +a[2] + " " + MON[a[1] - 1] + " " + a[0]; }
  var ERR = { need_number: "Name and a valid 03xx-xxxxxxx number are required.", bad_phone: "Number must look like 03xx-xxxxxxx.", bad_post: "Choose a departure and 1 to 4 packages.", forbidden: "Not allowed." };
  function save(cv, name) { var a = document.createElement("a"); a.href = cv.toDataURL("image/png"); a.download = name; a.click(); }
  window.openPost = function () {
    pk().then(function (d) {
      var U = window.claudeUser() || {}, cs = []; d.forEach(function (p) { if (cs.indexOf(p.city) < 0) cs.push(p.city); });
      sheet('<h2 class="h2">Post maker</h2><div class="mut">Make a package poster to share on WhatsApp. It always shows 0318-6299894 and your number.</div>' +
        '<label class="mut">City</label><select id="pmC" style="width:100%;padding:11px;margin:4px 0 10px">' + cs.map(function (c) { return "<option>" + c + "</option>"; }).join("") + '</select>' +
        '<label class="mut">Departure</label><select id="pmD" style="width:100%;padding:11px;margin:4px 0 10px"></select>' +
        '<label class="mut">Choose 1 to 4 packages</label><div id="pmL" style="max-height:230px;overflow:auto;margin:4px 0 10px"></div>' +
        '<div class="g2"><div><label class="mut">Name on poster</label><input id="pmN" style="width:100%;padding:11px" maxlength="40" value="' + e2(U.role === "agent" ? U.name : "") + '"></div><div><label class="mut">Your number</label><input id="pmP" inputmode="tel" placeholder="03xx-xxxxxxx" style="width:100%;padding:11px" value="' + e2(U.phone || "") + '"></div></div>' +
        '<div id="pmM" class="mut" style="margin:8px 0"></div><div id="pmV" style="margin:8px 0"></div>' +
        '<button class="pb" id="pmB">Preview</button><button class="pb" id="pmS">Save post</button><button class="pb ghost" onclick="openPosts()">My posts</button><button class="pb ghost" onclick="closeF()">Close</button>');
      function cur() { var id = $("pmD").value; return d.filter(function (p) { return p.id === id; })[0]; }
      function picks() { return [].slice.call($("pmL").querySelectorAll("input:checked")).map(function (i) { return +i.value; }); }
      function deps() { $("pmD").innerHTML = d.filter(function (p) { return p.city === $("pmC").value; }).map(function (p) { return '<option value="' + p.id + '">' + dl(p.departure_date) + " · " + e2(p.airline) + " · " + p.days + " days</option>"; }).join(""); combos(); }
      function combos() { var p = cur(); $("pmL").innerHTML = p ? p.hotels.map(function (h, i) { var lo = Math.min.apply(null, Object.values(h.rates)); return '<label style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(128,128,128,.2)"><input type="checkbox" value="' + i + '" style="width:22px;height:22px;flex:none;margin:0;padding:0"><span style="flex:1;text-align:left"><b>' + e2(h.makkah) + "</b> ↔ " + e2(h.madinah) + '<br><span class="mut">from Rs. ' + lo.toLocaleString("en-US") + "</span></span></label>"; }).join("") : ""; $("pmV").innerHTML = ""; }
      $("pmC").onchange = deps; $("pmD").onchange = combos;
      $("pmL").onchange = function () { var ch = picks().length; [].slice.call($("pmL").querySelectorAll("input")).forEach(function (i) { i.disabled = ch >= 4 && !i.checked; }); };
      function prev() { var p = cur(), pc = picks(); if (!p || !pc.length) { $("pmM").textContent = ERR.bad_post; return Promise.reject(); } $("pmM").textContent = ""; return AlRazaPoster.render({ pkg: p, picks: pc.map(function (i) { return p.hotels[i]; }), agent: { name: $("pmN").value.trim(), phone: $("pmP").value.replace(/\D/g, "") } }).then(function (cv) { cv.style.cssText = "width:100%;border-radius:12px"; $("pmV").innerHTML = ""; $("pmV").appendChild(cv); }); }
      $("pmB").onclick = function () { prev().catch(function () { }); };
      $("pmS").onclick = function () { var p = cur(), pc = picks(); if (!p || !pc.length) { $("pmM").textContent = ERR.bad_post; return; } $("pmS").disabled = true; window.claudeApi("/api/posts", "POST", { dep: p.id, combos: pc, agentName: $("pmN").value.trim(), agentPhone: $("pmP").value.trim() }).then(function () { return prev(); }).then(function () { $("pmM").textContent = "Saved. It is now on the website too."; }).catch(function (er) { $("pmM").textContent = ERR[er && er.message] || "Could not save."; }).then(function () { $("pmS").disabled = false; }); };
      deps();
    });
  };
  window.openPosts = function () {
    sheet('<h2 class="h2">Posts</h2><div id="pmL2" class="mut">Loading…</div><button class="pb ghost" onclick="openPost()">‹ Post maker</button><button class="pb ghost" onclick="closeF()">Close</button>');
    Promise.all([window.claudeApi("/api/posts?mine=1", "GET"), pk()]).then(function (r) {
      var L = r[0], box = $("pmL2"); box.innerHTML = L.length ? "" : "No posts yet.";
      L.forEach(function (po) {
        var p = PK.filter(function (x) { return x.id === po.dep; })[0]; if (!p) return;
        var c = document.createElement("div"); c.style.cssText = "margin:10px 0;padding:8px;border:1px solid rgba(128,128,128,.25);border-radius:12px"; c.innerHTML = '<div class="mut">' + e2(po.agent.name || "Administration") + " · " + e2(po.created.slice(0, 10)) + (po.by ? " · @" + e2(po.by) : "") + "</div>"; box.appendChild(c);
        AlRazaPoster.render({ pkg: p, picks: po.combos.map(function (i) { return p.hotels[i]; }).filter(Boolean), agent: po.agent }).then(function (cv) {
          var im = new Image(); im.src = cv.toDataURL("image/jpeg", .8); im.style.cssText = "width:100%;border-radius:10px"; c.appendChild(im);
          var b = document.createElement("div"); b.innerHTML = '<button class="pb">Download</button><button class="pb ghost">Share</button><button class="pb ghost">Delete</button>'; c.appendChild(b); var bt = b.querySelectorAll("button");
          bt[0].onclick = function () { save(cv, "al-raza-" + po.dep + ".png"); };
          bt[1].onclick = function () { cv.toBlob(function (bl) { var f = new File([bl], "al-raza.png", { type: "image/png" }); if (navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: "Al Raza Travel" }).catch(function () { }); else save(cv, "al-raza-" + po.dep + ".png"); }); };
          bt[2].onclick = function () { if (confirm("Delete this post?")) window.claudeApi("/api/posts?id=" + encodeURIComponent(po.id), "DELETE").then(function () { c.remove(); }); };
        });
      });
    }).catch(function () { $("pmL2").textContent = "Could not load posts."; });
  };
})();

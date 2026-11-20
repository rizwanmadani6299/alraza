/* Al Raza: connects the app to this website (own login + own database). */
(function () {
  var SUS = false, TK = "ar_tok", tok = sessionStorage.getItem(TK) || "", USER = null, pollers = [], ready = null, kt = 0;
  function api(path, body, method) {
    if (SUS) return new Promise(function () { });
    var h = { "content-type": "application/json" }; if (tok) h.authorization = "Bearer " + tok;
    return fetch(path, { method: method || "POST", headers: h, body: body && method !== "DELETE" ? JSON.stringify(body) : undefined }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401 && path.indexOf("/login") < 0) { sessionStorage.removeItem(TK); location.reload(); throw new Error("auth"); }
        if (r.status === 403 && j.error === "suspended" && path.indexOf("/login") < 0) { sessionStorage.removeItem(TK); tok = ""; SUS = true; var o = document.createElement("div"); o.style.cssText = "position:fixed;inset:0;z-index:99999;background:#08281d;color:#fff;display:grid;place-items:center;text-align:center;padding:24px;font-family:Arial,sans-serif"; o.innerHTML = '<div><img src="/logo-final.png" style="height:130px"><h2 style="font-family:Georgia,serif">Account suspended</h2><p>Your access has been paused by the administrator.<br>Please contact Al Raza Travel.</p><a href="/" style="color:#f3dc9b">Back to website</a></div>'; document.body.appendChild(o); pollers = []; throw new Error("suspended"); }
        if (!r.ok) throw new Error(j.error || "server_error");
        return j;
      });
    });
  }
  function call(b) { return api("/api/db", b); }
  function kick() { clearTimeout(kt); kt = setTimeout(function () { pollers.forEach(function (p) { p.tick(); }); }, 150); }
  function watch(body, cb, err) {
    var v, stop = false, t, obj = {};
    function tick() {
      clearTimeout(t); if (stop) return;
      if (document.hidden) { t = setTimeout(tick, 4000); return; }
      call(v === undefined ? body : Object.assign({}, body, { v: v })).then(function (r) { if (!stop && !r.same) { v = r.v; cb(r); } }).catch(function (e) { if (err) err(e); }).then(function () { if (!stop) t = setTimeout(tick, 4000); });
    }
    obj.tick = tick; pollers.push(obj); tick();
    return function () { stop = true; clearTimeout(t); pollers = pollers.filter(function (x) { return x !== obj; }); };
  }
  function sd(p, r) { return { exists: !!r.exists, id: p.split("/").pop(), data: function () { return r.data; } }; }
  function sc(r) { return { docs: (r.docs || []).map(function (d) { return { id: d.id, data: function () { return d.data; } }; }) }; }
  var DB = {
    doc: function (p) { return {
      get: function () { return call({ op: "get", path: p }).then(function (r) { return sd(p, r); }); },
      set: function (d) { return call({ op: "set", path: p, data: d }).then(function (x) { kick(); return x; }); },
      update: function (d) { return call({ op: "update", path: p, data: d }).then(function (x) { kick(); return x; }); },
      delete: function () { return call({ op: "delete", path: p }).then(function (x) { kick(); return x; }); },
      onSnapshot: function (cb, err) { return watch({ op: "get", path: p }, function (r) { cb(sd(p, r)); }, err); }
    }; },
    collection: function (p) { return {
      get: function () { return call({ op: "list", path: p }).then(sc); },
      doc: function (id) { return DB.doc(p + "/" + id); },
      add: function (d) { var id = "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); return DB.doc(p + "/" + id).set(d).then(function () { return { id: id }; }); },
      onSnapshot: function (cb, err) { return watch({ op: "list", path: p }, function (r) { cb(sc(r)); }, err); }
    }; }
  };
  var U = { id: function () { return Promise.resolve(USER.username); }, isOwner: function () { return Promise.resolve(USER.role === "administration" || USER.role === "admin"); }, me: function () { return Promise.resolve({ email: "" }); } };
  function ui() {
    return new Promise(function (res) {
      var d = document.createElement("div");
      d.style.cssText = "position:fixed;inset:0;z-index:99999;background:linear-gradient(160deg,#0f4a37,#08281d);display:grid;place-items:center;padding:20px;font-family:Arial,sans-serif";
      d.innerHTML = '<form style="background:#fbf6e9;border-radius:20px;padding:24px;width:100%;max-width:380px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)"><img src="/logo-final.png" alt="Al Raza Travel" style="height:150px"><h2 style="margin:6px 0 14px;color:#0e3b2c;font-family:Georgia,serif">Agent &amp; Admin Login</h2><input id="shu" placeholder="Username" autocapitalize="none" autocomplete="username" style="width:100%;padding:13px;margin:5px 0;border:1px solid #d8cfb8;border-radius:12px;font-size:16px"><input id="shp" type="password" placeholder="Password" autocomplete="current-password" style="width:100%;padding:13px;margin:5px 0;border:1px solid #d8cfb8;border-radius:12px;font-size:16px"><div id="she" style="color:#b3261e;min-height:22px;font-size:14px;margin:6px 0"></div><button style="width:100%;padding:13px;border:0;border-radius:99px;background:#0e3b2c;color:#fff;font-weight:700;font-size:16px">Login</button><p style="margin:12px 0 0"><a href="/" style="color:#0e3b2c;font-size:14px">Back to website</a></p></form>';
      document.body.appendChild(d);
      var M = { not_configured: "Login is not set up yet. Please contact the office.", bad_login: "Wrong username or password.", suspended: "This account is suspended. Please contact head office.", too_many: "Too many attempts. Wait a minute.", no_db: "Database is not connected yet." };
      d.querySelector("form").onsubmit = function (e) {
        e.preventDefault(); var b = d.querySelector("button"); b.disabled = true; d.querySelector("#she").textContent = "";
        api("/api/auth/login", { username: d.querySelector("#shu").value, password: d.querySelector("#shp").value }).then(function (j) { tok = j.token; USER = j.user; sessionStorage.setItem(TK, tok); d.remove(); res(); })
          .catch(function (er) { d.querySelector("#she").textContent = M[er.message] || "Could not login. Try again."; b.disabled = false; });
      };
    });
  }
  function ensure() {
    if (ready) return ready;
    ready = (tok ? api("/api/auth/me", null, "GET").then(function (j) { USER = j.user; }).catch(function (e) { tok = ""; if (e && e.message === "suspended") SUS = true; }) : Promise.resolve()).then(function () { return USER || SUS ? null : ui(); }).then(function () {
      if (SUS) return new Promise(function () { });
      if (USER.role !== "agent") return;
      return DB.doc("agents/" + USER.username).get().then(function (s) { if (!s.exists) return DB.doc("agents/" + USER.username).set({ name: USER.name, phone: USER.phone || "", city: "", email: "", uname: USER.username, created: new Date().toISOString().slice(0, 10) }); });
    });
    return ready;
  }
  window.claude = { use: function (n) { return ensure().then(function () { return n === "db" ? DB : n === "user" ? U : null; }); } };
  window.claudeLogout = function () { sessionStorage.removeItem(TK); location.href = "/"; };
  window.claudeApi = function (path, method, body) { return api(path, body, method || "POST"); };
  window.claudeUser = function () { return USER; };
})();

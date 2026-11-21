/* Al Raza: fast repeat visits. Pictures, scripts and styles are served from the phone first and refreshed quietly. */
var C="alraza-v2";
self.addEventListener("install",function(e){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!=C}).map(function(x){return caches.delete(x)}))}).then(function(){return clients.claim()}))});
self.addEventListener("fetch",function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!="GET"||u.origin!=location.origin||u.pathname.indexOf("/api/")==0||u.pathname=="/app"||u.pathname=="/app.html")return;
  var st=/\.(png|jpg|jpeg|webp|svg|css|js|woff2?|ico|mp4)$/i.test(u.pathname);
  if(st){e.respondWith(caches.open(C).then(function(c){return c.match(r).then(function(h){var f=fetch(r).then(function(x){if(x.ok)c.put(r,x.clone());return x}).catch(function(){return h});return h||f})}));return}
  e.respondWith(fetch(r).then(function(x){var y=x.clone();caches.open(C).then(function(c){c.put(r,y)});return x}).catch(function(){return caches.match(r)}));
});

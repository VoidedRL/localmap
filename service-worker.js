var networkDataReceived = false;

// fetch fresh data 
var networkUpdate = fetch('/data.json').then(function(response) {
  return response.json();
}).then(function(data) {
  networkDataReceived = true;
  updatePage(data);
});

// fetch cached data
caches.match('/data.json').then(function(response) {
  if (!response) throw Error("No data");
  return response.json();
}).then(function(data) {
  // don't overwrite newer network data
  if (!networkDataReceived) {
    updatePage(data);
  }
}).catch(function() {
  // if no cached data is found, network is used
  return networkUpdate;
}).catch(console.log("error"));

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('deep-map').then(function(cache) {
      return fetch(event.request).then(function(response) {
        if (event.request.method != ("POST")) {
          cache.put(event.request, response.clone());
          return response;
        }
      });
    })
  );
});

/*self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then((response) => {
        return caches.open('deep-map').then((cache) => {
          console.log('[Service Worker] Caching resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});*/


let tiles = [
  /*"https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dfea&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002103?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dff2&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002121?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dfee&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dfe4&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dfec&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002130?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dfe8&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dfed&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002113?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dff4&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002131?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3dff0&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021012?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021010?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021030?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021032?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021210?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021011?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021013?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021031?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021033?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021211?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021100?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021102?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021120?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021122?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021101?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021103?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021300?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/13/51.93116246149819/-5.148427088756213/52.03023222713165/-4.962689478892932?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=639834&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021121?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021123?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021112?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021301?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021130?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021110?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021132?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021111?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021113?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021310?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021131?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021133?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021311?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313001?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313000?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313003?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130003232?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130003322?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130003233?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130003323?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130003332?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313000323?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3df78&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313000333?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3df7a&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313000332?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3df72&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/13/51.95787403366981/-5.157181818980822/52.0568847784283/-4.971444209117541?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=570708&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130003333?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/13/51.94174598726816/-5.144478877086291/52.04079237051157/-4.95874126722301?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=28182&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/13/51.946801773437315/-5.149599879283566/52.04583698564474/-4.963862269420285?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=40441&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021102?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6f9&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021121?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6fd&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021123?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c70d&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021120?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6f1&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021132?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c706&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021122?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c701&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021112?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6fe&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021103?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c705&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021130?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6f5&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211200?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211022?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211202?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211220?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211021?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211023?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211020?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211030?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211221?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211201?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211203?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211031?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211032?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211210?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211033?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211212?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211230?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211213?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211231?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211211?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211120?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211122?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211302?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211320?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211300?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130003?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130012?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130030?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211121?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211303?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211321?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211301?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211123?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211003?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211103?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211013?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211102?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211012?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021110?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6ed&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021101?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6f5&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021100?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6e9&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/14/51.980357915318066/-5.065142481822629/52.029865815786295/-4.972273676890988?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=487059&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211002?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210133?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210113?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210131?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210311?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210133?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://www.bing.com/fd/ls/lsp.aspx",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210113?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://www.bing.com/fd/ls/lsp.aspx",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210131?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://www.bing.com/fd/ls/lsp.aspx",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021013?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://www.bing.com/fd/ls/lsp.aspx",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021011?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  " https://www.bing.com/fd/ls/lsp.aspx",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021011?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6f7&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  " https://www.bing.com/fd/ls/lsp.aspx",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021013?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c707&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021031?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c6ff&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210130?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210310?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  " https://www.bing.com/fd/ls/lsp.aspx",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210132?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210112?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  " https://www.bing.com/fd/ls/lsp.aspx",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210130?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210312?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210313?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210310?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210132?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210112?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210312?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021031?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dc.services.visualstudio.com/v2/track",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/14/51.98445833184663/-5.121094209553593/52.033961698937155/-5.028225404621953?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=624101&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210330?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210331?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021033?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c70f&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210333?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211232?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211222?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211223?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211233?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211322?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/14/51.94720585216055/-5.097576600911015/51.99675039590453/-5.004707795979375?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=876838&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211323?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211132?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211312?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211332?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211330?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211310?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021113?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c709&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021133?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c711&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021131?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3c701&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211130?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/14/51.970953883264784/-5.0645153040078466/52.02047217977656/-4.971646499076206?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=892098&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211001?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211011?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211000?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211100?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211010?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021100?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021101?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/0313130021110?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/14/51.99465940194161/-5.090288881184446/52.04415148973745/-4.997420076252805?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=257217&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211031?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d420&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211033?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d440&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211030?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d40c&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211032?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d42c&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211120?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d408&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211122?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d428&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110213?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110231?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110233?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110302?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110320?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110303?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110321?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110322?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110312?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110323?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110211?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110301?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110300?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110310?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://www.bing.com/maps/geotfe/comp/stl?v=8.14&og=1191&idx=0&oidjs=",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110330?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110313?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110332?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110331?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110311?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://www.bing.com/maps/geotfe/comp/stl?v=8.14&og=1191&idx=206&oidjs=",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110333?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111202?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111220?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111222?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111200?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112111?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112101?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112110?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112100?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002113000?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111201?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111221?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111223?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111203?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002113001?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211300?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d400&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211210?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d404&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211211?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d418&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111230?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111210?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111212?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111232?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002113010?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/51.99694495509814/-5.028147462727414/52.021696579855124/-4.981713060261594?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=182109&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211121?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d41c&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211123?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d43c&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211301?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d414&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110132?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110133?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111032?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111022?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110123?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002111023?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211013?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d430&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211012?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d41c&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211102?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d418&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110122?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110033?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211021?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d418&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211023?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d438&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211003?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d428&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110212?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110230?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110232?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110210?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110032?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/52.00449535958053/-5.072584894062857/52.02924280902154/-5.026150491597036?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=599452&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://www.bing.com/fd/ls/lsp.aspx",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110203?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110221?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110223?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110201?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110023?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211020?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d404&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211022?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d424&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211002?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d414&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110202?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110220?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110222?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110022?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110200?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110021?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110020?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110031?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110120?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110030?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211002?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/52.00697404852282/-5.096402910115103/52.03172012717418/-5.049968507649282?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=723540&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101331?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101313?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101311?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101133?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101333?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210133?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d442&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210113?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d432&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210131?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d422&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112000?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112001?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112010?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112011?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002103111?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211200?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d3fc&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211201?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d410&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300210311?mkt=en-GB&it=Z,L&og=1206&cb=Microsoft.Maps.NetworkCallbacks.normal&jsonso=3d41a&js=1&tj=1&c4w=1&vpt=e,p,pg&src=o",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/51.9919461588654/-5.093141343952993/52.016700547682206/-5.046706941487173?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=123229&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112002?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112003?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112013?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112012?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112102?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112103?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dc.services.visualstudio.com/v2/track",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112112?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/51.98746648424776/-5.08224084651647/52.012223349918685/-5.03580644405065?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=730451&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002112113?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002113002?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/51.989290834797046/-5.053711557776371/52.01404669178568/-5.00727715531055?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=684810&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002113003?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002113012?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/52.00006967041034/-5.033995185788795/52.02481956727573/-4.987560783322975?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=781705&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://www.bing.com/fd/ls/lsp.aspx",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/52.00545928765868/-5.063679786618891/52.03020620402394/-5.017245384153071?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=342499&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002110121?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/03131300211012?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t1-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101131?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/52.010430109323/-5.103832431185021/52.035174276591384/-5.0573980287192?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=982689&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101310?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101130?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101132?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101330?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101312?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://t0-flt.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/031313002101332?mkt=en-GB&it=A,G,RL&shading=hill&n=z&og=1206&c4w=1&src=o&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI",
  "https://dev.virtualearth.net/REST/V1/Imagery/Copyright/en-GB/AerialWithLabelsOnDemand/15/51.994685749156304/-5.092803187715782/52.019438623153434/-5.046368785249962?output=json&dir=0&jsonp=Microsoft.Maps.NetworkCallbacks.normal&jsonso=586064&key=AgMyUJDaBPgaREHKmkAQfXX7LduazhdcdnN0Y0hhC0kXK_VvJ-dXVc-7VfLKB_WI&ml=B,BX&ur=gb&c=en-GB&setfeatures=openmapdata"*/
];



caches.open('deep-map').then( cache => {

  cache.match(tiles).then(settings => {
    console.log(settings)
  });
  cache.addAll(tiles).then( () => {
    console.log("Starting Tiles Cached: "+tiles)
  });
});






/*if (filtered.length < 1) {
    console.log("Filtered = empty");
  } else {
    caches.open('deep-map').then(cache => {

      cache.match(filtered).then(settings => {
        console.log(settings)
      });
      cache.addAll(filtered).then(() => {
        console.log("Selected places cached: " + filtered)
      });
    });
}*/

self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(clients.claim()); });
self.addEventListener('push', event => {
  let data={};try{data=event.data?event.data.json():{};}catch(e){data={title:'ON Radio',body:event.data?.text()||''};}
  const title=String(data.title||'ON Radio');
  event.waitUntil(self.registration.showNotification(title,{
    body:String(data.body||'¡Escuchanos en vivo!'),icon:'./icono-192.png',badge:'./icono-192.png',tag:'onradio-'+String(data.id||'aviso'),data:{url:'https://onradiostreaming.github.io/ON-Radio/'},renotify:false
  }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
  const target='https://onradiostreaming.github.io/ON-Radio/';
  const windows=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const w of windows){if(w.url.startsWith(target)){await w.focus();return;}}
  await clients.openWindow(target);
 })());
});

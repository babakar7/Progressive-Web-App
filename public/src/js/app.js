var deferredPrompt;
// Check if SW feature is available in the browser so we don't execute code that doesnt work
// in allows you to check if a property in present in an object
// navigator is just the current browser
if('serviceWorker' in navigator){


  // register the service worker
  // tells the browser to treat the file as a SW and run it in the background
  navigator.serviceWorker
  // register actually returns a promise. it is an asyn action
  // however this will also run offline with cached version
  // caching the service worker doesn't make sense
  // would enter loop where you never fetch a new version of you application because it has it
  // in cache
    .register('/sw.js', /*{scope:'/help/'}*/)
    .then(()=>{
      console.log('Service worker registered')
    });
}


window.addEventListener('beforeinstallprompt', (event)=>{
  console.log('before install prompt fired')
    event.preventDefault()
    deferredPrompt = event
    // to not do anything
    return false

})

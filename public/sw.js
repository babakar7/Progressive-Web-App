importScripts('/src/js/idb.js')
importScripts('/src/js/util.js')
// variables to be updated when cached asset files are changed.
let cacheStaticName = "static-v5"
let cacheDynamic = "dynamic-v2"




// triggered by browser
self.addEventListener('install', (event)=>{
  console.log('Installing Service worker...' , event)
  // open a new cache. one for every domain. can have subcaches. caches.open takes name of cache
  // waitUntil waits until an operation that returns a promise is finished
  // This is to not clash with fetch
  // version control in the cache name
  event.waitUntil(caches.open(cacheStaticName)
    .then((cache)=>{
        // add content to the caches
        console.log('Pre-caching App Shell')
        // access to a bunch of methods (see mdn doc)
        // add will send a request to the server for specified asset and cache it
        // all in one step
        // path is relative to root folder
        cache.addAll([
          // '/'  & 'index.html are two different requests'
                  '/',
                  '/index.html',
                  '/src/js/app.js',
                  '/src/js/feed.js',
                  '/src/js/promise.js',
                  '/src/js/idb.js',
                  '/src/js/fetch.js',
                  '/src/js/util.js',
                  '/src/js/material.min.js',
                  '/src/css/app.css',
                  '/src/css/feed.css',
                  '/src/images/main-image.jpg',
                  'https://fonts.googleapis.com/css?family=Roboto:400,700',
                  'https://fonts.googleapis.com/icon?family=Material+Icons',
                  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]);
    })
  )
})
// triggered by browser
// only activated if user closes all pages & tabs
self.addEventListener('activate', (event)=>{
  console.log('Activating Service worker...' , event)
// wait till we are done so we don't trigger fetch event and get data from an old cache
  event.waitUntil(
    // keys gives keys of all subcaches in array in a promise
    caches.keys()
    .then((keyList)=>{
      // takes an array of promises and waits for them to finish
      // we can convert our array of strings into promises
      return Promise.all(keyList.map((key)=>{
        if(key !== cacheStaticName && key !== cacheDynamic){
          console.log(`Service Worker removing old cache: ${key}`)
          // function to execute once done ?
          // delte cache (it's a promise)
          return caches.delete(key)
        }
      }))
    })
  )
  // ensure SWs are loaded correclty
  return self.clients.claim()
})
// will be triggerred even when web app loads a css file or an image and of course when we manually
//use fetch
// triggered by app
self.addEventListener('fetch', (event)=>{
  // respondWidth allows us to override data that comes back from the server.
  // SW & so does every response.

  if(event.request.url.indexOf('https://progressive-web-app-66d61.firebaseio.com/posts.json')>-1){


      event.respondWith(

        fetch(event.request)
          .then((res)=>{

            // store on IndexDb
            var clonedRes = res.clone()

            // json() returns a promise
            clonedRes.json()
              .then((data)=>{

                    clearStorage('posts')
                  for( singleObj in data){

                      //  writeData doesn't delete entries that are not in database
                      // anymore. (after something is delete from db)
                      writeData('posts',  data[singleObj])

                  }

                  console.log('writing indexDb', data)
              })

            // originial response always has to be returned
            return res

          })
      )
  } else {



  event.respondWith(
    // caches is the overall cache storage
    // match will check a given request in any of the subcaches in cache storage of given page.
    // when doing cache.add it will store the request object
    caches.match(event.request)
    // even if we don't find the request the function inside then will be executed!
    // because the promise doesn't reject it just resolves as null!
      .then((response)=>{
        if (response){
          // we are not making a network request here, jsut intercepting & sending cached version
          return response
        } else {
          // continue with network request by returning the fetch
          return fetch(event.request)
                  .then((res)=> {
                    // caches.open returns a promise
                    // need a return here!!!!!! so that response is sent back to the html file
                return caches.open(cacheDynamic)
                      .then((cache)=>{
                        // can't do add here because add takes a url, sends a requests and withCredentials
                        // caches the result
                        // put doesn't send any request
                        // responses can only be consumed (used) once so it won't be available
                         cache.put(event.request.url, res.clone())
                        return res
                      })
                  } ).catch((err)=>{
                    console.log(err)
                  })
        }
      }))

    }

})

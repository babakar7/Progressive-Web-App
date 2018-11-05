var dbPromise = idb.open('posts-store', 1,(db)=>{

  if(!db.objectStoreNames.contains('posts')){

    db.createObjectStore('posts', {
      //primary key of each Object
      // will allow us to search objects later
      keyPath:'id'
    })
  }

})


function writeData(st, data){
  // use our promise interface
  // return the promise
  return dbPromise
    .then((db)=>{
      // we have access to the database & the object store created above
      // first we create a transaction
      // object store, type of transaction
      var tx = db.transaction(st, 'readwrite')
      // explicitly open store
      var store = tx.objectStore(st)
      // objects in firebase have id & we set keypath to id to allow us
      // to extract values later
      store.put(data)
      // close tx
      return tx.complete

    })
}


function readAllData(st) {

  return dbPromise
    .then((db)=>{
        var tx = db.transaction(st, 'readonly')
        var store = tx.objectStore(st)
        //no need to to return tx complete because it's a get data. if it fails we get no data back
        // does't change database integrity
        return store.getAll()
    })

}


function clearStorage(st){
  return dbPromise
    .then((db)=>{
      var tx =  db.transaction(st, 'readwrite')
        var store = tx.objectStore(st)
        store.clear()
        return tx.complete
    })
}

function dataURItoBlob(dataURI) {

  // convert base 64 URL to file
  
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

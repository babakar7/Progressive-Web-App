var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

var networkData = false;

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  //can show the install prompt here
  // check if defereed prompt is settings
  if(deferredPrompt){
    // prompt can only be shown once so need to check if it still is not null
    // will be emtied later
    deferredPrompt.prompt()

    // see what the user picked
    // userChoice is builtin promise
    deferredPrompt.userChoice.then((result)=> {
        console.log(result.outcome)
        if(result.outcome === 'dismissed'){
          console.log('user cancelled intallation')
        }
        // prompt only shown once!
         else{
           console.log('user added to home screen')
        }

        deferredPrompt = null
    })
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);


function createCard(data) {


  var cardWrapper = document.createElement('div');
  cardWrapper.style.marginLeft = "auto";
  cardWrapper.style.marginRight = "auto";
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = `url(${data.imageurl})`;
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitleTextElement.style.color = "white";
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.Location;
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);


}

function updateUi(data){


  for(i=0; i< data.length; i++){

    createCard(data[i])
  }
}





// firebase requires adding .json
fetch('https://progressive-web-app-66d61.firebaseio.com/posts.json')
.then(function(res) {
  return res.json()
})
  .then(function(data) {

    networkData = true
    let dataArr= []

    for(singleObj in data) {
      dataArr.push(data[singleObj])
    }

    console.log(dataArr)
    updateUi(dataArr)

  })


  if(!networkData){

    console.log('it ran')


        readAllData('posts')
          .then((data)=>{
            // result is an array of values
            console.log({data})
            updateUi(data)

          })

  }

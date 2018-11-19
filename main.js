var albumArray = [];
var favCounter = 0;

checkForStorage();

document.querySelector('.js-add-to-album').addEventListener('click', createNewFoto);
document.querySelector('.js-album').addEventListener('click', checkFotoBtnEvents);
document.querySelector('.js-album').addEventListener('focusout', getTextEdits);
document.querySelector('.js-show-btn').addEventListener('click', showMoreOrLessFotos);
document.querySelector('.js-view-favs-btn').addEventListener('click', showsFavsOrAllPhotos);

retrieveImg('input').addEventListener('change', enableAddToAlbumBtn);
retrieveInput('caption').addEventListener('input', enableAddToAlbumBtn);
retrieveInput('title').addEventListener('input', enableAddToAlbumBtn);
retrieveInput('search').addEventListener('keyup', startSearch);

function addInstructionsToAlbumArea() {
  document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
    `<h2 id="add-photos-subtitle">Add photos to your album with the form above!</h2>`
  );
}

function changeFavCounter(fotoObj) {
  if (fotoObj.favorite) {
    favCounter++;
  } else if (favCounter !== 0) {
    favCounter--;
  }

  document.querySelector('.js-view-favs-btn').innerHTML = `View ${favCounter} Favorites`;
}

function checkForStorage() {
  if (localStorage.length !== 0) {
    repopulateDom();
  } else {
    addInstructionsToAlbumArea();
  }
}

function checkFotoBtnEvents() {
  if (event.target.classList.contains('js-delete-btn')) {
    deleteFoto();
  }

  if (event.target.classList.contains('js-fav-btn')) {
    favoriteFoto();
  }
}

function clearInputFields() {
  retrieveInput('title').value = '';
  retrieveInput('caption').value = '';
  retrieveImg('input').value = '';
}

function createNewFoto(event) {
  event.preventDefault();
  let reader = new FileReader();

  reader.addEventListener("loadend", () => {
    let foto = new Photo(retrieveInput('title').value, retrieveInput('caption').value, reader.result);
    postToPage(foto);
    albumArray.push(foto);
    foto.saveToStorage(albumArray);
    clearInputFields();
  });

  reader.readAsDataURL(retrieveImg('file'));
  toggleButtonActiveStatus();
}

function deleteFoto() {
  let fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray.forEach(foto => {
    if (foto.id === fotoId) {
      foto.deleteFromStorage(fotoId);
    }
  });

  event.target.closest('.js-foto').remove();

  if (document.querySelector('.js-album').childElementCount === 0) {
    addInstructionsToAlbumArea();
  }
}

function enableAddToAlbumBtn() {
  if (!retrieveInput('title').value || !retrieveInput('caption').value || !document.querySelector('.js-file-input').value ) {
    document.querySelector('.js-add-to-album').disabled = true;
  } else {
    document.querySelector('.js-add-to-album').disabled = false;
  }
}

function favoriteFoto() {
  let fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);
   
  albumArray.forEach(foto => {
    if (foto.id === fotoId) {
      foto.favorite = !foto.favorite;
      foto.updatePhoto(foto.title, foto.caption, foto.favorite)
      foto.saveToStorage(albumArray);
      event.target.classList.replace(`favorite-btn-${!foto.favorite}`, `favorite-btn-${foto.favorite}`);
      changeFavCounter(foto);
    }
  });
}

function getTextEdits(event) {
  if (event.target.classList.contains('js-title')) {
    updateTitle();
  }

  if (event.target.classList.contains('js-caption')) {
    updateCaption();
  }
}

function postToPage(fotoObj) {
  if (document.getElementById("add-photos-subtitle")) {
    let message = document.getElementById("add-photos-subtitle");
    message.parentNode.removeChild(message);
  }
  
  document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
    `<section data-fotoid="${fotoObj.id}" class="image-contain js-foto">
    <p class="js-title" contenteditable="true">${fotoObj.title}</p>
    <img class="fit-image" src="${fotoObj.file}" alt="${fotoObj.title}">
    <p class="js-caption" contenteditable="true">${fotoObj.caption}</p>
    <article class="image-btns-contain">
    <button class="delete-btn js-delete-btn">
    </button>
    <button class="fav-btn favorite-btn-${fotoObj.favorite} js-fav-btn">
    </button>
    </article>
    </section>`
  );
}

function repopulateDom() {
  let jsonUserPhotosArray = JSON.parse((localStorage.getItem('userphotos')));

  jsonUserPhotosArray.forEach(jsonObj => {
    let foto = new Photo(jsonObj.title, jsonObj.caption, jsonObj.file, jsonObj.id, jsonObj.favorite);
    albumArray.push(foto);
    repopulateFavCounter(foto);
  });

  showTenPhotos();
  document.querySelector('.js-view-favs-btn').innerHTML = `View ${favCounter} Favorites`;
}

function repopulateFavCounter(fotoObj) {
  if (fotoObj.favorite) {
    favCounter++;
  }
}

function retrieveImg(inputOrFile) {
  let image;

  switch (inputOrFile) {
    case 'file':
      image = document.querySelector('.js-file-input').files[0];
      break;
    case 'input':
      image = document.querySelector('.js-file-input');
      break;
  }

  return image;
}

function retrieveInput(whichInput) {
  if (whichInput === 'title') {
    return document.querySelector('.js-title-input');
  } else if (whichInput === 'caption') {
    return document.querySelector('.js-caption-input');
  } else if (whichInput === 'search') {
    return document.querySelector('.js-search-input');
  }
}

function showsFavsOrAllPhotos(event) {
  event.preventDefault();
  document.querySelector('.js-album').innerHTML = '';

  if (event.target.innerText === 'View All Photos') {
    albumArray.forEach(foto => postToPage(foto));
    event.target.innerText = `View ${favCounter} Favorites`;
  } else {
    albumArray.forEach(foto => {
      if (foto.favorite === true) {
        postToPage(foto);
      }
    });
    
    event.target.innerText = 'View All Photos';
    }
}

function showMoreOrLessFotos() {
  document.querySelector('.js-album').innerHTML = '';

  if (event.target.innerText === 'Show More') {
    albumArray.forEach(foto => postToPage(foto));
    event.target.innerText = 'Show Less';
  } else {
    showTenPhotos();
    event.target.innerText = 'Show More';
  }
}

function showTenPhotos() {
  albumArray.forEach((foto, index, array) => {
    if (index >= array.length - 10) {
      postToPage(foto);
    }
  });
}

function startSearch() {
  document.querySelector('.js-album').innerHTML = '';
  let searchQuery = retrieveInput('search').value.toLowerCase();
  let fotosMatchingSearchQuery = albumArray.filter(foto => foto.title.toLowerCase().includes(searchQuery) || foto.caption.toLowerCase().includes(searchQuery));

  fotosMatchingSearchQuery.forEach(foto => postToPage(foto));
}

function toggleButtonActiveStatus() {
  document.querySelector('.js-add-to-album').disabled = !document.querySelector('.js-add-to-album').disabled;
}

function updateCaption() {
  let fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray.forEach(foto => {
    if (foto.id === fotoId) {
      foto.updatePhoto(event.target.previousElementSibling.previousElementSibling.innerHTML, event.target.innerHTML, foto.favorite);
      foto.saveToStorage(albumArray);
    }
  });
}

function updateTitle() {
  let fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray.forEach(foto => {
    if (foto.id === fotoId) {
      foto.updatePhoto(event.target.innerHTML, event.target.nextElementSibling.nextElementSibling.innerHTML, foto.favorite);
      foto.saveToStorage(albumArray);
    }
  });
}

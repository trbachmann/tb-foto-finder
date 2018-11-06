var albumArray = [];
var favCounter = 0;

checkForStorage();

document.querySelector('.js-add-to-album').addEventListener('click', createNewFoto);
document.querySelector('.js-album').addEventListener('click', fotoEventChecker);
document.querySelector('.js-album').addEventListener('focusout', getEdits);
document.querySelector('.js-file-input').addEventListener('change', canEnable);
document.querySelector('.js-search-input').addEventListener('keyup', startSearch)
document.querySelector('.js-show-btn').addEventListener('click', showMoreOrLess)
retrieveInput('title').addEventListener('input', canEnable);
retrieveInput('caption').addEventListener('input', canEnable);

function canEnable() {
  if (!retrieveInput('title').value || !retrieveInput('caption').value || !document.querySelector('.js-file-input').value ) {
    document.querySelector('.js-add-to-album').disabled = true;
  } else {
    document.querySelector('.js-add-to-album').disabled = false;
  }
}

function changeFavCounter(fotoObj) {
  if (fotoObj.favorite) {
    favCounter++;
  } else if (favCounter !== 0) {
    favCounter--;
  }
  
  document.querySelector('.js-num-of-favs').innerHTML = favCounter;
}

function checkForStorage() {
  if (localStorage.length !== 0) {
    repopulateDom();
  } else {
    document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
      `<h2 id="add-photos-subtitle">Add your photos with the form above!</h2>`
    );
  }
}

function clearInputFields() {
  retrieveInput('title').value = '';
  retrieveInput('caption').value = '';
  document.querySelector('.js-file-input').value = '';
}

function createNewFoto(event) {
  event.preventDefault();
  var reader = new FileReader();

  reader.addEventListener("loadend", function() {
    var foto = new Photo(retrieveInput('title').value, retrieveInput('caption').value, reader.result);
    postToPage(foto);
    albumArray.push(foto);
    foto.saveToStorage(albumArray);
    clearInputFields();
  });

  reader.readAsDataURL(retrieveInput('imgFile'));
  toggleButtonActiveStatus();
}

function deleteFoto() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray.forEach(function(foto) {
    if (foto.id === fotoId) {
      foto.deleteFromStorage(fotoId);
    }
  });

  event.target.closest('.js-foto').remove();

  if (document.querySelector('.js-album').childElementCount === 0) {
    document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
      `<h2 id="add-photos-sub">Add your photos with the form above!</h2>`
    );
  }
}

function favoriteFoto() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);
  
  albumArray.forEach(function(foto) {
    
    if (foto.id === fotoId) {
      foto.favorite = !foto.favorite;
      foto.updatePhoto(foto.title, foto.caption, foto.favorite)
      foto.saveToStorage(albumArray);
      event.target.classList.replace(`favorite-btn-${!foto.favorite}`, `favorite-btn-${foto.favorite}`);
      changeFavCounter(foto);
    }
  });
}

function fotoEventChecker() {
  if (event.target.classList.contains('js-delete-btn')) {
    deleteFoto();
  }

  if (event.target.classList.contains('js-fav-btn')) {
    favoriteFoto();
  }
} 

function getEdits(event) {
  if (event.target.classList.contains('js-title')) {
    updateTitle();
  }

  if (event.target.classList.contains('js-caption')) {
    updateCaption();
  }
}

function postToPage(fotoObj) {
  if (document.getElementById("add-photos-subtitle")) {
    var message = document.getElementById("add-photos-subtitle")
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
  var jsonUserPhotoArray = JSON.parse((localStorage.getItem('userphotos')));

  jsonUserPhotoArray.forEach(function(jsonObj) {
    var foto = new Photo(jsonObj.title, jsonObj.caption, jsonObj.file, jsonObj.id, jsonObj.favorite);
    // postToPage(foto);
    albumArray.push(foto);
    repopulateFavCounter(foto);
  });
  showTenPhotos();
}

function repopulateFavCounter(fotoObj) {
  if (fotoObj.favorite) {
    favCounter++;
  }

  document.querySelector('.js-num-of-favs').innerHTML = favCounter;
}

function retrieveInput(whichInput) {
  if (whichInput === 'title') {
    return document.querySelector('.js-title-input');
  } else if (whichInput === 'caption') {
    return document.querySelector('.js-caption-input');
  } else if (whichInput === 'imgFile') {
    return document.querySelector('.js-file-input').files[0];
  } else {
    return document.querySelector('.js-search-input');
  }
}

function showMoreOrLess() {
  document.querySelector('.js-album').innerHTML = '';

  if (event.target.innerText === 'Show More') {
    albumArray.forEach( function(fotoObj){
    postToPage(fotoObj);
    });

    event.target.innerText = 'Show Less';
  } else {
    showTenPhotos();
    event.target.innerText = 'Show More';
  }
}

function showTenPhotos() {
  albumArray.forEach(function(foto, index, array) {
    if (index >= array.length - 10) {
      postToPage(foto);
    }
  });
}

function startSearch() {
  document.querySelector('.js-album').innerHTML = '';

  var searchQuery = document.querySelector('.js-search-input').value.toLowerCase();

  var fotosMatchingQuery = albumArray.filter(function(foto) {
      return foto.title.toLowerCase().includes(searchQuery) || foto.caption.toLowerCase().includes(searchQuery);
  });

  fotosMatchingQuery.forEach(function(fotoMatchingQuery){
    postToPage(fotoMatchingQuery);
  });

}

function toggleButtonActiveStatus() {
  document.querySelector('.js-add-to-album').disabled = !document.querySelector('.js-add-to-album').disabled;
}

function updateCaption() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray.forEach(function(foto) {
    if (foto.id === fotoId) {
      foto.updatePhoto(event.target.previousElementSibling.previousElementSibling.innerHTML, event.target.innerHTML, foto.favorite)
      foto.saveToStorage(albumArray);
    }
  });
}

function updateTitle() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

    albumArray.forEach(function(foto) {
      if (foto.id === fotoId) {
        foto.updatePhoto(event.target.innerHTML, event.target.nextElementSibling.nextElementSibling.innerHTML, foto.favorite)
        foto.saveToStorage(albumArray);
      }
    });
}

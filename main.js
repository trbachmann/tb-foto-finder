
var albumArray = [];
// var favCounter = 0;

checkForStorage();

document.querySelector('.js-add-to-album').addEventListener('click', createNewFoto);
document.querySelector('.js-album').addEventListener('click', fotoEventChecker);
document.querySelector('.js-album').addEventListener('focusout', getEdits);

function checkForStorage() {
  if (localStorage.length !== 0) {
    repopulateDom();
  }
}

function clearInputFields() {
  retrieveInput('title').value = '';
  retrieveInput('caption').value = '';
}

function createNewFoto(event) {
  event.preventDefault();
  // var fileBlob = document.querySelector('.js-file-input').files[0];
  var reader = new FileReader();

  reader.addEventListener("loadend", function() {
    var foto = new Photo(retrieveInput('title').value, retrieveInput('caption').value, reader.result);
    postToPage(foto);
    albumArray.push(foto);
    foto.saveToStorage(albumArray);
    clearInputFields();
  });
  reader.readAsDataURL(retrieveInput('imgFile'));

}

function deleteFoto() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray = albumArray.filter(function(foto) {
    if (foto.id === fotoId) {
      foto.deleteFromStorage(fotoId);
    }
  });

  event.target.closest('.js-foto').remove();
}

function favoriteFoto() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);
  
  albumArray.forEach(function(foto){
    if (foto.id === fotoId) {
      foto.favorite = true;
    }

  })

  event.target.closest('.js-fav-btn').classList.add('favorite-btntrue');

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
    document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
      `<section data-fotoid="${fotoObj.id}" class="image-contain js-foto">
      <p class="js-title" contenteditable="true">${fotoObj.title}</p>
      <img class="fit-image" src="${fotoObj.file}" alt="${fotoObj.title}">
      <p class="js-caption" contenteditable="true">${fotoObj.caption}</p>
      <article class="image-btns-contain">
      <button class="delete-btn js-delete-btn">
      </button>
      <button class="favorite-btn js-fav-btn">
      </button>
      </article>
      </section>`
      );

    if (fotoObj.favorite) {
      event.target.classList.add('favorite-btn-active');
    }
}

function repopulateDom() {
  var newthing = JSON.parse((localStorage.getItem('userphotos')));

  newthing.forEach(function(jsonObj) {
    var foto = new Photo(jsonObj.title, jsonObj.caption, jsonObj.file, jsonObj.id, jsonObj.favorite);
    postToPage(foto);
    albumArray.push(foto);
  });
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

function updateCaption() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray.forEach(function(foto) {
    if (foto.id === fotoId) {
      foto.updatePhoto(event.target.previousElementSibling.previousElementSibling.innerHTML, event.target.innerHTML)
      foto.saveToStorage(albumArray);
    }
  });
}

function updateTitle() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

    albumArray.forEach(function(foto) {
      if (foto.id === fotoId) {
        foto.updatePhoto(event.target.innerHTML, event.target.nextElementSibling.nextElementSibling.innerHTML)
        foto.saveToStorage(albumArray);
      }
    });
}

var albumArray = [];
var titleInput = document.querySelector('.js-title-input');
var captionInput = document.querySelector('.js-caption-input');
var favCounter = 0;


document.querySelector('.js-add-to-album').addEventListener('click', createNewFoto);
document.querySelector('.js-album').addEventListener('click', fotoEventChecker);

function clearInputFields() {
  titleInput.value = '';
  captionInput.value = '';
}

function createNewFoto(event) {
  event.preventDefault();

  var fotoFile = URL.createObjectURL(document.querySelector('.js-file-input').files[0]);

  var foto = new Photo(titleInput.value, captionInput.value, fotoFile);
  postToPage(foto);
  albumArray.push(foto);
  clearInputFields();
}

function deleteFoto() {
  var fotoId = parseInt(event.target.closest('.js-foto').dataset.fotoid);

  albumArray = albumArray.filter(function(foto) {
    if (foto.id !== fotoId) {
      return foto;
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

function postToPage(fotoObj) {
  document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
    `<section data-fotoid="${fotoObj.id}" class="image-contain js-foto">
        <p>${fotoObj.title}</p>
        <article class="image-only-contain">
          <img class="fit-image" src="${fotoObj.file}" alt="">
        </article>
        <p>${fotoObj.caption}</p>
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
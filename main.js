var albumArray = [];
var titleInput = document.querySelector('.js-title-input');
var captionInput = document.querySelector('.js-caption-input');
var fileInput = document.querySelector('.js-file-input');


document.querySelector('.js-add-to-album').addEventListener('click', createNewFoto);

function postToPage(fotoObj) {
  document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
    `<section data-fotoId="${fotoObj.id}" class="image-contain">
        <p>${fotoObj.title}</p>
        <article class="image-only-contain">
          <img class="fit-image" src="./images/dessert1.png" alt="">
        </article>
        <p>${fotoObj.caption}</p>
        <article class="image-btns-contain">
          <button class="delete-btn">
          </button>
          <button class="favorite-btn">
          </button>
        </article>
      </section>`
  );
}

function createNewFoto(event) {
  event.preventDefault();
  uploadedFotoFile = fileInput.files[0];
  var  = URL.createObjectURL(uploadedFotoFile);
  var foto = new Photo(titleInput.value, captionInput.value);
  postToPage(foto);
}
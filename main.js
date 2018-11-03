var albumArray = [];
var titleInput = document.querySelector('.js-title-input');
var captionInput = document.querySelector('.js-caption-input');


document.querySelector('.js-add-to-album').addEventListener('click', createNewFoto);

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

function postToPage(fotoObj) {
  document.querySelector('.js-album').insertAdjacentHTML('afterbegin', 
    `<section data-fotoId="${fotoObj.id}" class="image-contain">
        <p>${fotoObj.title}</p>
        <article class="image-only-contain">
          <img class="fit-image" src="${fotoObj.file}" alt="">
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
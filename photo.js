class Photo {
  constructor(title, caption, file, id) {
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = false;
  }

  saveToStorage(arrayToStore) {
    var stringedAlbumArray = JSON.stringify(arrayToStore);
    localStorage.setItem('userphotos', stringedAlbumArray);
  }

  deleteFromStorage() {

  }

  updatePhoto() {

  }
}
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

  deleteFromStorage(fotoId) {
    var updatedArray = albumArray.filter(function(fotoInst) {
      if (fotoInst.id !== fotoId) {
        return fotoInst;
      }
    });
    console.log(updatedArray);
    albumArray = updatedArray;
    this.saveToStorage(albumArray);
  }

  updatePhoto() {

  }


}
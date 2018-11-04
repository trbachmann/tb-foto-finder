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
    albumArray = albumArray.filter(function(fotoInst) {
      if (fotoInst.id !== fotoId) {
        return fotoInst;
      }
    });
    
    this.saveToStorage(albumArray);
  }

  updatePhoto(title, caption, favorite) {
    this.title = title;
    this.caption = caption;
    this.favorite = favorite;
  }


}
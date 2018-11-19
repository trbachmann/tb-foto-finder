class Photo {
  constructor(title, caption, file, id, favorite) {
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage(arrayToStore) {
    let stringedAlbumArray = JSON.stringify(arrayToStore);
    localStorage.setItem('userphotos', stringedAlbumArray);
  }

  deleteFromStorage(fotoId) {
    let newalbumArray = albumArray.filter(function(fotoInst) {
      if (fotoInst.id !== fotoId) {
        return fotoInst;
      }
    });
    
    albumArray = newalbumArray; 
    
    if (albumArray.length !== 0) {
      this.saveToStorage(albumArray);
    } else {
      localStorage.clear();
    }
  }

  updatePhoto(title, caption, favorite) {
    this.title = title;
    this.caption = caption;
    this.favorite = favorite;
  }


}
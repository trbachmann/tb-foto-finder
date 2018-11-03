class Photo {
  constructor(title, caption, file, id) {
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = false;
  }

  saveToStorage() {

  }

  deleteFromStorage() {

  }

  updatePhoto() {

  }
}
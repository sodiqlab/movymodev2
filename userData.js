class User {
    constructor() {
      this.watchList = { tv: {}, movie: {} } || this.getWatchList();
    }
  
    getWatchList() {
      return JSON.parse(localStorage.getItem('userWatchList'));
  
    }
  
    setWatchList() {
      localStorage.setItem('userWatchList', JSON.stringify(this.watchList));
    }
  reset() {
      this.watchList.tv = {}
      this.watchList.movie = {}
  }
    clearUserData() {
      localStorage.clear();
      this.getWatchList();
    }
  }
  
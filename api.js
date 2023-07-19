class API {
  constructor() {
    this.baseURL = 'https://api.themoviedb.org/3/';
    this.api_key = Api.key;
    this.genreList = {};
    this.currentQuery = { tv: '', movie: '' };
    this.maxPage = { tv: 0, movie: 0 };
    this.defaultDiscoverOptions = {
      tv: {
        sort_by: 'popularity.desc',
        'air_date.gte': `${API.convertToAPIDateFormat(new Date(new Date().getFullYear() - 5, 0, 1))}`,
        'vote_count.gte': 500,
        language: 'en-US'
      },
      movie: {
        sort_by: 'popularity.desc',
        'primary_release_date.gte': `${API.convertToAPIDateFormat(new Date(new Date().getFullYear() - 5, 0, 1))}`,
        'vote_count.gte': 500,
        language: 'en-US'
      }
    };
    this.getGenreList();
  }

  static convertToAPIDateFormat(dateObj) {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1) < 10 ? `0${(dateObj.getMonth() + 1)}` : dateObj.getMonth() + 1;
    const day = dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
    return `${year}-${month}-${day}`;
  }

  static interpolateQueries(queryObj) {
    return Object.keys(queryObj).reduce((acc, curr) => `${acc}&${curr}=${queryObj[curr]}`, '');
  }

  getGenreList() {
    this.get(`${this.baseURL}genre/tv/list?api_key=${this.api_key}`).then((data) => {
      this.genreList.tv = data.genres.reduce((acc, curr) => { acc[curr.id] = { name: curr.name, checked: false }; return acc; }, {});
    });
    this.get(`${this.baseURL}genre/movie/list?api_key=${this.api_key}`).then((data) => {
      this.genreList.movie = data.genres.reduce((acc, curr) => { acc[curr.id] = { name: curr.name, checked: false }; return acc; }, {});
    });
  }

  async get(url, options = {}) {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  }

  async movie(endpoint, queryParams = {}) {
    let data;
    switch (endpoint) {
      default:
        data = await this.get(`${this.baseURL}movie/${endpoint}?api_key=${this.api_key}${API.interpolateQueries(queryParams)}`);
        return data;
    }
  }

  async searchAll(endpoint, query) {
    let data;
    switch (endpoint) {
      default:
        data = await this.get(`${this.baseURL}search/${endpoint}?api_key=${this.api_key}&query=${query}`);
        return data;
    }
  }

  async discover(type, queryParams = {}) {
    let data;
    switch (type) {
      default:
        data = await this.get(`${this.baseURL}discover/${type}?api_key=${this.api_key}${API.interpolateQueries(queryParams)}`);
        this.currentQuery[type] = queryParams;
        return data;
    }
  }

  async tv(endpoint, queryParams = {}) {
    let data;
    switch (endpoint) {
      default:
        data = await this.get(`${this.baseURL}tv/${endpoint}?api_key=${this.api_key}${API.interpolateQueries(queryParams)}`);
        return data;
    }
  }

  async getUpcoming(type) {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 4);
    const string = API.convertToAPIDateFormat(future);
    const url = `${this.baseURL}discover/${type}?api_key=${this.api_key}&sort_by=release_date.desc&release_date.lte=${string}`;
    const data = await this.get(url);
    return data;
  }
}

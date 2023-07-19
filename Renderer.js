class Renderer {
    static modals = {
      media: new bootstrap.Modal(document.getElementById('media-modal')),
      genres: new bootstrap.Modal(document.getElementById('genre-modal'))
    }
  
    static getImgSrc(path) {
      return `https://image.tmdb.org/t/p/w500/${path}`;
    }
  
    static renderTVHoverState(el, tv) {
      const container = document.createElement('div');
      container.classList.add('media-tv-hover');
  
      const title = document.createElement('h5');
      title.classList.add('media-tv-title');
      title.textContent = tv.title || tv.name;
      container.append(title);
  
      api.tv(tv.id).then((data) => {
        if (data.status === 'Returning Series') {
          if (data.next_episode_to_air) {
            const currentSeasonAndEp = document.createElement('p');
            currentSeasonAndEp.classList.add('tv-season-and-ep', 'mt-2');
            const season = data.next_episode_to_air.season_number;
            const episode = data.next_episode_to_air.episode_number;
            currentSeasonAndEp.innerText = `Season: ${season} Epsd: ${episode}`;
  
            const networkAirDate = document.createElement('p');
            networkAirDate.classList.add('tv-network-airdate');
            networkAirDate.textContent = `Airing on: ${data.next_episode_to_air.air_date}`;
  
            if (data.networks !== undefined && data.networks[0] !== undefined) {
              const network = document.createElement('p');
              network.classList.add('tv-network-info');
  
              const networkImg = document.createElement('img');
              networkImg.classList.add('tv-network-img');
  
              network.innerText = `Network: ${data.networks[0].name}`;
              networkImg.src = `${this.getImgSrc(data.networks[0].logo_path)}`;
              container.append(network, networkImg, currentSeasonAndEp, networkAirDate, this.renderLikeButton(data, 'tv'));
            }
          } else {
            const currentSeason = document.createElement('p');
            currentSeason.classList.add('tv-season-and-ep');
            const season = data.seasons[data.seasons.length - 1].season_number;
            currentSeason.innerText = `Season: ${season}`;
            container.append(currentSeason, this.renderLikeButton(data, 'tv'));
          }
        } else if (data.status === 'Ended' || data.status === 'Canceled') {
          const status = document.createElement('p');
          status.textContent = data.status;
  
          const lastSeason = document.createElement('p');
          lastSeason.classList.add('tv-season-and-ep');
          const season = data.seasons[data.seasons.length - 1].season_number;
          lastSeason.innerText = `Seasons: ${season}`;
          container.append(status, lastSeason, this.renderLikeButton(data, 'tv'));
        }
        el.append(container);
      });
    }
  
    static renderLikeButton(media, type) {
      const listButton = document.createElement('button');
      listButton.setAttribute('data-liked', 'false');
      const img = document.createElement('img');
      img.src = 'img/heart-unliked.svg';
      img.style.width = '1em';
      listButton.append(img);
      listButton.classList.add('btn', 'like-button');
      listButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = e.currentTarget.querySelector('img');
        const liked = e.currentTarget.getAttribute('data-liked') === 'true';
        img.src = liked ? 'img/heart-unliked.svg' : 'img/heart-liked.svg';
        e.currentTarget.setAttribute('data-liked', String(!liked));
        user.watchList[type][media.id] = media;
      });
      return listButton;
    }
  
    static renderMovieHoverState(el, movie) {
      const container = document.createElement('div');
      container.classList.add('media-movie-hover');
  
      const title = document.createElement('h5');
      title.textContent = movie.title;
      title.classList.add('media-movie-title');
  
      const release = document.createElement('p');
      release.textContent = movie.release_date;
  
      const votes = document.createElement('p');
      votes.textContent = `Rating: ${movie.vote_average}`;
  
      container.append(title, release, votes, this.renderLikeButton(movie, 'movie'));
      el.append(container);
    }
  
    static renderMedia(media, imgOnly) {
      const container = document.createElement('div');
      container.classList.add('media');
      if (!imgOnly) {
        container.addEventListener('click', () => {
          this.modals.media.show();
          document.dispatchEvent(new CustomEvent('mediaClicked', { detail: { id: media.id, type: media.title ? 'movie' : 'tv' } }));
        });
      }
      // Image
      const img = document.createElement('img');
      img.src = media.poster_path ? this.getImgSrc(media.poster_path) : 'img/noimg.jpg';
      img.classList.add('media-img');
      container.append(img);
      return container;
    }
  
    static renderMediaModal(media) {
      const modalContainer = document.getElementById('media-modal-container');
      const modalBody = document.getElementById('media-modal-body');
      const loadingScreen = document.getElementById('media-modal-loading-screen');
      modalBody.innerHTML = '';
      modalBody.style.display = 'none';
      loadingScreen.style.display = 'block';
      api[media.type](media.id).then((data) => {
        const mediaImg = this.renderMedia(data, true);
        mediaImg.append(this.renderMediaModalInfo(data, media.type));
        modalBody.append(mediaImg);
        modalBody.style.display = 'block';
        loadingScreen.style.display = 'none';
      });
    }
  
    static renderMediaModalInfo(media, type) {
      const container = document.createElement('div');
      container.classList.add('media-modal-info');
  
      if (type === 'movie') {
        const topSection = document.createElement('div');
        topSection.classList.add('d-flex', 'mt-2', 'justify-content-between');
  
        const title = document.createElement('span');
        title.textContent = media.title;
        title.classList.add('media-modal-title', 'mt-2', 'h3');
  
        topSection.append(title, this.renderLikeButton(media, type));
  
        const hr = document.createElement('hr');
        hr.style.backgroundColor = 'white';
        hr.style.margin = '0 0 0.5em 0';
  
        const overview = document.createElement('div');
        overview.classList.add('media-modal-overview', 'mt-2', 'mb-2');
        overview.textContent = media.overview;
  
        const released = document.createElement('span');
        released.textContent = `Release Date: ${media.release_date}`;
  
        const duration = document.createElement('span');
        duration.textContent = `Length: ${Math.floor(media.runtime / 60)}hr ${media.runtime % 60}min`;
  
        const rating = document.createElement('span');
        rating.textContent = `Rating: ${media.vote_average} \u2606`;
  
        const genres = document.createElement('span');
        genres.textContent = 'Genres: ';
        media.genres.forEach((genre, i, arr) => {
          if (i === 0 && arr.length === 1 || i === arr.length - 1) {
            genres.textContent += `${genre.name} `;
          } else {
            genres.textContent += `${genre.name}, `;
          }
        });
  
        container.append(topSection, hr, overview, released, duration, rating, genres);
        container.classList.add('animate__animated', 'animate__fadeInUp');
      } else {
        console.log(media);
        const topSection = document.createElement('div');
        topSection.classList.add('d-flex', 'mt-2', 'justify-content-between');
  
        const title = document.createElement('span');
        title.textContent = media.name;
        title.classList.add('media-modal-title', 'mt-2', 'h3');
  
        topSection.append(title, this.renderLikeButton(media, type));
  
        const hr = document.createElement('hr');
        hr.style.backgroundColor = 'white';
        hr.style.margin = '0 0 0.5em 0';
  
        const overview = document.createElement('div');
        overview.classList.add('media-modal-overview', 'mt-2', 'mb-2');
        overview.textContent = media.overview;
  
        const status = document.createElement('span');
        status.textContent = `Current Status: ${media.status}`;
  
        const airdate = document.createElement('span');
        const currentSeasonAndEp = document.createElement('span');
        if (media.next_episode_to_air) {
          currentSeasonAndEp.textContent = `Season: ${media.next_episode_to_air.season_number} Episode: ${media.next_episode_to_air.episode_number}`;
          airdate.textContent = `Next episode airing on: ${media.next_episode_to_air.air_date}`;
        } else {
          currentSeasonAndEp.textContent = `Seasons: ${media.last_episode_to_air.season_number}`;
          airdate.textContent = `Last aired: ${media.last_episode_to_air.air_date}`;
        }
  
        const rating = document.createElement('span');
        rating.textContent = `Rating: ${media.vote_average} \u2606`;
  
        const genres = document.createElement('span');
        genres.textContent = 'Genres: ';
        media.genres.forEach((genre, i, arr) => {
          if (i === 0 && arr.length === 1 || i === arr.length - 1) {
            genres.textContent += `${genre.name} `;
          } else {
            genres.textContent += `${genre.name}, `;
          }
        });
        container.append(topSection, hr, overview, status, currentSeasonAndEp, airdate, rating, genres);
        container.classList.add('animate__animated', 'animate__fadeInUp');
      }
  
      return container;
    }
  
    static renderGenres(type, genres) {
      console.log(genres);
      const modalContainer = document.getElementById('genre-modal-container');
      const modalTitle = document.getElementById('genre-modal-title');
      modalTitle.textContent = `${type === 'tv' ? 'TV Show' : 'Movie'} Genres`;
      const modalBody = document.getElementById('genre-modal-body');
      modalBody.innerHTML = '';
      Object.keys(genres).forEach((genre, i) => {
        const checkboxContainer = document.createElement('span');
        checkboxContainer.classList.add('genre-item');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = genre;
        checkbox.checked = genres[genre].checked;
        checkbox.id = `${type}_genre_${i}`;
        const label = document.createElement('label');
        label.textContent = genres[genre].name;
        label.htmlFor = checkbox.id;
        checkboxContainer.append(checkbox, label);
        modalBody.append(checkboxContainer);
      });
  
      this.modals.genres.show();
    }
  }
  
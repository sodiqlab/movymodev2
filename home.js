function renderList(el, mediaArr, type) {
    mediaArr.forEach((media) => {
      const item = Renderer.renderMedia(media);
      type === 'movie' ? Renderer.renderMovieHoverState(item, media) : Renderer.renderTVHoverState(item, media);
      el.append(item);
    });
  }
   
  function splashEndAnimation() {
    setTimeout(() => {
      document.getElementById('splash-screen').classList.add('animate__zoomOut');
      setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('page-wrapper').classList.add('animate__zoomIn');
        document.getElementById('page-wrapper').style.display = 'block';
        setTimeout(() => { document.getElementById('page-wrapper').classList.remove('animate__animated'); }, 1000);
      }, 500);
    }, 4000);
  }
  
  function splashStartAnimation() {
    document.querySelector('#splash-screen h1').classList.add('animate__animated', 'animate__slideInDown');
    document.querySelector('#splash-screen p').classList.add('animate__animated', 'animate__slideInUp');
  }
  
import '../sass/main.scss';
const axios = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Fetch from './components/fetch-service';
import pictureTemplate from '../template/picture.hbs';
import '../sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';

const newFetch = new Fetch(
  {
    rootSelector: '#search-form',
    notification: Notify,
    fetchType: axios,
    template: pictureTemplate,
    galleryContainer: '.gallery',
  });


const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newFetch._searchQuery !== '') {
      newFetch._scrollFetch().then(gallery => {
        newFetch._successFetchLoadBtn(gallery);
      })
        // .catch(newFetch._failedFetch());
    };
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '1000px',
});
observer.observe(document.querySelector('#sentinel'));





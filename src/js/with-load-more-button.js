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
    loadMoreBtn: '[data-action="load-more"]',
    loadMoreBtnEffectEl: '.spinner',
    loadMoreBtnLabelEl: '.label',
  });

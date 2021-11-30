import SimpleLightbox from "simplelightbox";
const USER_KEY = '24446633-b389c41e2d0894dd8f6fd2fd1';
const imageType = 'photo';
const orientation = 'horizontal';
const safesearch = true;
const BASE_URL = 'https://pixabay.com/api/?'

export default class Fetch {
  constructor({
    rootSelector,
    notification,
    fetchType,
    template,
    galleryContainer,
    loadMoreBtn,
    loadMoreBtnEffectEl,
    loadMoreBtnLabelEl,
    hidden = false,
  }) {
    this._refs = this._getRefs(rootSelector);
    this._galleryContainer = this._getElement(galleryContainer);
    this._notification = notification;
    this._searchQuery = '';
    this._page = 1;
    this._fetchType = fetchType;
    this._template = template;
    this._loadMoreBtn = this._getElement(loadMoreBtn);
    this._loadMoreBtnRefs = this._getLoadMoreRefs(loadMoreBtn, loadMoreBtnEffectEl, loadMoreBtnLabelEl);
    this._bindEvents();

    if (this._loadMoreBtn !== null) {
      hidden && this._hideLoadMoreBtn();
    }
  }

  // ---------------------------------------------------------------- Refs and elements of plugin ----------------------------------------------------------------
  _getRefs(root) {
    const refs = {};
    refs.input = document.querySelector(`${root} input`);
    refs.btn = document.querySelector(`${root} button`);
    return refs;
  }

  _getLoadMoreRefs(root, effectSelector, labelSelector) {
    const refs = {};
    refs.spinner = document.querySelector(`${root} ${effectSelector}`);
    refs.label = document.querySelector(`${root} ${labelSelector}`);

    return refs;
  }

  _getElement(root) {
    return document.querySelector(`${root}`);
  }

  // ---------------------------------------------------------------- Bind events ---------------------------------------------------------------------------------

  _bindEvents() {
    this._refs.btn.addEventListener('click', this._onFormClick.bind(this));
    this._bindLoadMoreBtn();
  }

  _bindLoadMoreBtn() {
    if (this._loadMoreBtn !== null) {
      this._loadMoreBtn.addEventListener('click', this._makeFetchLoadBtn.bind(this));
    }
  }

  // ---------------------------------------------------------------- Form Button Methods --------------------------------------------------------------------------------------

  _onFormClick(event) {
    event.preventDefault();
    this._clearContainer();
    this._searchQuery = this._refs.input.value;
    if (this._searchQuery === '') {
      this._notification.failure('The input cannot be empty.');
      return;
    };
    this._makeFetchFormBtn();
    if (this._loadMoreBtn !== null) {
      this._showLoadMoreBtn();
    }
  }

  _setUrlParams() {
    return new URLSearchParams({
      q: this._searchQuery,
      language: 'en',
      pageSize: 40,
      page: this._page,
      imageType: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
  }

  async _makeFetchFormBtn() {
    if (this._loadMoreBtn !== null) {
      this._disabledLoadMoreBtn();
    }
    const url = `${BASE_URL}key=${USER_KEY}&${this._setUrlParams()}`;
    return await this._fetchType.get(url)
      .then(gallery => {
        this._successFetchFormBtn(gallery);
      })
      .catch(() => {
        this._failedFetch();
      })
      .finally(() => {
        this._clearInput();
      })
  }

  async _successFetchFormBtn(gallery) {
    this._incrementPage();
    if (gallery.data.hits.length === 0) {
      this._notification.failure("Sorry, there are no images matching your search query. Please try again.");
      if (this._loadMoreBtn !== null) {
        this._enableLoadMoreBtn();
      }
      return;
    };
    const markup = await this._template(gallery.data.hits)
    this._galleryContainer.insertAdjacentHTML('beforeend', markup);
    this._addStyle();
    this._notification.success(`Hooray! We found ${gallery.data.totalHits} images.`);
    if (this._loadMoreBtn !== null) {
      this._enableLoadMoreBtn();
    }
  }

  _failedFetch() {
    this._notification.failure('Oops something went wrong, please try again later');
  }

  // ---------------------------------------------------------------- Load More Button Methods -------------------------------------------------------------------------------

  async _makeFetchLoadBtn() {
    if (this._loadMoreBtn !== null) {
      this._disabledLoadMoreBtn();
    }
    const url = `${BASE_URL}key=${USER_KEY}&q=${this._searchQuery}&page=${this._page}&per_page=40&image_type=${imageType}&safesearch=${safesearch}&orientation=${orientation}`
    await this._fetchType.get(url)
      .then(gallery => {
        this._successFetchLoadBtn(gallery);
      })
      .catch(() => {
        this._failedFetch();
      })
  }

  async _successFetchLoadBtn(gallery) {
    if (gallery.data.hits.length === 0) {
      if (this._loadMoreBtn !== null) {
        this._hideLoadMoreBtn();
      }
      this._notification.failure("We're sorry, but you've reached the end of search results.");
      return;
    }
    this._incrementPage();
    const markup = await this._template(gallery.data.hits)
    this._galleryContainer.insertAdjacentHTML('beforeend', markup);
    this._addStyle();
    if (this._loadMoreBtn !== null) {
      this._enableLoadMoreBtn();
    }
  }

  // ---------------------------------------------------------------- Scroll Fetch --------------------------------------------------------------------------------------

  async _scrollFetch() {
    const url = `${BASE_URL}key=${USER_KEY}&q=${this._searchQuery}&page=${this._page}&per_page=40&image_type=${imageType}&safesearch=${safesearch}&orientation=${orientation}`
    return await this._fetchType.get(url)
  }

  // ---------------------------------------------------------------- Styling Methods --------------------------------------------------------------------------------------

  _addStyle() {
    let gallery = new SimpleLightbox('.gallery a');
    gallery.refresh();
    gallery.on('show.simplelightbox');

    if (this._loadMoreBtn !== null) {
      this._softScroll();
    }
  }

  _softScroll() {
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: 60,
      behavior: 'smooth',
    });
  }

  // ---------------------------------------------------------------- Additional Page Control Button Methods ----------------------------------------------------------------

  _clearContainer() {
    this._galleryContainer.innerHTML = '';
  }

  _clearInput() {
    this._refs.input.value = ''
  }

  _incrementPage() {
    this._page += 1;
  }

  _resetPage() {
    this._page = 1;
  }

  // ---------------------------------------------------------------- Additional Load More Button Methods ----------------------------------------------------------------

  _enableLoadMoreBtn() {
    this._loadMoreBtn.disabled = false;
    this._loadMoreBtnRefs.label.textContent = 'Load More';
    this._loadMoreBtnRefs.spinner.classList.add('is-hidden');
  }

  _disabledLoadMoreBtn() {
    this._loadMoreBtn.disabled = true;
    this._loadMoreBtnRefs.label.textContent = 'Loading';
    this._loadMoreBtnRefs.spinner.classList.remove('is-hidden');
  }

  _showLoadMoreBtn() {
    this._loadMoreBtn.classList.remove('is-hidden');
  }

  _hideLoadMoreBtn() {
    this._loadMoreBtn.classList.add('is-hidden');
  }
}


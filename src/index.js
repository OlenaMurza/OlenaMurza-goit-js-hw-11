import './css/styles.css'
import Notiflix from 'notiflix'
import { fetchImages } from './js/fetch_images'
import { renderGallery } from './js/render_gallery'
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
import { onScroll, onToTopBtn } from './js/scroll'
// import render from './js/render_gallery'


const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
let query = '';
let page = 1;
// let simplelightbox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm)
loadMoreBtn.addEventListener('click', onLoadMoreBtn)


// onScroll()
// onToTopBtn()


const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

simpleLightBox.refresh()
 
function onSearchForm(e) {
  e.preventDefault()
  window.scrollTo({ top: 0 })
  page = 1
  query = e.currentTarget.searchQuery.value.trim()
  gallery.innerHTML = ''
  loadMoreBtn.classList.add("is-hidden")

  if (query === '') {
    alertNoEmptySearch()
    return
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound()
      } else {
        renderGallery(data.hits)
        // simpleLightBox = new SimpleLightBox('.gallery a').refresh()
        alertImagesFound(data)

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden')
        }
      }
    })
    .catch(error => console.log(error))
  
}


function onLoadMoreBtn() {
  page += 1
  simpleLightBox.destroy()

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits)
      
      simpleLightBox.refresh()

      const totalPages = Math.ceil(data.totalHits / perPage)

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden')
        alertEndOfSearch()
      }
    })
    .catch(error => console.log(error))
  
}


function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.')
}

function alertNoImagesFound() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
}
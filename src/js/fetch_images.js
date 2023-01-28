import axios from 'axios'
export { fetchImages }

axios.defaults.baseURL = 'https://pixabay.com/api/'
const KEY = '33118592-fe55a1628e08196b0e966d7a0'

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  )
  return response
}
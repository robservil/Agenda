import { get, post } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('/restaurants')
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

// Borrar cuando pueda
function create (data) {
  return post('restaurants', data)
}

export { getAll, getDetail, getRestaurantCategories, create }

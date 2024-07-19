import { get } from './helpers/ApiRequestsHelper'

function getProductCategories () {
  return get('productCategories')
}

function getAllProducts () {
  return get('orders')
}

function getProductDetail (productId) {
  return get(`products/${productId}`)
}

export { getProductCategories, getAllProducts, getProductDetail }

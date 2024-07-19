import { get, destroy, post, put } from './helpers/ApiRequestsHelper'

function getAllOrders () {
  return get('orders')
}

function remove (id) {
  return destroy(`orders/${id}`)
}

function create (data) {
  return post('orders', data)
}

function getOrderDetail (id) {
  return get(`orders/${id}`)
}

function updateOrder (id, data) {
  return put(`orders/${id}`, data)
}

export { getAllOrders, remove, create, getOrderDetail, updateOrder }

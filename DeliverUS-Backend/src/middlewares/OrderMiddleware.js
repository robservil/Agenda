import { Order, Restaurant } from '../models/models.js'

// TODO: Implement the following function to check if the order belongs to current loggedIn customer (order.userId equals or not to req.user.id)
// REVISAR
const checkOrderCustomer = async (req, res, next) => {
  try {
    const orderId = req.params.orderId // Obtener el ID de la orden de los parámetros de la solicitud
    const order = await Order.findByPk(orderId) // Buscar la orden en la base de datos

    if (!order) { // Si la orden no existe
      return res.status(404).json({ error: 'Order not found' })
    }

    if (order.userId !== req.user.id) { // Si el ID del usuario de la orden no coincide con el ID del usuario actual
      return res.status(403).json({ error: 'Unauthorized access' }) // Devolver un error de acceso no autorizado
    }

    // Si el usuario actual es el propietario de la orden, continuar con la siguiente función de middleware
    next()
  } catch (error) {
    // Si ocurre algún error durante la búsqueda de la orden, devolver un error de servidor interno
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// TODO: Implement the following function to check if the restaurant of the order exists
// REVISAR
const checkRestaurantExists = async (req, res, next) => {
  try {
    const restaurantId = req.body.restaurantId // Obtener el ID del restaurante de la solicitud
    const restaurant = await Restaurant.findByPk(restaurantId) // Buscar el restaurante en la base de datos

    if (!restaurant) { // Si el restaurante no existe
      return res.status(409).json({ error: 'Restaurant not found' }) // Devolver un error indicando que el restaurante no se encontró
    }
    if (typeof restaurantId !== 'number') {
      return res.status(409).json({ error: 'RestaurantId invalid' })
    }
    // Si el restaurante existe, continuar con la siguiente función de middleware
    next()
  } catch (error) {
    // Si ocurre algún error durante la búsqueda del restaurante, devolver un error de servidor interno
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const checkOrderOwnership = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: {
        model: Restaurant,
        as: 'restaurant'
      }
    })
    if (req.user.id === order.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkOrderVisible = (req, res, next) => {
  if (req.user.userType === 'owner') {
    checkOrderOwnership(req, res, next)
  } else if (req.user.userType === 'customer') {
    checkOrderCustomer(req, res, next)
  }
}

const checkOrderIsPending = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    const isPending = !order.startedAt
    if (isPending) {
      return next()
    } else {
      return res.status(409).send('The order has already been started')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkOrderCanBeSent = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    const isShippable = order.startedAt && !order.sentAt
    if (isShippable) {
      return next()
    } else {
      return res.status(409).send('The order cannot be sent')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
const checkOrderCanBeDelivered = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    const isDeliverable = order.startedAt && order.sentAt && !order.deliveredAt
    if (isDeliverable) {
      return next()
    } else {
      return res.status(409).send('The order cannot be delivered')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkOrderOwnership, checkOrderCustomer, checkOrderVisible, checkOrderIsPending, checkOrderCanBeSent, checkOrderCanBeDelivered, checkRestaurantExists }

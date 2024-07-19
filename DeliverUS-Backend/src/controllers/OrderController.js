// eslint-disable-next-line no-unused-vars
import { Order, Product, Restaurant, User, sequelizeSession } from '../models/models.js'
import moment from 'moment'
import { Op } from 'sequelize'
const generateFilterWhereClauses = function (req) {
  const filterWhereClauses = []
  if (req.query.status) {
    switch (req.query.status) {
      case 'pending':
        filterWhereClauses.push({
          startedAt: null
        })
        break
      case 'in process':
        filterWhereClauses.push({
          [Op.and]: [
            {
              startedAt: {
                [Op.ne]: null
              }
            },
            { sentAt: null },
            { deliveredAt: null }
          ]
        })
        break
      case 'sent':
        filterWhereClauses.push({
          [Op.and]: [
            {
              sentAt: {
                [Op.ne]: null
              }
            },
            { deliveredAt: null }
          ]
        })
        break
      case 'delivered':
        filterWhereClauses.push({
          sentAt: {
            [Op.ne]: null
          }
        })
        break
    }
  }
  if (req.query.from) {
    const date = moment(req.query.from, 'YYYY-MM-DD', true)
    filterWhereClauses.push({
      createdAt: {
        [Op.gte]: date
      }
    })
  }
  if (req.query.to) {
    const date = moment(req.query.to, 'YYYY-MM-DD', true)
    filterWhereClauses.push({
      createdAt: {
        [Op.lte]: date.add(1, 'days') // FIXME: se pasa al siguiente día a las 00:00
      }
    })
  }
  return filterWhereClauses
}

// Returns :restaurantId orders
const indexRestaurant = async function (req, res) {
  const whereClauses = generateFilterWhereClauses(req)
  whereClauses.push({
    restaurantId: req.params.restaurantId
  })
  try {
    const orders = await Order.findAll({
      where: whereClauses,
      include: {
        model: Product,
        as: 'products'
      }
    })
    res.json(orders)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the indexCustomer function that queries orders from current logged-in customer and send them back.
// Orders have to include products that belongs to each order and restaurant details
// sort them by createdAt date, desc.
const indexCustomer = async function (req, res) {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: 'products' },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['name', 'description', 'address',
            'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone',
            'logo', 'heroImage', 'status', 'restaurantCategoryId']
        }],
      order: [['createdAt', 'DESC']]
    })
    res.json(orders)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the create function that receives a new order and stores it in the database.
// Take into account that:
// 1. If price is greater than 10€, shipping costs have to be 0.
// 2. If price is less or equals to 10€, shipping costs have to be restaurant default shipping costs and have to be added to the order total price
// 3. In order to save the order and related products, start a transaction, store the order, store each product linea and commit the transaction
// 4. If an exception is raised, catch it and rollback the transaction

const obtenerProductosDeLaOrden = async (lineasProducto) => {
  return await Product.findAll({
    where: {
      id: lineasProducto.map(lp => lp.productId)
    }
  })
}
const getProductosConPrecio = async (lineasProducto) => {
  const productos = await obtenerProductosDeLaOrden(lineasProducto)
  const copiaProductos = [...lineasProducto]
  copiaProductos.forEach(lp => { lp.unityPrice = productos.find(p => p.id === Number(lp.productId)).price })
  return copiaProductos
}
const obtenerPrecioTotal = (lineaProductoConPrecio) => {
  const reducer = (total, value) => total + (value.quantity * value.unityPrice)
  const valor = lineaProductoConPrecio.reduce(reducer, 0)
  return valor
}
const obtenerShippingCosts = async (precio, restaurantId) => {
  let shippingCosts = 0
  if (precio <= 10) {
    const restaurant = await Restaurant.findByPk(restaurantId)
    shippingCosts = restaurant.shippingCosts
  }
  return shippingCosts
}
const guardarProductos = async (orden, lineasProductos, transaccion) => {
  const añadirPromesasProductos = lineasProductos.map(lineasProductos => {
    return orden.addProduct(lineasProductos.productId, { through: { quantity: lineasProductos.quantity, unityPrice: lineasProductos.unityPrice }, transaccion })
  })
  return Promise.all(añadirPromesasProductos)
}
const guardarOrdenesConProductos = async (orden, lineasProductos, transaccion) => {
  let ordenGuardada = await orden.save({ transaccion })
  await guardarProductos(orden, lineasProductos, transaccion)
  ordenGuardada = await ordenGuardada.reload({ include: { model: Product, as: 'products' }, transaccion })
  return ordenGuardada
}
const guardarOrdenesConPreciosyShippingCosts = async (orden, lineasProductosConPrecio) => {
  const precioProductos = obtenerPrecioTotal(lineasProductosConPrecio)
  orden.shippingCosts = await obtenerShippingCosts(precioProductos, orden.restaurantId)
  orden.price = precioProductos + orden.shippingCosts
  return orden
}
const create = async (req, res) => {
  // Use sequelizeSession to start a transaction
  let newOrder = Order.build(req.body)
  newOrder.userId = req.user.id // usuario actualmente autenticado
  try {
    const transaccion = await sequelizeSession.transaction(async (transaction) => {
      const lineasProductosConPrecio = await getProductosConPrecio(req.body.products)
      newOrder = await guardarOrdenesConPreciosyShippingCosts(newOrder, lineasProductosConPrecio)
      newOrder = await guardarOrdenesConProductos(newOrder, lineasProductosConPrecio, transaction)
      return await Order.findByPk(newOrder.id, {
        include: [{
          model: Product,
          as: 'products'
        }],
        transaction
      })
    })
    res.json(transaccion)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the update function that receives a modified order and persists it in the database.
// Take into account that:
// 1. If price is greater than 10€, shipping costs have to be 0.
// 2. If price is less or equals to 10€, shipping costs have to be restaurant default shipping costs and have to be added to the order total price
// 3. In order to save the updated order and updated products, start a transaction, update the order, remove the old related OrderProducts and store the new product lines, and commit the transaction
// 4. If an exception is raised, catch it and rollback the transaction

const update = async function (req, res) {
  let transaction
  try {
    transaction = await sequelizeSession.transaction()
  } catch (error) {
    res.status(500).send(error)
  } try {
    let price = 0
    for (const product of req.body.products) {
      const productData = await Product.findByPk(Number(product.productId))
      price += product.quantity * productData.price
    }
    let shippingCosts = 0
    const oldOrder = await Order.findByPk(Number(req.params.orderId))
    if (price <= 10) {
      const restaurant = await Restaurant.findByPk(Number(oldOrder.restaurantId))
      shippingCosts = restaurant.shippingCosts
    }
    await oldOrder.setProducts([])
    for (const product of req.body.products) {
      const productData = await Product.findByPk(Number(product.productId))
      await oldOrder.addProduct(productData, { through: { quantity: product.quantity, unityPrice: productData.price }, transaction })
    }
    const orderData = Object.assign({}, req.body)
    // Clone of req.body, so we can modify it
    orderData.price = price + shippingCosts
    orderData.shippingCosts = shippingCosts
    /*  req.body.price = price + shippingCosts
    req.body.shippingCosts = shippingCosts */
    await Order.update(orderData, { where: { id: req.params.orderId }, transaction })
    await transaction.commit()
    const newOrder = await Order.findByPk(req.params.orderId, { include: [{ model: Product, as: 'products' }] })
    res.json(newOrder)
  } catch (error) {
    await transaction.rollback()
    res.status(500).send(error)
  }
}
// TODO: Implement the destroy function that receives an orderId as path param and removes the associated order from the database.
// Take into account that:
// 1. The migration include the "ON DELETE CASCADE" directive so OrderProducts related to this order will be automatically removed.
const destroy = async function (req, res) {
  try {
    const result = await Order.destroy({ where: { id: req.params.orderId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted order id.' + req.params.orderId
    } else {
      message = 'Could not delete order.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const confirm = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.startedAt = new Date()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

const send = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.sentAt = new Date()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

const deliver = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.deliveredAt = new Date()
    const updatedOrder = await order.save()
    const restaurant = await Restaurant.findByPk(order.restaurantId)
    const averageServiceTime = await restaurant.getAverageServiceTime()
    await Restaurant.update({ averageServiceMinutes: averageServiceTime }, { where: { id: order.restaurantId } })
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId']
      },
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'email', 'avatar', 'userType']
      },
      {
        model: Product,
        as: 'products'
      }]
    })
    res.json(order)
  } catch (err) {
    res.status(500).send(err)
  }
}

const analytics = async function (req, res) {
  const yesterdayZeroHours = moment().subtract(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  const todayZeroHours = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  try {
    const numYesterdayOrders = await Order.count({
      where:
      {
        createdAt: {
          [Op.lt]: todayZeroHours,
          [Op.gte]: yesterdayZeroHours
        },
        restaurantId: req.params.restaurantId
      }
    })
    const numPendingOrders = await Order.count({
      where:
      {
        startedAt: null,
        restaurantId: req.params.restaurantId
      }
    })
    const numDeliveredTodayOrders = await Order.count({
      where:
      {
        deliveredAt: { [Op.gte]: todayZeroHours },
        restaurantId: req.params.restaurantId
      }
    })

    const invoicedToday = await Order.sum(
      'price',
      {
        where:
        {
          createdAt: { [Op.gte]: todayZeroHours }, // FIXME: Created or confirmed?
          restaurantId: req.params.restaurantId
        }
      })
    res.json({
      restaurantId: req.params.restaurantId,
      numYesterdayOrders,
      numPendingOrders,
      numDeliveredTodayOrders,
      invoicedToday
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

const OrderController = {
  indexRestaurant,
  indexCustomer,
  create,
  update,
  destroy,
  confirm,
  send,
  deliver,
  show,
  analytics
}
export default OrderController

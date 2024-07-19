// Define los middlewares de los datos, en OrderMiddleware van los middlewares de los usuarios

import { check } from 'express-validator'
import { Restaurant, Product, Order } from '../../models/models.js'

const checkRestaurantExists = async (value, { req }) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (restaurant.dataValues.id !== value) {
      return Promise.reject(new Error('The restaurantId is not the same.'))
    } else {
      return Promise.resolve()
    }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}
// TODO: Include validation rules for create that should:
// 1. Check that restaurantId is present in the body and corresponds to an existing restaurant
// 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
// 3. Check that products are available
// 4. Check that all the products belong to the same restaurant
const create = [
  // 1. Check that restaurantId is present in the body and corresponds to an existing restaurant
  check('restaurantId').exists().isInt({ min: 1 }).toInt().withMessage('restaurantId those not exists'),
  check('restaurantId')
    .custom(checkRestaurantExists),

  // 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
  check('products').isArray().withMessage('products must be an array')
    .notEmpty().withMessage('products array cannot be empty')
    .custom((value) => { // value es el array de productos
      for (const product of value) { // recorro el array
        const idProducto = product.productId
        if (typeof product !== 'object' || !idProducto || idProducto <= 0) {
          // Si NO es un objeto, o si no tiene id o cantidad, peta. También compruebo que son > 0
          throw new Error('Invalid product format')
        }
      }
      return true // Devuelve true si cumple las propiedades
    }),
  check('products').custom(async (value, { req }) => {
    for (let i = 0; i < value.length; i++) {
      const product = await Product.findByPk(value[i].productId)
      const correctRestaurantId = req.body.restaurantId
      if (product.restaurantId !== correctRestaurantId) {
        throw new Error('Product from another restaurant')
      }
    }
    return true
  }),
  check('address').exists(),
  check('products').custom(async (value) => {
    for (let i = 0; i < value.length; i++) {
      const producto = await Product.findByPk(value[i].productId)
      if (producto.availability !== true) {
        throw new Error('availability is false')
      }
    }
    return true
  }),
  check('products.*.quantity').isInt().custom((value) => {
    if (!value || value <= 0) {
      throw new Error('invalid quantity')
    }
    return true
  }),
  // 3. Check that products are available
  check('products.*.productId').custom(async (value) => { // Se aplicará la validación personalizada en custom a cada productId (que es el value) dentro del array de productos. El * indica que se aplicará a todos los elementos del array.
    const product = await Product.findByPk(value)
    if (!product || product.availability === false) { // El !product es porque findByPk si no encuentra esa Pk devuelve null, y si no pongo eso intentaría acceder a la propiedad available de un producto que sería null, por lo que daría un error inesperado
      throw new Error('Product not available')
    }
  }),

  // 4. Check that all the products belong to the same restaurant
  check('restaurantId').custom(async (value, { req }) => { // value es restaurantId y req es el pedido completo
    const restaurant = await Restaurant.findByPk(value) // encuentra al restaurante con esa Pk
    if (!restaurant) {
      throw new Error('Invalid restaurantId')
    }

    for (const product of req.body.products) { // recorro los productos de ese restaurante, que van en el cuerpo
      const producto = await Product.findByPk(product.productId)
      if (!producto || producto.restaurantId !== value) {
        throw new Error('All products must belong to the same restaurant')
      }
    }
  })
]

// TODO: Include validation rules for update that should:
// 1. Check that restaurantId is NOT present in the body.
// 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
// 3. Check that products are available
// 4. Check that all the products belong to the same restaurant of the originally saved order that is being edited.
// 5. Check that the order is in the 'pending' state.
const update = [

  // 1. Check that restaurantId is NOT present in the body.
  check('restaurantId').custom(async (value) => {
    if (value) {
      throw new Error('restaurantId should not be present in the body')
    }
    return true
  }),
  // 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
  check('products').isArray().notEmpty().withMessage('Error in the product Array')
    .custom(async (value) => {
      for (let i = 0; i < value.length; i++) {
        const product = value[i]
        if (!product.productId) {
          throw new Error('Problem with the productId, those not have it')
        }
      }
      return true
    }),
  check('products.*.quantity').isInt().custom((value) => {
    if (!value || value <= 0) {
      throw new Error('invalid quantity')
    }
    return true
  }),
  // 3. Check that products are available
  check('products').custom(async (value) => {
    for (let i = 0; i < value.length; i++) {
      const product = await Product.findByPk(value[i].productId)
      if (!product.availability) {
        throw new Error('The product is not available')
      }
    }
  }),
  // 4. Check that all the products belong to the same restaurant
  check('products').custom(async (value) => {
    const restaurantId = (await Product.findByPk(value[0].productId)).restaurantId
    for (let i = 0; i < value.length; i++) {
      const product = await Product.findByPk(value[i].productId)
      if (product.restaurantId !== restaurantId) {
        throw new Error('There are products from different restaurants')
      }
    }
  }),
  check('address').exists().notEmpty().withMessage('problems with the address'),
  // 5. Check that the order is in the 'pending' state.
  check('orderId').custom(async (value) => {
    const order = await Order.findByPk(value)
    if (order.status !== 'pending') {
      throw new Error('Is not in pending state')
    }
  })
]

export { create, update }

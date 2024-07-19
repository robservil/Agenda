/* eslint-disable no-multiple-empty-lines */
import OrderController from '../controllers/OrderController.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import * as OrderMiddleware from '../middlewares/OrderMiddleware.js'
import { Order } from '../models/models.js'
import { create, update } from '../controllers/validation/OrderValidation.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'

const loadFileRoutes = function (app) {
  // TODO: Include routes for:
  // 1. Retrieving orders from current logged-in customer
  app.route('/orders') // Esta ruta actúa si en el navegador se realiza una petición a una URL que contenga orders. Si pongo en el navegador https://tudominio.com/orders se llama a este método
    .get( // Define que esta función se encargará de peticiones HTTP GET
      isLoggedIn,
      hasRole('customer'),
      OrderController.indexCustomer // Realiza la acción de devolver los pedidos del cliente logineado
    ) // Esta ruta se define aquí para hacer las comprobaciones por separado y favorecer la modularidad


  // 2. Creating a new order (only customers can create new orders)
  app.route('/orders')
    .post(
      isLoggedIn,
      hasRole('customer'), // Aseguramos que sea un cliente logineado el que cree un pedido
      OrderMiddleware.checkRestaurantExists,
      create, // Comprobamos que se cumplen todas las validaciones del pedido
      handleValidation, // Maneja los resultados de OrderValidation, si son correctos, pasa el control a create
      OrderController.create
    )

  app.route('/orders/:orderId/confirm') // Para que el restaurante confirme el pedido
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderOwnership, // Verifica si el usuario que realiza la petición de confirmar es el propietario del restaurante asociado al pedido especificado por orderId
      OrderMiddleware.checkOrderIsPending, // Se comprueba que está pendiente, si está completo no me interesa
      OrderController.confirm)

  app.route('/orders/:orderId/send') // Para que el restaurante envíe el pedido
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderCanBeSent,
      OrderController.send)

  app.route('/orders/:orderId/deliver') // Para entregar el pedido
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderCanBeDelivered,
      OrderController.deliver)


  // TODO: Include routes for:
  // 3. Editing order (only customers can edit their own orders)
  app.route('/orders/:orderId')
    .put(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderCustomer, // Comprueba que el pedido pertenece al usuario que lo realiza
      OrderMiddleware.checkOrderIsPending, // TAL COMO ESTÁ, si el pedido se ha confirmado NO se puede cambiar
      update, // Como hemos puesto datos nuevos hay que volver a verificar si son correctos
      handleValidation,
      OrderController.update // Introducimos los nuevos datos en el Pedido
    )

  // 4. Remove order (only customers can remove their own orders)
  app.route('/orders/:orderId')
    .delete(
      isLoggedIn,
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderCustomer, // Compruebo que el pedido es del customer logeado.
      OrderMiddleware.checkOrderIsPending, // Verifico si el pedido todavía está pendiente y no se ha enviado.
      OrderController.destroy
    )

  // Muestra los detalles del pedido en concreto identificado por orderId
  app.route('/orders/:orderId')
    .get(
      isLoggedIn,
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderVisible, // Según el rol comprueba checkOrderCustomer o checkOrderOwnership
      OrderController.show)
}

export default loadFileRoutes

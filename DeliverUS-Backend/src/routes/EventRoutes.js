import EventAttributeValueController from '../controllers/EventAttributeValueController.js'
import EventController from '../controllers/EventController.js'
import CategoryController from '../controllers/CategoryController.js'

const loadFileRoutes = (app) => {
  app.route('/events')
    // Obtener todos los eventos
    .get(EventController.index)
    // Crear un nuevo evento
    .post(EventController.create)

  app.route('/events/:id')
    // Obtener un evento por ID
    .get(EventController.show)
    // Actualizar un evento existente
    .put(EventController.update)
    // Eliminar un evento
    .delete(EventController.destroy)

  app.route('/events/:id/attributes')
    //  Recuperar todos los campos personalizados de un evento específico.
    .get(EventAttributeValueController.index)

  app.route('/events/:id/attributes/:attributeId')
    // Relacionar en la tabla intermedia un evento con un campo personalizado
    .post(EventAttributeValueController.create)
    // Actualizar la relacion en la tabla intermedia entre un campo personalizado y un evento
    .put(EventAttributeValueController.update)
    // Eliminar la relacion en la tabla intermedia entre un campo personalizado y un evento
    .delete(EventAttributeValueController.destroy)

  app.route('/events/:id/categories')
    // Mostrar las categorias de un evento
    .get(CategoryController.index)

  app.route('/events/:id/categories/:categoryId')
    // Mostrar una categoria de un evento
    .get(CategoryController.show)
    // Asociar una categoría a un evento
    .post(CategoryController.create)
    // Actualizar una categoria asociada a un evento
    .put(CategoryController.update)
    // Eliminar una categoría de un evento
    .delete(CategoryController.destroy)
}

export default loadFileRoutes

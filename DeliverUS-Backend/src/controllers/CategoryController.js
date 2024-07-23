import { Event, Category, EventCategory } from '../models/models.js'

const index = async (req, res) => {
  try {
    const eventId = req.params.id
    const event = await Event.findByPk(eventId, {
      include: Category
    })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json(event.Categories)
  } catch (error) {
    res.status(500).send(error)
  }
}

const show = async (req, res) => {
  try {
    const { id, categoryId } = req.params
    const event = await Event.findByPk(id, {
      include: {
        model: Category,
        where: { id: categoryId }
      }
    })

    if (!event || !event.Categories.length) {
      return res.status(404).json({ message: 'Category not found for this event' })
    }

    res.json(event.Categories[0])
  } catch (error) {
    res.status(500).send(error)
  }
}

const create = async (req, res) => {
  try {
    const { id, categoryId } = req.params

    // Verificar si el evento existe
    const event = await Event.findByPk(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Verificar si la categoría existe
    const category = await Category.findByPk(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    // Asociar la categoría al evento
    await EventCategory.create({ eventId: id, categoryId })

    res.status(201).json({ message: 'Category associated with event successfully' })
  } catch (error) {
    res.status(500).send(error)
  }
}

const update = async (req, res) => {
  try {
    const { id, categoryId } = req.params
    const { newCategoryId } = req.body

    // Verificar si la asociación actual existe
    const eventCategory = await EventCategory.findOne({ where: { eventId: id, categoryId } })
    if (!eventCategory) {
      return res.status(404).json({ message: 'Category not associated with this event' })
    }

    // Verificar si la nueva categoría existe
    const newCategory = await Category.findByPk(newCategoryId)
    if (!newCategory) {
      return res.status(404).json({ message: 'New category not found' })
    }

    // Actualizar la asociación
    eventCategory.categoryId = newCategoryId
    await eventCategory.save()

    res.json({ message: 'Category association updated successfully' })
  } catch (error) {
    res.status(500).send(error)
  }
}

const destroy = async (req, res) => {
  try {
    const { id, categoryId } = req.params

    // Verificar si la asociación existe
    const eventCategory = await EventCategory.findOne({ where: { eventId: id, categoryId } })
    if (!eventCategory) {
      return res.status(404).json({ message: 'Category not associated with this event' })
    }

    // Eliminar la asociación
    await eventCategory.destroy()

    res.json({ message: 'Category disassociated from event successfully' })
  } catch (error) {
    res.status(500).send(error)
  }
}

const CategoryController = {
  index,
  show,
  create,
  update,
  destroy
}

export default CategoryController

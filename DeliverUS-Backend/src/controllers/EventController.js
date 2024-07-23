import { Category, CustomAttribute, Event, EventAttributeValue, EventCategory, sequelizeSession } from '../models/models.js'

const index = async function (req, res) {
  try {
    const events = await Event.findAll({
      attributes: { exclude: ['id'] },
      include: [{
        model: Category,
        attributes: ['name'],
        through: { attributes: [] }
      }, {
        model: CustomAttribute,
        attributes: ['name'],
        through: { attributes: ['value'] }
      }
      ]
    })
    res.json(events)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  const newEvent = Event.build(req.body)
  newEvent.createdBy = req.user.id
  try {
    const event = await newEvent.save()
    res.status(201).json(event)
  } catch (err) {
    res.json(req.body)
  }
}
/*
  {
  "event": {
    "name": "Evento de Ejemplo",
    "description": "Descripción del evento",
    "startDate": "2024-07-21T10:00:00Z",
    "endDate": "2024-07-21T12:00:00Z",
    "location": "Ubicación del evento"
  },
  "categories": [1, 2],  // IDs de categorías a asociar
  "customAttributes": [
    {
      "name": "Atributo Personalizado 1",
      "type": "string",
      "value": "Valor 1"
    },
    {
      "name": "Atributo Personalizado 2",
      "type": "integer",
      "value": 123
    }
  ]
}
*/
const create2 = async function (req, res) {
  const { event, categories = [], customAttributes = [] } = req.body

  const transaction = await sequelizeSession.transaction() // Inicia una transacción
  let newEvent // Variable para almacenar el evento creado

  try {
    // 1. Construir y guardar el evento
    newEvent = Event.build(event)
    await newEvent.save({ transaction })

    // 2. Asociar las categorías
    const categoryPromises = categories.map(async (categoryId) => {
      await EventCategory.findOrCreate({
        where: { eventId: newEvent.id, categoryId },
        defaults: { eventId: newEvent.id, categoryId },
        transaction
      })
    })
    await Promise.all(categoryPromises)

    // 3. Asociar los campos personalizados
    const customAttributePromises = customAttributes.map(async (attribute) => {
      const [customAttribute] = await CustomAttribute.findOrCreate({
        where: { name: attribute.name, type: attribute.type },
        defaults: { type: attribute.type },
        transaction
      })

      await EventAttributeValue.findOrCreate({
        where: { eventId: newEvent.id, customAttributeId: customAttribute.id },
        defaults: { eventId: newEvent.id, customAttributeId: customAttribute.id, value: attribute.value },
        transaction
      })
    })
    await Promise.all(customAttributePromises)

    // 4. Confirmar la transacción
    await transaction.commit()

    // 5. Recuperar el evento con categorías y campos personalizados
    const eventWithDetails = await Event.findByPk(newEvent.id, {
      attributes: { exclude: ['id'] },
      include: [{
        model: Category,
        attributes: ['name'],
        through: { attributes: [] }
      }, {
        model: CustomAttribute,
        attributes: ['name'],
        through: { attributes: ['value'] }
      }
      ]
    })

    // 6. Devolver la respuesta con el evento y sus detalles
    res.status(201).json(eventWithDetails)
  } catch (err) {
    // 7. Revertir la transacción en caso de error
    if (transaction.finished !== 'commit') {
      await transaction.rollback()
    }
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    const event = await Event.findByPk(req.params.eventId)
    if (event) {
      await event.update(req.body)
      res.json(event)
    } else {
      res.status(404).send('Event not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Event.destroy({ where: { id: req.params.eventId } })
    if (result) {
      res.send(`Successfully deleted event id ${req.params.eventId}`)
    } else {
      res.status(404).send('Event not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  try {
    const event = await Event.findByPk(req.params.id)
    if (event) {
      res.json(event)
    } else {
      res.status(404).send('Event not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const EventController = {
  index,
  create,
  create2,
  update,
  destroy,
  show
}

export default EventController

import { Event, CustomAttribute, EventAttributeValue } from '../models/models.js'

const index = async (req, res) => {
  try {
    const eventAttributes = await EventAttributeValue.findAll({
      where: { eventId: req.params.id },
      include: [{ model: CustomAttribute }]
    })
    res.json(eventAttributes)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (event) {
      const attribute = await CustomAttribute.findByPk(req.body.attributeId)
      if (attribute) {
        const eventAttributeValue = await EventAttributeValue.create({
          eventId: req.params.id,
          customAttributeId: req.body.attributeId,
          value: req.body.value // `value` debe ser un JSON válido
        })
        res.status(201).json(eventAttributeValue)
      } else {
        res.status(404).send('CustomAttribute not found')
      }
    } else {
      res.status(404).send('Event not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async (req, res) => {
  try {
    const eventAttribute = await EventAttributeValue.findOne({
      where: {
        eventId: req.params.id,
        customAttributeId: req.params.attributeId // `attributeId` debe ser `customAttributeId`
      }
    })
    if (eventAttribute) {
      await eventAttribute.update({ value: req.body.value }) // `value` debe ser un JSON válido
      res.send('Attribute updated')
    } else {
      res.status(404).send('Event attribute not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async (req, res) => {
  try {
    const result = await EventAttributeValue.destroy({
      where: {
        eventId: req.params.id,
        customAttributeId: req.params.attributeId // `attributeId` debe ser `customAttributeId`
      }
    })
    if (result) {
      res.send('Attribute deleted')
    } else {
      res.status(404).send('Event attribute not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async (req, res) => {
  try {
    const eventAttribute = await EventAttributeValue.findOne({
      where: {
        eventId: req.params.id,
        customAttributeId: req.params.attributeId // `attributeId` debe ser `customAttributeId`
      },
      include: [{ model: CustomAttribute }]
    })
    if (eventAttribute) {
      res.json(eventAttribute)
    } else {
      res.status(404).send('Event attribute not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const EventAttributeValueController = {
  index,
  create,
  update,
  destroy,
  show
}

export default EventAttributeValueController

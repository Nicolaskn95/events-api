import { validationResult } from "express-validator"
import { ObjectId } from "mongodb"
import queryString from "query-string"

export const getAllEvents = async (req, res) => {
  try {
    const db = req.app.locals.db
    const eventsCollection = db.collection("events")
    const events = await eventsCollection.find().toArray()
    res.json(events)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch events",
      details: error.message,
    })
  }
}

export const searchEvents = async (req, res) => {
  try {
    const db = req.app.locals.db
    const eventsCollection = db.collection("events")

    let queryParams = req.query
    // Caso tudo venha dentro de q (como uma string), faz o parse:
    if (typeof req.query.q === "string" && req.query.q.includes("&")) {
      queryParams = queryString.parse(req.query.q)
    }

    const searchTerm = queryParams.q
    const startDate = queryParams.startDate
    const endDate = queryParams.endDate
    const minPrice = queryParams.minPrice
    const maxPrice = queryParams.maxPrice

    const query = {}
    const decodedSearchTerm = decodeURIComponent(searchTerm)
    const cleanTerm = decodedSearchTerm.replace(/q=/, "")
    // console.log("decodedSearchTerm", decodedSearchTerm)

    // Termo de busca (em título ou descrição)
    if (cleanTerm != undefined) {
      query.title = { $regex: cleanTerm, $options: "i" }
    }

    // Filtro por datas
    if (startDate || endDate) {
      // console.log("startDate", startDate)
      // console.log("endDate", endDate)
      query.date = {}
      if (startDate != undefined) query.date.$gte = new Date(startDate)
      if (endDate != undefined) query.date.$lte = new Date(endDate)
    }

    // Filtro por faixa de preço
    if (minPrice || maxPrice) {
      query.ticketPrice = {}
      if (minPrice != undefined) query.ticketPrice.$gte = parseFloat(minPrice)
      if (maxPrice != undefined) query.ticketPrice.$lte = parseFloat(maxPrice)
    }
    console.log(query)
    const events = await eventsCollection.find(query).toArray()

    res.json({
      success: true,
      data: events,
      count: events.length,
    })
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({
      success: false,
      error: "Search failed",
      details: error.message,
    })
  }
}

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const db = req.app.locals.db
    const eventsCollection = db.collection("events")
    const event = await eventsCollection.findOne({
      _id: ObjectId.createFromHexString(id),
    })

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Invalid event ID",
      details: error.message,
    })
  }
}

export const createEvent = async (req, res) => {
  const db = req.app.locals.db
  const eventsCollection = db.collection("events")
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const eventData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await eventsCollection.insertOne(eventData)

    if (!result.acknowledged) {
      return res.status(500).json({
        success: false,
        error: "Failed to create event",
      })
    }

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: result.insertedId,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to create event",
      message: error.message,
    })
  }
}

export const updateEvent = async (req, res) => {
  const db = req.app.locals.db
  const { id } = req.params
  const eventsCollection = db.collection("events")
  const errors = validationResult(id)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    }

    const result = await eventsCollection.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(req.params.id) },
      { $set: updateData },
      { returnDocument: "after" }
    )

    if (!result.value) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    res.json({
      success: true,
      data: result.value,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Update failed",
      details: error.message,
    })
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const db = req.app.locals.db
    const eventsCollection = db.collection("events")
    const result = await eventsCollection.deleteOne({
      _id: ObjectId.createFromHexString(id),
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Deletion failed",
      details: error.message,
    })
  }
}

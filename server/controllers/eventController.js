const Event = require("../models/eventModel.js");

const getAllEvents = async (req, res) => {
    try{
        const allEvents = await Event.find();
        return res.status(200).json({ success: true, data: allEvents});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getSingleEvent = async (req, res) => {
    const concatEventName = req.params.id;
    const event = await Event.findOne({ concatEventName: concatEventName });
    if (!event) {
        return res.status(200).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({ success: true, data: event });
};

const addEvent = async (req, res) => {
    const { eventName, eventDate, eventDescription, eventType, eventPoster, eventStatus, eventImages } = req.body;
    if (!eventName || !eventDate || !eventDescription) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    const concatEventName = eventName.toLowerCase().replace(/ /g, "");
    const createdEvent = await Event.create({
        eventName,
        eventDate,
        concatEventName,
        eventDescription,
        eventPoster,
        eventStatus,
        eventType,
        eventImages
    });
    res.status(200).json(createdEvent);
};

const updateEvent = async (req, res) => {
    const concatEventName = req.params.id;
    const updatedEvent = await Event.findOneAndUpdate(
        { concatEventName: concatEventName },
        { ...req.body },
        { new: true }
    );

    if (!updatedEvent) {
        return res.status(200).json({ success: false, message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
};

const deleteEvent = async (req, res) => {
    const concatEventName = req.params.id;
    const deletedEvent = await Event.findOneAndDelete({ concatEventName: concatEventName });

    if (!deletedEvent) {
        return res.status(200).json({ success: false, message: "Event not found" });
    }
    res.status(200).json(deletedEvent);
};

module.exports = {
    getAllEvents,
    getSingleEvent,
    addEvent,
    updateEvent,
    deleteEvent
};
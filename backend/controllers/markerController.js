import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Marker from "../models/markerModel.js";
import expressAsyncHandler from "express-async-handler";

// #desc Adding a Marker
// #route POST /api/markers/add
// #access Private
const addMarker = asyncHandler(async (req, res) => {
  const { title, description, longitude, latitude } = req.body;
  const marker = await Marker.create({
    title,
    description,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    user: req.user.id,
    updatedBy: req.user.id,
  });
  if (marker) {
    res.status(201).json({
      _id: marker._id,
      title: marker.title,
      description: marker.description,
      location: marker.location,
      author: marker.user,
    });
  } else {
    res.status(400);
    throw new Error("Error in creating this marker");
  }
});

// #desc Deleting a Marker with a given id
// #route DEL /api/markers/:id
// #access Private
const delMarker = asyncHandler(async (req, res) => {
  const marker = await Marker.findById(req.params.id);
  if (!marker) {
    return res.status(404).json({ message: "Marker not found" });
  } else {
    await Marker.findByIdAndDelete(req.params.id);
    res.json({ message: `Marker ${req.params.id} successfully deleted` });
  }
});

// #desc Getting all Markers
// #route GET /api/markers/
// #access Private
const getAllMarkers = asyncHandler(async (req, res) => {
  const markers = await Marker.find();
  res.status(200).json({ markers });
});
// #desc Getting a Marker by his Id
// #route GET /api/markers/:id
// #access Private
const getMarker = asyncHandler(async (req, res) => {
    const marker = await Marker.findById(req.params.id);
    if (!marker) {
        return res.status(404).json({ message: "Marker not found" });
      } else {
        res.json({marker})
      }
  });

// #desc Updating a Marker with a given id, show the last updater
// #route PUT /api/markers/:id
// #access Private
const updateMarker = asyncHandler(async (req, res) => {
  const marker = await Marker.findById(req.params.id);
  if (!marker) {
    return res.status(404).json({ message: "Marker not found" });
  } else {
    const { title, description, longitude, latitude } = req.body;
    await Marker.findByIdAndUpdate(
      req.params.id,
      { title, description, longitude, latitude, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );
    res.json({ message: `Marker ${req.params.id} successfully updated` });
  }
});

export { addMarker, delMarker, getAllMarkers, updateMarker, getMarker };

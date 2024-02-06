import express from "express";
import { addMarker, delMarker, getAllMarkers, updateMarker, getMarker } from "../controllers/markerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addMarker);
router.route("/:id").delete( protect, delMarker).put(protect, updateMarker)
router.get('/', protect, getAllMarkers)
router.get('/:id', protect, getMarker)


export default router;

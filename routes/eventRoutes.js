// backend/routes/eventRoutes.js
import express from 'express';
import { protectUser } from '../middleware/authMiddleware.js';
import { getRecommendedEvents, joinEvent } from '../controllers/eventController.js';
import Event from '../models/Event.js'; // Import the Event model
import { getEventById } from '../controllers/eventController.js';

const router = express.Router();

router.get('/recommended', protectUser, getRecommendedEvents);
router.post('/join', protectUser, joinEvent);
router.get('/allEvents', async (req, res) => {
    try {
      // Fetch all events from the 'events' collection
      const events = await Event.find(); // This fetches data from the events collection
      res.status(200).json(events); // Send the events as a JSON response
    } catch (err) {
    //   console.error('Error fetching events:', err);
      res.status(500).json({ message: 'Server Error while fetching events' });
    }
});
router.get('/:id', getEventById);

export default router;

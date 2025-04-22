// backend/controllers/eventController.js
import Event from '../models/Event.js';
import User from '../models/User.js';

// export const joinEvent = async (req, res) => {
//     const { eventId, role } = req.body;
//     const userId = req.user.id;

//     try {
//       const event = await Event.findById(eventId);
//       if (!event) return res.status(404).json({ message: 'Event not found' });

//       const user = await User.findById(userId);

//       if (role === 'participant' && !event.participants.includes(userId)) {
//         event.participants.push(userId);
//         user.coins += 10; // 🎁 reward
//       } else if (role === 'volunteer' && !event.volunteers.includes(userId)) {
//         event.volunteers.push(userId);
//         user.coins += 20; // 🎁 more for volunteering
//       } else {
//         return res.status(400).json({ message: 'Already joined' });
//       }

//       await event.save();
//       await user.save();

//       res.json({ message: 'Joined successfully & coins added' });
//     } catch (err) {
//       res.status(500).json({ message: 'Error joining event' });
//     }
//   };

export const getRecommendedEvents = async (req, res) => {
  const userSkills = req.user.skills;
  const userInterests = req.user.interests;

  try {
    const events = await Event.find({
      $or: [
        { skillsRequired: { $in: userSkills } },
        { interestsTags: { $in: userInterests } }
      ]
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const joinEvent = async (req, res) => {
  const { eventId, role } = req.body;
  const userId = req.user.id;

  if (!['participant', 'volunteer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already a participant or volunteer
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'You are already a participant in this event' });
    }

    if (event.volunteers.includes(userId)) {
      return res.status(400).json({ message: 'You are already a volunteer in this event' });
    }

    // Add user to participants or volunteers array
    if (role === 'participant') {
      event.participants.push(userId);
    } else {
      event.volunteers.push(userId);
    }

    await event.save();

    // Add coins to user if they joined as a volunteer
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const coinsToAdd = role === 'volunteer' ? 50 : role === 'participant' ? 20 : 0;
    user.coins = (user.coins || 0) + coinsToAdd;
    await user.save();


    return res.json({
      message: `Successfully joined the event as a ${role}${role === 'volunteer' ? ' and earned 50 coins!' : '!'}`
    });
  } catch (error) {
    console.error('Error joining event:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants', 'name')
      .populate('volunteers', 'name');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(event);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

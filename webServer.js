import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Used when you implement the TODO handlers below.
// eslint-disable-next-line no-unused-vars
import User from './schema/user.js';
// eslint-disable-next-line no-unused-vars
import Photo from './schema/photo.js';

const app = express();

// define these in env and import in this file
const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/project2';

// Enable CORS for frontend running on a different port
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongoUrl);

mongoose.connection.on('error', err => { throw err; });

mongoose.connection.once('open', () => {
  // connected
});

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /user/list
 * Returns the list of users.
 */
app.get('/user/list', async (req, res) => {
  try {
		let users = await User.find({}).select('first_name last_name');
    return res.json(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * GET /user/:id
 * Returns the details of one user.
 */
app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

		let user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
		return res.json(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * GET /photosOfUser/:id
 * Returns all photos of the given user.
 */
app.get('/photosOfUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    let user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

		let photos = await Photo.find({ user_id: userId });
    let users = await User.find({}).select('first_name last_name');
		
    let userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = { _id: u._id, first_name: u.first_name, last_name: u.last_name };
    });

    let result = photos.map(p => ({
      _id: p._id,
      user_id: p.user_id,
      date_time: p.date_time,
      file_name: p.file_name,
      comments: (p.comments || []).map(c => ({
        _id: c._id,
        comment: c.comment,
        date_time: c.date_time,
        user: userMap[c.user_id.toString()],
      })),
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen(port);

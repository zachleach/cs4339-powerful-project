import mongoose from 'mongoose';
import User from '../schema/user.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /user/list
 * Returns list of users: [{ _id, first_name, last_name }]
 */
async function getList(req, res) {
  try {
    let users = await User.find({}).select('first_name last_name');
    return res.json(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

/**
 * GET /user/:id
 * Returns user details: { _id, first_name, last_name, location, description, occupation }
 */
async function getById(req, res) {
  try {
    let userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    let user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
    return res.json(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export { getList, getById };

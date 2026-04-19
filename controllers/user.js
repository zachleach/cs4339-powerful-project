// @FegelSamuel: we wrote both handlers here; they were extracted from webServer.js in P2.
// The User schema lives in schema/user.js; see that file for what fields are available.
import mongoose from 'mongoose';
import User from '../schema/user.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /user/list
 * Returns list of users: [{ _id, first_name, last_name }]
 */
// @FegelSamuel: .select() limits which fields Mongoose returns; we only send what the sidebar needs.
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
// @FegelSamuel: delete on Mongoose docs doesn't work - need .toObject() first
// Also move the null check BEFORE the deletes or it crashes when user not found
// Fix: let userObj = user.toObject(); delete userObj.login_name; etc.
// Or simpler: use .select('first_name last_name location description occupation') on findById
async function getById(req, res) {
  try {
    let userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    let user = await User.findById(userId);
    if (!user) return res.status(400).send('User not found');
    // tests yell at me to do this, i don't remember what __v is for
    delete user.login_name;
    delete user.password_digest;
    delete user.__v;
    return res.json(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export { getList, getById };

// @FegelSamuel: we wrote getPhotosOfUser; addComment is stubbed for you to implement.
// Photo schema is in schema/photo.js; comments are embedded subdocuments (not a separate collection).
import mongoose from 'mongoose';
import User from '../schema/user.js';
import Photo from '../schema/photo.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /photosOfUser/:id
 * Returns photos with nested comments; comment has user: { _id, first_name, last_name }
 */
// @FegelSamuel: the DB stores only user_id on each comment, not the full user object.
// We do a manual join here: fetch all users once, build a lookup map keyed by id string,
// then swap each comment's user_id for the full { _id, first_name, last_name } object.
// The frontend expects that shape; see components/UserPhotos/index.jsx (c.user.first_name).
async function getPhotosOfUser(req, res) {
  try {
    let userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    let user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    let photos = await Photo.find({ user_id: userId });
    let users = await User.find({}).select('first_name last_name');

    // @FegelSamuel: build a map so we only scan the users array once, not once per comment.
    let userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = { _id: u._id, first_name: u.first_name, last_name: u.last_name };
    });

    // @FegelSamuel: we build plain objects here rather than sending raw Mongoose docs.
    // This controls exactly what fields the frontend receives.
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
}

/**
 * POST /commentsOfPhoto/:photoId
 * Body: { comment }
 * - Must be logged in (401 if not)
 * - Add comment to photo with user_id from session
 * - Return updated photo or 200
 */
// @FegelSamuel: IMPLEMENT THIS (Problem 3, 15 points)
// 1. Get photoId from req.params, comment text from req.body.comment
// 2. Return 400 if comment is empty/missing
// 3. Find photo by photoId, return 404 if not found
// 4. Push new comment: { comment, user_id: req.session.userId, date_time: new Date() }
// 5. Call photo.save(), return 200
// Note: requireAuth middleware already handles 401, so you don't need to check session here
async function addComment(req, res) {
  // TODO: implement
  return res.status(501).send('Not implemented');
}

export { getPhotosOfUser, addComment };

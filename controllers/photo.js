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
}

/**
 * POST /commentsOfPhoto/:photoId
 * Body: { comment }
 * - Must be logged in (401 if not)
 * - Add comment to photo with user_id from session
 * - Return updated photo or 200
 */
async function addComment(req, res) {
  const { photoId } = req.params;
  const { comment } = req.body;
  const { userId } = req.session;

  if (!comment || comment.trim() === '') {
    return res.status(400).send('Comment text cannot be empty');
  }

  if (!isValidObjectId(photoId)) {
    return res.status(404).send('Invalid photo ID');
  }

  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).send('Photo not found');
    }

    const newComment = {
      comment,
      user_id: userId,
      date_time: new Date(),
    };

    photo.comments.push(newComment);
    await photo.save();

    return res.status(200).send('Comment added successfully');
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export { getPhotosOfUser, addComment };

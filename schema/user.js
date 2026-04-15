// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";

/**
 * Define the Mongoose Schema for a User.
 */
// @FegelSamuel: login_name and password_digest were added by us for P3 auth.
// login_name is the lowercase last name for seeded users (e.g. "took", "ripley"); see loadDatabase.js.
// password_digest is a bcrypt hash of "password" for all seeded users.
// NEVER send password_digest to the frontend; strip it from any response in auth controller.
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  location: String,
  description: String,
  occupation: String,
  // TODO: P3 auth fields
  login_name: String,
  password_digest: String,
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
export default User;

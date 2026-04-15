// @FegelSamuel: all three functions here are yours to implement.
// login: look up user by login_name, bcrypt.compare against password_digest, set req.session.userId
// logout: destroy session
// register: hash password with bcrypt, create user, return user without password_digest
// The User schema (schema/user.js) now has login_name and password_digest fields.
// eslint-disable-next-line no-unused-vars
import User from '../schema/user.js';
// TODO: import bcrypt

/**
 * POST /admin/login
 * Body: { login_name, password }
 * - Look up user by login_name
 * - bcrypt.compare password against password_digest
 * - On success: save user id to session, return user object with _id
 * - On failure: 400 for bad login_name or wrong password
 */
async function login(req, res) {
  // TODO: implement
  return res.status(501).send('Not implemented');
}

/**
 * POST /admin/logout
 * - If not logged in, return 400
 * - Destroy session, return 200
 */
async function logout(req, res) {
  // TODO: implement
  return res.status(501).send('Not implemented');
}

/**
 * POST /user
 * Body: { login_name, password, first_name, last_name, location, description, occupation }
 * - Check login_name not already taken (400 if duplicate)
 * - Hash password with bcrypt
 * - Create user with password_digest
 * - Return user object with login_name, first_name, last_name (NOT password_digest)
 */
async function register(req, res) {
  // TODO: implement
  return res.status(501).send('Not implemented');
}

export { login, logout, register };

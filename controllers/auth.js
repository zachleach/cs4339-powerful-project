// @FegelSamuel: all three functions here are yours to implement.
// login: look up user by login_name, bcrypt.compare against password_digest, set req.session.userId
// logout: destroy session
// register: hash password with bcrypt, create user, return user without password_digest
// The User schema (schema/user.js) now has login_name and password_digest fields.
import User from '../schema/user.js';
import bcrypt from 'bcrypt';

/**
 * POST /admin/login
 * Body: { login_name, password }
 * - Look up user by login_name
 * - bcrypt.compare password against password_digest
 * - On success: save user id to session, return user object with _id
 * - On failure: 400 for bad login_name or wrong password
 */
async function login(req, res) {
  const { login_name, password } = req.body;
  if (!login_name || !password) {
    return res.status(400).send('Login name and password are required');
  }

  try {
    const user = await User.findOne({ login_name });
    if (!user) {
      return res.status(400).send('Invalid login name');
    }

    const match = await bcrypt.compare(password, user.password_digest);
    if (!match) {
      return res.status(400).send('Invalid password');
    }

    req.session.userId = user._id;
    // Don't return password_digest
    const userObj = user.toObject();
    delete userObj.password_digest;
    return res.status(200).send(userObj);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

/**
 * POST /admin/logout
 * - If not logged in, return 400
 * - Destroy session, return 200
 */
async function logout(req, res) {
  if (!req.session.userId) {
    return res.status(400).send('Not logged in');
  }

  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    return res.status(200).send();
  });
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
  const {
    login_name, password, first_name, last_name, location, description, occupation,
  } = req.body;

  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).send('Login name already exists');
    }

    const saltRounds = 10;
    const password_digest = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      login_name,
      password_digest,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });

    req.session.userId = newUser._id;

    const userObj = newUser.toObject();
    delete userObj.password_digest;
    return res.status(200).send(userObj);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

/**
 * GET /admin/me
 * - Returns the currently logged-in user based on the session
 * - If not logged in, returns 401
 */
async function me(req, res) {
  if (!req.session.userId) {
    return res.status(401).send('Not logged in');
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).send('User not found');
    }

    const userObj = user.toObject();
    delete userObj.password_digest;
    return res.status(200).send(userObj);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export { login, logout, register, me };

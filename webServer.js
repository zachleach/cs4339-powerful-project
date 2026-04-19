// @FegelSamuel: LINT FIXES NEEDED
// 1. Line 22: remove extra blank line
// 2. Line 25, 31, 44: add trailing commas
// 3. Line 28: change var to let
// 4. Line 34: remove trailing space
// 5. Line 44: remove extra spaces before comment
// 6. Line 60: add "return next();" instead of just "next();" for consistent-return
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';

import * as userController from './controllers/user.js';
import * as photoController from './controllers/photo.js';
import * as authController from './controllers/auth.js';

const app = express();

const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/project3';

// Enable CORS for frontend running on a different port
// TODO: configure cors to allow credentials for session cookies


const allowedOrigins = [
  process.env.REACT_URL || 'http://localhost:3000',
  process.env.SERVER_URL || `http://localhost:${port}` // allows itself
];

var corsOptions = {
  credentials: true,
  origin: allowedOrigins,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 

// Parse JSON bodies
app.use(express.json());

// Configure express-session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // set true in production with HTTPS and whatnot
}));

// Connect to MongoDB
mongoose.connect(mongoUrl);
mongoose.connection.on('error', err => { throw err; });
mongoose.connection.once('open', () => {});

// @FegelSamuel: requireAuth is the middleware that protects all data routes.
// Once sessions are wired up, uncomment the check below; it reads req.session.userId
// which is set by authController.login on successful login.
// Right now it passes everything through so the app works without auth.
/**
 * Auth middleware - checks if user is logged in
 * TODO: implement - check req.session.userId, return 401 if not set
 */
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send('Not logged in');
  }
  next();
}

// All read/write data routes go through requireAuth first.
// Auth routes (no auth required)
app.post('/admin/login', authController.login);
app.post('/admin/logout', authController.logout);
app.get('/admin/me', authController.me);
app.post('/user', authController.register);

// Protected routes (require auth)
app.get('/user/list', requireAuth, userController.getList);
app.get('/user/:id', requireAuth, userController.getById);
app.get('/photosOfUser/:id', requireAuth, photoController.getPhotosOfUser);
app.post('/commentsOfPhoto/:photoId', requireAuth, photoController.addComment);

app.listen(port);

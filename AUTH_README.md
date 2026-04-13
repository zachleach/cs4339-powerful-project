> AI Generated Tutorial with Claude Opus 4.5 per AI policy: All AI usage is allowed except using AI to write code

# Authentication Task

## Overview

Add login/logout/registration so users must authenticate before accessing the app. When not logged in, show a login form. When logged in, show the app with a logout button.

## Core Concepts to Learn

**express-session**: Middleware that manages session state across HTTP requests. It stores a session ID in a cookie; the actual session data lives server-side. You access it via `req.session`. Key config options: `secret` (signs the cookie), `resave`, `saveUninitialized`, `cookie.secure`.

**bcrypt**: Library for hashing passwords. Never store plaintext passwords. Use `bcrypt.hash(password, saltRounds)` to create a digest, `bcrypt.compare(password, digest)` to verify. Salt rounds of 10 is standard.

**CORS credentials**: When frontend and backend run on different ports, cookies aren't sent by default. The backend needs `cors({ credentials: true, origin: 'http://localhost:3000' })` and the frontend needs `axios.create({ withCredentials: true })`.

**Session flow**: Login saves user ID to `req.session.userId`. Subsequent requests read that value to identify the user. Logout calls `req.session.destroy()`. Protected routes check if `req.session.userId` exists; if not, return 401.

## Files to Modify

### Backend

- `webServer.js` (lines 1-50ish)
  - Uncomment/configure `express-session` middleware
  - Configure CORS with credentials
  - Implement `requireAuth` middleware

- `controllers/auth.js`
  - `login`: look up user by `login_name`, bcrypt compare, save to session
  - `logout`: check logged in, destroy session
  - `register`: validate fields, check duplicate `login_name`, hash password, create user

- `schema/user.js`
  - Fields already added (`login_name`, `password_digest`), just verify they work

### Frontend

- `lib/api.js`
  - Uncomment `withCredentials: true`

- `components/LoginRegister/index.jsx`
  - Wire up `handleLogin` to call `POST /admin/login`
  - Wire up `handleRegister` to call `POST /user`
  - Show errors on failure

- `photoShare.jsx`
  - Uncomment auth gating: if no user, render `<LoginRegister>`
  - Pass `user` and `onLogout` down to `Root`/`TopBar`

- `components/TopBar/index.jsx`
  - Wire up `handleLogout` to call `POST /admin/logout`
  - Call `onLogout` prop on success

## TODO List

- [ ] Import and configure `express-session` in `webServer.js`
- [ ] Configure CORS with `credentials: true` and explicit `origin`
- [ ] Implement `requireAuth` middleware (check `req.session.userId`, return 401 if missing)
- [ ] Implement `login` in `controllers/auth.js`
  - [ ] Find user by `login_name`
  - [ ] Return 400 if not found
  - [ ] `bcrypt.compare` password
  - [ ] Return 400 if mismatch
  - [ ] Save `req.session.userId`
  - [ ] Return user object with `_id`
- [ ] Implement `logout` in `controllers/auth.js`
  - [ ] Return 400 if not logged in
  - [ ] `req.session.destroy()`
  - [ ] Return 200
- [ ] Implement `register` in `controllers/auth.js`
  - [ ] Validate required fields
  - [ ] Check `login_name` not taken (400 if duplicate)
  - [ ] `bcrypt.hash` the password
  - [ ] Create user with `password_digest`
  - [ ] Return user without `password_digest`
- [ ] Enable `withCredentials: true` in `lib/api.js`
- [ ] Wire up `LoginRegister` form submissions
- [ ] Wire up auth gating in `photoShare.jsx`
- [ ] Wire up logout button in `TopBar`
- [ ] Test with `cd test && npm test` (auth-related tests)

## Testing

```bash
# Login as existing user
curl -X POST http://localhost:3001/admin/login \
  -H "Content-Type: application/json" \
  -d '{"login_name": "took", "password": "password"}' \
  -c cookies.txt

# Access protected route with session cookie
curl http://localhost:3001/user/list -b cookies.txt

# Should fail without cookie
curl http://localhost:3001/user/list

# Logout
curl -X POST http://localhost:3001/admin/logout -b cookies.txt
```

Run the test suite:
```bash
cd test && npm test
```

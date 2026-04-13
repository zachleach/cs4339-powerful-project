import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Tabs, Tab,
} from '@mui/material';
// TODO: import { useMutation } from '@tanstack/react-query';
// eslint-disable-next-line no-unused-vars
import api from '../../lib/api';
import './styles.css';

/**
 * LoginRegister component
 * Props:
 *   onLogin - callback when user successfully logs in, receives user object
 *
 * TODO: implement login form
 * - login_name and password fields
 * - call POST /admin/login
 * - on success, call onLogin(user)
 * - on error, show error message
 *
 * TODO: implement registration form
 * - fields: login_name, password, first_name, last_name, location, description, occupation
 * - call POST /user
 * - on success, maybe auto-login or show success message
 * - on error (duplicate login_name), show error message
 */
// eslint-disable-next-line no-unused-vars
function LoginRegister({ onLogin }) {
  let [tab, setTab] = useState(0); // 0 = login, 1 = register
  let [error, setError] = useState('');

  // Login form state
  let [loginName, setLoginName] = useState('');
  let [password, setPassword] = useState('');

  // Register form state
  let [regLoginName, setRegLoginName] = useState('');
  let [regPassword, setRegPassword] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [location, setLocation] = useState('');
  let [description, setDescription] = useState('');
  let [occupation, setOccupation] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    setError('');
    // TODO: implement with useMutation
    // api.post('/admin/login', { login_name: loginName, password })
    //   .then(res => onLogin(res.data))
    //   .catch(err => setError(err.response?.data || 'Login failed'));
    setError('Login not implemented yet');
  }

  function handleRegister(e) {
    e.preventDefault();
    setError('');
    // TODO: implement with useMutation
    // api.post('/user', { login_name: regLoginName, password: regPassword, first_name: firstName, ... })
    //   .then(res => { /* maybe auto-login */ })
    //   .catch(err => setError(err.response?.data || 'Registration failed'));
    setError('Registration not implemented yet');
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Photo Sharing App
        </Typography>

        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {tab === 0 ? (
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Login Name"
              value={loginName}
              onChange={e => setLoginName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" type="submit">
              Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Login Name"
              value={regLoginName}
              onChange={e => setRegLoginName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Occupation"
              value={occupation}
              onChange={e => setOccupation(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" type="submit">
              Register
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;

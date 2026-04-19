import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Tabs, Tab,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

/**
 * LoginRegister component
 * Props:
 *   onLogin - callback when user successfully logs in, receives user object
 */
function LoginRegister({ onLogin }) {
  const queryClient = useQueryClient();
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

  const loginMutation = useMutation({
    mutationFn: credentials => api.post('/admin/login', credentials),
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onLogin(res.data);
    },
    onError: err => {
      setError(err.response?.data || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: userData => api.post('/user', userData),
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onLogin(res.data);
    },
    onError: err => {
      setError(err.response?.data || 'Registration failed');
    },
  });

  function handleLogin(e) {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ login_name: loginName, password });
  }

  function handleRegister(e) {
    e.preventDefault();
    setError('');
    registerMutation.mutate({
      login_name: regLoginName,
      password: regPassword,
      first_name: firstName,
      last_name: lastName,
      location,
      description,
      occupation,
    });
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

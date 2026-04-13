import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button,
} from '@mui/material';
import { useLocation, useMatch } from 'react-router-dom';
// TODO: import { useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

/**
 * TopBar component
 * TODO: receive props for auth:
 *   user - logged in user object (or null)
 *   onLogout - callback when user logs out
 *
 * TODO: show logout button when logged in
 * - Display "Hi {first_name}" and a Logout button
 * - On click, call POST /admin/logout
 * - On success, call onLogout()
 */
// eslint-disable-next-line no-unused-vars
function TopBar({ user, onLogout }) {
  let [context, setContext] = useState('');
  const location = useLocation();
  const photosMatch = useMatch('/users/:userId/photos');
  const detailMatch = useMatch('/users/:userId');

  // TODO: convert to useQuery
  useEffect(() => {
    let cancelled = false;
    let userId = photosMatch?.params.userId || detailMatch?.params.userId;
    if (!userId) {
      setContext('');
      return () => {};
    }
    api.get('/user/' + userId).then(res => {
      if (!cancelled) {
        let name = `${res.data.first_name} ${res.data.last_name}`;
        setContext(photosMatch ? 'Photos of ' + name : name);
      }
    });
    return () => { cancelled = true; };
  }, [location.pathname]);

  function handleLogout() {
    // TODO: implement with useMutation
    // api.post('/admin/logout')
    //   .then(() => onLogout())
    //   .catch(err => console.error('Logout failed', err));
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Samuel Ma & Zach Leach
        </Typography>
        <Typography variant="h5" color="inherit" sx={{ mr: 2 }}>
          {context}
        </Typography>
        {/* TODO: show when logged in */}
        {user && (
          <>
            <Typography color="inherit" sx={{ mr: 2 }}>
              Hi {user.first_name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;

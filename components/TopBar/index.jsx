import React from 'react';
import {
  AppBar, Toolbar, Typography, Button,
} from '@mui/material';
import { useMatch } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function TopBar({ user, onLogout }) {
  const photosMatch = useMatch('/users/:userId/photos');
  const detailMatch = useMatch('/users/:userId');
  let userId = photosMatch?.params.userId || detailMatch?.params.userId;

  let query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get('/user/' + userId).then(res => res.data),
    enabled: !!userId,
  });

  let context = '';
  if (query.data) {
    let name = `${query.data.first_name} ${query.data.last_name}`;
    context = photosMatch ? 'Photos of ' + name : name;
  }

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/admin/logout'),
    onSuccess: () => {
      onLogout();
    },
    onError: () => {
      // Even if server logout fails (e.g. session already expired),
      // we usually want to clear the local state.
      onLogout();
    },
  });

  function handleLogout() {
    logoutMutation.mutate();
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

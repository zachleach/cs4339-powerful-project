import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useLocation, useMatch } from 'react-router-dom';
import api from '../../lib/api';
import './styles.css';

function TopBar() {
  let [context, setContext] = useState('');
  const location = useLocation();
  const photosMatch = useMatch('/users/:userId/photos');
  const detailMatch = useMatch('/users/:userId');

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

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Zach Leach
        </Typography>
        <Typography variant="h5" color="inherit">
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;

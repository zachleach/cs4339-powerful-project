import React, { useState, useEffect } from 'react';
import {
  Typography, Box, CircularProgress, Link,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import api from '../../lib/api';
import './styles.css';

function UserDetail() {
  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get('/user/' + userId)
      .then(res => { if (!cancelled) setUser(res.data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <CircularProgress />;
  if (!user) return <Typography>User not found.</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h5">{user.first_name} {user.last_name}</Typography>
      <Typography>ID: {user._id}</Typography>
      <Typography>Location: {user.location}</Typography>
      <Typography>Occupation: {user.occupation}</Typography>
      <Typography sx={{ mb: 2 }}>About: {user.description}</Typography>
      <Link component={RouterLink} to={`/users/${userId}/photos`}>
        View Photos
      </Link>
    </Box>
  );
}

export default UserDetail;

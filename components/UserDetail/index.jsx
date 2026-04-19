import React from 'react';
import {
  Typography, Box, CircularProgress, Link,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

// @FegelSamuel: re-fetches whenever userId changes (clicking a different user in the sidebar).
// The cancelled flag is a cleanup guard; without it a slow response could overwrite
// state for the next user if the user navigated away before the first request resolved.
function UserDetail() {
  const { userId } = useParams();

  let query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get('/user/' + userId).then(res => res.data),
  });

  if (query.isLoading) return <CircularProgress />;
  if (!query.data) return <Typography>User not found.</Typography>;

  let user = query.data;
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

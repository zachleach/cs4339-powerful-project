import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Card, CardMedia, CardContent, CircularProgress, Divider, Link,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import api from '../../lib/api';
import './styles.css';

function formatDate(dt) {
  return new Date(dt).toLocaleString();
}

function UserPhotos() {
  let [photos, setPhotos] = useState([]);
  let [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get('/photosOfUser/' + userId)
      .then(res => { if (!cancelled) setPhotos(res.data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <CircularProgress />;
  if (!photos.length) return <Typography>No photos found.</Typography>;

  return (
    <Box>
      {photos.map(photo => (
        <Card key={photo._id} sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt={photo.file_name}
            sx={{ maxHeight: 300, objectFit: 'contain' }}
          />
          <CardContent>
            <Typography variant="caption" display="block">
              {formatDate(photo.date_time)}
            </Typography>
            {photo.comments?.map(c => (
              <Box key={c._id} sx={{ mt: 1 }}>
                <Divider />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <Link component={RouterLink} to={`/users/${c.user._id}`}>
                    {c.user.first_name} {c.user.last_name}
                  </Link>
                  {' - '}{formatDate(c.date_time)}
                </Typography>
                <Typography variant="body2">{c.comment}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;

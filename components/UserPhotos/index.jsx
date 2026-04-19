import React, { useState } from 'react';
import {
  Typography, Box, Card, CardMedia, CardContent, CircularProgress, Divider, Link,
  TextField, Button,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function formatDate(dt) {
  return new Date(dt).toLocaleString();
}

function CommentForm({ photoId }) {
  let [comment, setComment] = useState('');
  let queryClient = useQueryClient();

  let mutation = useMutation({
    mutationFn: text => api.post('/commentsOfPhoto/' + photoId, { comment: text }),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    mutation.mutate(comment);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        size="small"
        label="Add a comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        disabled={mutation.isPending}
        error={mutation.isError}
        helperText={mutation.isError ? (mutation.error?.response?.data || 'Failed to post comment') : ''}
      />
      <Button type="submit" variant="contained" size="small" sx={{ mt: 1 }} disabled={mutation.isPending}>
        {mutation.isPending ? 'Posting...' : 'Post Comment'}
      </Button>
    </Box>
  );
}

function UserPhotos() {
  const { userId } = useParams();

  let query = useQuery({
    queryKey: ['photos', userId],
    queryFn: () => api.get('/photosOfUser/' + userId).then(res => res.data),
  });

  if (query.isLoading) return <CircularProgress />;
  if (!query.data?.length) return <Typography>No photos found.</Typography>;

  return (
    <Box>
      {query.data.map(photo => (
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
            <CommentForm photoId={photo._id} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;

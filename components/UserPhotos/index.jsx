import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Card, CardMedia, CardContent, CircularProgress, Divider, Link,
  TextField, Button,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
// TODO: import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function formatDate(dt) {
  return new Date(dt).toLocaleString();
}

/**
 * CommentForm component
 * Props:
 *   photoId - the photo to add comment to
 *   onCommentAdded - callback after successful comment (to refresh)
 *
 * TODO: implement with useMutation
 * - Text field for comment
 * - Submit button
 * - POST /commentsOfPhoto/:photoId with { comment }
 * - On success, call onCommentAdded() or invalidate query
 */
// eslint-disable-next-line no-unused-vars
function CommentForm({ photoId, onCommentAdded }) {
  let [comment, setComment] = useState('');
  let [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    // TODO: implement with useMutation
    // api.post('/commentsOfPhoto/' + photoId, { comment })
    //   .then(() => {
    //     setComment('');
    //     onCommentAdded();
    //   })
    //   .finally(() => setSubmitting(false));
    setSubmitting(false);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        size="small"
        label="Add a comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        disabled={submitting}
      />
      <Button type="submit" variant="contained" size="small" sx={{ mt: 1 }} disabled={submitting}>
        Post Comment
      </Button>
    </Box>
  );
}

function UserPhotos() {
  let [photos, setPhotos] = useState([]);
  let [loading, setLoading] = useState(true);
  const { userId } = useParams();

  // TODO: convert to useQuery
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get('/photosOfUser/' + userId)
      .then(res => { if (!cancelled) setPhotos(res.data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  function handleCommentAdded() {
    // TODO: with TanStack Query, just invalidate the query instead
    api.get('/photosOfUser/' + userId)
      .then(res => setPhotos(res.data));
  }

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
            {/* TODO: comment form */}
            <CommentForm photoId={photo._id} onCommentAdded={handleCommentAdded} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;

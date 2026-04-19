import React from 'react';
import {
  List, ListItem, ListItemText, Divider, CircularProgress, Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function UserList() {
  let query = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/user/list').then(res => res.data),
  });

  if (query.isLoading) return <CircularProgress />;
  if (!query.data?.length) return <Typography>No users found.</Typography>;

  return (
    <List component="nav">
      {query.data.map(u => (
        <React.Fragment key={u._id}>
          <ListItem
            button
            component={RouterLink}
            to={`/users/${u._id}`}
          >
            <ListItemText primary={`${u.first_name} ${u.last_name}`} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;

import React, { useState, useEffect } from 'react';
import {
  List, ListItem, ListItemText, Divider, CircularProgress, Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../lib/api';
import './styles.css';

function UserList() {
  let [users, setUsers] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/list')
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!users.length) return <Typography>No users found.</Typography>;

  return (
    <List component="nav">
      {users.map(u => (
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

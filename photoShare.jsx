import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom/client';
import { Grid, Typography, Paper } from '@mui/material';
import {
  createBrowserRouter, RouterProvider, Outlet, useParams,
} from 'react-router-dom';
import {
  QueryClient, QueryClientProvider, useQuery, useQueryClient,
} from '@tanstack/react-query';

import './styles/main.css';
import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';
import api from './lib/api';

const queryClient = new QueryClient();

function Home() {
  return (
    <Typography variant="body1">
      Select a user from the left to view their profile and photos.
    </Typography>
  );
}

function UserDetailRoute() {
  const { userId } = useParams();
  return <UserDetail userId={userId} />;
}

function UserPhotosRoute() {
  const { userId } = useParams();
  return <UserPhotos userId={userId} />;
}

function Root({ user, onLogout }) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar user={user} onLogout={onLogout} />
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Outlet />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

function UserLayout() {
  return <Outlet />;
}

function App() {
  const qc = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/admin/me').then(r => r.data),
    retry: false,
    staleTime: Infinity,
  });

  const user = meQuery.data || null;

  function handleLogin(userData) {
    qc.setQueryData(['me'], userData);
  }

  function handleLogout() {
    qc.setQueryData(['me'], null);
  }

  if (meQuery.isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <LoginRegister onLogin={handleLogin} />;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root user={user} onLogout={handleLogout} />,
      children: [
        { index: true, element: <Home /> },

        { path: 'users', element: <UserList /> },

        {
          path: 'users/:userId',
          element: <UserLayout />,
          children: [
            { index: true, element: <UserDetailRoute /> },
            { path: 'photos', element: <UserPhotosRoute /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(document.getElementById('photoshareapp'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);

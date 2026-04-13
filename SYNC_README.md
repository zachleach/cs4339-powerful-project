> AI Generated Tutorial with Claude Opus 4.5 per AI policy: All AI usage is allowed except using AI to write code

# Data Sync Task (TanStack Query + Mutations)

## Overview

Replace manual `useEffect`/`useState` data fetching with TanStack Query. Add the ability for logged-in users to post comments on photos. TanStack Query handles caching, refetching, and keeping the UI in sync with server state.

## Core Concepts to Learn

**useQuery**: Declarative data fetching. Instead of `useEffect` + `useState`, you call `useQuery({ queryKey: ['users'], queryFn: () => api.get('/user/list') })`. It returns `{ data, isLoading, error }`. The `queryKey` is used for caching and invalidation.

**useMutation**: For write operations (POST, PUT, DELETE). Returns `{ mutate, isPending }`. After a mutation succeeds, you typically invalidate related queries so they refetch.

**QueryClient**: Central cache manager. Wrap your app in `<QueryClientProvider client={queryClient}>`. Use `queryClient.invalidateQueries({ queryKey: ['photos', userId] })` to trigger refetch after mutations.

**Query keys**: Arrays that identify cached data. `['user', userId]` and `['user', '123']` are different cache entries. When you invalidate `['photos']`, all queries starting with `['photos']` refetch.

**Stale time / cache time**: Control when data is considered stale and refetched. Defaults work fine for this project.

## Files to Modify

### Backend

- `controllers/photo.js`
  - Implement `addComment`: validate input, find photo, push comment with `user_id` from session, save, return 200

### Frontend

- `photoShare.jsx`
  - Create `QueryClient`
  - Wrap app in `<QueryClientProvider>`

- `components/UserList/index.jsx`
  - Convert `useEffect`/`useState` to `useQuery`
  - Query key: `['users']`

- `components/UserDetail/index.jsx`
  - Convert to `useQuery`
  - Query key: `['user', userId]`

- `components/UserPhotos/index.jsx`
  - Convert to `useQuery`
  - Query key: `['photos', userId]`
  - Wire up `CommentForm` with `useMutation`
  - Invalidate `['photos', userId]` on success

- `components/TopBar/index.jsx`
  - Convert user fetch to `useQuery`
  - Query key: `['user', userId]`

## TODO List

- [ ] Create `QueryClient` in `photoShare.jsx`
- [ ] Wrap app in `<QueryClientProvider>`
- [ ] Implement `addComment` in `controllers/photo.js`
  - [ ] Check comment not empty (400 if missing)
  - [ ] Find photo by ID
  - [ ] Return 404 if not found
  - [ ] Push new comment with `user_id`, `comment`, `date_time`
  - [ ] Save photo
  - [ ] Return 200
- [ ] Convert `UserList` to `useQuery`
- [ ] Convert `UserDetail` to `useQuery`
- [ ] Convert `UserPhotos` to `useQuery`
- [ ] Convert `TopBar` user fetch to `useQuery`
- [ ] Wire up `CommentForm` with `useMutation`
  - [ ] POST to `/commentsOfPhoto/:photoId`
  - [ ] On success, invalidate photos query
  - [ ] Clear input field
- [ ] Test commenting and verify UI updates

## Code Examples

### useQuery (replacing useEffect/useState)

Before:
```jsx
let [users, setUsers] = useState([]);
let [loading, setLoading] = useState(true);

useEffect(() => {
  api.get('/user/list')
    .then(res => setUsers(res.data))
    .finally(() => setLoading(false));
}, []);
```

After:
```jsx
import { useQuery } from '@tanstack/react-query';

let { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/user/list').then(res => res.data),
});
```

### useMutation (for posting comments)

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

let queryClient = useQueryClient();

let commentMutation = useMutation({
  mutationFn: (comment) => api.post('/commentsOfPhoto/' + photoId, { comment }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['photos', userId] });
    setComment('');
  },
});

// In form submit:
commentMutation.mutate(comment);
```

### QueryClientProvider setup

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

## Testing

Start the server and frontend:
```bash
npm run dev
```

1. Log in (auth must be working first, or temporarily disable `requireAuth`)
2. Navigate to a user's photos
3. Post a comment
4. Verify the comment appears immediately without page refresh

Backend test:
```bash
# Post a comment (need valid session cookie)
curl -X POST http://localhost:3001/commentsOfPhoto/PHOTO_ID \
  -H "Content-Type: application/json" \
  -d '{"comment": "test comment"}' \
  -b cookies.txt
```

Run the test suite:
```bash
cd test && npm test
```

## Note on Auth Dependency

The comment endpoint requires authentication (`req.session.userId`). While developing, you can either:
1. Wait for auth to be implemented
2. Temporarily hardcode a user ID in `addComment` for testing
3. Temporarily remove `requireAuth` from the route

Just remember to restore proper auth before merging.

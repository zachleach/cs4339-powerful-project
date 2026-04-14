> AI Generated Tutorial with Claude Opus 4.5 per AI policy: All AI usage is allowed except using AI to write code

# useQuery Refactor (TanStack Query)

## Overview

Replace manual `useEffect`/`useState` data fetching with TanStack Query's `useQuery` hook. Also implement the comment form with `useMutation`. This is a code quality refactor; the app behaves the same from the user's perspective. The main benefits are less boilerplate, automatic loading/error state management, and cache deduplication (two components needing the same data share one request).

Note: this task does not add real-time sync across clients. `invalidateQueries` after a comment post just re-fetches data for the current user's browser.

## Core Concepts

**useQuery**: Declarative data fetching. Instead of `useEffect` + `useState`, you call `useQuery({ queryKey: ['users'], queryFn: () => api.get('/user/list').then(res => res.data) })`. It returns `{ data, isLoading, error }`. TanStack Query calls `queryFn`, stores the result under `queryKey`, and handles loading state automatically.

**useMutation**: For write operations (POST, PUT, DELETE). Returns `{ mutate, isPending }`. After a mutation succeeds, call `invalidateQueries` to mark related cached data as stale so it refetches.

**QueryClient**: The central cache. Holds all query results keyed by `queryKey`. Wrap your app in `<QueryClientProvider client={queryClient}>` so every component can access it via `useQuery` and `useQueryClient`.

**Query keys**: Arrays that identify a cache entry. `['user', '123']` and `['user', '456']` are separate entries. When you call `invalidateQueries({ queryKey: ['photos'] })`, every entry whose key starts with `'photos'` is marked stale and refetches. The first element is a namespace by convention, not a named collection; the whole array is serialized into one flat key.

**Cache deduplication**: If two components call `useQuery` with the same key, only one network request fires. Both components share the cached result. In this project, TopBar and UserDetail both fetch `['user', userId]` and get deduplicated automatically.

**Stale time / cache time**: Control when data is considered stale and re-fetched. Defaults work fine for this project.

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

let query = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/user/list').then(res => res.data),
});
// query.data is the resolved value; query.isLoading is true while fetching
```

### useMutation (for posting comments)

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

let queryClient = useQueryClient();

let mutation = useMutation({
  mutationFn: (comment) => api.post('/commentsOfPhoto/' + photoId, { comment }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['photos', userId] });
    setComment('');
  },
});

// In form submit:
mutation.mutate(comment);
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

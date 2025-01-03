## todo

- [x] load all collection at once
- [x] collection list view
- [x] collection filter
- [x] search collection
- [x] group by objekt toggle
- [x] objekt click to view
- [x] setup indexer
- [x] grouped duplicate can see all objekt
- [x] change to react-aria based components
- [x] add members and artists filter
- [x] objekt count if grouped
- [x] use accessToken and refreshToken when request to cosmo api
- [x] search users
- [x] debounced delay search when typing
- [x] column adjust
- [x] virtualize
- [x] nextjs loading bar
- [x] toggle dark/light mode
- [x] if mobile, set default column to 3
- [x] parallel fetching user objekt for faster load
- [x] get objekt copies from database (temporary fetch from apollo)
- [x] fetch description metadata from apollo
- [x] get all objekts from indexer database
- [x] setup main database
- [x] refresh token when expired and store it
- [x] update justd components to 2.0
- [x] modal open on load if query id exists
- [x] objekt's trades history
- [x] suspense
- [x] serial number and collection number printed on picture
- [x] highest/lowest number of duplicates
- [x] login
- [x] wallet connect
- [x] fix accent color on some objekt (low prio)
- [x] user's trades history
- [x] filter multiple member
- [x] sort by season
- [x] short form search
- [x] hover trade history show picture
- [x] save tab state, via context or zustand persist store
- [ ] fix performance issue with modal
- [ ] transfer objekt, can select multiple
- [ ] filter by date in user trade history
- [ ] leaderboard
- [ ] improve navbar
- [ ] user collection progress
- [ ] index all user using cosmo's search api (otw)
- [ ] dehydrate react-query and use suspense (low prio)
- [ ] user's como, user's profile picture (low prio)
- [ ] search user change component to cmdk (low prio)
- [ ] virtualize table row (low prio) (cannot do window virtualize on `<table>`, will change to `<div>`) (low prio)

## features

- load all objekts at once (polaris have this)
- can objekt search (polaris have this)
- can toggle group by objekt (polaris have this but cannot toggle)
- can adjust column (apollo have this but need login and only can do self collection)

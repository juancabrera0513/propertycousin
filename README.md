# The Property Cousins Website

React and Vite website for The Property Cousins Real Estate Team.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `XANNELLO_AUTHORIZATION` to the current server-side Xannello credential.
3. Run `npm install`.
4. Run `npm run dev`.

The Xannello credential is consumed by the local Vite middleware and is never
included in the browser bundle.

## Production

The `api/xannello.js` serverless endpoint is configured for Vercel. Add
`XANNELLO_AUTHORIZATION` as a protected production environment variable before
deploying. `vercel.json` also provides the SPA fallback required for direct
visits to React Router URLs.

If the frontend and API are deployed on separate domains, set
`VITE_XANNELLO_PROXY_URL` to the public serverless endpoint.

## Checks

```bash
npm run lint
npm run build
```

## Statistics admin

The private `/admin` route uses Firebase Authentication and Cloud Firestore.
The public site keeps the checked-in statistics as a fallback until Firebase is
configured.

1. Create a Firebase project on the no-cost Spark plan.
2. Enable **Authentication > Sign-in method > Email/Password**.
3. Create a Firestore database in production mode and deploy `firestore.rules`.
4. Register a web app and copy its public settings into `.env.local` using the
   names in `.env.example`.
5. Add the production domain under **Authentication > Settings > Authorized
   domains**.
6. Create each editor under **Authentication > Users**.
7. Copy the user's UID and create an empty Firestore document named with that
   UID at `site_admins/{uid}`. Client code cannot create or modify administrator
   records.

Editors can then sign in at `/admin`. Public visitors can read the statistics;
only UIDs present in `site_admins` can update their value and label. The first
successful administrator save creates `site_content/stats` using the checked-in
values.

The sign-in screen links to `/admin/forgot-password`. Configure the Firebase
password-reset template with the subject and HTML in
`firebase/email-templates/`, then set its custom action URL to the production
`/admin/reset-password` page. That page validates Firebase's single-use code and
lets the user choose a new password.

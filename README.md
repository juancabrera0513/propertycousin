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

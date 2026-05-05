# Backend

Express and MongoDB API for Team Task Manager.

## Scripts

- `npm run dev` - start with nodemon
- `npm start` - start production server
- `npm run check` - quick script check

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

## Main Modules

- `src/config/db.js` - Mongo connection bootstrap
- `src/models/` - Mongoose models
- `src/controllers/` - route controllers
- `src/middleware/` - auth and role middleware
- `src/routes/` - API routes
- `src/app.js` - Express app setup
- `src/server.js` - server startup

## Railway

Set these variables in Railway:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `NODE_ENV=production`

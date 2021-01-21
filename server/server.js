const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const PORT = 3000;

// requiring mongoose
const mongoose = require('mongoose');

// allow cross-origin requests
const corsOptions = {
  origin: "http://localhost:8080"   // or should this be 3000?
};
app.use(cors(corsOptions));

// requiring routers here
const apiRouter = require('./routes/api.js');
const signupRouter = require('./routes/signup.js');
const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');
const favRouter = require('./routes/favs.js');

const MongoURI =
  'mongodb+srv://cameronhbg:rGBxRb6Wm7gPkImZ@cluster0.i6kz1.mongodb.net/LocallySRCD?retryWrites=true&w=majority';

mongoose.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('connected to DB');
});

// parsing any JSON body we get first
app.use(express.json());
app.use(cookieParser());

// flow check -> quick check what requests we get from the client instead of checking the Network Tab in Chrome DevTools
app.use((req, res, next) => {
  console.log(`
  *** FLOW METHOD ***\n
  URL: ${req.url}\n
  BODY: `, req.body,
  `\n METHOD: ${req.method}\n`);
  return next();
});

// route handlers here 🤹
app.use('/api', apiRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/favs', favRouter);

/*** MAIN PAGE ***/

// directs the request to the assets folder for images
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));
// for the devServer
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

// catch all
app.use('*', (req, res, next) => {
  return res.status(404).send("This is not the page you're looking for...");
});

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'Interval Server Error' },
  };

  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  res.statusMessage = errorObj.log;
  return res.status(errorObj.status).end();
});

app.listen(PORT, () => {
  console.log(`Server listening on port: 🐼 ${PORT} 🐼`);
});

module.exports = app;

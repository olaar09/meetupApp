const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const HttpStatus = require('http-status-codes');

const indexRouter = require('./src/routes/v1/index');
const usersRouter = require('./src/routes/v1/users');
const commentRouter = require('./src/routes/v1/comments');
const meetupsRouter = require('./src/routes/v1/meetups');
const questionsRouter = require('./src/routes/v1/questions');

const getModule = require('./src/modules');
const responseHelper = require('./src/helpers/responseHelper');
const ErrorStrings = require('./src/helpers/repsonseStringHelper');
const { getUserId } = require('./src/helpers/sessionHelper');

const userModule = getModule('users');
const app = express();


// view engine setup
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Authenticate request and Add needed data to request object
app.use(async (req, res, next) => {
// routes to exlude from authorization
  if (req.originalUrl === '/v1/users/create-admin'
      || (req.originalUrl === '/v1/auth' && req.method === 'POST')
      || (req.originalUrl === '/')
      || (req.originalUrl === '/v1/auth/login' && req.method === 'POST')
  ) {
    return next();
  }

  // every other route are authenticated
  // through jwt authentication token
  try {
    const user = await userModule.authUser(req.headers.authorization);
    if (user) {
      req.userData = user;
      req.getUserId = () => getUserId(req);
      return next();
    }
    return responseHelper.endResponse(res, HttpStatus.UNAUTHORIZED, ErrorStrings.authFailed);
  } catch (error) {
    if (error instanceof userModule.AuthFailedErr) {
      return responseHelper.endResponse(res, HttpStatus.UNAUTHORIZED, ErrorStrings.authFailed);
    }

    if (error instanceof userModule.NotFoundErr) {
      return responseHelper.endResponse(res, HttpStatus.NOT_FOUND, ErrorStrings.userNotFound);
    }

    return responseHelper.endResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR, ErrorStrings.internalServerError,
    );
  }
});


app.use('/', indexRouter);
app.use('/v1/meetups', meetupsRouter);
app.use('/v1/questions', questionsRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/auth', usersRouter);
app.use('/v1/comments', commentRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

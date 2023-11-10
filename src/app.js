const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const sanitizer = require('perfect-express-sanitizer');

const hpp = require('hpp');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./helpers/appError');
const borrowedRoutes = require('./routes/borrowedRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());
// Set security HTPP headers.
app.use(helmet());

// Data sanitization against XSS and SQL injection.
app.use(
  sanitizer.clean({
    xss: true,
    sql: true,
  })
);
// Pervent parameter pollution.
app.use(hpp());

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/borrowed', borrowedRoutes);

app.all('*', (req, res, next) => {
  return next(new AppError(`Cannot find ${req.originalUrl} in server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

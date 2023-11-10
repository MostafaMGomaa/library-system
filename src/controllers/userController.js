const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/userModel');
const BorrowedBook = require('../models/borrowedBookModel');

const Email = require('../helpers/Email');
const AppError = require('../helpers/appError');
const { generateJWT, isVaildUserToken } = require('../helpers/auth');
const { getAll, getOne, deleteOne, updateOne } = require('./crudFactory');

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
exports.deleteOneUser = deleteOne(User);
exports.updateOneUser = updateOne(User);

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) return next(new AppError('User already exists', 403));

  const newUser = await User.create({ ...req.body, role: 'user' });
  const token = generateJWT(newUser, res);

  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  // Find the user by his email.
  const user = await User.findOne({ where: { email: req.body.email } });
  // Check if the user exists.
  if (!user) return next(new AppError('User not found!', 404));

  // Compare between password in the body and user hashed password in db.
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return next(new AppError('Invalid email or password', 403));

  const token = generateJWT(user, res);

  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res
    .status(201)
    .json({ status: 'success', message: 'Logged out successfully' });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return next(new AppError('Cannot find any users', 404));

  /**
   * Creat reset token to send it in the response.
   * Hash the token in the db for secuirty reasons.
   */
  const resetToken = crypto.randomBytes(4).toString('hex');
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordChangedAt = Date.now();
  // Token will be expired after 10 min;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  // Applay the changes in the db.
  await user.save();

  // If Send email crashed (User cannot find reset token) reset passwordReset values to null
  try {
    await new Email(user.email, resetToken).restPassword();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email',
    });
  } catch (err) {
    console.error(err);

    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const user = await isVaildUserToken(req, res, next);
    if (!user) return next(new AppError('Cannot find any users', 404));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password changed' });
  } catch (error) {
    next(error);
  }
});

/**
 * Check if the users vaildate his mail or not.
 */
exports.verifyToken = asyncHandler(async (req, res, next) => {
  const user = await isVaildUserToken(req, res, next);

  if (!user)
    return next(new AppError('Token is invalied or has expired!', 400));

  res.status(200).json({
    status: 'success',
  });
});

exports.userBorrowedBook = asyncHandler(async (req, res, next) => {
  const borrowedBooks = await BorrowedBook.findAll({
    where: {
      borrower_id: req.user.id,
    },
  });

  res.status(200).json({
    status: 'success',
    data: borrowedBooks,
  });
});

exports.setUserId = (req, res, next) => {
  if (!req.params.id) req.params.id = req.user.id;
  next();
};

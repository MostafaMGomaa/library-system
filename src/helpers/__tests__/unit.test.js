const { isUnEmail } = require('../middlewares');
const {
  isVaildUserToken,
  restrictTo,
  protect,
  generateJWT,
} = require('../auth');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AppError = require('../appError');
const User = require('../../models/userModel');

function setup() {
  const req = { user: {}, headers: {} };
  const res = { cookie: jest.fn() };
  const next = jest.fn();

  return { req, res, next };
}
const mockAsyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

describe('genJWT', () => {
  const { res } = setup();
  generateJWT({ id: 'userID', role: 'user' }, res);
  it('should has cookies', () => {
    expect(res.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.any(Object)
    );
  });
});

// !TODO: testme in integration test better
describe('protect function', () => {
  it('should call next() when a valid token is provided', async () => {
    const { req, res, next } = setup();

    req.authorization = 'Bearer validTokenHere';

    jwt.verify = jest.fn((token, secret, callback) => {
      callback(null, { id: 'userId' });
    });
    User.findByPk = jest.fn(() => Promise.resolve({ id: 'userId' }));
    const protectedRoute = mockAsyncHandler(protect);

    await protectedRoute(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next() with an error when no token is provided', async () => {
    const { req, res, next } = setup();

    User.findByPk = jest.fn(() => Promise.resolve(null));

    const protectedRoute = mockAsyncHandler(protect);
    await protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

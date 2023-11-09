const { body } = require('express-validator');

const router = require('express').Router();

const {
  getAllBooks,
  createOneBook,
  deleteOneBooks,
  getOneBook,
  updateOneBooks,
} = require('../controllers/bookController');
const { handleInputError } = require('../helpers/middlewares');
const { protect, restrictTo } = require('../helpers/auth.js');

router
  .route('/')
  .get(getAllBooks)
  .post(
    protect,
    restrictTo('admin', 'user'),
    body('title').isString().withMessage('Title must be a string'),
    body('author').isString().withMessage('Author must be a string'),
    body('isbn').isISBN('13'),
    body('shelf_location')
      .isString()
      .withMessage('Shelf location must be a string'),
    body('available_quantity')
      .optional()
      .isInt()
      .withMessage('Shelf location must be an int'),
    handleInputError,
    createOneBook
  );
router.use(protect);

router
  .route('/:id')
  .get(getOneBook)
  .patch(
    restrictTo('admin'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('author').optional().isString().withMessage('Author must be a string'),
    body('isbn').optional().isISBN('13'),
    body('shelf_location')
      .optional()
      .isString()
      .withMessage('Shelf location must be a string'),
    body('available_quantity')
      .optional()
      .isInt()
      .withMessage('Shelf location must be an int'),
    handleInputError,
    updateOneBooks
  )
  .delete(restrictTo('admin'), deleteOneBooks);
module.exports = router;

const { body } = require('express-validator');
const router = require('express').Router();

const {
  getAllBorrowedBooks,
  createOneBorrowedBook,
  getOneBorrowedBook,
  updateOneBorrowedBook,
  deleteOneBorrowedBook,
} = require('../controllers/borrowedController');
const { protect, restrictTo } = require('../helpers/auth');
const { handleInputError } = require('../helpers/middlewares');

router.use(protect);
router.use(restrictTo('admin'));
router
  .route('/')
  .get(getAllBorrowedBooks)
  .post(
    body('book_id').isInt().withMessage('Book id must be an integer'),
    body('borrower_id').isInt().withMessage('Borrower id must be an integer'),
    body('due_date').isDate().withMessage('Due date must be a date'),
    body('return_date')
      .optional()
      .isDate()
      .withMessage('Due date must be a date'),
    handleInputError,
    createOneBorrowedBook
  );
router
  .route('/:id')
  .get(getOneBorrowedBook)
  .patch(
    body('book_id')
      .optional()
      .isInt()
      .withMessage('Book id must be an integer'),
    body('borrower_id')
      .optional()
      .isInt()
      .withMessage('Borrower id must be an integer'),
    body('due_date').optional().isDate().withMessage('Due date must be a date'),
    body('return_date')
      .optional()
      .isDate()
      .withMessage('Due date must be a date'),
    handleInputError,
    updateOneBorrowedBook
  )
  .delete(deleteOneBorrowedBook);

module.exports = router;

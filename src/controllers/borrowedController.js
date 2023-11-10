const asyncHandler = require('express-async-handler');
const Excel = require('../controllers/Excel');
const moment = require('moment');

const Book = require('../models/bookModel');
const BorrowedBook = require('../models/borrowedBookModel');
const User = require('../models/userModel');
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./crudFactory');
const { Op } = require('sequelize');

exports.getAllBorrowedBooks = getAll(BorrowedBook, {
  options: {
    include: [
      {
        model: User,
        attributes: ['name', 'email'],
      },
      {
        model: Book,
        attributes: [
          'title',
          'author',
          'isbn',
          'available_quantity',
          'shelf_location',
        ],
      },
    ],
  },
  filterByDate: true,
});

exports.createOneBorrowedBook = createOne(BorrowedBook);
exports.getOneBorrowedBook = getOne(BorrowedBook, {
  include: [
    {
      model: User,
      attributes: ['name', 'email'],
    },
    {
      model: Book,
      attributes: [
        'title',
        'author',
        'isbn',
        'available_quantity',
        'shelf_location',
      ],
    },
  ],
});
exports.updateOneBorrowedBook = updateOne(BorrowedBook);
exports.deleteOneBorrowedBook = deleteOne(BorrowedBook);
exports.getOverdueBooks = asyncHandler(async (req, res, next) => {
  const currentDate = `${moment().format()}`.split('T')[0];
  const options = {
    where: {
      due_date: {
        [Op.lt]: currentDate,
      },
    },
  };
  const books = await BorrowedBook.findAll(options);

  if (req.query.export == 'true')
    return Excel.createExcel(books, 'overdue', res);

  res.status(200).json({ status: 'success', data: books });
});

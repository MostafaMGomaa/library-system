const asyncHandler = require('express-async-handler');
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
const sequelize = require('../db');

exports.getAllBorrowedBooks = getAll(BorrowedBook, {
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
  const overdueBooks = await BorrowedBook.findAll({
    where: {
      return_date: {
        [Op.gt]: sequelize.col('due_date'),
      },
    },
  });
  res.status(200).json({ status: 'success', data: overdueBooks });
});

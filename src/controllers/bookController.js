const { Op, where } = require('sequelize');
const asyncHandler = require('express-async-handler');

const Book = require('../models/bookModel.js');
const BorrowedBook = require('../models/borrowedBookModel');
const User = require('../models/userModel');
const { getOne, deleteOne, updateOne, createOne } = require('./crudFactory.js');
const AppError = require('../helpers/appError.js');
const sequelize = require('../db.js');

exports.getAllBooks = asyncHandler(async (req, res, next) => {
  const { title, author, isbn } = req.query;
  const query = {};

  if (title)
    query.title = {
      [Op.like]: `${title}%`,
    };
  if (author)
    query.author = {
      [Op.like]: `${author}%`,
    };
  if (isbn)
    query.isbn = {
      [Op.like]: `${isbn}%`,
    };

  const data = await Book.findAll({
    where: query,
  });

  res.status(200).json({
    status: 'success',
    result: data.length,
    data,
  });
});

exports.createOneBook = createOne(Book);
exports.getOneBook = getOne(Book);
exports.deleteOneBooks = deleteOne(Book);
exports.updateOneBooks = updateOne(Book);

exports.borrow = asyncHandler(async (req, res, next) => {
  try {
    const data = await sequelize.transaction(async (t) => {
      // Get Book by id and decrease available_quantity (if > 0)
      const book = await Book.findByPk(req.body.book_id, { transaction: t });
      if (!book || book.available_quantity === 0) {
        return next(new AppError(`This book doesn't available now`, 400));
      }

      book.available_quantity = book.available_quantity - 1;
      await book.save({ transaction: t });

      const borrowedBook = await BorrowedBook.create(req.body, {
        transaction: t,
      });

      return borrowedBook;
    });

    res.status(201).json({
      status: 'success',
      data,
    });
  } catch (error) {
    return next(new AppError(`Something went very wrong`, 500));
  }
});

exports.returnBorrowedBook = asyncHandler(async (req, res, next) => {
  try {
    const data = await sequelize.transaction(async (t) => {
      // Get borrrowedBook
      const borrowedBook = await BorrowedBook.findByPk(req.params.id, {
        transaction: t,
      });
      // Increase  available_quantity.
      const book = await Book.findByPk(borrowedBook.book_id, {
        transaction: t,
      });
      book.available_quantity += 1;
      // Set due date
      borrowedBook.return_date = Date.now();
      borrowedBook.isReturn = true;
      await borrowedBook.save();
      return borrowedBook;
    });
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(`Something went very wrong`, 500));
  }
});

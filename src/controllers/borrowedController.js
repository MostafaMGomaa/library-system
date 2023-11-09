const BorrowedBook = require('../models/borrowedBookModel');
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./crudFactory');

exports.getAllBorrowedBooks = getAll(BorrowedBook);
exports.createOneBorrowedBook = createOne(BorrowedBook);
exports.getOneBorrowedBook = getOne(BorrowedBook);
exports.updateOneBorrowedBook = updateOne(BorrowedBook);
exports.deleteOneBorrowedBook = deleteOne(BorrowedBook);

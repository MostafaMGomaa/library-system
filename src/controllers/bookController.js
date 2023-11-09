const { Op, where } = require('sequelize');
const asyncHandler = require('express-async-handler');

const Book = require('../models/bookModel.js');
const {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
} = require('./crudFactory.js');

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

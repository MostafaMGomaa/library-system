const { DataTypes } = require('sequelize');
const DB = require('../db');
const Book = require('./bookModel');
const User = require('./userModel');

const BorrowedBook = DB.define(
  'BorrowedBook',
  {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      references: {
        model: Book,
        key: 'id',
      },
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide book_id for a bowrrowed book.' },
      },
    },
    borrower_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide borrower_id for a bowrrowed book.' },
      },
    },
    return_date: {
      type: DataTypes.DATE,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide due_date for a bowrrowed book.' },
      },
    },
  },
  {
    timestamps: true,
  }
);
BorrowedBook.belongsTo(Book, {
  foreignKey: 'book_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

BorrowedBook.belongsTo(User, {
  foreignKey: 'borrower_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = BorrowedBook;

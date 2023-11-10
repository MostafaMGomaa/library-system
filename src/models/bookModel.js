const { DataTypes } = require('sequelize');
const DB = require('../db');

const Book = DB.define(
  'book',
  {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide title for the book.' },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide author for the book.' },
      },
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide author for the book.' },
      },
    },
    available_quantity: {
      type: DataTypes.SMALLINT.UNSIGNED,
      defaultValue: 1,
      validate: {
        isInt: { msg: 'Available quantity must be an integer.' },
      },
    },
    shelf_location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide shelf location for the book.' },
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        name: 'title',
        fields: ['title'],
      },
      {
        name: 'author',
        fields: ['author'],
      },
      {
        name: 'isbn',
        fields: ['isbn'],
      },
    ],
  }
);

/*
* this hook should :
  - Trim username title & author and make it lowercase
*/

Book.beforeSave((book) => {
  book.title = book.title.trim().toLowerCase();
  book.author = book.author.trim().toLowerCase();
});

module.exports = Book;

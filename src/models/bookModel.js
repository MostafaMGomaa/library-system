const { DataTypes } = require('sequelize');
const DB = require('bcryptjs');

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
      vaildate: {
        isInt: {
          msg: 'Must be an integer number of books',
        },
      },
    },
    shelf_location: {
      type: DataTypes.STRING,
      allowNull: false,
      vaildate: {
        notNull: { msg: 'Please provide shelf location for the book.' },
      },
    },
  },
  {
    timestamps: true,
  }
);

/*
* this hook should :
  - Trim username title & author and make it lowercase
*/

Book.beforeSave((book) => {
  book.title = user.title.trim().toLowerCase();
  book.author = book.author.trim().toLowerCase();
});

module.exports = Book;

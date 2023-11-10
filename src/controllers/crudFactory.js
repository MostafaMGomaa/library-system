const asyncHandler = require('express-async-handler');
const AppError = require('../helpers/appError');
const moment = require('moment');
const { Op } = require('sequelize');
const Excel = require('../controllers/Excel');

const filterDate = (req, join) => {
  let fromDate = moment().subtract(1, 'years');
  let toDate = moment().format();
  if (req.query.fromDate) fromDate = req.query.fromDate;
  if (req.query.toDate) toDate = req.query.toDate;
  if (req.query.lastmonth === 'true')
    fromDate = moment().subtract(1, 'months').format().split('T')[0];
  return { fromDate, toDate };
};

const getBorrows = async (Model, join, req) => {
  let date = filterDate(req, join);
  let data;

  // to manipulate the filter object only if the filter by date is required in borrow route
  if (join.filterByDate) {
    data = await Model.findAll({
      ...join.options,
      where: {
        [Op.and]: [
          {
            createdAt: {
              [Op.gt]: date.fromDate,
              [Op.lte]: date.toDate,
            },
          },
        ],
      },
    });
  } else {
    data = await Model.findAll(join);
  }
  return data;
};

exports.getAll = (Model, join) =>
  asyncHandler(async (req, res, next) => {
    const data = await getBorrows(Model, join, req);
    if (req.query.export == 'true')
      return Excel.createExcel(data, 'Borrows-Report', res, true);
    res.status(200).json({
      status: 'success',
      result: data.length,
      data,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data,
    });
  });

exports.getOne = (Model, join) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.findByPk(req.params.id, join);

    if (!data)
      return next(new AppError('cannot find any result with that id', 404));

    res.status(200).json({ status: 'success', data });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const [updatedRowCount, updatedRows] = await Model.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });

    if (updatedRowCount === 0)
      return next(new AppError('cannot find result with that id', 404));

    res
      .status(200)
      .json({ message: 'User updated successfully', data: updatedRows[0] });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data === 0)
      return next(new AppError('cannot find result with that id', 404));

    res.status(204).json({ message: 'Deleted successfully' });
  });

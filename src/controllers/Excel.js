const ExcelJS = require('exceljs');

exports.createExcel = (borrowData, excelName, res, detailed = false, next) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = 'LMS';
  workbook.lastModifiedBy = 'LMS';
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(excelName);

  topInfo(sheet);
  borrowColumns(sheet, detailed);
  let RowNumber = 3;
  borrowData.forEach((element) => {
    borrowRowData(
      sheet,
      RowNumber++,
      element.id,
      element.book_id,
      element.borrower_id,
      element.createdAt,
      element.due_date,
      element.isReturn,
      element.user.name,
      element.book.title,
      detailed
    );
  });
  setHeaders(res, excelName);
  workbook.xlsx.write(res);
};

const topInfo = (sheet) => {
  const labelRow = sheet.getRow(1);
  labelRow.font = {
    name: 'Arial Black',
    family: 2,
    size: 14,
    italic: true,
    bold: true,
  };
  sheet.mergeCells(`A1:E1`);

  labelRow.values = ['****', 'Liberary', ' Management  ', 'System ', '****'];
  labelRow.alignment = { vertical: 'middle', horizontal: 'center' };

  topInfoCellsBackground(labelRow, 'ffffc000');
  section_topInfo_borders(sheet, 1);
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 25;
  sheet.getColumn('C').width = 25;
  sheet.getColumn('D').width = 25;
  sheet.getColumn('E').width = 25;
  sheet.getColumn('F').width = 25;
  sheet.getColumn('G').width = 25;
  sheet.getColumn('H').width = 25;
};
const topInfoCellsBackground = (row, color) => {
  for (let cellNum = 1; cellNum < 6; cellNum++) {
    row.getCell(cellNum).fill = {
      type: 'pattern',
      pattern: 'lightGray',
      bgColor: { argb: color },
    };
  }
};
const sectionCellsBackground = (row, color, length) => {
  for (let cellNum = 1; cellNum < length + 1; cellNum++) {
    row.getCell(cellNum).fill = {
      type: 'pattern',
      pattern: 'lightGray',
      bgColor: { argb: color },
    };
  }
};
const section_topInfo_borders = (sheet, lineNum) => {
  ['A', 'B', 'C', 'D', 'E'].map((key) => {
    sheet.getCell(`${key}${lineNum}`).border = {
      top: { style: 'double' },
      bottom: { style: 'double' },
    };
  });
};
const setHeaders = (res, excelName) => {
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment;filename=` + `${excelName}.xlsx`
  );
};
const borrowColumns = (sheet, detailed) => {
  let details = [];
  if (detailed) details = ['Book Name', 'Borrower Name'];
  const labelsAndDays = [
    'Operation ID',
    'Book ID',
    ...details,
    'Borrower ID',
    'Borrow Date',
    'Due Date',
    'Returned',
  ];
  const row = sheet.getRow(2);
  row.values = labelsAndDays;
  row.alignment = { horizontal: 'center' };
  sectionCellsBackground(row, 'ffa9d08e', labelsAndDays.length);

  row.font = {
    name: 'Arial black',
    size: 12,
    bold: true,
  };
  row.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  user_columns_borders(sheet, 2);
};
const borrowRowData = (
  sheet,
  RowNumber,
  operationID,
  BookID,
  BorrowerID,
  BorrowDate,
  DueDate,
  isReturn,
  userName,
  bookName,
  detailed
) => {
  const row = sheet.getRow(RowNumber);
  let details = [];
  if (detailed) details = [bookName, userName];
  const data = [
    operationID,
    BookID,
    ...details,
    BorrowerID,
    BorrowDate,
    DueDate,
    isReturn,
  ];
  row.values = data;
  row.alignment = { horizontal: 'center' };
  row.font = {
    color: { argb: 'ff0000ff' },
  };
};
const user_columns_borders = (sheet, lineNum) => {
  [`A`, `B`].map((key) => {
    sheet.getCell(`${key}${lineNum}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
  sheet.getCell(`C${lineNum}`).border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
  };
  sheet.getCell(`D${lineNum}`).border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
  };
  sheet.getCell(`E${lineNum}`).border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
};

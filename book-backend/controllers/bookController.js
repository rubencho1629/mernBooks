const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Book = require('../models/Book');
const { errorHandler } = require('../helpers/dberrorHandler');

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy : 'name'

  Book.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .exec((err, book) => {
      if (err) {
        return res.status(400).json({
          error: "book not found"
        })
      }
      res.json(book);
    })
}

exports.read = (req, res) => {
  req.book.photo = undefined;
  return res.json(req.book);
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }

    const { name, description, price, category, quantity } = fields
    let book = new Book(fields);

    // 1KB = 1000 bytes
    // 1MB = 1,000,000 bytes 
    // 1 Byte = 8 bits

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image should be lass than 1MB in size"
        })
      }
      book.photo.data = fs.readFileSync(files.photo.path)
      book.photo.contentType = files.photo.type
    }

    book.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error)
        })
      }
      res.json(result);
    })

  })
}

exports.remove = (req, res) => {
  let book = req.book
  book.remove((err, deletedBook) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json({
      message: "Book was deleted succesfully"
    })
  })
}

exports.bookById = (req, res, next, id) => {
  Book.findById(id)
    .populate("category")
    .exec((err, book) => {
      if (err || !book) {
        return res.status(400).json({
          error: "Book not found"
        });
      }
      req.book = book;
      next();
    })
}

exports.photo = (req, res, next ) => {
  if (req.book.photo.data) {
    res.set('Content-Type', req.book.photo.contentType)
    return res.send(req.book.photo.data)
  }
  next();
}
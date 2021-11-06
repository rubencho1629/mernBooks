const express = require('express');
const router = express.Router();


const { list, create,remove, bookById, photo } = require('../controllers/bookController');


router.get('/book', list);
router.post('/create', create);
router.get('/photo/:bookId', photo);
router.delete('/:bookId', remove);

router.param("bookId", bookById);


module.exports = router;

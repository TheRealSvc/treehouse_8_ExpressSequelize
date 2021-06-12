var express = require('express');
var router = express.Router();
const Books = require('../models').Book ;

/* GET home page. */
router.get('/', function(req, res, next) {
 res.redirect("/books")
});


/* GET books page */
router.get('/books', function(req, res, next) {
 let test = Promise.resolve(Books.findAll()) ;
 test.then(x => res.json(x));
});

/* Shows the create new book form */
router.get('/books/new', function(req, res, next) {
    //let test = Promise.resolve(Books.findAll()) ;
    res.render("new-book");
   });
   
/* Posts a new book to the database */
router.post('/books/new', function(req, res, next) {
    //let test = Promise.resolve(Books.findAll()) ;
    //test.then(x => res.json(x));
   });
   
   
/* Shows book detail form */
router.get('/books/:id', function(req, res, next) {
    //let test = Promise.resolve(Books.findAll()) ;
    //test.then(x => res.json(x));
   });
   
/* Updates book info in the database */
router.post('/books/:id', function(req, res, next) {
    //let test = Promise.resolve(Books.findAll()) ;
    //test.then(x => res.json(x));
   });
   
/* - Deletes a book.  */
router.post('/books/:id/delete', function(req, res, next) {
    // CAREFULL HERE 
   });



module.exports = router;


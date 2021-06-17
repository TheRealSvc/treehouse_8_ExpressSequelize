var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }

/* GET home page. */
router.get('/', asyncHandler( async (req, res) => { 
 res.redirect("/books")
}))
;

/* GET books page */
router.get('/books', asyncHandler( async (req, res) => { 
  console.log(`%${req.query.q}%`)
  if (req.query.q === undefined) {
    var books = await Book.findAll() ;
  } else {  
    var books = await Book.findAll({ 
      where: {
        [Op.or]: [ {
        title: {
          [Op.like]: `%${req.query.q}%`
        }},
        {author: {
          [Op.like]: `%${req.query.q}%`
        }},
        {genre: {
          [Op.like]: `%${req.query.q}%`
        }}
        ]
      },
      order: [["createdAt", "DESC"]] });
    } 
    let search = {search: req.query.q} ;
    res.render("index", { books , search}) 
  }
)
)


/* Shows the create new book form */
router.get('/books/new', asyncHandler( async (req, res) => { 
    res.render("new-book");
}));


/* Posts a new book to the database */
router.post('/books/new', asyncHandler( async (req, res) => { 
    let book ; 
    try {
        book = await Book.create(req.body);
        res.redirect("/books");     
    } catch (error) {
    if(error.name === "SequelizeValidationError") {
        console.log("SequelizeValidationError") ; 
        res.render("new-book", { errors: error.errors })
    } else {
        console.log(" some error !") ; 
      throw error;
    }  
  }
}));


   
/* - Shows book detail form */
router.get( "/books/:id", asyncHandler(async (req, res) => {
      const book = await Book.findByPk(req.params.id);
      console.log('In get /books/:id !!!!')
      console.log(book);
      if (book) {
        res.render("update-book", { book });
      } else {
        errHandler(404, "Page not found! Please try again.");
      }
    })
  );
   
/* Updates book info in the database */
router.post('/books/:id', asyncHandler(async (req, res) => {
    let book;
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/');
      } else {
        errHandler(404, "Page not found! Please try again.");
      }
    }) 
    );

/* - Deletes a book.  */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/');
   }));


module.exports = router;
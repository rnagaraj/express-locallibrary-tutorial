const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
    Genre
        .find({})
        .sort([['name','ascending']]).exec((err, genres) => {
        if(err) {
            return next(err);
        } else {
            res.render('genre_list', {title: 'Genres', genres: genres});
        }
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
    async.parallel({
        
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },

        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
                .exec(callback);
        }

    },function(err, results) {
        if (err) { 
            return next(err); 
        }
        if (results.genre==null) { // No results.
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }

        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );

    });
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
    res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    // Validate that the name field is not empty. body: validator
    body('name').isLength({min: 1}).trim().withMessage('Genre name reqired'),

    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre({
            name: req.body.name
        });

        if(!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
            return;

        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre
                .findOne({'name': req.body.name})
                .exec((err, found_genre) => {
                    if(err) {
                        return next(err);
                    } 
                    if(found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_genre.url);
                    } else {
                        genre.save((err) => {
                            if(err) {
                                return next(err);
                            } 
                            
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(genre.url);
                            
                        });
                    }

                }) ;

        }


    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
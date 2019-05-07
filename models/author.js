var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

//Define Fields
var AuthorSchema = new Schema(
    {
      first_name: {type: String, required: true, max: 100},
      family_name: {type: String, required: true, max: 100},
      date_of_birth: {type: Date},
      date_of_death: {type: Date},
    }
  );

// Virtual for author's full name
AuthorSchema
    .virtual('name')
    .get(function () {
        return `${this.family_name}, ${this.first_name}`;
    });

// Virtual for author's lifespan
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        var dob = this.date_of_birth;
        var dod = this.date_of_death;
        var lifespan = (dod && dob) ? `${moment(dod).format('MMMM Do, YYYY')} - ${moment(dob.getYear()).format('MMMM Do, YYYY')}` : 
            (dob) ? `${moment(dob.getYear()).format('MMMM Do, YYYY')} - ` : 'No Information';

        return lifespan;
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return `/catalog/author/${this._id}`;
    });

// Export Author Model
module.exports = mongoose.model('Author', AuthorSchema);
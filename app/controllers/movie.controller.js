const db = require("../models");
const Movie = db.movies;
let Validator = require('validatorjs');
const movieDummy = require('../dummy');

let rules = {
  id: "required|integer",
  title: "required|string",
  description: "required|string",
  rating: "required|integer",
  image: "string",
  created_at: "required|date",
  updated_at: "required|date",
};

function validationCheck (payload, rules) {
  let validation = new Validator(payload, rules, {
    required: 'The :attribute is empty', 
    date: 'The :attribute must contain date',
    string: 'The :attribute must contain character',
    integer: 'The :attribute must contain numeric',
  });

  return validation;
} 

exports.create = async (req, res) => {
  let validation = validationCheck(req.body, rules);

  const movie = {
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
    image: req.body.image,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
  };

  if (validation.fails()) {
    let validationObj  = {};
    for (const key in rules) {
      validationObj[`${key}`] = validation.errors.get(`${key}`)
    }

    res.status(412)
      .send({
          message: 'Validation failed',
          validation_message: validationObj
      });
  } else {
    Movie.create(movie)
      .then(data => {
        res.status(200).send({
          data : data,
          message : "Movie was successfully created"
        })
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Movie."
        });
      });
    }
};

exports.findAll = (req, res) => {
  Movie.findAll({})
    .then(data => {
        res.status(200).json({
          data : data,
          message : "All movie successfully retreived"
        })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving movie."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Movie.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200)
        .send({
          data: data,
          message : `Movie with id ${id} successfully found`
        });
      } else {
        res.status(404).send({
          message: `Cannot find Movie with id=${id} because not found.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Movie with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  let validation = validationCheck(req.body, rules);
  
  if (validation.fails()) {
    let validationObj  = {};
    for (const key in rules) {
      validationObj[`${key}`] = validation.errors.get(`${key}`)
    }
    res.status(412)
      .send({
          message: 'Validation failed',
          validation_message: validationObj
      });
  } else {
    Movie.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.status(200)
          .send({
            message : `Movie with id=${id} was successfully updated`
          });
        } else {
          res.status(404)
          .send({
            message: `Cannot update Movie with id=${id} because not found.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Movie with id=" + id
        });
      });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Movie.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200)
        .send({
          message: `Movie with id=${id} was successfully deleted!`
        });
      } else {
        res.status(404)
        .send({
          message: `Cannot delete Movie with id=${id} because not found.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error delete Movie with id=" + id
      });
    });
};
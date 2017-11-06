

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../db-connect')

/**
 * GET /api/users
 *
 * Retrieve a page of users (up to ten at a time).
 */
exports.getUsers = (req, res, next) => {

  connection.query(
    'SELECT * from `users`', // LIMIT ? OFFSET ?', [10, token],
    (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.json(results);
    }
  );
}


/**
 * POST /api/users
 *
 * Create a new user.
 */
exports.createUser = (req, res, next) => {



  connection.query('INSERT INTO `users` SET ?', userData, (err, result) => {
    console.log(result);
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // res.status(403).send('User already exits');
        // return;
        read(userData.id, (err, entity) => {
          if (err) {
            next(err);
            return;
          }
          res.json(entity);
        });
      } else {
        next(err);
      }
    
    } else {
        read(userData.id, (err, entity) => {
          if (err) {
            next(err);
            return;
          }
          res.json(entity);
        });
    }
  });

}


function read (id, cb) {
  console.log(id);
  connection.query('SELECT * FROM `users` WHERE `id` = ?', id, (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      if (!results.length) {
        cb({
          code: 404,
          message: 'Not found'
        });
        return;
      }
      cb(null, results[0]);
    });
}


/**
 * GET /api/users/:id
 *
 * Retrieve a user.
 */
exports.getUser = (req, res, next) => {

  console.log('Body');
  console.log(req.body);
  console.log('Query');
  console.log(req.query);

  read(req.query.userId, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
}


/**
 * PUT /api/users/:id
 *
 * Update a user.
 */
exports.updateUser = (req, res, next) => {

  connection.query(
    'UPDATE `users` SET ? WHERE `id` = ?', [req.body, req.params.id], (err) => {
      if (err) {
        next(err);
        return;
      }
      read(req.userId, (err, entity) => {
        if (err) {
          next(err);
          return;
        }
        res.json(entity);
      });
    });
}


/**
 * DELETE /api/users/:id
 *
 * Delete a user.
 */
exports.deleteUser = (req, res, next) => {

  connection.query('DELETE FROM `users` WHERE `id` = ?', req.userId, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"result":"success"});
  });
}





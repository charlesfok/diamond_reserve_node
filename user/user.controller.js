

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../db-connect')


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

exports.getAdmins = (req, res, next) => {

  connection.query(
    'SELECT arn from `users` WHERE is_admin = true', // LIMIT ? OFFSET ?', [10, token],
    (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.json(results);
    }
  );
}

exports.getHomeTitle = (req, res, next) => {

  connection.query(
    'SELECT home_title from `admin` WHERE 1', // LIMIT ? OFFSET ?', [10, token],
    (err, results) => {
      if (err) {
        next(err);
        return;
      }
      res.json(results[0]);
    }
  );
}

exports.updateHomeTitle = (req, res, next) => {

  console.log(req.body);

  connection.query(
    'UPDATE `admin` SET ? WHERE `id` = 1', req.body, (err) => {
      if (err) {
        next(err);
        return;
      }
      res.json('success');
    });
}





exports.createUser = (req, res, next) => {

  connection.query('INSERT INTO `users` SET ?', req.body, (err, result) => {
    console.log(result);
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // res.status(403).send('User already exits');
        // return;
        read(req.body.id, (err, entity) => {
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
        read(req.body.id, (err, entity) => {
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
  connection.query('SELECT * FROM `users` WHERE `id` = ?', id, (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      if (!results.length) {
        cb(null, {
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

  read(req.query.user_id, (err, entity) => {
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
      console.log('aaaaa');

      console.log(req.body);

  connection.query(
    'UPDATE `users` SET ? WHERE `id` = ?', [req.body, req.params.id], (err) => {
      if (err) {
        next(err);
        return;
      }
      console.log('fefefewfewf');
      read(req.params.id, (err, entity) => {
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

  connection.query('DELETE FROM `users` WHERE `id` = ?', req.query.user_id, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"result":"success"});
  });
}





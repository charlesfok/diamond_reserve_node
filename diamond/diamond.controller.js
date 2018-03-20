'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../db-connect')
const request = require('request');
const csvParser = require('csv-parse');

exports.getDiamonds = (req, res, next) => {

  connection.query('SELECT is_admin FROM `users` WHERE `id` = ?', req.query.user_id, (err, result) => {
    
      if (err) {
        next(err);
        return;
      }
      if (!result.length) {
        res.json({code: 404, message: 'Not found'});
        return;
      }
      var is_admin = result[0].is_admin;
      console.log('Admin:');
      console.log(is_admin);

      var sql;

      if (is_admin) {

         sql = `SELECT  A.vendo_number,
                        A.shape, 
                        A.weight, 
                        A.color, 
                        A.clarity, 
                        A.measurements, 
                        A.diamond360, 
                        A.price, 
                        A.diamond_image, 
                        A.certificate_number,
                        A.comments,
                        A.culet_size,
                        A.cut_grade,
                        A.fluorescene_intensity,
                        A.girdle_thick,
                        A.girdle_thin,
                        A.lab,
                        A.fancy_color,
                        A.fancy_color_intensity,
                        A.fancy_color_overtone,
                        A.polish,
                        A.symmetry,
                        A.table_number,
                        A.certificate_image,
                        A.depth,
                        IFNULL(B.is_reserved, 0) as total_reserved,
                        B.reserved_date as total_reserved_date,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  diamonds A
                       LEFT JOIN
                          (SELECT diamond_id,
                                  COUNT(user_id) as is_reserved,
                                  reserved_date
                           FROM reservations
                           WHERE state = 'reserved'
                           GROUP BY diamond_id) as B
                           on A.vendo_number = B.diamond_id
                       LEFT JOIN
                          (SELECT diamond_id,
                                  state,
                                  reserved_date,
                                  reject_reason
                           FROM reservations
                           WHERE user_id = ?) as C
                           on A.vendo_number = C.diamond_id
                 ORDER BY A.weight DESC`;


          connection.query(sql, req.query.user_id, (err, results) => {
              if (err) {
                next(err);
                return;
              }
              res.json(results);
          });

      } else {
 
         sql = `SELECT  A.vendo_number,
                        A.shape, 
                        A.weight, 
                        A.color, 
                        A.clarity, 
                        A.measurements, 
                        A.diamond360, 
                        A.price, 
                        A.diamond_image, 
                        A.certificate_number,
                        A.comments,
                        A.culet_size,
                        A.cut_grade,
                        A.fluorescene_intensity,
                        A.girdle_thick,
                        A.girdle_thin,
                        A.fancy_color,
                        A.fancy_color_intensity,
                        A.fancy_color_overtone,
                        A.table_number,
                        A.lab,
                        A.polish,
                        A.symmetry,
                        A.certificate_image,
                        A.depth,
                        IFNULL(B.is_reserved, 0) as total_reserved,
                        B.reserved_date as total_reserved_date,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  diamonds A
                       LEFT JOIN
                          (SELECT diamond_id,
                                  COUNT(user_id) as is_reserved,
                                  reserved_date
                           FROM reservations
                           WHERE state = 'reserved'
                           GROUP BY diamond_id) as B
                           on A.vendo_number = B.diamond_id
                       LEFT JOIN
                          (SELECT diamond_id,
                                  state,
                                  reserved_date,
                                  reject_reason
                           FROM reservations
                           WHERE user_id = ?) as C
                           on A.vendo_number = C.diamond_id
                 WHERE (B.is_reserved IS NULL) OR (C.state IS NOT NULL)
                 ORDER BY A.weight DESC`;


          connection.query(sql, req.query.user_id, (err, results) => {
              if (err) {
                next(err);
                return;
              }
              console.log("success get diamonds");
              res.json(results);

          });
      }

  });
}



exports.getDiamond = (req, res, next) => {

 
  connection.query('SELECT is_admin FROM `users` WHERE `id` = ?', req.query.user_id, (err, result) => {
    
      if (err) {
        next(err);
        return;
      }
      if (!result.length) {
        res.json({code: 404, message: 'Not found'});
        return;
      }
      var is_admin = result[0].is_admin;
      console.log('Admin:');
      console.log(is_admin);

      var sql;

      if (is_admin) {

         sql = `SELECT  A.vendo_number,
                        A.shape, 
                        A.weight, 
                        A.color, 
                        A.clarity, 
                        A.measurements, 
                        A.diamond360, 
                        A.price, 
                        A.diamond_image, 
                        A.certificate_number,
                        A.comments,
                        A.culet_size,
                        A.cut_grade,
                        A.fluorescene_intensity,
                        A.girdle_thick,
                        A.girdle_thin,
                        A.fancy_color,
                        A.fancy_color_intensity,
                        A.fancy_color_overtone,
                        A.lab,
                        A.table_number,
                        A.polish,
                        A.symmetry,
                        A.certificate_image,
                        A.depth,
                        IFNULL(B.is_reserved, 0) as total_reserved,
                        B.reserved_date as total_reserved_date,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  diamonds A
                       LEFT JOIN
                          (SELECT diamond_id,
                                  COUNT(user_id) as is_reserved,
                                  reserved_date
                           FROM reservations
                           WHERE state = 'reserved'
                           GROUP BY diamond_id) as B
                           on A.vendo_number = B.diamond_id
                       LEFT JOIN
                          (SELECT diamond_id,
                                  state,
                                  reserved_date,
                                  reject_reason
                           FROM reservations
                           WHERE user_id = ?) as C
                           on A.vendo_number = C.diamond_id
                 WHERE A.vendo_number = ?
                 ORDER BY A.weight DESC`;


          connection.query(sql, [req.query.user_id, req.params.id], (err, results) => {
              if (err) {
                next(err);
                return;
              }
              if (!results.length) {
                res.json({code: 404, message: 'Not found'});
                return;
              }
              console.log("success get diamond:");          
              console.log(results[0]);
              res.json(results[0]);
            });

      } else {
 
         sql = `SELECT  A.vendo_number,
                        A.shape, 
                        A.weight, 
                        A.color, 
                        A.clarity, 
                        A.measurements, 
                        A.diamond360, 
                        A.price, 
                        A.diamond_image, 
                        A.certificate_number,
                        A.comments,
                        A.table_number,
                        A.culet_size,
                        A.cut_grade,
                        A.fluorescene_intensity,
                        A.girdle_thick,
                        A.girdle_thin,
                        A.fancy_color,
                        A.fancy_color_intensity,
                        A.fancy_color_overtone,
                        A.lab,
                        A.polish,
                        A.symmetry,
                        A.certificate_image,
                        A.depth,
                        IFNULL(B.is_reserved, 0) as total_reserved,
                        B.reserved_date as total_reserved_date,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  diamonds A
                       LEFT JOIN
                          (SELECT diamond_id,
                                  COUNT(user_id) as is_reserved,
                                  reserved_date
                           FROM reservations
                           WHERE state = 'reserved'
                           GROUP BY diamond_id) as B
                           on A.vendo_number = B.diamond_id
                       LEFT JOIN
                          (SELECT diamond_id,
                                  state,
                                  reserved_date,
                                  reject_reason
                           FROM reservations
                           WHERE user_id = ?) as C
                           on A.vendo_number = C.diamond_id
                 WHERE ((B.is_reserved IS NULL) OR (C.state IS NOT NULL)) AND A.vendo_number = ?
                 ORDER BY A.weight DESC`;


          connection.query(sql, [req.query.user_id, req.params.id], (err, results) => {
              if (err) {
                next(err);
                return;
              }
              if (!results.length) {
                res.json({code: 404, message: 'Not found'});
                return;
              }
              console.log("success get diamonds");
              console.log(results[0]);
              res.json(results[0]);

          });
      }

  });

}



exports.createDiamond = (req, res, next) => {

  console.log(req.body);

  connection.query('INSERT INTO `diamonds` SET ?', req.body, (err, res) => {
    if (err) {
      next(err);
      return;
    }
    readCoin(res.insertId, req.useId, (err, entity) => {
      if (err) {
        next(err);
        return;
      }
      res.json(entity);
    });
  });
}


function readDiamond (diamondId, cb) {

  var sql = 
   `SELECT  A.*
    FROM  diamonds A
    WHERE A.vendo_number = ?` ;
     

  connection.query(sql, diamondId, (err, results) => {
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
 * PUT /api/coins/:id
 *
 * Update a coin.
 */
exports.updateDiamond = (req, res, next) => {

  connection.query(
    'UPDATE `diamonds` SET ? WHERE `vendo_number` = ?', [req.body, req.params.id], (err) => {
      if (err) {
        next(err);
        return;
      }
      res.json({"message" : "Diamond is updated",
                "result": "success"});  
  });
}


/**
 * DELETE /api/coins/:id
 *
 * Delete a coin.
 */
exports.deleteDiamond = (req, res, next) => {
  connection.query('DELETE FROM `diamonds` WHERE `id` = ?', req.params.id, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"result":"success"});
  });

}


exports.pullDiamonds = (req, res, next) => {
  console.log('pull');

 
  request('https://s3.amazonaws.com/diamondreserve-userfiles-mobilehub-952888115/uploads', function (error, response, body) {
    if (error) {
      next(error);
      return;
    }
    csvParser(body, {
      delimiter: ','
    }, function(err, data) {
      if (err) {
        console.log(err);
        next(err);
      } 
        connection.query('DELETE FROM `diamonds1` WHERE 1', (err) => {
          if (err) {
            next(err);
            return;
          }

          var keys = ['shape', 
                      'weight', 
                      'color', 
                      'clarity', 
                      'measurements', 
                      'cut_grade', 
                      'lab',
                      'price',
                      'depth',
                      'table_number',
                      'girdle_thin',
                      'girdle_thick',
                      'girdle',
                      'culet_size',
                      'culet_condition',
                      'polish',
                      'symmetry',
                      'fluorescene_intensity',
                      'fluorescene_color',
                      'crown_height',
                      'crown_angle',
                      'pavillion_depth',
                      'pavillion_angle',
                      'treatment',
                      'laserinscription',
                      'comments',
                      'certificate_number',
                      'certificate_image',
                      'diamond360',
                      'sarin_file',
                      'vendo_number',
                      'matched_stock_number',
                      'is_matched_separable',
                      'city',
                      'state',
                      'country',
                      'fancy_color',
                      'fancy_color_intensity',
                      'fancy_color_overtone',
                      'parcel_stone_count',
                      'status',
                      'trade_show',
                      'diamond_image'];

          var sql = 'INSERT INTO `diamonds1` (' +  keys.join(',') + ') VALUES ?';

          console.log(sql);

          connection.query(sql, [data], (err1, result) => {
              if (err1) {
                next(err1);
                return;
              }
            res.json(data);
          });

        });

      });
  });


}









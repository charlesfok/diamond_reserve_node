

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../db-connect')





exports.getReserves = (req, res, next) => {

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
                        A.polish,
                        A.symmetry,
                        A.certificate_image,
                        A.depth,
                        C.user_id as user,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  reservations C
                       LEFT JOIN diamonds as A
                           on A.vendo_number = C.diamond_id
                 WHERE C.state = 'pending' OR C.state = 'reserved'
                 ORDER BY C.state DESC`;


          connection.query(sql, (err, results) => {
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
                        A.lab,
                        A.polish,
                        A.symmetry,
                        A.certificate_image,
                        A.depth,
                        C.user_id as user,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  reservations C
                       LEFT JOIN diamonds as A
                           on A.vendo_number = C.diamond_id
                 WHERE C.user_id = ?
                 ORDER BY C.state DESC`;


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



function getReservedDiamonds (diamondId, cb) {

  var sql = 
   `SELECT  A.*
    FROM  reservations A
    WHERE (A.diamond_id = ? AND A.state = 'reserved')` ;

  connection.query(sql, diamondId, (err, results) => {
      if (err) {
        cb(err);
        return;

      }
      cb(null, results); 
  });
}



exports.acceptReserve = (req, res, next) => {

    getReservedDiamonds(req.body.diamond_id, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      if (results.length > 0) {
         res.json({"message" : "This diamond is already reserved",
                   "result": "fail"});
      } 
      else 
      {
        const body = {'state' : 'rejected',
                      'reject_reason' : 'Rejected by selecting other client'};
        body.reserved_date = null;

        connection.query('UPDATE `reservations` SET ? WHERE `diamond_id` = ?', [body, req.body.diamond_id], (err) => {
            if (err) {
              next(err);
              return;
            }

            var sql =  `SELECT *
                        FROM  reservations 
                        WHERE (diamond_id = ? AND user_id = ?)` ;
            
            connection.query(sql, [req.body.diamond_id, req.body.user_id], (err, result1) => {
                if (err) {
                  next(err);
                  return;
                }

                req.body.state = "reserved";
                req.body.reject_reason = "";

                if (result1.length > 0) { //Accept the user's reserve request: user_id should be users' in body
                  req.body.reserved_date =  new Date();
                  connection.query('UPDATE `reservations` SET ? WHERE `id` = ?', [req.body, result1[0].id], (err) => {
                      if (err) {
                        next(err);
                        return;
                      }
                      console.log("Reserve request of user is accepted")
                      res.json({"message" : "This diamond is on reserved",
                                "result": "success"});
                  });
                }
                else {  // Admin requires reservation : user_id should be admin's in body
                  connection.query('INSERT INTO `reservations` SET ?', req.body, (err, result) => {
                      if (err) {
                        next(err);
                        return;
                      }
                      console.log("Admin created reservation")
                      res.json({"message" : "This diamond is on reserved by admin",
                                "result": "success"});
                  });
                }
            });
        });

      }
    });
 }




exports.requestReserve = (req, res, next) => {
  
  console.log(req.body);
  req.body.state = "pending"

    getReservedDiamonds(req.body.diamond_id, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      if (results.length > 0) {
         res.json({"message" : "This diamond is already reserved",
                   "result": "fail"});
      } 
      else 
      {
        var sql =  `SELECT *
                    FROM  reservations 
                    WHERE (diamond_id = ? AND user_id = ?)` ;

        connection.query(sql, [req.body.diamond_id, req.body.user_id], (err, result1) => {
            if (err) {
              next(err);
              return;
            }

            if (result1.length > 0) {
              const body = {'state' : 'pending'};
              connection.query('UPDATE `reservations` SET ? WHERE `id` = ?', [body, result1[0].id], (err) => {
                  if (err) {
                    next(err);
                    return;
                  }
                  res.json({"message" : "This diamond is on pending",
                            "result": "success"});
              });
            }
            else {
              connection.query('INSERT INTO `reservations` SET ?', req.body, (err, result) => {
                  if (err) {
                    next(err);
                    return;
                  }
                  res.json({"message" : "This diamond is on pending",
                            "result": "success"});              
              });
            }
        });
      }
    });
 }




exports.rejectReserve = (req, res, next) => {
  
  req.body.state = "rejected"

  connection.query('UPDATE `reservations` SET ? WHERE (diamond_id = ? AND user_id = ?)', [req.body, req.body.diamond_id, req.body.user_id], (err) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"message" : "Reservation is rejected",
              "result": "success"});    
  });
}



exports.cancelReserve = (req, res, next) => {

  console.log(req.body.diamond_id);
  connection.query('DELETE FROM `reservations` WHERE `diamond_id` = ?', req.body.diamond_id, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"message" : "Reservation is cancelled",
              "result": "success"});   
    });

}



















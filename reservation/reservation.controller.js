

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../db-connect')




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

  req.body.state = "pending"

    getReservedDiamonds(req.body.diamond_id, (err, results) => {
      if (err) {
        next(err);
        return;
      }

      if (results.length > 0) {
         res.json({"fail" : "This diamond is already reserved"});
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

                if (result1.length > 0) {
                  req.body.reserved_date =  new Date();
                  connection.query('UPDATE `reservations` SET ? WHERE `id` = ?', [req.body, result1[0].id], (err) => {
                      if (err) {
                        next(err);
                        return;
                      }
                      res.json({"success" : "This diamond is on reserved"});
                  });
                }
                else {
                  connection.query('INSERT INTO `reservations` SET ?', req.body, (err, result) => {
                      if (err) {
                        next(err);
                        return;
                      }
                    res.json({"success" : "This diamond is on reserved by admin"});
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
         res.json({"fail" : "This diamond is already reserved"});
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
                  res.json({"success" : "This diamond is on pending"});
              });
            }
            else {
              connection.query('INSERT INTO `reservations` SET ?', req.body, (err, result) => {
                  if (err) {
                    next(err);
                    return;
                  }
                res.json({"success" : "This diamond is on pending"});
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
    res.json({"success" : "This diamond is on rejected"});
  });
}



exports.cancelReserve = (req, res, next) => {

  connection.query('DELETE FROM `reservations` WHERE `diamond_id` = ?', req.body.diamond_id, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"success":"The reservation is cancelled"});
  });

}



















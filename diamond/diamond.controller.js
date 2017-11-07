

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../db-connect')


exports.getDiamonds = (req, res, next) => {


  connection.query('SELECT is_admin FROM `users` WHERE `id` = ?', req.query.user_id, (err, result) => {
    
      if (err) {
        next(err);
        return;
      }
      if (!results.length) {
        res.json({code: 404, message: 'Not found'});
        return;
      }
      var is_admin = result[0].is_admin;
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
                        IFNULL(B.is_reserved, 0) as total_reserved,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  diamonds A
                       LEFT JOIN
                          (SELECT diamond_id,
                                  COUNT(user_id) as is_reserved
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
                           on A.vendo_number = C.diamond_id`;


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
                        A.lab,
                        A.polish,
                        A.symmetry,
                        A.certificate_image,
                        A.depth,
                        IFNULL(B.is_reserved, 0) as total_reserved,
                        C.state as user_state,
                        C.reserved_date as user_reserved_date,
                        C.reject_reason as user_reject_reason            

                 FROM  diamonds A
                       LEFT JOIN
                          (SELECT diamond_id,
                                  COUNT(user_id) as is_reserved
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
                 WHERE (B.is_reserved IS NULL) OR (C.state IS NOT NULL)`;


          connection.query(sql, req.query.user_id, (err, results) => {
              if (err) {
                next(err);
                return;
              }
              res.json(results);
          });
      }

  });
}


function searchCoins (query, userId, cb) {

  var whereClause = buildConditions(query, userId);  
  var orderByClause = buildOrder(query);

  var sql = 
   `SELECT  A.*, 
            B.roll_bias, 
            B.pitch_bias, 
            B.max_norm,
            G.company_name as cert_company,
            H.company_name as additional_cert_company,
            I.name as denomination,
            I.composition,
            CONCAT(J.first_name, " ", J.last_name) as user_name,
            K.numeric_grade, 
            K.common_grade,
            IFNULL(D.favorites_count, 0) as favorites_count,
            IFNULL(E.likes_count, 0) as likes_count,
            IFNULL(L.comments_count, 0) as comments_count,
            IFNULL(M.favorites_count, 0) as my_favorited,
            IFNULL(N.likes_count, 0) as my_liked,
            O.last_visit_date as last_visit_date
    FROM  collectibles A
          LEFT JOIN 
              coin_angular_methods B
              ON A.angular_method_id = B.id
          LEFT JOIN 
              collectible_grades C
              on A.grade_id = C.id
          LEFT JOIN 
              (SELECT collectible_id,
                      COUNT(user_id) as favorites_count
               FROM user_favorites
               GROUP BY collectible_id) as D
               on A.id = D.collectible_id
          LEFT JOIN 
              (SELECT collectible_id,
                      COUNT(user_id) as likes_count
               FROM user_collectible_likes
               GROUP BY collectible_id) as E
               on A.id = E.collectible_id
          LEFT JOIN 
              (SELECT collectible_id,
                      COUNT(id) as comments_count
               FROM user_comments
               GROUP BY collectible_id) as L
               on A.id = L.collectible_id             
          LEFT JOIN 
              (SELECT collectible_id,
                      COUNT(created_date) as visits
               FROM user_collectible_visits
               GROUP BY collectible_id) as F
               on A.id = F.collectible_id
          LEFT JOIN coin_cert_companies G
                ON A.cert_company_id = G.id
          LEFT JOIN coin_cert_companies H
                ON A.additional_cert_company_id = H.id
          LEFT JOIN coin_subcategory I
                ON A.denomination_id = I.id 
          LEFT JOIN users J
                ON A.user_id = J.id  
          LEFT JOIN collectible_grades K
                ON A.grade_id = K.id  
          LEFT JOIN 
              (SELECT collectible_id,
                      COUNT(user_id) as favorites_count
               FROM user_favorites
               WHERE user_id = ?
               GROUP BY collectible_id) as M
                 on A.id = M.collectible_id
          LEFT JOIN 
              (SELECT collectible_id,
                      COUNT(user_id) as likes_count
               FROM user_collectible_likes
               WHERE user_id = ?
               GROUP BY collectible_id) as N
                on A.id = N.collectible_id     
          LEFT JOIN
              (SELECT collectible_id,
                      MAX(created_date) as last_visit_date
               FROM user_collectible_visits
               WHERE user_id = ?
               GROUP BY collectible_id) as O
               on A.id = O.collectible_id  
    WHERE ` + whereClause.where + 
    ' ORDER BY ' + orderByClause;

    console.log(sql);
    console.log(whereClause.values);

  connection.query(sql, [userId, userId, userId, whereClause.values], (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      // console.log(results);
      cb(null, results);
  });
}




function buildConditions(query, userId) {

  var conditions = [];
  var values = [];
  var conditionsStr;

  var catalog = query.catalog;
  console.log(catalog);

  if (catalog == 'marketplace_coins'){
    conditions.push("A.for_sale = 1");
  
  } else if (catalog == 'my_coins'){
    conditions.push("A.user_id = ?");
    values.push(userId);
  
  } else if (catalog == 'my_favorites'){
    var favoriteWhere = `A.id IN (SELECT DISTINCT collectible_id
                                  FROM user_favorites
                                  WHERE user_id = ?)`;
    conditions.push(favoriteWhere);
    values.push(userId);
  
  }  else if (catalog == 'recently_viewed'){
    var visitWhere = `A.id IN (SELECT DISTINCT collectible_id
                                  FROM user_collectible_visits
                                  WHERE user_id = ?)`;
    conditions.push(visitWhere);
    values.push(userId);
  }

  if (typeof query.search_key !== 'undefined') {
    conditions.push("A.description LIKE '%" + query.search_key + "%'");
  }

  if (typeof query.main_category_id !== 'undefined') {
    var denominationWhere = `A.denomination_id IN (SELECT DISTINCT id
                                                    FROM coin_subcategory
                                                    WHERE main_category_id = ` + query.main_category_id + `)`;
    conditions.push(denominationWhere);
  }

  if (typeof query.min_grade !== 'undefined') {
    conditions.push("C.numeric_grade >= " + parseInt(query.min_grade));
  }

  if (typeof query.max_grade !== 'undefined') {
    conditions.push("C.numeric_grade <= " + parseInt(query.max_grade));
  }

  if (typeof query.year !== 'undefined') {
    conditions.push("A.year = " + query.year);
  }

  if (typeof query.grading_company_id !== 'undefined') {
    if (query.grading_company_id < 5) {
        conditions.push("A.cert_company_id = " + query.grading_company_id);
    } else { // none/other
        conditions.push("(A.cert_company_id > 4 OR A.cert_company_id IS NULL)");
    }
  }

  if (typeof query.min_price !== 'undefined') {
    conditions.push("A.price >= " + parseInt(query.min_price));
  }

  if (typeof query.max_price !== 'undefined') {
    conditions.push("A.price <= " + parseInt(query.max_price));
  }

  return {
    where: conditions.length ?
             conditions.join(' AND ') : '1',
    values: values
  };
}



function buildOrder(query) {

  var orderString;

  if (query.catalog == 'recently_viewed'){
    console.log(query.catalog);
    orderString = 'O.last_visit_date DESC, A.denomination_value, A.year';
    return orderString;
  }

  var sortKey = query.sort_key;
  console.log(sortKey);

  if (sortKey == 'addition_recent') {
    orderString = 'A.created_date DESC, A.denomination_value, A.year';
  
  } else if (sortKey == 'addition_oldest') {
    orderString = 'A.created_date ASC, A.denomination_value, A.year';
  
  } else if (sortKey == 'most_views') {
    orderString = 'F.visits DESC, A.denomination_value, A.year';

  } else if (sortKey == 'most_favorited') {
    orderString = 'D.favorites_count DESC, A.denomination_value, A.year';

  } else if (sortKey == 'most_liked') {
    orderString = 'E.likes_count DESC, A.denomination_value, A.year';

  } else if (sortKey == 'mint_oldest') {
    orderString = 'A.year ASC, A.denomination_value, A.year';

  } else if (sortKey == 'mint_recent') {
    orderString = 'A.year DESC, A.denomination_value';

  } else if (sortKey == 'grade_lowest') {
    orderString = 'C.numeric_grade ASC, A.denomination_value, A.year';
  
  } else if (sortKey == 'grade_highest') {
    orderString = 'C.numeric_grade DESC, A.denomination_value, A.year';

  } else if (sortKey == 'price_lowest') {
    orderString = 'A.price ASC, A.denomination_value, A.year';

  } else if (sortKey == 'price_highest') {
    orderString = 'A.price DESC, A.denomination_value, A.year';

  } else if (sortKey == 'visit_recent') {
    orderString = 'A.price DESC, A.denomination_value, A.year';

  } else {
    orderString = 'A.denomination_value, A.year, C.numeric_grade DESC';
  } 
  return orderString;
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


exports.getDiamond = (req, res, next) => {

  readDiamond(req.params.id, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    console.log(entity);
    res.json(entity);

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
      readDiamond(req.params.id, (err, entity) => {
        if (err) {
          next(err);
          return;
        }
        res.json(entity);
      });
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
        cb({
          code: 404,
          message: 'Not found'
        });
        return;
      }
      cb(null, results[0]);
    });
}









// Cron job
var CronJob = require('cron').CronJob;
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db-connect')
const request = require('request');
const csvParser = require('csv-parse');

var job = new CronJob('00 * * * * *', function() {
     console.log('job started');
     console.log(new Date());
     updateCSV();
  }, function () {
  	 console.log('job stopped'); 
  },
  true,
  'America/Los_Angeles' 
);

function updateCSV() {
  
  console.log('Start pulling data...');

  request('https://s3.amazonaws.com/diamondreserve-userfiles-mobilehub-952888115/uploads', function (error, response, body) {
    if (error) {
      console.log(error);
      return;
    }
    csvParser(body, {
      delimiter: ','
    }, function(err, data) {
      if (err) {
        console.log(err);
        return;
      } 
        connection.query('DELETE FROM `diamonds1` WHERE 1', (err) => {
          if (err) {
            console.log(err);
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
                      'fluorescence_color',
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
          var header = data.splice(0, 1);

          connection.query(sql, [data], (err1, result) => {
              if (err1) {
                console.log(err1);
                return;
              }
            console.log(data);
          });

        });

      });
  });

} 


module.exports.job = job
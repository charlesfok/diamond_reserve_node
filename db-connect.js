'use strict';

const express = require('express');
const config = require('./config');
const mysql = require('mysql');

const options = {
  user: 'sql9204835',
  password: 'kg7xSZzhJ3',
  database: 'sql9204835',
  host: 'sql3.freesqldatabase.com',
  port: 3306
};



const connection = mysql.createConnection(options);
console.log('Connect created');

module.exports = connection;
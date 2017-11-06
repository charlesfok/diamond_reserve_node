'use strict';

const express = require('express');
const config = require('./config');
const mysql = require('mysql');

const options = {
  user: 'sql3203367',
  password: 'pmXihvmHrA',
  database: 'sql3203367',
  host: 'sql3.freesqldatabase.com',
  port: 3306
};



const connection = mysql.createConnection(options);
console.log('Connect created');

module.exports = connection;
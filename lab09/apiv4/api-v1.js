const express = require('express');
const api = express.Router();

api.get('/revision', function(req, res) {
  res.status(200).json({'api':'version 1'});
});

module.exports = api;

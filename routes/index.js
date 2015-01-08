var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/localhost/g3/views/', function(req, res) {
  res.render('index', { title: 'Rules Builder' });
});

/**
 * Send partial, or 404 if it doesn't exist
 */
router.get('/partials/*', function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      res.send(404);
    } else {
      res.send(html);
    }
  });
});

module.exports = router;

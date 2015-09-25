var express = require('express');
var router = express.Router();
var pool = require('../config/Postgres').pool;
var instagram = require('../api/Instagram');
var moment = require('moment');
var async = require('async');

const ERROR_MESSAGE = "Error fetching data";
const dateFormat = "MM-DD-YYYY";

/* GET users listing. */
router.get('/tagsearch/:tag', function(req, res) {

  var startDate = moment(req.query.startDate, dateFormat);
  var endDate = moment(req.query.endDate, dateFormat);
  if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate) || endDate.isSame(startDate)) {
    return res.status(400).send("Invalid date(s)");
  }

  console.log(req.params.tag);
  console.log(req.query.startDate);
  console.log(req.query.endDate);

  var query = "SELECT CREATED_TIME FROM TAGS JOIN MEDIA ON TAGS.ID = MEDIA.TAG_ID" +
    " WHERE NAME = $1 AND START_DATE = $2 AND END_DATE = $3 ORDER BY CREATED_TIME DESC";
  var queryParams = [req.params.tag, startDate.unix(), endDate.unix()];
  pool.query(query, queryParams, function(err, result) {
    if (err) {
      console.error('error running query', err);
      return res.status(500).send(err);
    } else if (result.rows == 0) {

      async.parallel({
        min_tag_id: function(callback) {
          instagram.getTagIdFromDate(startDate.unix(), callback);
        },
        max_tag_id: function(callback) {
          instagram.getTagIdFromDate(endDate.unix(), callback);
        }
      }, function(error, results) {
        if(error) {
          res.send(error);
        } else {
          instagram.getWithTagIds(req.params.tag, results.min_tag_id, results.max_tag_id, function(err, result) {
            if (err)
              return res.send(ERROR_MESSAGE)
            else
              return res.send(result.data);
          });
        }
      });

    } else {
      return res.status(200).send(result);
    }
  });
});

module.exports = router;

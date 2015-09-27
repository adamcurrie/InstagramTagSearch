var express = require('express');
var router = express.Router();
var pool = require('../config/Postgres').pool;
var begin = require('any-db-transaction');
var Instagram = require('../api/Instagram');
var moment = require('moment');
var async = require('async');
var Tags = require('../models/Tag');
var Media = require('../models/Media');
var _ = require('lodash');

const ERROR_MESSAGE = "Unable to process request";
const dateFormat = "MM-DD-YYYY";
const QUERY_LIMIT = 20;

router.get('/tagsearch/:tag', function(req, res) {

  var startDate = moment(req.query.startDate, dateFormat);
  var endDate = moment(req.query.endDate, dateFormat);
  if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate) || endDate.isSame(startDate)) {
    return res.status(400).send("Invalid date(s)");
  }

  const startDateUnix = startDate.unix();
  const endDateUnix = endDate.unix();
  const offset = parseInt(req.query.offset, 10);
  const queryOffset = _.isFinite(offset) && offset > 0 ? offset : 0;

  Tags.get(req.params.tag, startDateUnix, endDateUnix, function(tagsError, tagData) {
    if (tagsError) {
      return res.status(400).send(ERROR_MESSAGE);
    } else if (tagData == null) {
      getNewInstagramMedia(startDateUnix, endDateUnix, req.params.tag, function(err, results) {
        if (err) {
          return res.send(ERROR_MESSAGE);
        } else {
          return res.send(results);
        }
      });
    } else {
      Media.get(tagData.id, QUERY_LIMIT, queryOffset, function(mediaError, mediaList) {
        if (mediaError) {
          return res.status(400).send(ERROR_MESSAGE);
        } else if (mediaList.length == 0){
          getMoreInstagramMedia(req.params.tag, tagData.id, tagData.min_tag_id, tagData.max_tag_id, function(err, results) {
            if (err) {
              return res.send(ERROR_MESSAGE);
            } else {
              return res.send(results);
            }
          });
        } else {
          return res.send(mediaList);
        }
      });
    }
  });
});

/**
 * Gets Instagram media and adds media entries to the existing media entries
 * @param tag
 * @param tagId
 * @param minTagId
 * @param maxTagId
 * @param cb
 */
function getMoreInstagramMedia(tag, tagId, minTagId, maxTagId, cb) {
  Instagram.getWithTagIds(tag, minTagId, maxTagId, function(instagramError, instagramData) {
    if (instagramError) {
      return cb(ERROR_MESSAGE, null);
    } else {
      var txn = begin(pool);
      async.series([
        function(callback) {
          Media.create(tagId, instagramData.data, callback, txn);
        },
        function(callback) {
          Tags.update(txn, tagId, instagramData.maxTagId, callback);
        }
      ], function(txnError, results) {
        if (txnError) {
          txn.rollback();
          return cb(ERROR_MESSAGE, null);
        } else {
          txn.commit();
          return cb(null, instagramData.data)
        }
      });
    }
  });
}

/**
 * Gets Instagram media and creates a Tag in the DB and corresponding media entries
 * @param startDateUnix
 * @param endDateUnix
 * @param tag
 * @param cb
 */
function getNewInstagramMedia(startDateUnix, endDateUnix, tag, cb) {
  async.parallel({
    min_tag_id: function(callback) {
      Instagram.getTagIdFromDate(startDateUnix, callback);
    },
    max_tag_id: function(callback) {
      Instagram.getTagIdFromDate(endDateUnix, callback);
    }
  }, function(tagIdError, tagIdResults) {
    if (tagIdError) {
      return cb(ERROR_MESSAGE, null);
    } else {
      Instagram.getWithTagIds(tag, tagIdResults.min_tag_id, tagIdResults.max_tag_id, function(instagramError, instagramData) {
        if (instagramError) {
          return cb(ERROR_MESSAGE, null);
        } else {
          var txn = begin(pool);
          async.waterfall([
            function(callback) {
              Tags.create(tag, startDateUnix, endDateUnix, instagramData.minTagId, instagramData.maxTagId, callback, txn);
            },
            function(id, callback) {
              Media.create(id, instagramData.data, callback, txn);
            }
          ], function(txnError, txnResults) {
            if (txnError) {
              txn.rollback();
              return cb(ERROR_MESSAGE, null);
            } else {
              txn.commit();
              return cb(null, instagramData.data);
            }
          });
        }
      });
    }
  });
}

module.exports = router;

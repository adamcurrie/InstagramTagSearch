var pool = require('../config/Postgres').pool;
var vsprintf = require("sprintf-js").vsprintf;
var _ = require('lodash');

const INSERT_QUERY = "INSERT INTO MEDIA (TAG_ID, CREATED_TIME, MEDIA_TYPE, MEDIA_URL, INSTAGRAM_URL, USERNAME) VALUES " +
  "($1, $2, $3, $4, $5, $6)";
const INSERT_QUERY_PARAMS = ", ($%d, $%d, $%d, $%d, $%d, $%d)";
const SELECT_QUERY = "SELECT MEDIA_TYPE, MEDIA_URL, INSTAGRAM_URL, USERNAME FROM MEDIA WHERE TAG_ID = $1 ORDER BY CREATED_TIME LIMIT $2 OFFSET $3";

/**
 * Creates a Media entry in the DB
 * @param tagId
 * @param dataList
 * @param callback
 * @param txn (optional) Use DB Transaction
 */
exports.create = function(tagId, dataList, callback, txn) {
  if (dataList.length > 0) {
    var params = [];
    dataList.forEach(function(data) {
      params.push(tagId);
      params.push(data.createdTime);
      params.push(data.mediaType);
      params.push(data.media_url);
      params.push(data.instagram_url);
      params.push(data.username);
    });

    var query = INSERT_QUERY;
    var paramCount = 7;
    for (var i = 0; i < dataList.length - 1; i++, paramCount += 6) {
      query += vsprintf(INSERT_QUERY_PARAMS, _.range(paramCount, paramCount + 6));
    }

    if (txn) {
      txn.query(query, params, function(err, result) {
        if (err) {
          console.error(query);
          console.error(params);
          console.error(err);
          callback(err, null);
        } else {
          callback(null, dataList);
        }
      });
    } else {
      pool.query(query, params, function(err, result) {
        if (err) {
          console.error(query);
          console.error(params);
          console.error(err);
          callback(err, null);
        } else {
          callback(null, dataList);
        }
      });
    }
  } else {
    callback("No elements to insert", null);
  }
}

/**
 * Gets Media given a tagId, limit, and offset
 * @param tagId
 * @param limit
 * @param offset
 * @param callback
 */
exports.get = function(tagId, limit, offset, callback) {
  const params = [tagId, limit, offset];
  pool.query(SELECT_QUERY, params, function(err, result) {
    if (err) {
      console.error(query);
      console.error(params);
      console.error(err);
      callback(err, null);
    } else {
      callback(null, result.rows);
    }
  });
}
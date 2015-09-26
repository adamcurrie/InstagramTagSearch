var pool = require('../config/Postgres').pool;

const INSERT_QUERY = "INSERT INTO TAGS (NAME, START_DATE, END_DATE, MIN_TAG_ID, MAX_TAG_ID) VALUES ($1, $2, $3, $4, $5) RETURNING ID";
const SELECT_QUERY = "SELECT ID, MIN_TAG_ID, MAX_TAG_ID FROM TAGS WHERE NAME = $1 AND START_DATE = $2 AND END_DATE = $3";
const UPDATE_QUERY = "UPDATE TAGS SET MAX_TAG_ID = $1 WHERE ID = $2";

/**
 * Creates the Tag entry in the DB
 * @param name
 * @param startDate
 * @param endDate
 * @param minTagId
 * @param maxTagId
 * @param callback
 * @param txn (optional) Use DB Transaction
 */
exports.create = function(name, startDate, endDate, minTagId, maxTagId, callback, txn) {
  const params = [name, startDate, endDate, minTagId, maxTagId];
  if (txn) {
    txn.query(INSERT_QUERY, params, function(err, result) {
      if (err) {
        console.error(INSERT_QUERY);
        console.error(params)
        console.error(err);
        callback(err, null);
      } else {
        callback(null, result.rows[0].id);
      }
    });
  } else {
    pool.query(INSERT_QUERY, params, function(err, result) {
      if (err) {
        console.error(INSERT_QUERY);
        console.error(params);
        console.error(err);
        callback(err, null);
      } else {
        callback(null, result.rows[0].id);
      }
    });
  }
}

/**
 * Gets the Id given the tag name, start date, and end date
 * @param name
 * @param startDate
 * @param endDate
 * @param callback
 */
exports.get = function(name, startDate, endDate, callback) {
  const params = [name, startDate, endDate];
  pool.query(SELECT_QUERY, params, function(err, result) {
    if (err) {
      console.error(INSERT_QUERY);
      console.error(params);
      console.error(err);
      callback(err, null);
    } else if (result.rows.length == 0) {
      callback(null, null);
    } else {
      callback(null, result.rows[0]);
    }
  })
}

/**
 * Updates max_tag_id
 * @param tagId
 * @param maxTagId
 * @param callback
 */
exports.update = function(txn, tagId, maxTagId, callback) {
  const params = [maxTagId, tagId];
  txn.query(UPDATE_QUERY, params, function(txnError, results) {
    if (txnError) {
      callback(txnError, null);
    } else {
      callback(null, null);
    }
  });
}
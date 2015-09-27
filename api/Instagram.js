var request = require('request');
var _ = require('lodash');
var sprintf = require("sprintf-js").sprintf;

const BASE_URI = 'https://api.instagram.com';
const CLIENT_ID_PARAM = 'client_id=' + process.env.INSTAGRAM_CLIENT_ID;
const ERROR_MESSAGE = "Error fetching data";

const TAG_ID_FROM_DATE_URL = BASE_URI + '/v1/users/992911/media/recent?max_timestamp=%s&count=1&' + CLIENT_ID_PARAM;
const TAG_URL = BASE_URI + '/v1/tags/%s/media/recent?max_tag_id=%s&min_tag_id=%s&' + CLIENT_ID_PARAM;

exports.getTagIdFromDate = function(timestamp, callback) {

  const url = sprintf(TAG_ID_FROM_DATE_URL, timestamp);

  request.get(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      const tagId = json.pagination.next_max_id.split('_')[0];
      callback(null, tagId);
    } else {
      callback(ERROR_MESSAGE, null);
    }
  });
}

exports.getWithTagIds = function(tag, minTagId, maxTagId, callback) {

  const url = sprintf(TAG_URL, tag, maxTagId, minTagId);
  console.log(url);

  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      var result = {};

      result.data = _.map(json.data, function parseMediaData(data) {
        const hashtag = '#' + tag.toLowerCase();
        var instance = {};
        instance.mediaType = data.type;
        if (instance.mediaType == 'image') {
          instance.media_url = data.images.standard_resolution.url;
        } else {
          instance.media_url = data.videos.standard_resolution.url;
        }
        instance.username = data.user.username;
        instance.instagram_url = data.link;

        if (data.caption.text.toLowerCase().indexOf(hashtag) != -1) {
          instance.createdTime = data.caption.created_time;
        } else {
          for (var i = 0; i < data.comments.data.length; i++) {
            if (data.comments.data[i].text.toLowerCase().indexOf(hashtag) != -1) {
              instance.createdTime = data.comments.data[i].created_time;
              break;
            }
          }
        }
        return instance;
      });
      result.maxTagId = json.pagination.next_max_tag_id;
      result.minTagId = minTagId;
      callback(null, result);
    } else {
      callback(ERROR_MESSAGE, null);
    }
  });
}


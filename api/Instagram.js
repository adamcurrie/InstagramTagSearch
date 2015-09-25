var request = require('request');
var _ = require('lodash');

const base_uri = 'https://api.instagram.com';
const client_id_param = 'client_id=' + process.env.INSTAGRAM_CLIENT_ID;
const ERROR_MESSAGE = "Error fetching data";

exports.getTagIdFromDate = function(timestamp, callback) {

  const url = base_uri + '/v1/users/992911/media/recent?max_timestamp=' + timestamp +
    '&count=1&' + client_id_param;

  request.get(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      const tagId = json.data[0].id.split('_')[0];
      callback(null, tagId);
    } else {
      callback(ERROR_MESSAGE, null);
    }
  });
}


exports.getWithTagIds = function(tag, minTagId, maxTagId, callback) {

  const url = base_uri + '/v1/tags/' + tag + '/media/recent?' +
      client_id_param + '&max_tag_id=' + maxTagId + '&min_tag_id=' + minTagId;

  console.log(url);

  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      console.log(json);

      var result = {};
      result.data = _.map(json.data, function parseMediaData(data) {
        var result = {};
        result.mediaType = data.type;
        if (result.mediaType == 'image') {
          result.mediaURL = data.images.standard_resolution.url;
        } else {
          result.mediaURL = data.videos.standard_resolution.url;
        }
        result.username = data.user.username;
        result.instagramURL = data.link;

        if (_.contains(data.tags, tag)) {
          result.createdTime = data.created_time;
        } else {
          for (var i = 0; i < data.comments.count; i++) {
            if (_.contains(data.comments.data[i].text, tag)) {
              result.createdTime = data.comments.data[i].text;
              break;
            }
          }
        }
        return result;
      });
      result.nextMagTagId = json.next_max_tag_id;
      callback(null, result);
    } else {
      callback(ERROR_MESSAGE, null);
    }
  });
}


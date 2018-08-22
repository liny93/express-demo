/**
 * @author liny
 * @version 0.1
 * @param {Response} res response响应对象
 * @param {Integer} status 状态码
 * @param {Object}  data 数据
 * @param {String} message 文字描述
 * @return {Object} obj 返回json数据
 */
function resJson(res, status, data, message) {
  const jsonObj = {};
  const arr = Array.prototype.slice.apply(arguments);
  const len = arr.length;
  const httpStatus = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
  };
  if (len == 1) {
    status = 500;
  } else if (len == 2) {
    status = 200;
    data = arr[1];
  } else if (len == 3) {
    if (status == 200) {
      data = arr[2];
    } else {
      message = arr[2];
      data = {};
    }
  }
  jsonObj.code = +status;
  jsonObj.data = data || {};
  jsonObj.msg = message || httpStatus[status] || '';
  if (res && res.json) {
    res.json(jsonObj);
  } else {
    return jsonObj;
  }
}

module.exports = resJson;

/**
 * @author wwl
 * @version 0.1
 * @param {res} response响应对象
 * @param {status} 状态码
 * @param {data}  数据
 * @param {message} 文字描述
 * @return {obj} 返回json数据
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
    // console.log('res参数有误!');
    return jsonObj;
  }
}

module.exports = resJson;

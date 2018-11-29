function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber1(n) {
  n = n.toString()
  return n[0]!=='0' ? n : n[1];
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatNumber1:formatNumber1
};
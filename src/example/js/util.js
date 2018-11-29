function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

function showModal(content,callback) {
  wx.showModal({
    title: '提示',
    content: content,
    success: function(res) {
      if (res.confirm) {
        callback.confirm(res);
      } else{
        callback.cancel(res);
      }
    }
  })
}

module.exports = {
  json2Form: json2Form,
  showModal:showModal
}
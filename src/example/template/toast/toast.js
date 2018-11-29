"use strict";

function toast(params) {
  var that = getCurrentPages()[getCurrentPages().length - 1];
  setTimeout(function () {
    that.setData({
      toast: {
        show: false
      }
    });
  }, params.duration || 3000);
  that.setData({
    toast: {
      show: params.show,
      content: params.content
    }
  });
}

module.exports = {
  toast: toast
};
//# sourceMappingURL=toast.js.map

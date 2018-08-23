//app.js
const wxApiPromise = require('./utils/wx.api.promise.js');

App({
    onLaunch: function () {
        wxApiPromise
            .login()
            .then(result => {
                console.log(result)
            })

    }
})
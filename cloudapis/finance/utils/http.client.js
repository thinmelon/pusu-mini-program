const HTTP = require('http');
const QUERY_STRING = require('querystring');

/**
 *      GET 请求
 */
function get(url, callback) {
    console.log('http.get ==> ' + url);
    HTTP.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            callback(data)
        });
    }).on('error', (error) => {
        callback(error)
    });
}

function getPromisify(url) {
    console.log('http.getPromisify ==> ' + url);
    return new Promise((resolve, reject) => {
        HTTP.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data)
            });
        }).on('error', (error) => {
            reject(error)
        });
    })
}

function postPromisify(host, port, path, data) {
    console.log('http.postPromisify ==> ', host, port, path);
    const postData = QUERY_STRING.stringify(data);
    const options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = HTTP.request(options, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data);
            });
        }).on('error', (error) => {
            reject(error)
        });
        req.write(postData);
        req.end();
    })
}

module.exports = {
    get,
    getPromisify,
    postPromisify
}
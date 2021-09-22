//import modules
const http = require('http'),
    fs = require('fs'),
    url = require('url');

http.createServer((request, response) => {
    let addr = request.url,
        q = url.parse(addr, true),
        filePath = '';

    //logs request URL and timestamp to log.txt
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    //if URL contains 'documentation', returns documentation.html to user; otherwise index.html 
    if (q.pathname.includes('documentation')) {
        filePath = (_dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    });
}).listen(8080);

console.log('My test server is running Port 8080.');
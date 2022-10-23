const fs = require("fs");

const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
    proxyTimeout: 500
});

const hosts = JSON.parse(fs.readFileSync("hosts.json"));
const httpHosts = hosts["http"];
const httpsHosts = hosts["https"];
console.log(hosts);

proxy.on("error", function (err, req, res) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("System unavailable: " + err);
});

http.createServer(
    function (req, res) {
        try {
            const host = req.headers["host"];
            console.log(host);
            for (let h of httpHosts) {
                if (h["host"] == host) {
                    proxy.web(req, res, {
                        target: h["target"]
                        // no ssl
                    });
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }
).listen(63000);
console.log("Proxy started on port 63000");

console.log(fs.readFileSync('/etc/letsencrypt/live/www.vocabulum.de/privkey.pem', 'utf8'));
console.log(fs.readFileSync('/etc/letsencrypt/live/www.vocabulum.de/cert.pem', 'utf8'));

http.createServer(
    function (req, res) {
        try {
            const host = req.headers["host"];
            console.log(host);
            for (let h of httpsHosts) {
                if (h["host"] == host) {
                    proxy.web(req, res, {
                        target: h["target"],
                        ssl: {
                            key: fs.readFileSync('/etc/letsencrypt/live/www.vocabulum.de/privkey.pem', 'utf8'),
                            cert: fs.readFileSync('/etc/letsencrypt/live/www.vocabulum.de/cert.pem', 'utf8')
                        }
                    });
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }
).listen(62000);
console.log("Proxy (https) started on port 62000");
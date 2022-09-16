const fs = require("fs");

const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
    proxyTimeout: 500
});

const hosts = JSON.parse(fs.readFileSync("hosts.json"));
console.log(hosts);

proxy.on("error", function (err, req, res) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("System unavailable: " + err);
});

http.createServer(function(req, res) {
    try {
        const host = req.headers["host"];
        console.log(host);
        for (let h of hosts) {
            if (h["host"] == host) {
                proxy.web(req, res, {target: h["target"]});
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}).listen(63000);
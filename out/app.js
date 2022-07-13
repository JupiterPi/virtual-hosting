const fs = require("fs");
const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const hosts = JSON.parse(fs.readFileSync("hosts.json"));
console.log(hosts);
http.createServer(function (req, res) {
    const host = req.headers["host"];
    for (let h of hosts) {
        if (h["host"] == host) {
            proxy.web(req, res, { target: h["target"] });
        }
    }
}).listen(80);
//# sourceMappingURL=app.js.map
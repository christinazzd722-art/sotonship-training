const http = require("http");

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === "/") {
        res.end("Hello from IdeaSpark backend!");
    }

    else if (req.url === "/api/idea" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            const data = JSON.parse(body);

            console.log("Received idea:", data.idea);

            res.end("Backend received: " + data.idea);
        });
            }

    else {
        res.statusCode = 404;
        res.end("Not found");
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
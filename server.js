const http = require("http");
const { loadEnvFile } = require("node:process");

loadEnvFile();

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

        req.on("end", async () => {
            const data = JSON.parse(body);

            console.log("Received idea:", data.idea);

            const response = await openai.responses.create({
                model: "gpt-5.6-luna",
                input: `Turn this rough idea into a clear, buildable project idea.

                User idea: ${data.idea}

                Return ONLY a valid JSON object with these fields:
                - projectName: a short project name
                - description: what the project does
                - features: an array of exactly 3 key features
                - audience: who the project is for

                Do not include Markdown or explanations outside the JSON.`
            });

            res.end(response.output_text);
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
import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(async (req, res) => {
  const target = "https://flashchat13.base44.app" + req.originalUrl;

  const response = await fetch(target, {
    method: req.method,
    headers: {
      ...req.headers,
      host: "flashchat13.base44.app"
    },
    body: req.method === "GET" ? undefined : req.body
  });

  const body = await response.text();
  res.send(body);
});

app.listen(3000);

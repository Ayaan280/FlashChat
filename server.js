import express from "express";
import fetch from "node-fetch";

const app = express();

// Needed for POST bodies (Firebase, login, etc.)
app.use(express.raw({ type: "*/*" }));

app.use(async (req, res) => {
  try {
    const target = "https://flashchat13.base44.app" + req.originalUrl;

    const hasBody = !["GET", "HEAD"].includes(req.method);

    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        ...req.headers,
        host: "flashchat13.base44.app"
      },
      body: hasBody ? req.body : undefined
    });

    // Copy status
    res.status(upstream.status);

    // Copy headers EXACTLY
    upstream.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send raw buffer (fixes MIME issues)
    const buffer = await upstream.buffer();
    res.send(buffer);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
});

app.listen(process.env.PORT || 3000);

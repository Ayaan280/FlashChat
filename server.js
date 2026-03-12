import express from "express";
import fetch from "node-fetch";

const app = express();

// Accept all raw bodies (needed for POST, Firebase, etc.)
app.use(express.raw({ type: "*/*" }));

app.use(async (req, res) => {
  try {
    const target = "https://flashchat13.base44.app" + req.originalUrl;

    // Only include body for non-GET/HEAD requests
    const hasBody = !["GET", "HEAD"].includes(req.method);

    const response = await fetch(target, {
      method: req.method,
      headers: {
        ...req.headers,
        host: "flashchat13.base44.app"
      },
      body: hasBody ? req.body : undefined
    });

    // Copy status + headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send binary-safe response
    const body = await response.buffer();
    res.send(body);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
});

app.listen(process.env.PORT || 3000);

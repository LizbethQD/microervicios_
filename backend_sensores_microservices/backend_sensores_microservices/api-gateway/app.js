const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

// Ruta base
app.get("/", (req, res) => {
  res.json({ message: "API Gateway funcionando correctamente" });
});

// Proxy para Auth Service
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  })
);

// Proxy para Sensors Service
app.use(
  "/sensors",
  createProxyMiddleware({
    target: "http://sensors-service:3002",
    changeOrigin: true,
    pathRewrite: { "^/sensors": "" },
  })
);

// Proxy para Catalog Service
app.use(
  "/catalog",
  createProxyMiddleware({
    target: "http://catalog-service:3004",
    changeOrigin: true,
    pathRewrite: { "^/catalog": "" },
  })
);

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});

module.exports = app;
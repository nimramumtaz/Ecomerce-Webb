const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const productsRouter = require("./routes/products.routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parse JSON request bodies

// Simple welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-Commerce RESTful API is running",
    endpoints: {
      rest: "/api/v1/products",
      graphql: "/graphql",
    },
  });
});

// REST routes
app.use("/api/v1/products", productsRouter);

// GraphQL endpoint (over-fetching solution)
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // opens a browser UI at /graphql for easy testing
  })
);

// 404 handler for unknown routes -> must come after all real routes
app.use(notFoundHandler);

// Centralized error handler -> must be LAST
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`GraphQL Playground at http://localhost:${PORT}/graphql`);
});

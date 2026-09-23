# E-Commerce RESTful API + GraphQL (AWT Lab 03)

A local Node.js/Express API for an e-commerce product catalog. Built to follow
proper REST principles, standardized error handling, and a GraphQL endpoint
to solve the classic REST **over-fetching** problem.

## 📦 What's inside

- **RESTful Product API** — `/api/v1/products` (GET, POST, PUT, DELETE)
- **Idempotent PUT** — calling update repeatedly with the same data never
  corrupts state (fixes the "duplicate order on retry" problem)
- **Filtering & Pagination** — `?category=electronics&limit=5&page=1`
- **Field Selection** — `?fields=title,price` (lightweight over-fetching fix)
- **GraphQL endpoint** — `/graphql` (full over-fetching fix — client asks for
  exactly the fields it needs)
- **Standardized JSON errors** — every error returns `error_code`, `message`,
  `timestamp`

## 🛠 Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

Server runs at: **http://localhost:3000**
GraphQL Playground (GraphiQL UI): **http://localhost:3000/graphql**

## 📚 API Endpoints

### REST — Products

| Method | Endpoint                          | Description                          |
|--------|------------------------------------|---------------------------------------|
| GET    | `/api/v1/products`                 | List all products (supports filters) |
| GET    | `/api/v1/products/:id`             | Get a single product                 |
| POST   | `/api/v1/products`                 | Create a new product                 |
| PUT    | `/api/v1/products/:id`             | Update a product (idempotent)        |
| DELETE | `/api/v1/products/:id`             | Delete a product                     |

**Query parameters (GET list):**
- `category=electronics` — filter by category
- `limit=5&page=1` — pagination
- `fields=title,price` — return only these fields (over-fetching fix)

### Example requests

```bash
# Get all products, 2 per page
curl "http://localhost:3000/api/v1/products?limit=2"

# Get only title & price of product 1 (no over-fetching)
curl "http://localhost:3000/api/v1/products/1?fields=title,price"

# Filter electronics category
curl "http://localhost:3000/api/v1/products?category=electronics"

# Create a product
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"title":"New Item","price":1200,"category":"electronics"}'

# Update a product (idempotent — safe to repeat)
curl -X PUT http://localhost:3000/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Name","price":2999,"category":"electronics"}'

# Delete a product
curl -X DELETE http://localhost:3000/api/v1/products/1
```

### GraphQL

Open `http://localhost:3000/graphql` in a browser for the interactive
GraphiQL UI, or query via curl:

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ product(id:1){ title price } }"}'
```

```graphql
# List all products in a category, only asking for title & price
{
  products(category: "electronics") {
    title
    price
  }
}
```

## ⚠️ Error Response Schema

Every error (400, 404, etc.) follows this exact shape:

```json
{
  "error_code": "PRODUCT_NOT_FOUND",
  "message": "Product with id 999 was not found",
  "timestamp": "2026-09-23T04:31:40.210Z"
}
```

| Status | error_code            | When it happens                          |
|--------|------------------------|-------------------------------------------|
| 400    | VALIDATION_ERROR       | Missing/invalid `title` or `price`        |
| 404    | PRODUCT_NOT_FOUND      | Product ID doesn't exist                  |
| 404    | ROUTE_NOT_FOUND        | Unknown route hit                         |
| 201    | (success)              | Product created successfully              |

## 📁 Project Structure

```
ecommerce-api/
├── server.js               # App entry point
├── package.json
├── data/
│   └── products.js         # In-memory "database"
├── routes/
│   └── products.routes.js  # REST endpoints
├── graphql/
│   └── schema.js           # GraphQL schema & resolvers
└── middleware/
    └── errorHandler.js     # Standardized error handling
```

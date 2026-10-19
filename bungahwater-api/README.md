# Bungah Water API

Backend API for Bungah Water Order and Delivery system.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Public
- `GET /deliveries` - Today's deliveries
- `POST /orders/my-orders` - Get orders by phone number
- `GET /orders` - Get all pending/on_delivery orders
- `POST /orders/new` - Create new order

### Admin (requires header: `x-admin-password: bw2026`)
- `GET /bw/customers` - Get customers with pending orders
- `POST /bw/customers/new` - Add new customer
- `POST /bw/customers/update` - Update customer
- `POST /bw/orders/update` - Update order delivery
- `POST /bw/orders/update-qty` - Update order quantity
- `POST /bw/orders/payment` - Update payment status
- `POST /bw/orders/cancel` - Cancel order
- `POST /bw/revenue/revenue` - Get revenue
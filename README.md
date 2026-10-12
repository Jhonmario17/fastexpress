# FastExpress – Proyecto Integrador de Calidad de Software

## Backend (Node + Express + Jest)
    cd backend && npm install
    npm start            # API en http://localhost:3000
    npm run coverage     # pruebas + reporte de cobertura (carpeta coverage/)

## Frontend (Vue 3 + Vite)
    cd frontend && npm install
    npm run dev          # http://localhost:5173 (usa proxy hacia el backend)

## API
POST /api/cotizar  { "peso": 3, "tipoCliente": "VIP", "tipoEnvio": "EXPRESS" }

## Supuestos de negocio
- Subtotal = $5.00 + (peso x tarifa del tramo). La tarifa del tramo aplica a TODO el peso (no escalonada).
- El descuento se aplica al subtotal; luego el recargo EXPRESS (+25%) se aplica sobre el valor ya descontado.
- Resultado redondeado a 2 decimales.

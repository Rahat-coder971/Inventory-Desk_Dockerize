import dotenv from 'dotenv';
import Product from './models/Product.js';
import { connectDatabase } from './config/db.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Barcode Scanner',
    sku: 'SCAN-1001',
    category: 'Hardware',
    price: 89.99,
    quantity: 14,
    status: 'active',
    description: 'Rechargeable scanner for warehouse intake and dispatch counters.',
  },
  {
    name: 'Thermal Label Printer',
    sku: 'PRINT-2030',
    category: 'Hardware',
    price: 149.5,
    quantity: 6,
    status: 'active',
    description: 'Compact printer for shipping labels and product tags.',
  },
  {
    name: 'Inventory Audit Pack',
    sku: 'AUDIT-4450',
    category: 'Supplies',
    price: 24.75,
    quantity: 42,
    status: 'active',
    description: 'Clipboards, count sheets, and tamper labels for cycle counts.',
  },
  {
    name: 'Cold Storage Sensor',
    sku: 'SENS-7788',
    category: 'IoT',
    price: 64,
    quantity: 4,
    status: 'draft',
    description: 'Temperature sensor awaiting warehouse approval.',
  },
  {
    name: 'Legacy Picking Tablet',
    sku: 'TAB-0912',
    category: 'Electronics',
    price: 219,
    quantity: 2,
    status: 'archived',
    description: 'Older tablet model retained for maintenance history.',
  },
];

async function seed() {
  await connectDatabase();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

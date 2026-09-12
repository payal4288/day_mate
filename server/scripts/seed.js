/**
 * Seed script — populates MongoDB with sample DayMate data
 * and generates Gemini embeddings for all documents.
 *
 * Run: node scripts/seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import Bill from '../models/Bill.js';
import Task from '../models/Task.js';
import { generateEmbedding } from '../utils/embeddings.js';

const SAMPLE_DOCS = [
  {
    title: 'School Field Trip Permission Form',
    tag: 'Urgent',
    category: 'form',
    fields: new Map([
      ['Child Name', 'Leo (Grade 3)'],
      ['Event', 'Science Museum Trip'],
      ['Date', 'Sept 28'],
      ['Cost', '$18'],
      ['Status', 'Auto-Signed & Added to Calendar']
    ]),
    status: 'Auto-Signed & Added to Calendar',
    processed: false
  },
  {
    title: 'Child Doctor Medical Form',
    tag: 'Auto-Fill',
    category: 'medical',
    fields: new Map([
      ['Child Name', 'Maya (Age 5)'],
      ['Clinic', 'Oakwood Pediatrics'],
      ['Insurance ID', '#904812 (Pre-filled)'],
      ['Status', 'Ready to Send']
    ]),
    status: 'Ready to Send',
    processed: false
  },
  {
    title: 'Fridge Water Filter Notice',
    tag: 'Reminder',
    category: 'warranty',
    fields: new Map([
      ['Appliance', 'Whirlpool Refrigerator'],
      ['Task', 'Replace Water Filter'],
      ['Filter Model', '#EDR1RXD1'],
      ['Status', 'Filter Added to Shopping Cart']
    ]),
    status: 'Filter Added to Shopping Cart',
    processed: false
  },
  {
    title: 'Furnace HVAC Filter Replacement',
    tag: 'Reminder',
    category: 'warranty',
    fields: new Map([
      ['Appliance', 'Home Furnace / AC System'],
      ['Filter Size', '20x25x1 MERV 11'],
      ['Last Replaced', 'April 10, 2026'],
      ['Next Due', 'In 12 days'],
      ['Order Link', 'Amazon 2-pack $29.99']
    ]),
    status: 'Filter Change Due',
    processed: false
  },
  {
    title: 'Car Insurance Renewal Notice',
    tag: 'Urgent',
    category: 'insurance',
    fields: new Map([
      ['Vehicle', 'Honda Odyssey'],
      ['Old Rate', '$165/mo'],
      ['New Rate', '$194/mo'],
      ['Increase', '$29/mo'],
      ['Action', 'Request low-mileage discount']
    ]),
    status: 'Rate increased — action needed',
    processed: false
  }
];

const SAMPLE_BILLS = [
  {
    vendor: 'Wifi / Internet Bill',
    oldPrice: '$65 / mo',
    newPrice: '$89 / mo',
    alert: 'Price went up $24/mo',
    script:
      'Hi, my internet bill jumped from $65 to $89. Local fiber offers $55/mo. Please keep my rate at $55 or discount my bill. Thank you.',
    emailSent: false,
    moneySaved: 0
  },
  {
    vendor: 'Fitness App Subscription',
    oldPrice: '$20 / mo',
    newPrice: '$20 / mo',
    alert: 'Not used for 3 months',
    script:
      'Hi, please cancel my fitness subscription starting today. Thank you.',
    emailSent: false,
    moneySaved: 0
  },
  {
    vendor: 'Car Insurance Renewal',
    oldPrice: '$165 / mo',
    newPrice: '$194 / mo',
    alert: 'Rate increased $29/mo',
    script:
      'Hi, my car insurance increased. I have a clean driving record. Please review low-mileage discounts to lower my monthly rate. Thanks.',
    emailSent: false,
    moneySaved: 0
  }
];

const SAMPLE_TASKS = [
  {
    name: 'Home Furnace / AC System',
    status: 'Filter Change Due',
    action: 'Change AC filter (Size 20x25x1)',
    contractor: 'Apex Heating & AC ($85 tune-up)',
    booked: false
  },
  {
    name: 'Family SUV (Honda Odyssey)',
    status: 'Oil Change Needed',
    action: 'Synthetic Oil Change & Tire Rotation',
    contractor: 'Honda Certified Express (Saturday 9 AM)',
    booked: false
  },
  {
    name: 'Water Heater Tank',
    status: 'Flush Tank Soon',
    action: 'Flush sediment to stop rust',
    contractor: 'Local Plumber Co ($95 service)',
    booked: false
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Document.deleteMany({}),
    Bill.deleteMany({}),
    Task.deleteMany({})
  ]);
  console.log('🗑️  Cleared existing collections');

  // Seed bills and tasks (no embeddings needed)
  await Bill.insertMany(SAMPLE_BILLS);
  console.log(`✅ Seeded ${SAMPLE_BILLS.length} bills`);

  await Task.insertMany(SAMPLE_TASKS);
  console.log(`✅ Seeded ${SAMPLE_TASKS.length} tasks`);

  // Seed documents WITH embeddings
  console.log('🔮 Generating embeddings for documents...');
  for (const docData of SAMPLE_DOCS) {
    const doc = new Document(docData);
    const text = doc.toEmbeddingText();
    doc.embedding = await generateEmbedding(text);
    await doc.save();
    console.log(`  ✓ "${doc.title}" embedded (${doc.embedding.length} dims)`);
  }

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Next step — Create the Atlas Vector Search index:');
  console.log('   1. Open MongoDB Atlas → your cluster → "Search Indexes"');
  console.log('   2. Click "Create Search Index" → JSON editor');
  console.log('   3. Select collection: daymate.documents');
  console.log('   4. Paste this JSON:\n');
  console.log(
    JSON.stringify(
      {
        fields: [
          {
            type: 'vector',
            path: 'embedding',
            numDimensions: 768,
            similarity: 'cosine'
          }
        ]
      },
      null,
      2
    )
  );
  console.log('\n   5. Name the index: document_vector_index');
  console.log('   6. Click Create — it takes ~2 minutes to build.\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

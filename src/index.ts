import "dotenv/config";
import express from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { childrenTable } from "./db/schema.ts";

// Mock Data for testing
const children = [
  {
    id: 1,
    firstName: "Smitty",
    lastName: "Jensen",
    dateOfBirth: "2017-06-09",
    hometown: "Townville",
    isNice: true,
  },
  {
    id: 2,
    firstName: "Page",
    lastName: "Tuner",
    dateOfBirth: "2021-04-20",
    hometown: "Metropolis",
    isNice: true,
  },
  {
    id: 3,
    firstName: "Kevin",
    lastName: "Monno",
    dateOfBirth: "2019-09-09",
    hometown: "New London",
    isNice: false,
  },
]

// Connect to Neon PostgreSQL database via Neon
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

// Create Express.js App
const app = express();
const port = 3000;
app.use(express.json())


// Send a welcome message.
app.get('/', (req, res) => {
  res.json({ message: "Ho! Ho! Ho! Welcome to Santa's Naughty and Nice List!" });
});

// Get all the children from Santa's Naughty and Nice List.
app.get('/children', async (req, res) => {
  const sqlChildren = await db.select().from(childrenTable);
  res.json(sqlChildren);
});

// Get info on a single child fron Santa's Naughty and Nice List.
app.get('/children/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const [child] = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, id));

  if (!child) {
    res.status(404).json({ error: "Child not found." });
  }

  res.json(child);
});

// Add a new child to Santa's Naughty and Nice List.
app.post('/children', (req, res) => {
  const { firstName, lastName, dateOfBirth, hometown, isNice } = req.body;

  if (!firstName) {
    return res.status(400).json({ error: "First Name is required" });
  }
  if (!lastName) {
    return res.status(400).json({ error: "Last Name is required" });
  }
  if (!dateOfBirth) {
    return res.status(400).json({ error: "Date of birth is required" });
  }
  if (!hometown) {
    return res.status(400).json({ error: "Hometown is required" });
  }
  if (isNice !== true && isNice !== false) {
    return res.status(400).json({ error: "Is Nice? is required" });
  }

  const newChild = {
    id: children.length + 1,
    firstName,
    lastName,
    dateOfBirth,
    hometown,
    isNice
  };

  children.push(newChild);
  res.status(201).json(newChild);
});

// Update info on a single child from Santa's Naughty and Nice List.
app.put('/children/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const child = children.find((c) => c.id === id);

  if (!child) {
    return res.status(404).json({ error: "Child not found" });
  }

  child.firstName = req.body.firstName;
  child.lastName = req.body.lastName;
  child.dateOfBirth = req.body.dateOfBirth;
  child.hometown = req.body.hometown;
  child.isNice = req.body.isNice;

  res.json(child);
});

// Remove a single child from Santa's Naughty and Nice List.
app.delete('/children/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const childIndex = children.findIndex((c) => c.id === id);

  if (childIndex === -1) {
    return res.status(404).json({ error: "Child not found" });
  }

  children.splice(childIndex, 1);
  res.status(204).send();
});


// Run server
app.listen(port, () => {
  console.log(`Santa's Naughty and Nice List API running on http://localhost:${port}`);
});
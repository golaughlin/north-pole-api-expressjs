import "dotenv/config";
import express from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { childrenTable } from "./db/schema.ts";

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
app.post('/children', async (req, res) => {
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

  const newChild: typeof childrenTable.$inferInsert = {
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
    hometown: hometown,
    isNice: isNice,
  };

  try {
    await db.insert(childrenTable).values(newChild);
    console.log("Added a new child to Santa's List");
    res.status(201).json(newChild);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Could not add the new child to the list" });
  }
});

// Update info on a single child from Santa's Naughty and Nice List.
app.put('/children/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await db
      .update(childrenTable)
      .set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        hometown: req.body.hometown,
        isNice: req.body.isNice,
      })
      .where(eq(childrenTable.id, id));

    console.log(`Updated child #${id} on Santa's List`);
    return res.json({ message: `Updated child #${id} on Santa's List`});
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not update child" });
  }
});

// Remove a single child from Santa's Naughty and Nice List.
app.delete('/children/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await db.delete(childrenTable).where(eq(childrenTable.id, id));
    console.log(`Child #${id} has been removed from Santa's List`);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Could not remove child" });
  }
});


// Run server
app.listen(port, () => {
  console.log(`Santa's Naughty and Nice List API running on http://localhost:${port}`);
});
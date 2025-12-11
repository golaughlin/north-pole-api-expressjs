import express from "express";

// Create Express.js App
const app = express();
const port = 3000;


// Send a welcome message.
app.get('/', (req, res) => {
  res.send("Ho! Ho! Ho! Welcome to Santa's Naughty and Nice List!");
});

// Get all the children from Santa's Naughty and Nice List.
app.get('/children', (req, res) => {
  res.send("List of Children");
});

// Get info on a single child fron Santa's Naughty and Nice List.
app.get('/children/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Info on Child #${id}`);
});

// Add a new child to Santa's Naughty and Nice List.
app.post('/children', (req, res) => {
  res.send("Added a new child to Santa's Naughty and Nice List.");
});

// Update info on a single child from Santa's Naughty and Nice List.
app.put('/chidren/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Updated info on Child #${id}`);
});

// Remove a single child from Santa's Naughty and Nice List.
app.delete('/children/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Child #${id} removed from Santa's Naughty and Nice List.`);
});


// Run server
app.listen(port, () => {
  console.log(`Santa's Naughty and Nice List API running on http://localhost:${port}`);
});
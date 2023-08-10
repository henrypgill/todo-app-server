import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg";

import { addDummyDbItems, DbItem, getNextIdCounter, DbItemWithId } from "./db";
import filePath from "./filePath";

const client = new Client();

addDummyDbItems();

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /items
app.get("/todos", async (req, res) => {
  const query = "SELECT * FROM todos;";
  const result = await client.query(query);
  if (result.rows.length !== 0) {
    res.status(200).json(result.rows);
  } else {
    res.status(404).json("no todos found");
  }
});

// POST /items
app.post<{}, {}, DbItemWithId>("/todos", async (req, res) => {
  const postData = req.body;
  const query =
    "INSERT INTO todos (title, description, status, created, due) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
  const queryData = [
    postData.title,
    postData.description,
    postData.status,
    postData.created,
    postData.due,
  ];
  const result = await client.query(query, queryData);
  res.status(200).json(result.rows);
});

// GET /items/:id
app.get<{ id: string }>("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  const query = "SELECT * FROM todos WHERE id=$1;";
  const result = await client.query(query, [todoId]);

  if (result.rows.length === 0) {
    res.status(404).json("todo not found");
  } else {
    res.status(200).json(result.rows[0]);
  }
});

app.get("/nextid", (req, res) => {
  res.json({ id: getNextIdCounter() });
});

// DELETE /items/:id
app.delete<{ id: string }>("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  const query = "DELETE FROM todos WHERE id=$1 RETURNING *;";
  const result = await client.query(query, [todoId]);
  if (result.rows.length === 0) {
    res.status(404).json("todo not found");
  } else {
    res.status(200).json(result.rows[0]);
  }
});

// PATCH /items/:id
app.patch<{ id: string }, {}, DbItem>("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  const todo = req.body;
  const values = [
    todo.id,
    todo.title,
    todo.description,
    todo.status,
    todo.created,
    todo.due,
  ];
  const query =
    "UPDATE todos SET title=$2, description=$3, status=$4, created=$5, due=$6 WHERE id=$1 RETURNING *;";
  const result = await client.query(query, values);

  if (result.rows.length === 0) {
    res.status(404).json("todo not found");
  } else {
    res.status(200).json(result.rows[0]);
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});

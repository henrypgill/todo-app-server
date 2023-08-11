import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg";

import { DbItem, getNextIdCounter, DbItemWithId } from "./db";
import filePath from "./filePath";
import { getDbClientConfig } from "./clientConfig";
console.log("server is starting");
// read in contents of any environment variables in the .env file
dotenv.config();

// const config = {
//   connectionString: process.env.PGCONNECTION_STRING,
//   ssl: { rejectUnauthorized: false }}

const config = getDbClientConfig();

/** Parses JSON data in a request automatically */
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
const app = express();
const client = new Client(config);
client.connect().then(() => appResponses());
// console.log(config)
// console.log(client)

app.use(express.json());
app.use(cors());

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

function appResponses() {
  // API info page
  app.get("/", (req, res) => {
    const pathToFile = filePath("../public/index.html");
    res.sendFile(pathToFile);
  });

  // GET /items
  app.get("/todos", async (req, res) => {
    console.log("request 1 received");
    const query = "SELECT * FROM todos;";
    const result = await client.query(query);
    console.log("done waiting");
    if (result.rows.length !== 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json("no todos found");
    }
  });

  // POST /items
  app.post<{}, {}, DbItemWithId>("/todos", async (req, res) => {
    console.log("request 2 received");
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

  // app.get("/createFakes", async (req, res) => {
  //   console.log("requested to create fakes");
  //   const dummyData = createDummyTodos(0);
  //   // res.json(dummyData)
  //   // console.log(dummyData);
  //   const result: ServerToDoData[] = [];
  //   const query =
  //     "INSERT INTO todos (title, description, status, created, due) VALUES ($1, $2, $3, $4, $5) RETURNING *;";

  //   for (const dummyTodo of dummyData) {
  //     const queryData = [
  //       dummyTodo.title,
  //       dummyTodo.description,
  //       false,
  //       dummyTodo.created,
  //       dummyTodo.due,
  //     ];
  //     const queryResponse = await client.query<ServerToDoData>(
  //       query,
  //       queryData
  //     );
  //     result.push(queryResponse.rows[0]);
  //   }

  //   res.status(200).json([...result]);
  // });

  app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
}

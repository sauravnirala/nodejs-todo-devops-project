const express = require("express");
const app = express();

app.use(express.json());

let tasks = [];

app.get("/", (req,res)=>{
 res.send("Node.js Todo App Running");
});

app.get("/tasks",(req,res)=>{
 res.json(tasks);
});

app.post("/tasks",(req,res)=>{
 tasks.push(req.body);
 res.send("Task Added");
});

app.delete("/tasks/:id",(req,res)=>{
 tasks.splice(req.params.id,1);
 res.send("Task Deleted");
});

app.listen(3000,()=>{
 console.log("Server running on port 3000");
});

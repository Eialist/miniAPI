import express from 'express';
const app = express();

app.get("/api", (req, res) => {
    res.send("Hello there!")
})

app.listen(5780, () => {
    console.log("Server has started on port 5780")
})
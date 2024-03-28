import { MongoClient } from 'mongodb';
import express from 'express';
import dotenv from "dotenv";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, console.log("hello"));
let db = undefined;


function fetchDB() {
    db = client.db("esl_database");
    console.log(db.name)
    return db;
}

app.get("/items", async (req, res) => {
    let data = await fetchDB().collection("year4").find().toArray();
    console.log(data);
    res.send(data);
    return data;
})

app.post("/api/addWord/", async (req, res) => {
    const { sv, en, week } = req.body;
    const AddWord = (req, res) => {
        console.log(req.body);

        if (sv == undefined || en == undefined) {
            return res.status(403).send({ error: "Missing sv or en word" });
        }
        try {
            const filter = { name: week }
            const updateDocument = { $push: { ["words"]: { sv: sv, en: en } } };
            console.log(filter);
            return fetchDB().collection("year4").updateOne(filter, updateDocument, { upsert: true });
        }
        catch (error) {
            return res.status(403).send({ error: error.message });
        }

    }
    AddWord(req, res);
    res.status(200).send({ msg: 'Nytt ord tillagt' });
})

async function connectToDB() {
    await client.connect()
        .then(app.listen(PORT, () => {
            console.log("listening for requests");
        }))

}
connectToDB();
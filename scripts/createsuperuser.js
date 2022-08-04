require("dotenv").config();
const readline = require("readline");
const {MongoClient} = require('mongodb');
const {hash} = require("bcrypt");

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const client = new MongoClient(process.env.MONGO_URI);

async function createsuperuser() {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(process.env.MONGO_DB)
    const users = db.collection("users");
    input.question("Enter username: ", username => {
        input.question("Enter password: ", async password => {
            await users.insertOne({
                username,
                password: await hash(password, 10),
                roles: ["user", "admin", "manager"],
                verified: true,
                strike: false,
                createdAt: new Date()
            })
            console.log("User created");
            await client.close();
            input.close();
        });
    });
}

createsuperuser().catch(err => {
    console.log(err);
})
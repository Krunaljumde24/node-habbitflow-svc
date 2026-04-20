import bodyParser from "body-parser";
import express from "express"
import { connectMysql } from "./database/MysqlConn.js";
import { authRouter } from "./routes/authRouter.js";
import { HabbitRouter } from "./routes/HabbitRouter.js";
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: process.env.APP_URL
}))

app.use(authRouter)
app.use(HabbitRouter)

app.get('/', (req, res) => {
    res.status(200).send('Express js / GET API')
})

app.post('/', (req, res) => {
    res.status(200).send('Express js / POST API')
})

app.put('/', (req, res) => {
    res.status(200).send('Express js / PUT API')
})


try {
    await connectMysql();
    app.listen(port, () => {
        console.log(`Express server is running on port ${port}`);
    })
} catch (error) {
    console.log("Failed to start habbitflow-svc express server.");

}


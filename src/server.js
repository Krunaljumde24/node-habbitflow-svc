import bodyParser from "body-parser";
import express from "express"
// import { register } from "./service/authService.js";
import { connectMysql } from "./database/MysqlConn.js";
import { authRouter } from "./routes/AuthRouter.js";
import { HabbitRouter } from "./routes/HabbitRouter.js";
import cors from "cors"
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const port = process.env.PORT || 8888;


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:5173'
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


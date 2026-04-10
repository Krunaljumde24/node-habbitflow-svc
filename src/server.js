import bodyParser from "body-parser";
import express from "express"
import { register } from "./service/authService.js";
import { connectMysql } from "./database/mysqlConnection.js";
import { authRouter } from "./routes/AuthRouter.js";

const app = express();

const port = 8890;


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(authRouter)

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


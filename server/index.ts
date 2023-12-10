import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";;
import Express, { Router } from "express";
import { Route } from "./src/route";

const app = Express();

const corsOptions = {};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(Express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(Express.urlencoded({ extended: true }));

new Route(app, Router());

// set port, listen for requests
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`⚡ Server is running on port ${PORT}.`);
});

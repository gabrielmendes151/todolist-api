const express = require('express');
const routes = require('./routes.js');
require("./config/database").connect();
require("dotenv").config();
const { PORT } = process.env

const app = express();

app.use(express.json());
app.use(routes);  

app.listen(PORT);   
require("dotenv/config");
require("express-async-errors");
const migrationsRun = require("./src/database/sqlite/migrations");
const AppError = require("./src/utils/AppError");
const uploadConfig = require("./src/configs/upload");

const cors = require("cors");

const express = require("express");
const routes = require("./src/routes");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());

// Rota para mostrar foto na tela.
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use(( error, req, res, next ) => {

    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
        console.error(error)
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    });

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server in running on Port ${PORT}`));
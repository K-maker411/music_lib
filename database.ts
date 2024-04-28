import {Sequelize} from "sequelize";

// create sequelize instance, dialect is sqlite, sqlite file will be in the folder of the program itself
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./music_lib.sqlite"
});

export {sequelize};
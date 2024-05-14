import {Sequelize} from "sequelize";
import {walk_func} from "./file-handling";
const walk = require("@root/walk");

// create sequelize instance, dialect is sqlite, sqlite file will be in the folder of the program itself
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./music_lib.sqlite"
});

const init_database = async () =>
{
    // drop table if it exists (once files are loaded,
    await sequelize.sync({force:true});

    const audio_path = "/Users/kaushikbalantrapu/Music/Music/Media.localized/Music";
    console.log("About to walk");
    await walk.walk(audio_path, walk_func);
    console.log("Finished walking");
}

export {sequelize, init_database};
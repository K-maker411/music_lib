import express, {Request, Response} from "express";
import AudioFile from "./models/AudioFile";
import {init_database} from "./database";
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';

// TODO
//  GET request for / is being called before io.on("connection"), which is causing the database to not work (for obvious reasons, since there's no db being created at that time)

const app = express();
const server = createServer(app);
const io = new Server(server);
//socketIO.attach(server);

app.set("view engine", "ejs");

let audio_files : AudioFile[] = [];
let audio_files_populated : boolean = false;

// NOTE - currently being used without options, perhaps that's all that's necessary
async function get_audio_files() {
    try {
        // get all audio files from database and return
        return await AudioFile.findAll();
    }

    catch (error) {
        console.log("Error getting previously-imported audio files: ", error);
        throw error;
    }
}

// initializes db and does appropriate logging
async function start_server() {
    try {
        console.log("Synchronizing server...");
        // create table if it doesn't exist, drop table if it does (and then walk through given dir to get all audio files)
        await init_database();
        console.log("Server successfully synchronized!");
    } catch (error) {
        console.log("Error synchronizing server: ", error);
        throw error;
    }

    /*
    console.log("About to do io.on");
    io.on("connection", async (socket: Socket) => {
        console.log("inside io.on");
        io.emit("file_processing_started", socket);
        try {
            console.log("Synchronizing server...");
            // create table if it doesn't exist, drop table if it does (and then walk through given dir to get all audio files)
            await init_database();
            io.emit("file_processing_finished", socket);
            console.log("Server successfully synchronized!");
        } catch (error) {
            console.log("Error synchronizing server: ", error);
            throw error;
        }

    });

    io.on("connect_error", (err: Error) => {
        console.log(`connect_error due to ${err.message}`);
    })*/
}

// IIFE, runs immediately, allows for loading bar to happen
(async function(){
    if (!audio_files_populated) {
        console.log("Start server being run")
        // file processing about to start, so emit message to indicate such
        io.emit("file_processing_started");
        // Populate the database
        await start_server();
        io.emit("file_processing_finished");
        audio_files_populated = true;
    }
})();

io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});

// index.ejs get page
app.get("/", async (req: Request, res: Response) => {
    console.log("Hello World!");
    // retrieves all files from database
    try {
        // get all audio files
        audio_files = await get_audio_files();
        // render table with files
        res.render("index", { files: audio_files });
    }

    catch (error) {
        console.log("Error getting audio files: ", error);
        res.status(500).send("Error getting audio files!");
    }
})



// listen on port 3000
server.listen(3000)
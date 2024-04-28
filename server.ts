import express, {Request, Response} from "express";
import multer from "multer";
import AudioFile from "./models/AudioFile"
import musicMetadata from "music-metadata"

const app = express();

app.set("view engine", "ejs");



// NOTE - currently being used without options, perhaps that's all that's necessary
async function get_audio_files()
{
    try {
        // get all audio files from database and return
        return await AudioFile.findAll();
    }

    catch (error) {
        console.log("Error getting previously-imported audio files: ", error);
        throw error;
    }


}

async function start_server() {
    try {
        console.log("Synchronizing server...");
        // create table if it doesn't exist, otherwise don't do anything
        await AudioFile.sync()
        console.log("Server successfully synchronized!");
    }

    catch (error) {
        console.log("Error synchronizing server: ", error);
        throw error;
    }
}

app.get("/", async (req: Request, res: Response) => {

    console.log("Hello World!");
    // retrieves all files from database
    try {
        // wait for server to be synchronized/started
        await start_server();
        const music_metadata_ex = await musicMetadata.parseFile("/Users/kaushikbalantrapu/Music/Music/Media.localized/Music/Vilayat Khan/00045_Vilayat/01. Raga Pooriya - Alaap, Jod, Jhala, Gat.mp3")
        const ex = await AudioFile.create({path: "/Users/kaushikbalantrapu/Music/Music/Media.localized/Music/Vilayat Khan/00045_Vilayat/01. Raga Pooriya - Alaap, Jod, Jhala, Gat.mp3", title: music_metadata_ex.common.title, artist: music_metadata_ex.common.artist})
        // get all audio files
        const files = await get_audio_files();
        // FOR EXAMPLE
        files.push(ex);
        // render table with files
        res.render("index", { files: files });
    }

    catch (error) {
        console.log("Error getting audio files: ", error);
        res.status(500).send("Error getting audio files!");
    }

    //res.download("server.ts")
    //res.json({message: "Hello World!"});
    //res.send("Hello World!");
})

const upload = multer({})


// listen on port 3000
app.listen(3000)
import * as fs from "node:fs";
import path from "path";
import AudioFile from "./models/AudioFile"
import NodeID3 from "node-id3";

// checks if the given dir ent is an audio file
function isAudioFile(dir_ent: fs.Dirent) {
    const extension = path.extname(dir_ent.name);
    return extension === '.mp3' || extension === '.m4a' || extension === '.wav';
}

const walk_func = async (err : Error, pathname: string, dir_ent: fs.Dirent) => {
    // if error, throw it
    if (err)
    {

        throw err;
    }

    // if hidden directory, return false
    if (dir_ent.isDirectory() && dir_ent.name.startsWith("."))
    {
        return false;
    }

    if (dir_ent.isFile())
    {
        // if the current dir_ent is an audio file, we create an AudioFile db record using the info of this particular file
        if (isAudioFile(dir_ent))
        {
            console.log("dir_ent.name: ", dir_ent.name);
            console.log("pathname: ", pathname);
            const tags = NodeID3.read(pathname);
            await AudioFile.create({path: pathname, title: tags.title, album: tags.album, artist: tags.artist, track_number: tags.trackNumber, date: tags.date});
        }


    }

}

export {walk_func}

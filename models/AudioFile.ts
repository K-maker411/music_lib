import {DataTypes, Model, Sequelize} from "sequelize";
import {sequelize} from "../database";

// AudioFile inherits from Model
// also makes sure to export default
export default class AudioFile extends Model {}

// define all fields of AudioFile
AudioFile.init({
        // path of the AudioFile on the user's machine
        // path must not be null, since we need to find the audio file itself
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // audio file title (if applicable)
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NONE"
        },
        // album title (if applicable)
        album: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NONE"
        },
        // track number in album (if applicable)
        track_number : {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "NONE"
        },
        // artist name (if applicable)
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NONE"
        },

        // some interpretation of date (date performed, date published, etc.)
        // if applicable
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: "NONE"
        }
    },
    {
        sequelize,
        modelName: "AudioFile"
    }
);

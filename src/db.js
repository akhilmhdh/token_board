import { Sequelize, DataTypes, Model } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const sequelize = new Sequelize(process.env.DB_HOST);

export class Booth extends Model {}

Booth.init(
    {
        // Model attributes are defined here
        counter: {
            type: DataTypes.STRING,
        },
        token: {
            type: DataTypes.STRING,
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "booth", // We need to choose the model name
    }
);

export const BoothSync = async () => {
    try {
        await Booth.sync();
    } catch (error) {
        console.log(error);
    }
};

import dotenv from "dotenv";

dotenv.config();

export default {
    app:{
        PORT: process.env.PORT,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    },
    mongo:{
        USER: process.env.MONGO_USER,
        PWD: process.env.MONGO_PASSWORD,
        DB: process.env.MONGO_DB,
    },
    sessions:{
        SECRET: process.env.SESSION_SECRET
    }
}
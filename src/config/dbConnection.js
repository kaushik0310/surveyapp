'use strict';
const mongoose=require("mongoose");
const db=require('./index');

const connectDb=async()=>{
    try {
        const connection=await mongoose.connect(db.dbUri);
        console.log(`Database connected on ${connection.connection.host} with port ${connection.connection.port}`);
        return connection;
        
    } catch (error) {
        console.error("Database connection error:", error.message);
        // Exit process on failure
        process.exit(1);
        
    }
}

module.exports=connectDb;
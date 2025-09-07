import mongoose from "mongoose";
export const connectDB = () => {
    mongoose.connect(process.env.DB_URI as string).then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.error("Database connection error:", err);
    });
};

export default connectDB;
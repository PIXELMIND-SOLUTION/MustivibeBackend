import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected ✔");
    })
    .catch((err) => console.log("DB Error:", err));
};

export default connectDatabase;

import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:  { type: String, required: true },
    last_name:  { type: String},
    email:  { type: String, required: true, unique: true },
    age:  { type: Number},
    password:  { type: String },
    role: {type: String, default: "user"},
})

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel
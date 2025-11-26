import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
 email: { type: String, unique: true },
    password: { 
    type: String,
    required: true,
  },
  role:{  
    type: String,
    "default": "user",
    enum: ["admin", "user"],
    default: "user"
  },  
  // isEmailVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  // emailVerificationToken: {
  //   type: String,
  // },
  // emailVerificationExpires: {
  //   type: Date,
  // },
  


 
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);

};  
 



const User = mongoose.model('User', userSchema);
export default User;

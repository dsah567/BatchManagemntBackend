import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const teacherSchema = new mongoose.Schema({
  fullName: { 
    type: String,
    required: true 
    },
  email: { 
    type: String, 
    required: true, 
    unique: true 
    },
  password: { 
    type: String, 
    required: true 
    },
  photo: { 
    type: Buffer, 
    contentType: String 
  }, 
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]  
});

// Pre-save middleware to hash password
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;

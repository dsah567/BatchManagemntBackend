import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true
      },
      mobileNo: {
        type: String,
        required: true
      },
      uid: {
        type: String,
        required: true,
        unique: true
      },
      subjectBatch: {
        type: String,
        required: true
      }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;

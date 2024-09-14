import Teacher from '../models/teacher.model.js';
import Student from '../models/teacher.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const signUpTeacher = async (req, res) => {
  try {

    console.log("signup");
    const { fullName, email, password } = req.body;
    console.log(fullName, email, password);
    const newTeacher = new Teacher({
        fullName,
        email,
        password,
      });

      if (req.file) {
        newTeacher.photo = req.file.buffer;
      }
  
      await newTeacher.save();

    res.status(201).json({ message: 'Teacher signed up successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const signInTeacher = async (req, res) => {
  const { email, password } = req.body;
  console.log("signin");
  try {
    const teacher = await Teacher.findOne({ email });
    console.log(email,password);
    if (!teacher) return res.status(400).json({ message: 'Teacher not found' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token =await jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    // res.cookie('jwt_token', token, {
    //   httpOnly: true,
    //   secure: true, 
    //   sameSite: 'strict', 
    // });

    return res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
    }).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logoutTeacher = (req, res) => {
  // res.clearCookie('jwt_token', { httpOnly: true, secure: true });
  res.clearCookie('jwt_token', { httpOnly: true, secure: true, sameSite: 'none' }).json({ message: 'Logged out successfully' });
};


const getCurrentTeacher = (req, res) => {
  try {
    console.log({ user: req.user });
    res.json({ user: req.user });  
  } catch (error) {
    console.log('Not authenticated');
    res.status(401).json({ message: 'Not authenticated' });
  }
};


const addStudent = async (req, res) => {
  try {
    const { fullName, age, mobileNo, uid, subjectBatch } = req.body;
    const teacherId = req.params.id;

    const student = new Student({ fullName, age, mobileNo, uid, subjectBatch });
    await student.save();

    const teacher = await Teacher.findById(teacherId);
    teacher.students.push(student._id);
    await teacher.save();

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const editStudent = async (req, res) => {
  try {
    const { fullName, age, mobileNo, subjectBatch } = req.body;
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.fullName = fullName || student.fullName;
    student.age = age || student.age;
    student.mobileNo = mobileNo || student.mobileNo;
    student.subjectBatch = subjectBatch || student.subjectBatch;

    await student.save();
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const listStudents = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId).populate('students');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.status(200).json({ students: teacher.students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const studentId = req.params.studentId;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    teacher.students = teacher.students.filter((id) => id.toString() !== studentId);
    await teacher.save();

    await Student.findByIdAndDelete(studentId);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
    signUpTeacher, 
    signInTeacher, 
    logoutTeacher,
    getCurrentTeacher,
    addStudent, 
    editStudent, 
    listStudents, 
    deleteStudent
}
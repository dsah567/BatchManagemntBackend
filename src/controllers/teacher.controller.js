import Teacher from '../models/teacher.model.js';
import Student from '../models/student.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const signUpTeacher = async (req, res) => {
  try {

    const { fullName, email, password,gender,phoneno,age } = req.body;
    const teacher = await Teacher.findOne({ email });
    
    if (teacher) return res.status(400).json({ message: 'email already exist' });
    const newTeacher = new Teacher({
        fullName,
        email,
        password,
        age,
        gender,
        phoneno
      });

      if (req.file) {
        newTeacher.photo = req.file.buffer;
      }
  
      await newTeacher.save();

    res.status(201).json({ message: 'Teacher signed up successfully!' });
  } catch (err) {
    res.status(500).json({message: 'server error' , error: err.message });
  }
};


const signInTeacher = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const teacher = await Teacher.findOne({ email });
    
    if (!teacher) return res.status(400).json({ message: 'Teacher not found' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token =await jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
   

    return res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
      maxAge: 24 * 60 * 60 * 1000,
    }).json({ message: 'Login successful',user: teacher });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logoutTeacher = (req, res) => {

  // res.clearCookie('jwt_token', { httpOnly: true, secure: true });
  res.clearCookie('jwt_token', { httpOnly: true, secure: true, sameSite: 'none' }).json({ message: 'Logged out successfully' });
};


const getCurrentTeacher = async (req, res) => {
  try {
    
    const teacher=await Teacher.findOne({_id:req.user.id })
    
    res.json({ message: 'Login successful',user: teacher });  
  } catch (error) {
   
    res.status(401).json({ message: 'Not authenticated' });
  }
};


const addStudent = async (req, res) => {
  try {
    const { fullName, age, gender,mobileNo, uid, subjectBatch } = req.body;
    const teacherId = req.params.id;

    const student = new Student({ fullName, age,gender, mobileNo, uid, subjectBatch });
    
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
    const { fullName, age,gender, mobileNo, subjectBatch, } = req.body;
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.fullName = fullName || student.fullName;
    student.age = age || student.age;
    student.gender=gender||student.gender;
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

const checkuid = async (req, res) => {
  try {
    const { uid } = req.body;
    const student = await Student.findOne({ uid });
    if (student) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
const student = async (req, res) => {
  
  try {
    const studentId = req.params.studentId;
  
    const student = await Student.findById(studentId);
    
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    deleteStudent,
    checkuid,
    student
}
import express from 'express';
import { signUpTeacher, signInTeacher, addStudent, editStudent, listStudents, deleteStudent } from '../controllers/teacher.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const teacherRouter = express.Router();

// Teacher routes
teacherRouter.post('/signup', upload.single('photo'), signUpTeacher); 
teacherRouter.post('/signin', signInTeacher);                         
teacherRouter.post('/:id/students',authMiddleware, addStudent);                      
teacherRouter.put('/students/:studentId',authMiddleware, editStudent);               
teacherRouter.get('/:id/students',authMiddleware, listStudents);                     
teacherRouter.delete('/:id/students/:studentId',authMiddleware, deleteStudent);      

export default teacherRouter;

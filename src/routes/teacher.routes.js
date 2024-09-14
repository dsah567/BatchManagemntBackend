import express from 'express';
import { signUpTeacher,logoutTeacher, signInTeacher,getCurrentTeacher, addStudent, editStudent, listStudents, deleteStudent, checkuid,student } from '../controllers/teacher.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const teacherRouter = express.Router();

// Teacher routes
teacherRouter.post('/signup', upload.single('photo'), signUpTeacher); 
teacherRouter.post('/signin', signInTeacher);                         
teacherRouter.post('/logout',logoutTeacher);
teacherRouter.get('/me',authMiddleware, getCurrentTeacher); 
teacherRouter.post('/:id/students',authMiddleware, addStudent);                      
teacherRouter.put('/students/:studentId',authMiddleware, editStudent);
teacherRouter.get('/student/:studentId',authMiddleware, student);                
teacherRouter.get('/:id/students',authMiddleware, listStudents);                     
teacherRouter.delete('/:id/students/:studentId',authMiddleware, deleteStudent);      
teacherRouter.post('/checkuid',checkuid)

export default teacherRouter;

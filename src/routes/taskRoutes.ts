import express from 'express';
import {
    createTaskController,
    getTasksController,
    getTaskController,
    updateTaskController,
    deleteTaskController
} from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getTasksController)
    .post(protect, createTaskController);

router.route('/:id')
    .get(protect, getTaskController)
    .put(protect, updateTaskController)
    .delete(protect, deleteTaskController);

export default router;

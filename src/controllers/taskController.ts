import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as taskService from '../services/taskService';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createTaskController = asyncHandler(async (req: AuthRequest, res: Response) => {
    const validation = createTaskSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ errors: validation.error.format() });
        return;
    }

    // @ts-ignore
    const task = await taskService.createTask(validation.data, req.user._id);
    res.status(201).json(task);
});

export const getTasksController = asyncHandler(async (req: AuthRequest, res: Response) => {
    // @ts-ignore
    const tasks = await taskService.getTasks(req.query, req.user._id);
    res.json(tasks);
});

export const getTaskController = asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    res.json(task);
});

export const updateTaskController = asyncHandler(async (req: AuthRequest, res: Response) => {
    const validation = updateTaskSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ errors: validation.error.format() });
        return;
    }

    // @ts-ignore
    const updatedTask = await taskService.updateTask(req.params.id, validation.data, req.user._id.toString());

    if (!updatedTask) {
        res.status(404);
        throw new Error('Task not found');
    }
    res.json(updatedTask);
});

export const deleteTaskController = asyncHandler(async (req: AuthRequest, res: Response) => {
    const success = await taskService.deleteTask(req.params.id);
    if (!success) {
        res.status(404);
        throw new Error('Task not found');
    }
    res.json({ message: 'Task removed' });
});

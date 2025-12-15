import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/Task';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().or(z.date()).transform((str) => new Date(str)), // Accept string or date object
    priority: z.nativeEnum(TaskPriority),
    assignedToId: z.string().optional(), // ID as string
});

export const updateTaskSchema = z.object({
    title: z.string().max(100).optional(),
    description: z.string().optional(),
    dueDate: z.string().or(z.date()).transform((str) => new Date(str)).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedToId: z.string().optional(),
});

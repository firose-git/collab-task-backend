import { Task, ITask } from '../models/Task';
import { getIO } from '../utils/socket';
import { AuditLog, AuditAction } from '../models/AuditLog';

export const createTask = async (taskData: Partial<ITask>, creatorId: string) => {
    const task = (await Task.create({ ...taskData, creatorId } as any)) as unknown as ITask;

    const io = getIO();
    io.emit('taskCreated', task);

    if (task.assignedToId && task.assignedToId.toString() !== creatorId) {
        io.to(task.assignedToId.toString()).emit('notification', {
            type: 'assignment',
            message: `You have been assigned to task: ${task.title}`,
            taskId: task._id
        });
    }

    return task;
};

export const getTasks = async (query: any, userId: string) => {
    // query handling: status, priority, sort
    // "filtering on the task list based on Status and Priority. Implement sorting by Due Date."

    const { status, priority, sortBy, sortOrder } = query;

    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Sorting
    const sort: any = {};
    if (sortBy === 'dueDate') {
        sort.dueDate = sortOrder === 'desc' ? -1 : 1;
    } else {
        sort.createdAt = -1; // Default
    }

    const tasks = await Task.find(filter)
        .sort(sort)
        .populate('creatorId', 'name email')
        .populate('assignedToId', 'name email');

    return tasks;
};

export const getTaskById = async (id: string) => {
    return await Task.findById(id)
        .populate('creatorId', 'name email')
        .populate('assignedToId', 'name email');
};

export const updateTask = async (id: string, updates: Partial<ITask>, userId: string) => {
    const task = await Task.findById(id);
    if (!task) return null;

    const previousAssignee = task.assignedToId?.toString();

    // specific check: "When a task's status, priority, or assignee is updated... all other users... see the change instantly"
    // We just emit 'taskUpdated' with the new task.

    Object.assign(task, updates);
    const updatedTask = await task.save();

    // Populate for socket message
    await updatedTask.populate('creatorId', 'name email');
    await updatedTask.populate('assignedToId', 'name email');

    const io = getIO();
    io.emit('taskUpdated', updatedTask);

    // Assignment Notification
    const newAssignee = updatedTask.assignedToId?.toString();
    if (newAssignee && newAssignee !== previousAssignee && newAssignee !== userId) {
        io.to(newAssignee).emit('notification', {
            type: 'assignment',
            message: `You have been assigned to task: ${updatedTask.title}`,
            taskId: updatedTask._id
        });
    }

    // Audit Log (Bonus)
    await AuditLog.create({
        action: AuditAction.UPDATE,
        entityType: 'Task',
        entityId: id as any,
        userId: userId as any,
        details: `Updated fields: ${Object.keys(updates).join(', ')}`
    });
    console.log(`User ${userId} updated task ${id}`);

    return updatedTask;
};

export const deleteTask = async (id: string) => {
    const task = await Task.findById(id);
    if (!task) return null;

    await task.deleteOne();

    getIO().emit('taskDeleted', id);

    return true;
};

import mongoose, { Document, Schema } from 'mongoose';

export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    ASSIGN = 'ASSIGN',
}

export interface IAuditLog extends Document {
    action: AuditAction;
    entityType: string; // 'Task', 'User', etc.
    entityId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId; // Who performed the action
    details: string;
    timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
    action: { type: String, enum: Object.values(AuditAction), required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

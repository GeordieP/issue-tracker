import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    dateCreated: { type: Number, required: true },
    dateUpdated: { type: Number, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    openStatus: { type: Boolean, required: true }
});

export default mongoose.model('Task', taskSchema);

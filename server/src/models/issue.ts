import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    dateCreated: { type: Number, required: true },
    dateUpdated: { type: Number, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true},
    body: { type: String },
    severity: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true},
    tags: { type: [String], required: true },
});

export default mongoose.model('Issue', issueSchema);

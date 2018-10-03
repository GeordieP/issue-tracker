import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    dateCreated: { type: Number, required: true },
    dateUpdated: { type: Number, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    alias: { type: String, required: true },
});

export default mongoose.model('Project', projectSchema);

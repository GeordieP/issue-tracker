import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    dateCreated: { type: Number, required: true },
    dateUpdated: { type: Number, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, required: true },
    parentType: { type: String }
});

export default mongoose.model('Comment', commentSchema);

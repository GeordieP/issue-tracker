import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    level: { type: Number, required: true },
    resourceID: { type: Schema.Types.String, required: true }
});

export default mongoose.model('Permission', permissionSchema)

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    joinDate: { type: Number, required: true },
    username: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    email: { type: String, required: true, unique: true, },
    fullName: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String },
    homepage: { type: String },
});

export default mongoose.model('User', userSchema);

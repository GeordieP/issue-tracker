import mongoose from 'mongoose';

// import all types to get them initialized
import User from './user';
import Comment from './comment';
import Issue from './issue';
import Project from './project';
import Task from './task';
import Permission from './permission';

// mongo
mongoose.connect('mongodb://admin:admin@localhost:27017/issue-tracker?authSource=admin', {
    useNewUrlParser: true,
})
    .catch(console.error);


// these exports are just to make the language server be quiet..
export { User };
export { Comment };
export { Issue };
export { Project };
export { Task };
export { Permission };

export default {
    User,
    Comment,
    Issue,
    Project,
    Task,
    Permission
};

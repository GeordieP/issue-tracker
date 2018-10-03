import {
    ResourceType,
    PermissionLevel,
    getPermissions,
    getUnauthPermissions,
    getSitePermissions,
} from '../permissions';

export default (db: any) => {
    return ({
        Resource: {
            __resolveType: (root: any) => root
        },
        Project: {
            creator(root: any) {
                return db.User.findById(root.creator, '-password');
            },

            userPermissions(root: any, args: any, ctx: any) {
                if (!ctx.state.user) {
                    return getUnauthPermissions(
                        root.id,
                        ResourceType.Project
                    );
                }

                return getPermissions(
                    root.id,
                    ResourceType.Project,
                    ctx.state.user.id,
                );
            },
        },

        Issue: {
            project(root: any) {
                return db.Project.findById(root.project);
            },

            creator(root: any) {
                return db.User.findById(root.creator, '-password'); // don't resolve password, there's no need to from graphql.
            },

            userPermissions(root: any, args: any, ctx: any) {
                const { project: projectID } = root;

                if (!ctx.state.user) {
                    return getUnauthPermissions(
                        projectID,
                        ResourceType.Project,
                    );
                }

                return getPermissions(
                    projectID,
                    ResourceType.Project,
                    ctx.state.user.id,
                );
            },
        },

        Task: {
            creator(root: any) {
                return db.User.findById(root.creator, '-password');
            },

            parent(root: any) {
                return db.Issue.findById(root.parent);
            },

            async userPermissions(root: any, args: any, ctx: any) {
                const parent = await db.Issue.findById(root.parent);
                const { project: projectID } = parent;

                if (!ctx.state.user) {
                    return getUnauthPermissions(
                        projectID,
                        ResourceType.Project
                    );
                }

                return getPermissions(
                    projectID,
                    ResourceType.Project,
                    ctx.state.user.id,
                );
            }
        },

        CParentType: {
            __resolveType: (root: any) => {
                switch(root.parentType) {
                    case 'TASK':
                        return 'Task';
                    default:
                        return 'Issue';
                }
            },
        },

        Comment: {
            __resolveType: (root: any) => {
                switch(root.parentType) {
                    case 'TASK':
                        return 'TaskComment';
                    default:
                        return 'IssueComment';
                }
            },
        },

        IssueComment: {
            __resolveType: () =>  'ISSUE',

            creator(root: any) {
                return db.User.findById(root.creator, '-password');
            },

            parent(root: any) {
                return db.Issue.findById(root.parent);
            },

            async userPermissions(root: any, args: any, ctx: any) {
                const parent = await db.Issue.findById(root.parent);
                const { project: projectID } = parent;

                if (!ctx.state.user) {
                    return getUnauthPermissions(
                        projectID,
                        ResourceType.Project
                    );
                }

                return getPermissions(
                    projectID,
                    ResourceType.Project,
                    ctx.state.user.id,
                );
            }
        },

        TaskComment: {
            __resolveType: () =>  'TASK',

            creator(root: any) {
                return db.User.findById(root.creator, '-password');
            },

            parent(root: any) {
                return db.Task.findById(root.parent);
            },

            async userPermissions(root: any, args: any, ctx: any) {
                const commentParent = await db.Task.findById(root.parent);
                const taskParent = await db.Issue.findById(commentParent.parent);
                const { project: projectID } = taskParent;

                if (!ctx.state.user) {
                    return getUnauthPermissions(
                        projectID,
                        ResourceType.Project
                    );
                }

                return getPermissions(
                    projectID,
                    ResourceType.Project,
                    ctx.state.user.id,
                );
            }
        },

        Query: {
            users: () => db.User.find({}, '-password'),
            user: (root: any, args: any) => (args.id != null)
                ? db.User.findById(args.id, '-password')
                : db.User.findOne(args, '-password'),

            projects: (root: any, args: any) => db.Project.find(args),
            project: (root: any, args: any) => (args.id != null)
                ? db.Project.findById(args.id)
                : db.Project.findOne(args),

            issues: (root: any, args: any) => db.Issue.find(args),
            issue: (root: any, { id }: { id: ID}) => db.Issue.findById(id),

            tasks: (root: any, args: any) => db.Task.find(args),
            task: (root: any, { id }: { id: ID}) => db.Task.findById(id),

            comments: (root: any, args: any) => db.Comment.find(args),
            comment: (root: any, { id }: { id: ID}) => db.Comment.findById(id),
        },

        Mutation: {
            /* TEMP: PERMISSIONS */
            createPermission: (root: any, { userID, resourceID, level }: any, ctx: any) => {
                return new db.Permission({
                    userID,
                    resourceID,
                    level,
                }).save();
            },

            /* USERS */
            updateUser: async (root: any, args: any, ctx: any) => {
                const { id } = args;
                delete args.id;

                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                const user = await db.User.findById(id, '-password');

                if (!user) {
                    throw new Error('Could not find user to update.');
                }

                const { level } = await getSitePermissions(ctx.state.user.id);

                // PERMS: Admin for site or same user
                if (level < PermissionLevel.Admin
                    && user.id.toString() !== ctx.state.user.id.toString()
                ) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Admin }, had ${ level })`);
                }

                const opts = {
                    'new': true, // return the modified document rather than pre-edit document
                };

                return db.User.findByIdAndUpdate(id, args, opts);
            },

            deleteUser: async (root: any, { id }: { id: ID }, ctx: any) => {
                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                const { level } = await getSitePermissions(ctx.state.user.id);

                // PERMS: Delete for site
                if (level < PermissionLevel.Delete) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Delete }, had ${ level })`);
                }

                try {
                    await db.User.findByIdAndDelete(id)
                } catch(e) {
                    console.error(e);
                    throw e;
                }

                return id;
            },

            /* PROJECTS */
            createProject: async (root: any, args: any, ctx: any) => {
                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                const { level } = await getSitePermissions(ctx.state.user.id);

                // PERMS: Create for site
                if (level < PermissionLevel.Create) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Create }, had ${ level })`);
                }

                return new db.Project({
                    ...args,
                    creator: ctx.state.user.id,
                    dateCreated: Date.now(),
                    dateUpdated: Date.now()
                }).save();
            },

            updateProject: async (root: any, args: any, ctx: any) => {
                const { id } = args;
                delete args.id;

                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                const project = await db.Project.findById(id);

                if (!project) {
                    throw new Error(`Could not find project to update.`);
                }

                const { level } = await getPermissions(id, ResourceType.Project, ctx.state.user.id);

                // PERMS: Edit for project or project creator
                if (level < PermissionLevel.Edit
                    && project.creator.toString() !== ctx.state.user.id.toString()
                ) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Edit }, had ${ level })`);
                }

                const opts = {
                    'new': true, // return the modified document rather than pre-edit document
                };

                return db.Project.findByIdAndUpdate(id, args, opts);
            },

            deleteProject: async (root: any, { id }: { id: ID }, ctx: any) => {
                try {
                    if (ctx.isUnauthenticated() || ctx.state.user == null) {
                        throw new Error('Not signed in.');
                    }

                    const project = await db.Project.findById(id).exec();

                    if (!project) {
                        throw new Error('Could not find project to delete.');
                    }

                    const { level } = await getPermissions(id, ResourceType.Project, ctx.state.user.id);

                    // PERMS: Delete for project or project creator
                    if (level < PermissionLevel.Delete
                        && project.creator.toString() !== ctx.state.user.id.toString()
                    ) {
                        throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Delete }, had ${ level })`);
                    }

                    // delete all associated issues
                    await db.Issue.deleteMany({ project: project._id });
                    await project.remove();
                } catch(e) {
                    console.error(e);
                    throw e;
                }

                return id;
            },

            /* ISSUES */
            createIssue: async (root: any, args: any, ctx: any) => {
                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                if (args.project == null) {
                    return new Error('No project provided.');
                }

                const { level } = await getPermissions(args.project, ResourceType.Project, ctx.state.user.id);

                // PERMS: Create for project
                if (level < PermissionLevel.Create) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Create }, had ${ level })`);
                }

                return new db.Issue({
                    ...args,
                    creator: ctx.state.user.id,
                    dateCreated: Date.now(),
                    dateUpdated: Date.now(),
                }).save();
            },

            updateIssue: async (root: any, args: any, ctx: any) => {
                const { id } = args;
                delete args.id;

                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                const issue = await db.Issue.findById(id);

                if (!issue) {
                    throw new Error(`Could not find issue to update.`);
                }

                // PERMS: Edit for project or issue author
                const { level } = await getPermissions(issue.project, ResourceType.Project, ctx.state.user.id);

                if (level < PermissionLevel.Edit
                    && issue.creator.toString() !== ctx.state.user.id.toString()
                ) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Edit }, had ${ level })`);
                }

                const opts = {
                    'new': true, // return the modified document rather than pre-edit document
                };

                return db.Issue.findByIdAndUpdate(id, args, opts);
            },

            deleteIssue: async (root: any, { id }: { id: ID }, ctx: any) => {
                try {
                    if (ctx.isUnauthenticated() || ctx.state.user == null) {
                        throw new Error('Not signed in.');
                    }

                    const issue = await db.Issue.findById(id).exec();

                    if (!issue) {
                        throw new Error('Could not find issue to delete.');
                    }

                    const { level } = await getPermissions(issue.project, ResourceType.Project, ctx.state.user.id);

                    // PERMS: Delete for project or issue author
                    if (level < PermissionLevel.Delete
                        && issue.creator.toString() !== ctx.state.user.id.toString()
                    ) {
                        throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Delete }, had ${ level })`);
                    }

                    await db.Comment.deleteMany({ parent: issue._id });
                    await issue.remove();
                } catch(e) {
                    console.error(e);
                    throw e;
                }

                return id;
            },

            /* COMMENTS */
            createComment: async (root: any, args: any, ctx: any) => {
                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                if (args.parent == null) {
                    return new Error('No parent provided.');
                }

                // get parent so we can check permissions
                let parentIssue;
                switch(args.parentType) {
                    case 'ISSUE':
                        // this comment's parent is an issue, find the issue and its parent project.
                        parentIssue = await db.Issue.findById(args.parent);
                        break;
                    case 'TASK':
                        // this comment's parent is a task, find the parent task and its parent issue,
                        // then finally the parent project.
                        const parentTask = await db.Task.findById(args.parent);
                        parentIssue = await db.Issue.findById(parentTask.parent);
                        break;
                }

                if (!parentIssue) {
                    throw new Error('Could not find parent issue for comment.');
                }

                const { level } = await getPermissions(parentIssue.project, ResourceType.Project, ctx.state.user.id);

                // PERMS: Create for project
                if (level < PermissionLevel.Create) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Create }, had ${ level })`);
                }

                return new db.Comment({
                    ...args,
                    creator: ctx.state.user.id,
                    dateCreated: Date.now(),
                    dateUpdated: Date.now(),
                }).save();
            },

            updateComment: async (root: any, args: any, ctx: any) => {
                const { id } = args;
                delete args.id;

                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                const comment = await db.Comment.findById(id);

                if (!comment) {
                    throw new Error(`Could not find comment to update.`);
                }

                // only comment author can delete
                if (comment.creator.toString() !== ctx.state.user.id.toString()) {
                    throw new Error(`Insufficient Permissions. (Must be author)`);
                }

                const opts = {
                    'new': true, // return the modified document rather than pre-edit document
                };

                return db.Comment.findByIdAndUpdate(id, args, opts);
            },

            deleteComment: async (root: any, args: any, ctx: any) => {
                const { id } = args;
                delete args.id;

                try {
                    if (ctx.isUnauthenticated() || ctx.state.user == null) {
                        throw new Error('Not signed in.');
                    }

                    const comment = await db.Comment.findById(id);

                    if (!comment) {
                        throw new Error('Could not find comment to delete.');
                    }

                    let parentIssue;
                    switch(comment.parentType) {
                        case 'ISSUE':
                            // this comment's parent is an issue, find the issue and its parent project.
                            parentIssue = await db.Issue.findById(comment.parent);
                            break;
                        case 'TASK':
                            // this comment's parent is a task, find the parent task and its parent issue,
                            // then finally the parent project.
                            const parentTask = await db.Task.findById(comment.parent);
                            parentIssue = await db.Issue.findById(parentTask.parent);
                            break;
                    }

                    if (!parentIssue) {
                        throw new Error('Could not find parent issue for comment.');
                    }

                    const { level } = await getPermissions(parentIssue.project, ResourceType.Project, ctx.state.user.id);

                    // PERMS: Delete for project, comment author, or issue author
                    if (level < PermissionLevel.Delete
                        && comment.creator.toString() !== ctx.state.user.id.toString()
                        && parentIssue.creator.toString() !== ctx.state.user.id.toString()
                    ) {
                        throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Delete }, had ${ level })`);
                    }

                    await comment.remove();
                } catch(e) {
                    console.error(e);
                    throw e;
                }

                return id;
            },

            createTask: async (root: any, args: any, ctx: any) => {
                if (ctx.isUnauthenticated() || ctx.state.user == null) {
                    throw new Error('Not signed in.');
                }

                if (args.parent == null) {
                    return new Error('No parent provided.');
                }

                const parentIssue = await db.Issue.findById(args.parent);

                if (!parentIssue) {
                    throw new Error('Could not find parent issue for task.');
                }

                const { level } = await getPermissions(parentIssue.project, ResourceType.Project, ctx.state.user.id);

                // PERMS: Create for project or issue author
                if (level < PermissionLevel.Create
                    && parentIssue.creator.toString() !== ctx.state.user.id.toString()
                ) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Create }, had ${ level })`);
                }

                return new db.Task({
                    ...args,
                    creator: ctx.state.user.id,
                    dateCreated: Date.now(),
                    dateUpdated: Date.now(),
                }).save();
            },

            updateTask: async (root: any, args: any, ctx: any) => {
                const { id } = args;
                delete args.id;

                if (ctx.isUnauthenticated()) {
                    throw new Error('Not signed in.');
                }

                const task = await db.Task.findById(id);

                if (!task) {
                    throw new Error('Could not find task to update.');
                }

                const parentIssue = await db.Issue.findById(task.parent).lean().exec();

                if (!parentIssue) {
                    throw new Error('Could not find parent issue for task.');
                }

                const { level } = await getPermissions(parentIssue.project, ResourceType.Project, ctx.state.user.id);

                // PERMS: Edit for project, task author, or issue author
                if (level < PermissionLevel.Edit
                    && task.creator.toString() !== ctx.state.user.id.toString()
                    && parentIssue.creator.toString() !== ctx.state.user.id.toString()
                ) {
                    throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Edit }, had ${ level })`);
                }

                const opts = {
                    'new': true, // return the modified document rather than pre-edit document
                };

                return db.Task.findByIdAndUpdate(id, args, opts);
            },

            deleteTask: async (root: any, { id }: { id: ID }, ctx: any) => {
                try {
                    if (ctx.isUnauthenticated()) {
                        throw new Error('Not signed in.');
                    }

                    const task = await db.Task.findById(id);

                    if (!task) {
                        throw new Error('Could not find task to update.');
                    }

                    const parentIssue = await db.Issue.findById(task.parent);

                    if (!parentIssue) {
                        throw new Error('Could not find parent issue for task.');
                    }

                    const { level } = await getPermissions(parentIssue.project, ResourceType.Project, ctx.state.user.id);

                    // PERMS: Delete for project, or issue author
                    if (level < PermissionLevel.Delete
                        && parentIssue.creator.toString() !== ctx.state.user.id.toString()
                    ) {
                        throw new Error(`Insufficient Permissions. (required ${ PermissionLevel.Delete }, had ${ level })`);
                    }

                    await task.remove();
                } catch(e) {
                    console.error(e);
                    throw e;
                }

                return id;
            },
        }
    });
}

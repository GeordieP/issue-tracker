import Router from 'koa-router';

import passport from 'koa-passport';
import bcrypt from 'bcryptjs';

import { User, Permission } from '../models';
import { getSitePermissions, getDefaultSitePermissions, PermissionLevel } from '../permissions';

const router = new Router();

const authenticate = (ctx: any) =>
passport.authenticate('local', async (err: Error, user: any, info: any, status: any) => {
    if (err) console.error('error in passport.authenticate', err)

    if (!user) {
        ctx.status = 400;
        const msg = 'Error: No user to authenticate.';
        console.error(msg);
        ctx.body = { status: msg };
        return
    }

    try {
        ctx.login(user);
        ctx.status = 200;
        ctx.body = {
            auth_username: ctx.state.user.username || 'ERROR: no user username',
            auth_id: ctx.state.user.id || 'ERROR: no user id',
            auth_sitePermLevel: (await getSitePermissions(ctx.state.user.id)).level || 'ERROR: no user permissions',
        }
    } catch(e) {
        console.error('error in catch of passport.authenticate', e)
    }
})(ctx);

/* REGISTER */

router.post('/auth/register', async (ctx: any) => {
    try {
        const salt = bcrypt.genSaltSync();
        const pw = bcrypt.hashSync(ctx.request.body.password, salt);

        const newUser = await new User({
            username: ctx.request.body.username,
            password: pw,
            email: ctx.request.body.email,
            fullName: ctx.request.body.fullName,
            joinDate: Date.now()
        }).save().catch(console.error);

        if (!newUser) {
            throw new Error('Failed to create new user');
        }

        const numUsers = await User.count();
        // if this is the first user create an admin permissions document for this user on site resource
        if (numUsers === 1) {
            await new Permission({
                userID: newUser._id,
                resourceID: '__SITE',
                level: PermissionLevel.Admin,
            }).save().catch(console.error);
        }

        return authenticate(ctx);
    } catch(e) {
        console.error('error in POST /auth/register', e)
    }
});

/* LOGIN */

router.post('/auth/login', async (ctx: any) => {
    try {
        if (ctx.isAuthenticated()) {
            ctx.body = {
                success: false,
                status: 'Already logged in.'
            };
            return
        }

        return authenticate(ctx);
    } catch(e) {
        console.error('error in POST /auth/login', e)
    }
});

/* LOGOUT */

router.get('/auth/logout', async (ctx: any) => {
    try {
        if (ctx.isUnauthenticated()) {
            ctx.body = {
                success: false,
                status: 'Already logged out.'
            };
            ctx.throw(401);
            return
        }

        ctx.logout();
        ctx.status = 200;
    } catch(e) {
        console.error('error in POST /auth/logout', e)
    }
});

interface AuthResponseBody {
    auth_authenticated: boolean;
    auth_username?: string;
    auth_id?: string;
    auth_sitePermLevel?: number;
}

router.get('/auth/status', async (ctx: any) => {
    try {
        const body: AuthResponseBody = {
            auth_authenticated: ctx.isAuthenticated()
        }

        // if we're logged in, add some extra info
        if (ctx.isAuthenticated()) {
            body.auth_username = ctx.state.user.username;
            body.auth_id = ctx.state.user.id;
            body.auth_sitePermLevel = (await getSitePermissions(ctx.state.user.id)).level;
        } else {
            body.auth_sitePermLevel = (await getDefaultSitePermissions()).level;
        }

        ctx.body = body;
        ctx.status = 200;
    } catch(e) {
        console.error('error in POST /auth/status', e)
    }
});

export default router;

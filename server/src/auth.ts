import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import { User } from './models';

passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser((id: ID, done: any) => {
    User.findById(id).exec()
        .then((user: any) => {
            done(null, user);
        })
        .catch((e: Error) => {
            console.error('error in deserializeruser', e)
            done(e, null);
        });
});

const options = {
    usernameField: 'email'
};

const localStrategy = new LocalStrategy(options, (email: string, password: string, done: any) => {
    // find first user where email matches
    User.findOne({ email }).exec((err: Error, doc: any) => {
        console.error('error in localstrategy findone', err)

        if (!doc) {
            return done(null, false);
        }

        // check if given password matches one from db
        return bcrypt.compareSync(password, doc.password)
            ? done(null, doc)
            : done(null, false);
    })
});

passport.use(localStrategy);

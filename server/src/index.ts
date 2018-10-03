import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';
import session from 'koa-session';
import passport from 'koa-passport';
import RedisStore from 'koa-redis';

// mongoDB
import models from './models';

// gql
import { makeExecutableSchema } from 'graphql-tools';
import graphqlSchema from './graphql/schema';
import createResolvers from './graphql/resolvers';

import authRoutes from './routes/auth';

// keys for koa-session from keys.json file
import keys from './keys';
import './auth';

// SERVER //
const app = new Koa();

// keys for koa-session
app.keys = keys;
app.use(session({
    store: new RedisStore(),   // store sessions in redis
    maxAge: 86400000,          // 1 day (default 1 day)
    overwrite: true,           // cookie can overwrite (default true)
    renew: true,               // renew when session is almost up to keep users logged in (default false)
}, app));

// body parser
app.use(bodyParser());

// DEBUGGING: time logger
// app.use(async (ctx, next) => {
//     const start = Date.now();
//     await next();
//     const ms = Date.now() - start;
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

// DEBUGGING: print headers
// app.use(async (ctx: any, next: any) => {
//     console.clear()
//     console.log(ctx.request.headers)
//     await next();
// });

// auth
app.use(passport.initialize());
app.use(passport.session());

// gql
const executableSchema = makeExecutableSchema({
    typeDefs: [graphqlSchema],
    resolvers: createResolvers(models),
});

const gql = graphqlHTTP({
    schema: executableSchema,
    graphiql: true,
    formatError: (error: any, ctx: any) => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path,
    })
});

app.use(mount('/graphql', gql));

// routes
app.use(authRoutes.routes());

app.listen(4769, console.log.bind(null, 'server listening on port 4769'));

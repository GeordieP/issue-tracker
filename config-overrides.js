module.exports = {
    webpack: (config, env) => {
        // postcss - config is in /postcss.config.js
        require('react-app-rewire-postcss')(config);
        return config;
    },
};

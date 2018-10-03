module.exports = {
    "ident": "postcss",
    "modules": true,
    "plugins": {
        "autoprefixer": {
            "browsers": [
                ">1%",
                "Firefox ESR",
                "last 4 versions",
                "not ie < 9"
            ],
            "flexbox": "no-2009",
        },
        "postcss-flexbugs-fixes": true,
        "postcss-preset-env": {
            "features": {
                "nesting-rules": true
            },
            "stage": 3,
        },
        "postcss-simple-vars": true
    }
};

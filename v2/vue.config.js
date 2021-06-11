const path = require('path')
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                json: path.join(__dirname, 'public/json'),
                '/': path.join(__dirname, 'public'),
            }
        },

    }
}
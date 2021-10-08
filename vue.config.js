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

    },
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: [path.resolve(__dirname, 'src/assets/scss/mixin.scss'), path.resolve(__dirname, 'src/assets/scss/variables.scss')]
                })
                .end()
        })
    },
}
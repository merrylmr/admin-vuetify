const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const IsProd = process.env.NODE_ENV === 'production';
module.exports = {
    configureWebpack: (config) => {
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
        const plugins = IsProd ? [
            new PrerenderSPAPlugin({
                staticDir: path.join(__dirname, 'dist'),
                routes: ['/', '/calendar'],
                server: {
                    port: 8001
                },
                renderer: new Renderer({
                    inject: {
                        foo: 'bar'
                    },
                    renderAfterDocumentEvent: 'render-event',

                })
            })
        ] : []
        return {
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, 'src'),
                    json: path.join(__dirname, 'public/json'),
                    '/': path.join(__dirname, 'public'),
                    'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'}
                },
                plugins
            }

        }
    }
}
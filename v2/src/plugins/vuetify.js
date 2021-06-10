import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

const opts = {
    icons: {
        iconfont: 'md',
    },
    theme: {
        themes: {
            light: {
                primary: colors.deepPurple.darken1,
                secondary: colors.deepPurple.lighten4,
                accent: colors.indigo.base,
            },
            dark: {
                primary: '#1976D2',
            },
        },
    },
}

export default new Vuetify(opts)
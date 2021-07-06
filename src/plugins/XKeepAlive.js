import {matches} from "./utils";
import {getKey} from "vue-navigation/src/utils";

export default (keyName) => {
    return {
        name: 'x-keep-alive',
        abstract: true,
        props: {},
        data: () => ({
            routes: []
        }),
        computed: {},
        watch: {
            routes(val) {
                for (const key in this.cache) {
                    if (!matches(val, key)) {
                        const vnode = this.cache[key]
                        vnode && vnode.componentInstance.$destroy()
                        delete this.cache[key]
                    }
                }
            }
        },
        created() {
            this.cache = {}
        },
        destroyed() {
            for (const key in this.cache) {
                const vnode = this.cache[key]
                vnode && vnode.componentInstance.$destroy()
            }
        },
        render() {
            const vnode = this.$slots.default ? this.$slots.default[0] : null
            if (vnode) {
                vnode.key = vnode.key || (vnode.isComment ? 'comment' : vnode.tag)
            }
            const key = getKey(this.$route, keyName)
            if (vnode.key.indexOf(key) === -1) {
                vnode.key = `__navigation-${key}-${vnode.key}`
            }

            if (this.cache[key]) {
                if (vnode.key === this.cache[key].key) {
                    vnode.componentInstance = this.cache[key].componentInstance
                } else {
                    this.cache[key].componentInstance.$destroy()
                    this.cache[key] = vnode;
                }
            } else {
                this.cache[key] = vnode
            }
            vnode.data.keepAlive = true
            return vnode
        }
    }
}

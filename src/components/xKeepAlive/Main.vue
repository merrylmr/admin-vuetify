<template>
    <keep-alive :include="include">
        <slot></slot>
    </keep-alive>
</template>

<script>
export default {
    name: 'x-keep-alive',
    data() {
        return {
            include: []
        }
    },
    props: {
        router: {
            type: Object
        }
    },
    watch: {
        $route(to, from) {
            if (to.meta.keepAlive) {
                !this.include.includes(to.name) && this.include.push(to.name);
            }
            if (from.meta.keepAlive && to.meta.deep < from.meta.deep) {
                const index = this.include.indexOf(from.name);
                index !== -1 && this.include.splice(index, 1);
            }
        }
    },
    mounted() {
        if (this.$route.meta.keepAlive) {
            this.include.push(this.$route.name)
        }
        this.$eventBus.$on('remove', (name) => {
            this.include = this.include.filter(item => {
                return item !== name
            })
        })

        this.$eventBus.$on('triggerActive', () => {
            console.log('this.$route.name', this.$route.name);
        })
    }
}
</script>

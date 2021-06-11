<template>
  <div class="home d-flex">
    <div class="left-sidebar">
      <v-navigation-drawer
          v-model="navSettings.drawer"
          :color="navSettings.color"
          :mini-variant="navSettings.miniVariant"
          :permanent="navSettings.permanent"
          fixed
          dark
      >
        <v-list rounded>
          <template v-for="(item,index) in menu">
            <v-list-group
                color="primary"
                v-if="item.sub && item.sub.length"
                :key="index"
                :prepend-icon="item.icon"
                value="true"
            >
              <template v-slot:activator>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </template>

              <v-list-item
                  v-for="(one, i) in item.sub"
                  :key="i"
                  link
                  :to="{path:one.value}"
              >
                <v-list-item-icon>
                  <v-icon v-text="one.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text="one.label"></v-list-item-title>
              </v-list-item>
            </v-list-group>

            <v-list-item
                :to="{path:item.value}"
                :key="index"
                link
                v-else
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="item.label"></v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
    </div>
    <div class="main-content flex-grow-0">
      <router-view></router-view>
    </div>
  </div>

</template>
<script>



export default {
  name: 'home',
  data() {
    return {
      navSettings: {
        drawer: true,
        color: 'primary',
        miniVariant: false,
        expandOnHover: false,
        permanent: true,
        background: false,
      },
      menu: [
        {
          icon: 'mdi-home',
          value: 'dashboard',
          label: 'Dashboard',
        },
        {
          label: '图表',
          value: 'chart',
          icon: 'mdi-chart-bar',
          sub: [
            {
              label: '地图',
              value: 'map',
              icon: 'mdi-map-marker',
            }
          ]
        },
        {
          label: '组件',
          value: 'component',
          icon: 'mdi-apps'
        },
        {
          label: '国际化',
          value: 'international',
          icon: 'mdi-earth'
        }
      ]
    }
  },
  computed: {
  },
  methods: {

  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
.left-sidebar {
  width: 276px;
}

.home {
  display: flex;
}

.main-content {
  flex: auto;
}
</style>
<template>
  <div class="home d-flex">
    <div class="left-sidebar">
      <v-navigation-drawer
          v-model="navSettings.drawer"
          :mini-variant="navSettings.miniVariant"
          :permanent="navSettings.permanent"
          fixed
      >
        <v-list rounded>
          <template v-for="(item,index) in menu">
            <v-list-group
                v-if="item.sub && item.sub.length"
                :key="index"
                :prepend-icon="item.icon"
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
    <div class="main-content">
      <x-keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </x-keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
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
          icon: 'mdi-apps',
          sub: [
            {
              label: '富文本',
              value: 'tinymce',
              icon: 'mdi-book-edit-outline',
            },
            {
              label: '图片裁剪',
              value: 'crop',
              icon: 'mdi-ab-testing',
            },
            {
              label: '水印',
              value: 'watermark',
              icon: 'mdi-ab-testing',
            },
            {
              label: '手机端日历',
              value: 'calendar',
              icon: 'mdi-ab-testing',
            }
          ]
        },
        {
          label: '插件',
          value: 'component',
          icon: 'mdi-apps',
          sub: [
            {
              label: 'AnchorScroll',
              value: 'anchorScroll',
              icon: 'mdi-book-edit-outline',
            },
          ]
        },
        {
          label: '缓存组件',
          value: 'keepAlive',
          icon: 'mdi-apps',
          sub: [
            {
              label: '首页-列表-详情',
              value: 'a',
              icon: 'mdi-book-edit-outline',
            },
            //  TODO:
            // {
            //   label: '列表-添加/编辑',
            //   value: 'a',
            //   icon: 'mdi-book-edit-outline',
            // },
          ]
        },
        {
          label: '读书笔记',
          value: 'note',
          icon: 'mdi-notebook-outline',
          sub: [
            {
              label: '列表',
              value: 'noteList',
              icon: 'mdi-format-list-bulleted',
            }
          ]
        },
        {
          label: 'threejs',
          value: 'threejs',
          icon: 'mdi-notebook-outline',
          sub: [
            {
              label: 'demo1',
              value: 'demo1',
              icon: 'mdi-format-list-bulleted',
            }
          ]
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
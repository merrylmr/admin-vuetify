<template>
  <div class="ma-4">
    <!-- 分类 -->
    <div>
      <template
          v-for="(item,index) in cateList"
      >
        <v-chip
            :key="index"
            class="ma-2"
            color="green"
            text-color="white"
        >
          <v-avatar
              left
              class="green darken-4"
          >
            1
          </v-avatar>
          {{ item.label }}
        </v-chip>
      </template>
    </div>
    <!--  列表  -->
    <v-list two-line subheader>
      <template v-for="(item,index) in items"
      >
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title
                v-html="item.title">
            </v-list-item-title>
            <v-list-item-subtitle
                v-html="item.desc">
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ item.time }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-img
                src="https://cdn.vuetifyjs.com/images/lists/ali.png"
                width="125px"
                height="100px"
                dark></v-img>
          </v-list-item-action>
        </v-list-item>
        <v-divider
            v-if="index + 1 < items.length"
            :key="index"
        ></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'noteList',
  data() {
    return {
      items: [
        {
          title: '向上管理',
          desc: '向上管理向上管理向上管理向上管理向上管理',
          time: '2021.7.5'
        },
        {
          title: '你当飞往你的山',
          desc: '你当飞往你的山你当飞往你的山',
          time: '2021.7.6'
        }
      ],
      cateList: [
        {
          label: '项目管理',
          value: 'project',
          icon: ''
        },
        {
          label: 'vue',
          value: 'vue',
          icon: ''
        },
        {
          label: 'html+css',
          value: 'html/css',
          icon: ''
        }
      ]
    }
  }
}
</script>
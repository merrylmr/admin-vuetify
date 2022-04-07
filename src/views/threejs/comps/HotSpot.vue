<template>
  <div>
    <v-btn class="ma-2" tile color="indigo" dark
           @click="addPointHandle">添加热点
    </v-btn>
    <v-divider></v-divider>
    <!-- 当前场景热点 -->
    <div class="list">

    </div>

    <v-navigation-drawer
        v-model="drawer"
        height="100vh"
        :right="true"
        :hide-overlay="true"
        absolute
        temporary>
      <div class="pa-4">
        <div class="header">
          <div class="header-title">添加热点</div>
          <div class="header-close">
            <!--          <v-icon v-text="dmi-"></v-icon>-->
          </div>
        </div>
        <div class="body">
          <v-form>
            <v-select
                :items="items"
                v-model="form.iconType"
                item-text="label"
                item-value="value"
                label="图标">
            </v-select>


            <!-- 系统图表列表-->
            <div class="sys-icon-list"
                 v-show="form.iconType==='sys'">
              <div class="icon-item"
                   v-for="(item,index) in sysIcons"
                   :class="{'is-active':form.iconPath===item.url}"
                   :key="index"
                   @click="changeIconHandle(item)">
                <img :src="item.url">
              </div>
            </div>
            <v-text-field
                v-show="form.iconType==='custom'"
                label="图标地址"
                v-model="form.iconPath"
                placeholder="请输入图标链接">
            </v-text-field>
            <v-subheader>图标大小</v-subheader>
            <v-slider
                thumb-label="always"
                v-model="form.iconSize"
                min="-100"
                max="100"
            ></v-slider>


            <v-select
                :items="hotTypes"
                item-text="label"
                item-value="value"
                v-model="form.hotType"
                label="热点类型">
            </v-select>

          </v-form>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import {randomString} from '@/assets/js/utils.js'
export default {
  name: 'hot-spot',
  data() {
    return {
      drawer: true,
      items: [
        {
          label: '系统图标',
          value: 'sys'
        },
        {
          label: '自定义图标',
          value: 'custom'
        }
      ],
      hotTypes: [
        {
          label: '全景切换',
          value: 'scene'
        },
        {
          label: '超链接',
          value: 'link'
        },
        {
          label: '图片热点',
          value: 'img'
        },
        {
          label: '视频热点',
          value: 'video'
        },
        {
          label: '图文热点',
          value: 'list'
        },
        {
          label: '环物热点',
          value: 'around'
        },
        {
          label: '文章热点',
          value: 'article'
        }
      ],
      sysIcons: [
        {
          key: 'forward',
          url: 'img/new_spotd1_gif.png'
        },
        {
          key: 'left',
          url: 'img/new_spotd2_gif.png'
        }],
      form: {
        iconType: 'sys',
        iconPath: 'img/new_spotd1_gif.png',
        iconSize: 10,
        hotType: 'scene',
        pos: {
          x: 0,
          y: 0,
          z: 0.1
        }
      }
    }
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    activePoint: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    changeIconHandle(item) {
      this.form.iconPath = item.key
    },
    addPointHandle() {
      this.drawer = true;
      this.form = {
        id: randomString(),
        iconType: 'sys',
        iconPath: 'img/new_spotd1_gif.png',
        iconSize: 10,
        hotType: 'scene',
        pos: {
          x: 0,
          y: 0,
          z: 0.1
        }
      }
      this.$emit('addPoint', this.form)
    }
  },
  watch: {
    activePoint(n) {
      console.log('activePoint watch:', n)

      this.form = this._.merge(this.form, this._.cloneDeep(n))
      if (n) {
        this.drawer = true;
      }
    }
  }
}
</script>


<style scoped lang="scss">
.header {
  &-title {
    font-size: 16px;
  }
}

.sys-icon-list {
  @include flex();
  flex-wrap: wrap;
}

.icon-item {
  width: 35px;
  height: 35px;
  margin: 0 2px 15px;
  cursor: pointer;
  border-radius: 2px;

  &.is-active {
    border: 2px solid #5e35b1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

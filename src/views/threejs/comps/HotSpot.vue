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
        transition="slide-x-reverse-transition"
        v-if="drawer"
        v-model="drawer"
        height="100vh"
        :right="true"
        :hide-overlay="true"
        absolute

        @input="toggleDrawerHandle"
    >
      <div class="pa-4">
        <div class="header">
          <div class="header-title"
          >添加热点
          </div>
          <div class="header-close">
            <v-btn
                small
                text
                @click="closeDrawHandle">关闭
            </v-btn>
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
                min="10"
                max="100"
                @change="changeHandle"
            ></v-slider>


            <v-select
                :items="hotTypes"
                item-text="label"
                item-value="value"
                v-model="form.hotType"
                label="热点类型">
            </v-select>

            <div>
              选择目标全景
              <v-btn color="primary"
                     @click="isShowSceneDlg=true">选择场景
              </v-btn>
              <div class="selected-scene"
                   v-if="selectedScene.id">
                <div class="selected-scene__img">
                  <img :src="selectedScene.url" alt="">
                </div>
                <div class="selected-scene__name">
                  {{ selectedScene.name }}
                </div>
              </div>
            </div>

            <div class="form-item">
              <div class="form-item__label">
                <span>标题</span>
                <v-checkbox
                    label="显示"
                    v-model="form.title.show"
                    @change="changeHandle">
                </v-checkbox>
              </div>
              <div class="form-item__value">
                <v-text-field
                    v-model="form.title.label"
                    @change="changeHandle"
                    placeholder="请输入标题">
                </v-text-field>
              </div>
            </div>


          </v-form>
        </div>
      </div>
    </v-navigation-drawer>
    <SceneDlg
        v-if="isShowSceneDlg"
        :visible="isShowSceneDlg"
        :doc="doc"
        :scene-id="form.value"
        @close="isShowSceneDlg=false"
        @sure="sureHandle">
    </SceneDlg>
  </div>
</template>

<script>
import {randomString} from '@/assets/js/utils.js'
import SceneDlg from './Scene.vue'
export default {
  name: 'hot-spot',
  data() {
    return {
      drawer: false,
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
        iconSize: 80,
        hotType: 'scene',
        value: '',
        pos: {
          x: 0,
          y: 0,
          z: 0.1
        },
        "title": {
          "label": "",
          "show": true
        }
      },
      isShowSceneDlg: false
    }
  },
  components: {SceneDlg},
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
    },
    doc: {
      type: Object,
      default: () => {
        return {
          scenes: []
        }
      }
    }
  },
  computed: {
    selectedScene() {
      return this.doc.scenes.find(item => {
        return item.id === this.form.value
      }) || {}
    }
  },
  methods: {
    changeIconHandle(item) {
      this.form.iconPath = item.url
      this.changeHandle()
    },
    addPointHandle() {
      this.drawer = true;
      this.form = {
        id: randomString(),
        iconType: 'sys',
        iconPath: 'img/new_spotd1_gif.png',
        iconSize: 80,
        hotType: 'scene',
        pos: {
          x: 0,
          y: 0,
          z: -0.2
        },
        title: {
          label: '',
          show: true
        }
      }
      this.$emit('addPoint', this.form)
    },
    toggleDrawerHandle(v) {
      console.log('toggleDrawerHandle:', v)
    },
    sureHandle(id) {
      this.form.value = id;
      this.isShowSceneDlg = false;
      this.changeHandle();
    },
    changeHandle() {
      this.$emit('change', this.form)
    },
    // 取消选中的热点
    closeDrawHandle() {
      this.drawer = false;
      this.$emit('cancel')
    }
  },
  watch: {
    activePoint: {
      handler(n) {
        console.log('activePoint watch:', n)
        this.form = this._.cloneDeep(n)
        if (n && n.id) {
          this.drawer = true;
        } else {
          this.drawer = false;
        }
      },
      deep: true
    }
  }
}
</script>


<style scoped lang="scss">
.header {
  @include flex(space-between, center);

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

.selected-scene {
  margin-top: 10px;
  border: 1px solid #eee;

  &__name {
    padding: 0 10px;
  }

  img {
    width: 100%;
  }
}

.form-item {
  &__label {
    @include flex(space-between, center);
  }
}
</style>

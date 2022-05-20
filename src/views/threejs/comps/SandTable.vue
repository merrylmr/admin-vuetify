<template>
  <div class="sand-table">
    <div class="v-title">电子沙盘</div>


    <v-text-field
        label="图片地址"
        placeholder="请输入图片地址"
        v-model="form.url"
        @change="changeHandle">
    </v-text-field>


    <div class="mt-2">
      <v-btn color="primary"
             @click="addMakerHandle">添加标记点
      </v-btn>

      <div class="marker-list mt-2">
        <div class="marker-item"
             v-for="(item,index) in sandTable.markers"
             :key="index"
             :class="{'is-active':index===activeIndex}"
             @click="clickMarkerHandle(index,item)">
          <span><span class="circle"></span>
          {{ item.name }}</span>
          <div class="marker-item__del"
               @click="delMarkerHandle(index)">
            删除
          </div>
        </div>
      </div>
    </div>

    <SceneDlg
        v-if="isShowSceneDlg"
        :visible="isShowSceneDlg"
        :doc="doc"
        :scene-id="form.value"
        :checked="checkedSceneIds"
        @close="isShowSceneDlg=false"
        @sure="sureHandle">
    </SceneDlg>
  </div>
</template>

<script>
import SceneDlg from './Scene.vue'

export default {
  name: 'sand-table',
  props: {
    sandTable: {
      type: Object,
      default: () => {
        return {
          url: ''
        }
      }
    },
    doc: {
      type: Object,
      default: () => {
        return {
          scenes: []
        }
      }
    },
    activeIndex: {
      type: Number
    }
  },
  components: {SceneDlg},
  data() {
    return {
      form: {
        url: '',
        markers: []
      },
      isShowSceneDlg: false,
      // activeIndex: -1
    }
  },
  computed: {
    checkedSceneIds() {
      const markers = this.sandTable.markers;
      return markers.map(item => {
        return item.sceneId
      })
    }
  },
  methods: {
    changeHandle() {
      this.$emit('change', this.form)
    },
    // 添加标记点
    addMakerHandle() {
      this.isShowSceneDlg = true;
    },
    sureAddMarker(data) {
      // 弹窗：场景列表
      const dom = document.getElementById('sandTableBox');
      const rect = dom.getBoundingClientRect();
      this.form.markers.push({
        pos: {
          x: rect.width / 2,
          y: rect.height / 2
        }, // 位置
        angle: 0, // 角度
        sceneId: data.id,
        name: data.name,
      })
    },
    sureHandle(data) {
      this.isShowSceneDlg = false;
      console.log('sureHandle', data);
      if (data && data.id) {
        this.sureAddMarker(data);
      }
    },
    clickMarkerHandle(index, item) {
      this.$emit('changeIndex', index, item)
    },
    // 删除点位
    delMarkerHandle(index) {
      const sandTableClone = this._.cloneDeep(this.sandTable);
      sandTableClone.markers.splice(index, 1)
      this.$emit('change', sandTableClone)
    }
  },
  created() {
    this.form = this.sandTable;
  }
}
</script>

<style scoped lang="scss">
.v-title {
  font-size: 16px;
  padding: 10px 5px;
}

.marker-item {
  padding: 10px;
  cursor: pointer;
  @include flex(space-between, center);

  &.is-active {
    .circle {
      background-color: $--color-primary;
    }
  }

  &:hover {
    background-color: #fafafa;

    .marker-item__del {
      opacity: 1;
    }
  }

  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #eee;
    display: inline-block;
  }

  &__del {
    opacity: 0;
  }
}
</style>

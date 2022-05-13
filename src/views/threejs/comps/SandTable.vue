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
             :key="index">
          <span class="circle"></span>
          {{ item.name }}
        </div>
      </div>
    </div>

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
      activeIndex: -1
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
      this.sureAddMarker(data);
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

  &:hover {
    background-color: #fafafa;
  }

  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #eee;
    display: inline-block;
  }
}
</style>

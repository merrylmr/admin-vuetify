<template>
  <v-dialog
      title="提示"
      :value="visible"
      width="500"
  >
    <v-card>
      <div
          class="item"
          v-for="(item,index) in urlList"
          :key="index"
          :class="{'is-active':item===selectedUrl}"
          @click="chooseImg(item)"
      >
        <img :src="item" alt="">
      </div>
      <div class="py-4 px-4 d-flex justify-end">
        <v-btn @click="handleClose">取 消</v-btn>
        <v-btn
            class="ml-2"
            color="primary"
            @click="sureAction">确 定
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'file-dlg',
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      urlList: ['https://f.cdn-static.cn/33245_15964263665362.gif',
        'https://f.cdn-static.cn/33245_15964416642372.jpg',
        'https://f.cdn-static.cn/33245_15964466917605.jpg'],
      selectedUrl: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    chooseImg(img) {
      this.selectedUrl = img;
      console.log('chooseImg', img)
    },
    sureAction() {
      this.$emit('insert', this.selectedUrl)
    }
  }
}
</script>
<style scoped lang="scss">
.item {
  width: 100px;
  display: inline-block;
  height: 100px;
  margin: 20px;

  &.is-active {
    border: 2px solid #1976D2;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
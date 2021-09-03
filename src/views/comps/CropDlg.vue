<template>
  <v-dialog
      width="1000"
      :value="visible"
    @click:outside="handleClose">
    <v-card>
      <div class="main d-flex">
        <div class="left-section d-flex">
          <div class="text-label">图片裁剪</div>
          <div class="clip-area d-flex justify-center align-center">
            <div class="img-wrapper">
              <img
                  :style="{
                width:imgSize.width+'px',
                height:imgSize.height+'px'}"
                  :src="src">
              <div class="clip-place">
                <div :style="cropStyle" style="position: absolute;">
                  <div class="img-mask"
                       style="position: absolute; "
                       :style="{...cropMaskUrl}">
                    <img
                        style="position: absolute;"
                        :style="{
                  width:imgSize.width+'px',
                  height:imgSize.height+'px',
                  left:-clipRect.x+'px',
                  top:-clipRect.y+'px'
                  }"
                        :src="src" alt="">
                  </div>
                  <!--   边框 -->
                  <div class="clip-h-line"></div>
                  <div class="clip-h-line bottom"></div>
                  <div class="clip-v-line"></div>
                  <div class="clip-v-line right"></div>
                  <div class="clip-move"
                       @mousedown="startMoveHandle"></div>
                  <!--   操作点 -->
                  <div class="handles">
                    <div class="handle"
                         @mousedown="mousedownHandle($event,item)"
                         v-for="(item,index) in handles"
                         :key="index"
                         :class="'handle-'+item"
                         :style="{'cursor':cursors[index]}">
                    </div>
                  </div>
                </div>
                <div>
                </div>
              </div>
              <img
                  :style="{
                width:imgSize.width+'px',
                height:imgSize.height+'px'}"
                  class="bg-img"
                  :src="src">
            </div>
          </div>
        </div>
        <div class="right-section">
          <div class="text-label">裁剪形状</div>
          <div class="shape-list d-flex">
            <div class="shape-item"
                 :class="{'is-active':item.type===selectedShape.type}"
                 v-for="(item,index) in shapeList"
                 :key="index"
                 @click="selectShapeHandle(item)">
              <img v-if="item.url"
                   :src="item.url" alt="">
              <span v-else></span>
            </div>
          </div>
          <div class="text-label">裁剪比例</div>
          <v-radio-group
              v-model="clipRect.rate"
              @change="changeRateHandle">
            <v-radio
                v-for="(item,index) in rateList"
                :value="item.value"
                :label="item.label"
                :key="index">
            </v-radio>
          </v-radio-group>

          <div class="btn-bottom">
            <v-btn @click="handleClose">取消</v-btn>
            <v-btn color="primary ml-2"
                   @click="sureAction">确定
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {getImgOriginSize} from '@/assets/js/image.js'

export default {
  name: 'crop-comp',
  props: {
    visible: {
      type: Boolean
    },
    crop: {
      type: Object,
      default: () => {
        return {
          type: '',
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      }
    },
    src: {
      type: String,
      default:'https://dora-doc.qiniu.com/gogopher.jpg'
    }
  },
  data() {
    return {
      shapeList: [
        {
          label: '矩形',
          type: 'rect',
          url: ''
        },
        {
          label: '圆形',
          type: 'circle',
          url: '/img/circle.svg'
        },
        {
          label: '三角形',
          type: 'triangle',
          url: '/img/triangle.svg'
        },
      ],
      handles: ['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l'],
      cursors: ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'],
      rateList: [
        {
          label: '原始比列',
          value: 'origin'
        },
        {
          label: '1:1',
          value: '1'
        },
        {
          label: '4:3',
          value: '4/3'
        },
        {
          label: '3:4',
          value: '3/4',
        },
        // {
        //   label: '标准屏幕尺寸',
        //   value: 'screen'
        // },
        // {
        //   label: '1/2屏比列',
        //   value: '1/2screen'
        // },
        // {
        //   label: '1/3屏比列',
        //   value: '1/3screen'
        // },
        {
          label: '自定义',
          value: 'custom'
        }
      ],
      imgSize: {
        width: 200,
        height: 200
      },
      // 裁剪的区域
      clipRect: {
        width: 100,
        height: 100,
        x: 10,
        y: 10,
        type: 'rect',
        rate: 'custom',
      },
      rate: 1,
    }
  },
  computed: {
    cropStyle() {
      return {
        width: this.clipRect.width + 'px',
        height: this.clipRect.height + 'px',
        left: this.clipRect.x + 'px',
        top: this.clipRect.y + 'px'
      }
    },
    cropMaskUrl() {
      if (this.selectedShape.url) {
        return {
          '-webkit-mask-box-image-source': `url(${this.selectedShape.url})`,
          ' -webkit-mask-box-image-slice': 'initial',
          '-webkit-mask-box-image-width': 'initial',
          '-webkit-mask-box-image-outset': 'initial',
          '-webkit-mask-box-image-repeat': 'initial'
        }
      } else {
        return {}
      }
    },
    selectedShape() {
      return this.shapeList.find(item => {
        return this.clipRect.type === item.type
      })
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    getClipArea() {
      const clipAreaDom = document.querySelector('.clip-area');
      console.log('clipAreaDom', clipAreaDom.clientWidth, clipAreaDom.clientHeight)
      return {
        width: clipAreaDom.clientWidth,
        height: clipAreaDom.clientHeight
      }
    },
    // 计算图片的宽高
    async calcImgSize() {
      const clipSize = this.getClipArea()
      //  图片的原始高度及当前区域的宽高
      const originSize = await getImgOriginSize((this.src));
      if (originSize.width < clipSize.width && originSize.height < clipSize.height) {
        return originSize
      } else {

        //  原始的宽高都大于区域；
        //  原始的宽度大于区域的宽度；
        //  原始的高度大于区域的高度；
        if (originSize.width > originSize.height) {
          this.rate = 300 / originSize.width
          return {
            width: 300,
            height: originSize.height * 300 / originSize.width
          }
        } else {
          this.rate = 300 / originSize.height
          return {
            height: 300,
            width: originSize.width / originSize.height * 300
          }
        }
      }
      // const maxV = Math.max(originSize.width, originSize.height);
      // console.log('originSize', originSize, maxV)
    },
    selectShapeHandle(item) {
      this.clipRect.type = item.type;
    },

    mousedownHandle(e, dir) {
      let pos = {
        x: e.clientX,
        y: e.clientY
      }
      const beforeRect = this._.cloneDeep(this.clipRect);
      const rect = this._.cloneDeep(this.clipRect);


      const moveHandle = (e) => {
        const curPos = {
          x: e.clientX,
          y: e.clientY
        }

        let diffX = curPos.x - pos.x;
        let diffY = curPos.y - pos.y;

        switch (dir) {
          case 'r':
            // 限制宽度（不能超过imgSize.W）
            if (beforeRect.width + diffX + beforeRect.x > this.imgSize.width) {
              diffX = this.imgSize.width - beforeRect.width - beforeRect.x;
            }
            rect.width = beforeRect.width + diffX;
            break;
          case 'l':
            if (beforeRect.x + diffX < 0) {
              diffX = -beforeRect.x;
            }
            rect.width = beforeRect.width - diffX;
            rect.x = beforeRect.x + diffX;
            break;
          case 't':
            if (beforeRect.y + diffY < 0) {
              diffY = -beforeRect.y
            }
            rect.height = beforeRect.height - diffY;
            rect.y = beforeRect.y + diffY;
            break;
          case 'b':
            if (beforeRect.height + diffY + beforeRect.y > this.imgSize.height) {
              diffY = this.imgSize.height - beforeRect.height - beforeRect.y;
            }
            rect.height = beforeRect.height + diffY;
            break;
          case 'tr':
            if (beforeRect.y + diffY < 0) {
              diffY = -beforeRect.y
            }
            rect.height = beforeRect.height - diffY;
            rect.y = beforeRect.y + diffY;

            if (beforeRect.width + diffX + beforeRect.x > this.imgSize.width) {
              diffX = this.imgSize.width - beforeRect.width - beforeRect.x;
            }

            rect.width = beforeRect.width + diffX;
            break;
          case 'tl':
            if (beforeRect.y + diffY < 0) {
              diffY = -beforeRect.y
            }
            rect.height = beforeRect.height - diffY;
            rect.y = beforeRect.y + diffY;

            if (beforeRect.x + diffX < 0) {
              diffX = -beforeRect.x;
            }
            rect.width = beforeRect.width - diffX;
            rect.x = beforeRect.x + diffX;
            break;
          case 'bl':
            if (beforeRect.height + diffY + beforeRect.y > this.imgSize.height) {
              diffY = this.imgSize.height - beforeRect.height - beforeRect.y;
            }
            rect.height = beforeRect.height + diffY

            if (beforeRect.x + diffX < 0) {
              diffX = -beforeRect.x;
            }
            rect.width = beforeRect.width - diffX;
            rect.x = beforeRect.x + diffX;
            break;
          case 'br':
            if (beforeRect.height + diffY + beforeRect.y > this.imgSize.height) {
              diffY = this.imgSize.height - beforeRect.height - beforeRect.y;
            }
            rect.height = beforeRect.height + diffY;

            // 限制宽度（不能超过imgSize.W）
            if (beforeRect.width + diffX + beforeRect.x > this.imgSize.width) {
              diffX = this.imgSize.width - beforeRect.width - beforeRect.x;
            }
            rect.width = beforeRect.width + diffX;
            break;
          default:
            break;
        }
        this.clipRect = this._.cloneDeep(rect);
      }
      const upHandle = () => {
        document.removeEventListener('mousemove', moveHandle)
        document.removeEventListener('mouseup', upHandle)
      }
      document.addEventListener('mousemove', moveHandle)
      document.addEventListener('mouseup', upHandle)
      console.log('dir', dir);
    },
    // 开始拖动
    startMoveHandle(e) {
      const pos = {
        x: e.clientX,
        y: e.clientY
      };

      const beforeRect = this._.cloneDeep(this.clipRect);
      const rect = this._.cloneDeep(this.clipRect);

      const moveHandle = (e) => {
        let diffX = e.clientX - pos.x;
        let diffY = e.clientY - pos.y;

        // 边界判断

        if (beforeRect.x + diffX < 0) {
          diffX = -beforeRect.x;
        } else if (beforeRect.x + diffX + beforeRect.width > this.imgSize.width) {
          diffX = this.imgSize.width - beforeRect.width - beforeRect.x;
        }

        if (beforeRect.y + diffY < 0) {
          diffY = -beforeRect.y;
        } else if (beforeRect.y + diffY + beforeRect.height > this.imgSize.height) {
          diffY = this.imgSize.height - beforeRect.height - beforeRect.y;
        }
        rect.x = beforeRect.x + diffX;
        rect.y = beforeRect.y + diffY;

        this.clipRect = rect;
      }

      const upHandle = () => {
        document.removeEventListener('mousemove', moveHandle)
        document.removeEventListener('mouseup', upHandle)
      }
      document.addEventListener('mousemove', moveHandle)
      document.addEventListener('mouseup', upHandle)
    },
    sureAction() {
      const rect = this._.cloneDeep(this.clipRect);
      if (this.rate !== 1) {
        rect.width = parseInt(rect.width / this.rate);
        rect.height = parseInt(rect.height / this.rate);
        rect.x = parseInt(rect.x / this.rate)
        rect.y = parseInt(rect.y / this.rate);
      }
      console.log('this.clipRect', rect);
      this.$emit('change', rect)
    },
    changeRateHandle() {
      this.clipRect.x = 0;
      this.clipRect.y = 0;
      switch (this.clipRect.rate) {
        case 'origin':
          this.clipRect.width = this.imgSize.width;
          this.clipRect.height = this.imgSize.height;
          break;
        case '1': {
          const min = Math.min(this.imgSize.width, this.imgSize.height);
          this.clipRect.width = min;
          this.clipRect.height = min;
        }
          break;
        case '4/3':
          if (this.imgSize.height >= this.imgSize.width) {
            this.clipRect.width = this.imgSize.width;
            this.clipRect.height = this.imgSize.width * 3 / 4;
          } else {
            this.clipRect.width = this.imgSize.height * 4 / 3;
            this.clipRect.height = this.imgSize.height;
          }
          break;
        case '3/4':
          if (this.imgSize.height > this.imgSize.width) {
            this.clipRect.width = this.imgSize.width;
            this.clipRect.height = this.imgSize.width * 4 / 3
          } else {
            // w> h
            this.clipRect.width = this.imgSize.height * 3 / 4
            this.clipRect.height = this.imgSize.height;
          }
          break;
          // case 'screen':
          //   this.clipRect.width = this.imgSize.width;
          //   this.clipRect.height = this.imgSize.height;
          //   break;
          // case '1/3screen':
          //   break;
          // case '1/2screen':
          //   break;
        case 'custom':
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.imgSize = await this.calcImgSize();

      this.clipRect = {
        type: this.crop.type || 'rect',
        x: this.crop.x * this.rate,
        y: this.crop.y * this.rate,
        width: this.crop.width * this.rate || this.imgSize.width,
        height: this.crop.height * this.rate || this.imgSize.height,
        rate: this.crop.rate || 'custom'
      }
    })
  }
}
</script>

<style scoped lang="scss">
.img {
  -webkit-user-drag: none;
}

.main {
  height: 500px;
}

.left-section {
  flex: auto;
  background-color: #000;
  height: 100%;
  padding: 20px;
  flex-direction: column;

  .text-label {
    font-size: 18px;
    color: #fff;
    flex: none;
  }

  .clip-area {
    background-color: #303030;
    width: 100%;
    height: 100%;
    flex: 1;
    text-align: center;
    box-sizing: border-box;

    img {
      display: inherit;
    }

    .img-wrapper {
      position: relative;

      .bg-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.6;
      }
    }

    .clip-place {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0, 0, 0);
    }
  }
}

.right-section {
  position: relative;
  padding: 10px;
  width: 200px;
  flex: none;
  //height: 100%;

  .text-label {
    font-weight: bold;
    margin-top: 20px;
  }
}

.shape-list {
  //@include flex();
}

.shape-item {
  width: 25px;
  height: 25px;
  cursor: pointer;
  margin: 8px;

  &.is-active {
    border: 1px solid #673AB7;
  }

  span {
    display: block;
    width: 100%;
    height: 100%;
    background-color: #666;
  }

  img {
    width: 100%;
  }
}


.img-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  overflow: hidden;

}

.clip-h-line {
  height: 1px !important;
  width: 100%;

  &.bottom {
    bottom: 0;
  }
}

.clip-h-line,
.clip-v-line {
  opacity: 0.4;
  position: absolute;
  background: #FFF url(/img/Jcrop.gif);
}

.clip-v-line {
  height: 100%;
  width: 1px !important;

  &.right {
    right: 0;
  }
}

.clip-move {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: move;
  z-index: 360;
}

.handle {
  box-sizing: border-box;
  position: absolute;
  background-color: #333;
  border: 1px #EEE solid;
  font-size: 1px;
  height: 7px;
  width: 7px;
  opacity: 0.5;
  z-index: 601;

  &-tl {
    top: -4px;
    left: -4px;
  }

  &-t {
    top: -4px;
    left: 50%;
    margin-left: -4px;
  }

  &-tr {
    top: -4px;
    right: -4px;
  }

  &-l {
    top: 50%;
    margin-top: -4px;
    left: -4px;
  }

  &-r {
    top: 50%;
    margin-top: -4px;
    right: -4px;
  }

  &-bl {
    bottom: -4px;
    left: -4px;
  }

  &-b {
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
  }

  &-br {
    bottom: -4px;
    right: -4px;
  }
}

.btn-bottom {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
  text-align: center;
}

img {
  user-drag: none;
  -webkit-user-drag: none;
}
</style>

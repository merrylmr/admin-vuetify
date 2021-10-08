<template>
  <div class="ma-4">
    <v-btn @click="visible=true">裁剪</v-btn>
    <v-row class="mt-2">
      <v-col cols="6">
        <v-card :style="cropMask">
          <img
              :src="url"
              style="width:100%">
        </v-card>
      </v-col>
      <CropDlg
          v-if="visible"
          :visible="visible"
          :crop="crop"
          @close="visible=false"
          @change="cropHandle"
      >
      </CropDlg>
    </v-row>
  </div>

</template>

<script>
import CropDlg from './CropDlg'
import {CLIP_URL} from '@/assets/js/const.js'

export default {
  name: 'crop',
  data() {
    return {
      visible: false,
      src: 'https://dora-doc.qiniu.com/gogopher.jpg',
      crop: {
        type: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },
  components: {CropDlg},
  computed: {
    cropMask() {
      const crop = this.crop;
      if (!crop) {
        return {}
      }
      const url = CLIP_URL[crop.type]
      if (url) {
        return {
          '-webkit-mask-box-image-source': `url(${url})`,
          'mask-box-image-source': `url(${url})`,
          ' -webkit-mask-box-image-slice': 'initial',
          '-webkit-mask-box-image-width': 'initial',
          '-webkit-mask-box-image-outset': 'initial',
          '-webkit-mask-box-image-repeat': 'initial'
        }
      } else {
        return {}
      }
    },
    url() {
      return this.cropImg(this.src)
    }
  },
  methods: {
    cropImg(url) {
      const crop = this.crop;
      const src = this.src;
      if (src && crop.width && crop.height) {
        const suffix = `imageMogr2/crop/!${crop.width}x${crop.height}a${crop.x}a${crop.y}`
        const connectChar = url.includes('?') ? '&' : '?'
        return url + connectChar + suffix
      } else {
        return url
      }
    },
    cropHandle(info) {
      this.crop = info;
      this.visible = false;
    }
  }
}
</script>
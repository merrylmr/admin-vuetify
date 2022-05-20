<template>
  <v-dialog
      width="600px"
      :value="visible"
      :overlay-opacity="0.8"
      @click:outside="closeHandle">
    <v-card>
      <v-card-title>选择场景</v-card-title>
      <div class="wrapper">
        <div class="scene-lit">
          <template v-for="(item,index) in doc.scenes">
            <div class="scene-item"
                 :key="index"
                 v-if="!checked.includes(item.id)"
                 :class="{'is-active':selectedItem.id===item.id}"
                 @click="clickItemHandle(item)">
              <div class="scene-item__img">
                <img :src="item.url" alt="">
              </div>
              <div class="scene-item__name">
                {{ item.name }}
              </div>
            </div>
          </template>
        </div>


      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="sureAction"
        >
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  name: 'scene-dlg',
  props: {
    visible: {
      type: Boolean
    },
    doc: {
      type: Object,
      default: () => {
        return {
          scenes: []
        }
      }
    },
    sceneId: {
      type: String,
    },
    checked: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedItem: {}
    }
  },
  methods: {
    closeHandle() {
      console.log('closeHandle');
      this.$emit('close')
    },
    clickItemHandle(item) {
      this.selectedItem = item;
    },
    sureAction() {
      this.$emit('sure', this.selectedItem)
    }
  },
  created() {
    if (this.sceneId) {
      this.selectedItem = this.doc.scenes.find(item => {
        return item.id === this.sceneId
      })
    }
  }
}
</script>


<style scoped lang="scss">
.scene-lit {
  @include flex()
}

.scene-item {
  width: 80px;
  margin-right: 10px;
  cursor: pointer;


  &.is-active {
    .scene-item__img {
      border: 2px solid $--color-primary
    }
  }

  &__img {
    height: 80px;
    border: 2px solid transparent;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__name {
    text-align: center;
  }
}

.wrapper {
  padding: 20px;
}
</style>

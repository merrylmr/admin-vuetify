<template>
  <div>
    <editor
        v-model="value"
        :init="init">
    </editor>
    <fileDlg
        v-if="isShowFileDlg"
        :visible="isShowFileDlg"
        @close="isShowFileDlg=false"
        @insert="insertImgHandle"></fileDlg>
  </div>

</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import Editor from '@tinymce/tinymce-vue'

import FileDlg from '../../components/FileDlg';

export default {
  name: 'tinymce-comp',
  data() {
    return {
      editor: null,
      value: '',
      isShowFileDlg: false,
      init: {
        placeholder: '输入内容',
        fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 50px 56px 60px 64px',
        language_url: '/tinymce/langs/zh_CN.js',// 语言包的路径
        language: 'zh_CN',//语言
        skin_url: '/tinymce/skins/ui/oxide',// skin路径
        height: 500,//编辑器高度
        branding: false,//是否禁用“Powered by TinyMCE”
        menubar: true,//顶部菜单栏显示,
        base_url: '/tinymce',
        toolbar: 'undo redo | formatselect fontsizeselect  | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code codesample link help customBtn',
        plugins: [],
        setup: (editor) => {
          this.editor = editor
          editor.ui.registry.addButton('customBtn', {
            icon: 'image',
            tooltip: '图库',
            text: '图片库',
            onAction: () => {
              this.isShowFileDlg = true;
            }
          })
        }
      },

    }
  },
  components: {Editor, FileDlg},
  methods: {
    insertImgHandle(url) {
      const imgDom = `<img src="${url}" width="500" />`
      this.editor && this.editor.insertContent(imgDom);
      this.isShowFileDlg = false;
    }
  },
  mounted() {
    tinymce.init({});
  }
}
</script>
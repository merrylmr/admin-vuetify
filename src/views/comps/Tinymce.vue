<template>
  <div>
    <editor v-model="value" :init="init"></editor>
  </div>
</template>

<script>
// 引入基本文件
// import 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
// import 'tinymce/themes/silver'

// 引入你需要的插件
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/link';

export default {
  name: 'tinymce-comp',
  data() {
    return {
      value: '',
      init: {
        language_url: '/tinymce/langs/zh_CN.js',// 语言包的路径
        language: 'zh_CN',//语言
        skin_url: 'tinymce/skins/ui/oxide',// skin路径
        height: 300,//编辑器高度
        branding: false,//是否禁用“Powered by TinyMCE”
        menubar: true,//顶部菜单栏显示,
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code codesample link help',
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
            'codesample'
        ],
      }
    }
  },
  components: {Editor},
  mounted() {
    // Initialize the app
    // tinymce.init({ });
  }
}
</script>
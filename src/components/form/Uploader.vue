<template lang="pug">
  .uploader
    img.img-thumbnail(v-if="localValue && isImage", :src="localValue")
    audio.mb-3(v-if="localValue && isAudio", :src="localValue", controls)
    input(type="file", @change="onSelectFile", :accept="mimeType", :id="domId")
    label.btn.btn-outline-primary.btn-block.animated(
      :class="isUploading ? 'disabled' : ''",
      :for="domId",
      @animationend="removeFlash"
    )
      template(v-if="isUploading")
        i.fa.fa-spin.fa-spinner
        | {{ this.progress * 100 / 100 >> 0 }}%
      template(v-else)
        i.fa(:class="fileIcon")
        | 上传{{this.fileType}}
    p.alert.alert-danger(v-if="error") {{error}}
    p.help-block.text-center {{ label }}
</template>

<script>
  import axios from 'axios';
  import {uniqueId} from 'lodash';

  export default {
    props: {
      value: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: '请上传 mp3 格式的音频文件',
      },
      type: {
        type: String,
        default: 'audio',
      },
      fileType: {
        type: String,
        default: '音频',
      },
      fileIcon: {
        type: String,
        default: 'fa-file-audio-o',
      },
      mimeType: {
        type: String,
        default: 'audio/*',
      },
      extension: {
        type: RegExp,
        default: /\.mp3$/i,
      },
      errorMessage: {
        type: String,
        default: '只能上传 MP3 格式的音频',
      },
    },

    computed: {
      domId() {
        return 'file-input-' + this.uid;
      },
      isImage() {
        return /\.(jpg|png|gif)$/.test(this.localValue);
      },
      isAudio() {
        return /\.mp3$/.test(this.localValue);
      },
    },

    data() {
      return {
        isUploading: false,
        uid: '',
        error: '',
        localValue: '',
        progress: 0,
      };
    },

    methods: {
      processValue() {
        this.localValue = this.value || '';
      },
      removeFlash(event) {
        event.target.classList.remove('flash');
      },
      onSelectFile(event) {
        if (this.isUploading) {
          alert('正在上传，请稍候');
          event.target.value = '';
          return;
        }
        let file = event.target.files[0];
        if (!this.extension.test(file.name)) {
          alert(this.errorMessage);
          event.target.value = '';
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert('只能上传不大于 10M 的文件。');
          event.target.value = '';
          return;
        }
        this.progress = 0;
        this.isUploading = true;
        let form = new FormData();
        form.append('file', file);
        form.append('type', this.type);
        axios.post('file', form, {
          onUploadProgress: this.onUploadProgress.bind(this),
        })
          .then( json => {
            this.error = '';
            this.$emit('input', json.path);
          })
          .catch( err => {
            if (err.response && err.response.data) {
              err = err.response.data.message;
            } else if (err.status === 422) {
              err = JSON.stringify(err.body);
            }
            this.error = err;
          })
          .then(() => {
            this.isUploading = false;
          });
        event.target.value = '';
      },
      onUploadProgress(event) {
        this.progress = event.loaded / event.total;
      },
    },

    created() {
      this.uid = uniqueId('uploader-');
    },

    beforeMount() {
      this.processValue();
    },

    watch: {
      value() {
        this.processValue();
      },
    },
  }
</script>

<style lang="stylus">
  .uploader
    audio,
    .img-thumbnail
      width 100%

    input[type=file]
      display none
</style>
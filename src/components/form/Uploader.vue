<template lang="pug">
  .uploader.row
    label.col-md-2.form-control-label(
      :for="domId"
    ) {{label}}
    .col-md-6
      audio.mb-3(v-if="localValue", :src="localValue", controls)
      input(type="file", @change="onSelectFile", accept="audio/*", :id="domId")
      label.btn.btn-outline-primary.btn-block.animated(
        :class="isUploading ? 'disabled' : ''",
        :for="domId",
        @animationend="removeFlash"
      )
        i.fa.fa-spin.fa-spinner(v-if="isUploading")
        i.fa.fa-file-audio-o(v-else)
        | 上传音频
      p.alert.alert-danger(v-if="error") {{error}}
      p.help-block.text-center 目前支持 wav 格式
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
        default: '上传音频',
      },
    },

    computed: {
      domId() {
        return 'file-input-' + this.uid;
      },
    },

    data() {
      return {
        isUploading: false,
        uid: '',
        error: '',
        localValue: '',
      }
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
        if (!/\.(wav|mp3)/i.test(file.name)) {
          alert('只能上传 *.wav 格式的音频。');
          event.target.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('只能上传不大于 5M 的音频。');
          event.target.value = '';
          return;
        }
        this.isUploading = true;
        let form = new FormData();
        form.append('file', file);
        axios.post('file', form)
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
  audio
    width 100%
</style>
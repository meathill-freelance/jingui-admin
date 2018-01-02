<template lang="pug">
  .uploader.row
    label.col-md-2.form-control-label(:for="domId") {{label}}
    .col-md-6
      audio.mb-3(v-if="localValue", :src="localValue", controls)
      input(type="file", @change="onSelectFile", accept="audio/*", :id="domId")
      label.btn.btn-outline-primary.btn-block.animated(
        :for="domId",
        @animationend="removeFlash"
      )
        i.fa.fa-file-audio-o
        | 上传音频
      p.alert.alert-danger(v-if="error") {{error}}
      p.help-block.text-center 目前支持 mp3 格式
</template>

<script>
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
        uid: '',
        error: '',
        localValue: '',
      }
    },

    methods: {
      processValue() {
        this.localValue = value;
      },
      removeFlash(event) {
        event.target.classList.remove('flash');
      },
      onSelectFile(event) {
        let file = event.target.files[0];
        if (!/\.mp3$/i.test(file.name)) {
          alert('只能上传 *.mp3 格式的图片。');
          event.target.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('只能上传不大于 5M 的音频。');
          event.target.value = '';
          return;
        }
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
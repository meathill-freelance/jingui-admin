<template lang="pug">
.bg-white.px-3.pt-3.pb-1.formData-editor
  form.form-horizontal(
    :action="API + 'season/'",
    method="post",
    @submit.prevent="save"
  )
    h3.mb-4 基础信息
    .form-group.row
      label.col-md-2.form-control-label(for="title") 名称
      .col-md-6
        input.form-control(
          id="title",
          name="title",
          placeholder="名称",
          v-model="formData.title",
          required,
          maxlength="100"
        )
    .form-group.row
      label.col-md-2.form-control-label(for="start_at") 开始时间
      .col-md-6
        datepicker#start_at(
          v-model="formData.start_at"
          format="yyyy-MM-dd",
          name="published_time",
          placeholder="开始日期",
        )
    .form-group.row
      label.col-md-2.form-control-label(for="duration") 长度
      .col-md-2
        .input-group
          input.form-control(
            type="number",
            id="duration",
            v-model="formData.duration",
            placeholder="长度",
            name="duration",
          )
          .input-group-addon 天

    hr
    .alert.offset-2(:class="'alert-' + status", v-if="message") {{message}}
    .form-group.row
      .col-sm-10.offset-2
        button.btn.btn-primary(:disabled="preventSubmit")
          i.fa.fa-spin.fa-spinner(v-if="loading")
          i.fa.fa-check(v-else)
          | 保存
        router-link.btn.btn-link(:to="{name: season}") 取消
</template>

<script>
import {assign} from 'lodash';
import axios from 'axios';

import Datepicker from 'src/components/Datepicker.vue';
import baseMixin from 'src/mixin/base';

/* global API */

export default {
  components: {
    Datepicker,
  },
  mixins: [baseMixin],

  data() {
    return {
      formData: {
        title: '',
        start_at: '',
        duration: 21,
      },

      API: API,
      loading: false,
      message: '',
      status: ''
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    preventSubmit() {
      return this.loading || this.status === 'success';
    },
  },
  methods: {
    fetch() {
      return axios.get(`season/${this.id}`)
        .then( json => {
          this.loading = false;
          this.formData = json.data;
        })
        .catch( err => {
          alert('加载学期失败。' + err);
        });
    },
    removeFlash(event) {
      event.target.classList.remove('flash');
    },
    save() {
      this.loading = true;
      let api = 'season';
      let method = this.id ? 'patch' : 'post';
      if (this.id) {
        api += '/' + this.id;
      }
      const data = assign({}, this.formData, this.extraData);
      axios[method](api, data)
        .then( json => {
          if (json.code !== 0) {
            throw new Error('保存失败。' + json.msg);
          }

          this.message = '保存成功';
          this.status = 'success';
          setTimeout( () => {
            this.$router.push({
              name: '学期管理'
            })
          }, 2500);
        })
        .catch( err => {
          if (err.status === 422) { // 提交数据有误，表单验证不通过
            err = '保存失败。' + err.body.map((value, key) => {
              if (value instanceof Array) {
                value = value.join('');
              }
              return value.replace(key, DICT[key]);
            }).join('; ');
          } else if (err.status === 423) {
            err = err.body.msg;
          }
          this.message = err;
          this.status = 'danger';
        })
        .then(() => {
          this.loading = false;
        });
    }
  },
  beforeMount() {
    if (this.id) {
      this.loading = true;
      return this.fetch();
    }
  },
  watch: {
    '$route'(to) {
      this.id = to.params.id;
      this.fetch();
    },
  },
}
</script>
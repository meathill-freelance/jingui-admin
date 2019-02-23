<template lang="pug">
.bg-white.px-3.pt-3.pb-1.formData-editor
  h3.mb-4 基础信息
  form.form-horizontal(
    v-if="isLoaded",
    :action="API + 'cover/'",
    method="post",
    @submit.prevent="save"
  )
    .form-group.row
      label.col-md-2.form-control-label(for="name") 商品名称
      .col-md-6
        input#name.form-control(
          name="name",
          placeholder="名称",
          v-model="formData.name",
          required,
          maxlength="40",
        )
    .form-group.row
      label.col-md-2.form-control-label(for="price") 商品价格
      .col-md-6
        input#price.form-control(
          type="number",
          name="price",
          placeholder="价格",
          v-model="formData.price",
          required,
        )
    .form-group.row
      label.col-sm-2.form-control-label(for="type") 商品类型
      .col-sm-6
        select#type.form-control(v-model="formData.type", required)
          option(value="", disabled) 请选择
          option(value="1") 精品课程
          option(value="2") 考研书籍
    .form-group.row
      label.col-sm-2.form-control-label(for="link") 商品链接
      .col-sm-6
        input#link.form-control(
          name="link",
          placeholder="如果是小程序则填写小程序 appId",
          v-model="formData.link",
          required,
        )
        small.form-text.text-muted 小程序必须关联到同一公众号下
    .form-group.row
      label.col-md-2.form-control-label(for="thumbnail") 商品缩略图
      .col-md-6
        uploader#thumbnail.form-group(
          v-model="formData.thumbnail",
          file-type="图片",
          file-icon="fa-file-image-o",
          mime-type="image/*",
          label="请上传 jpg png 格式的图片文件",
          errorMessage="只能上传 JPG、PNG 格式的图片文件。",
          type="product",
          :extension="extensionReg",
        )

    hr
    .alert.offset-2(:class="'alert-' + status", v-if="message") {{message}}
    .form-group.row
      .col-sm-10.offset-2
        button.btn.btn-primary(:disabled="preventSubmit")
          i.fa.fa-spin.fa-spinner.mr-2(v-if="isSaving")
          i.fa.fa-check.mr-2(v-else)
          | 保存
        router-link.btn.btn-link(:to="{name: 'shop.list'}") 取消

  div(v-else)
    i.fa.fa-spin.fa-spinner.fa-3x
</template>

<script>
import {assign, } from 'lodash';
import axios from 'axios';

import Datepicker from 'src/components/Datepicker.vue';
import Uploader from 'src/components/form/Uploader';
import baseMixin from 'src/mixin/base';

/* global API */

export default {
  components: {
    Datepicker,
    Uploader,
  },
  mixins: [
    baseMixin,
  ],

  data () {
    return {
      formData: {
        name: '',
        type: '',
        thumbnail: '',
        price: null,
        link: '',
      },

      API: API,
      isLoaded: true,
      isSaving: false,
      message: '',
      status: '',
      extensionReg: /\.(jpg|png)$/i,
    };
  },
  computed: {
    id () {
      return this.$route.params.id;
    },
    preventSubmit () {
      return this.isSaving || this.status === 'success';
    },
  },
  methods: {
    fetch () {
      return axios.get(`product/${this.id}`)
        .then(json => {
          this.isLoaded = true;
          this.formData = json.data;
        })
        .catch(err => {
          alert('加载商品信息失败。' + err);
        });
    },
    removeFlash (event) {
      event.target.classList.remove('flash');
    },
    save () {
      this.isSaving = true;
      let api = 'product';
      let method = this.id ? 'patch' : 'post';
      if (this.id) {
        api += '/' + this.id;
      }
      const data = assign({}, this.formData, this.extraData);
      axios[method](api, data)
        .then(json => {
          if (json.code !== 0) {
            throw new Error('保存失败。' + json.msg);
          }

          this.message = '保存成功';
          this.status = 'success';
          setTimeout(() => {
            this.$router.push({
              name: 'shop.list',
            });
          }, 2500);
        })
        .catch(err => {
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
          this.isSaving = false;
        });
    },
  },
  beforeMount () {
    if (this.id) {
      this.isLoaded = false;
      return this.fetch();
    }
  },
  watch: {
    '$route' (to) {
      this.id = to.params.id;
      this.fetch();
    },
  },
};
</script>

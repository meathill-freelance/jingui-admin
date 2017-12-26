<template lang="pug">
.bg-white.px-3.pt-3.pb-1.exercise-editor
  <form :action="API + 'product/'" method="post" enctype="multipart/form-data" class="form-horizontal" @submit.prevent="save">
    h3.mb-4 基础信息
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="title">作业标题</label>
      <div class="col-md-6">
        <input id="title" name="title" class="form-control" placeholder="作业标题" v-model="exercise.title" required maxlength="100">
      </div>
    </div>
    .form-group.row
      <label class="col-md-2 form-control-label" for="published_time">上线日期</label>
      .col-md-6
        p.form-control-static(v-if="published") {{exercise.published_time}}
        input#published_time.form-control(
          v-else
          v-model="exercise.published_time"
          name="published_time"
          placeholder="上线日期"
        )
    .form-group.row
      <label class="col-md-2 form-control-label" for="type">作业类型</label>
      .col-md-6
        select#type.form-control(name="category", v-model.number="exercise.type")
          option(value="0") 听力练习
          option(value="1") 阅读联系
    hr
    template(v-if="exercise.type === 0")
      .form-group.uploader.row
        label.col-md-2.form-control-label(for="file-input") 上传音频
        .col-md-6
          input#file-input(type="file", @change="onSelectFile", accept="image/*")
          label.btn.btn-outline-primary.btn-block.animated(
            for="file-input",
            @animationend="removeFlash"
          )
            i.fa.fa-file-audio-o
            | 上传音频
          p.alert.alert-danger(v-if="thumbnailError") {{thumbnailError}}
          p.help-block.text-center 支持 mp3 格式，文件不大于 1M
      .form-group.row
        label.col-md-2.form-control-label 问题

    template(v-else)
      .form-group.row
        label.col-md-2.form-control-label(for="article") 阅读文字
        .col-md-6
          textarea#article.form-control(v-model="extraData.article" rows="6")
    .alert.offset-2(:class="'alert-' + status", v-if="message") {{message}}
    <div class="form-group row">
      <div class="col-sm-10 offset-2">
        <button class="btn btn-primary" :disabled="preventSubmit">
          <i class="fa fa-spin fa-spinner" v-if="loading"></i>
          <i class="fa fa-check" v-else></i>
          | 保存
        </button>
        <a class="btn btn-link" href="#/product/">取消</a>
      </div>
    </div>
  </form>
</template>

<script>
import {mapObject, isString} from 'lodash';
import axios from 'axios';
import moment from 'moment';

/* global API */

const tomorrow = parseInt(moment().add(1, 'days').format('X'));

export default {
  data() {
    return {
      exercise: {
        title: '',
        published_at: '',
        type: 0,
      },
      extraData: {

      },

      API: API,
      thumbnailError: '',
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
    published() {
      return this.id && this.exercise.published_at < tomorrow;
    },
  },
  created() {
    if (this.id) {
      this.loading = true;
      return this.fetch();
    }
  },
  methods: {
    fetch() {
      return axios.get(`exercise/${this.id}`)
        .then( json => {
          this.loading = false;
          this.exercise = json.exercise;
        })
        .catch( err => {
          alert('加载商品属性失败。' + err);
        });
    },
    onSelectFile(event) {
      let file = event.target.files[0];
      if (!/\.(png|jpg|jpeg)$/i.test(file.name)) {
        alert('只能上传 *.jpg，*.png 格式的图片。');
        return;
      }
      if (file.size > 1024 * 1024) {
        alert('只能上传不大于 1M 的图片。');
        return;
      }
      let form = new FormData();
      form.append('file', file);
      this.$http.post(this.API + 'file', form)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          this.thumbnailError = '';
          this.product.thumbnail = json.path;
        })
        .catch( err => {
          if (err.status === 422) {
            err = JSON.stringify(err.body);
          }
          this.thumbnailError = err;
        });
      event.target.value = '';
    },
    removeFlash(event) {
      event.target.classList.remove('flash');
    },
    save() {
      if (!this.product.thumbnail) {
        alert('请上传商品图片。');
        this.$el.querySelector('[for=file-input]').classList.add('flash');
        return;
      }
      this.loading = true;
      let api = 'product';
      let method = this.id ? 'patch' : 'post';
      if (this.id) {
        api += '/' + this.id;
      }
      axios[method](api, this.product)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          if (json.code === 0) {
            if (!this.id) {
              mapObject(this.product, value => {
                return isString(value) ? '' : 0;
              });
            }
            this.message = '保存成功';
            this.status = 'success';
            setTimeout( () => {
              this.$router.push({
                name: '商品管理'
              })
            }, 2500);
          } else {
            this.message = '保存失败。' + json.msg;
            this.status = 'danger';
          }
          this.loading = false;
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
          this.loading = false;
        });
    }
  },
  watch: {
    '$route'(to) {
      this.id = to.params.id;
      this.fetch();
    }
  }
}
</script>
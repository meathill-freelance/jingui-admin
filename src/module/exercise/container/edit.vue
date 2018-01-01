<template lang="pug">
.bg-white.px-3.pt-3.pb-1.exercise-editor
  form.form-horizontal(
    :action="API + 'exercise/'",
    method="post",
    enctype="multipart/form-data",
    @submit.prevent="save"
  )
    h3.mb-4 基础信息
    .form-group.row
      label.col-md-2.form-control-label(for="title") 作业标题
      .col-md-6
        input.form-control(
          id="title",
          name="title",
          placeholder="作业标题",
          v-model="exercise.title",
          required,
          maxlength="100"
        )
    .form-group.row
      label.col-md-2.form-control-label(for="season") 学期
      .col-md-6
        select.form-control(
          id="season",
          name="season_id",
          v-model="exercise.season_id",
          required,
        )
          option(value='', disabled) 请选择
          option(v-for="item in seasons", :value="item.id") {{item.title}} ({{item.start_at}} ~ {{item.end_at}})
    .form-group.row
      label.col-md-2.form-control-label(for="published_time") 上线日期
      .col-md-6
        p.form-control-static(v-if="id") {{exercise.published_at | toDate}}
        datepicker#published_time(
          v-else
          v-model="exercise.published_at"
          format="yyyy-MM-dd",
          name="published_time"
          placeholder="上线日期"
        )
    .form-group.row
      <label class="col-md-2 form-control-label" for="type">作业类型</label>
      .col-md-6
        p.form-control-static(v-if="id") {{ exercise.type | toType }}
        select#type.form-control(
          v-else,
          name="category",
          v-model.number="exercise.type",
        )
          option(value="0") 听力练习
          option(value="1") 阅读练习

    hr
    template(v-if="exercise.type === 0")
      .form-group.uploader.row
        label.col-md-2.form-control-label(for="file-input") 上传音频
        .col-md-6
          audio.mb-3(v-if="extraData.audio", :src="extraData.audio", controls)
          input#file-input(type="file", @change="onSelectFile", accept="audio/*")
          label.btn.btn-outline-primary.btn-block.animated(
            for="file-input",
            @animationend="removeFlash"
          )
            i.fa.fa-file-audio-o
            | 上传音频
          p.alert.alert-danger(v-if="thumbnailError") {{thumbnailError}}
          p.help-block.text-center 目前支持 mp3 格式
      .form-group.row
        label.col-md-2.form-control-label 问题
        .col-md-8
          select-question(v-model="extraData.questions")
    template(v-else)
      .form-group.row
        label.col-md-2.form-control-label(for="article") 阅读文字
        .col-md-6
          textarea#article.form-control(v-model="extraData.article" rows="6")

    hr
    .alert.offset-2(:class="'alert-' + status", v-if="message") {{message}}
    .form-group.row
      .col-sm-10.offset-2
        button.btn.btn-primary(:disabled="preventSubmit")
          i.fa.fa-spin.fa-spinner(v-if="loading")
          i.fa.fa-check(v-else)
          | 保存
        a.btn.btn-link(href="#/exercise/") 取消
</template>

<script>
import {assign} from 'lodash';
import axios from 'axios';
import moment from 'moment';

import SelectQuestion from 'src/components/SelectQuestion.vue';
import Datepicker from 'src/components/Datepicker.vue';
import baseMixin from 'src/mixin/base';
import exerciseMixin from "src/mixin/exercise";

/* global API */

const tomorrow = parseInt(moment().add(1, 'days').format('X'));

export default {
  components: {
    Datepicker,
    SelectQuestion,
  },
  mixins: [baseMixin, exerciseMixin],

  data() {
    return {
      exercise: {
        title: '',
        published_at: '',
        type: 0,
      },
      extraData: {
        audio: '',
        questions: null,
        article: '',
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
  methods: {
    fetch() {
      return axios.get(`exercise/${this.id}`)
        .then( json => {
          this.loading = false;
          this.exercise = json.exercise;
          this.extraData = json.extra;
        })
        .catch( err => {
          alert('加载作业失败。' + err);
        });
    },
    onSelectFile(event) {
      let file = event.target.files[0];
      if (!/\.mp3$/i.test(file.name)) {
        alert('只能上传 *.mp3 格式的图片。');
        event.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('只能上传不大于 1M 的图片。');
        event.target.value = '';
        return;
      }
      let form = new FormData();
      form.append('file', file);
      axios.post('file', form)
        .then( json => {
          this.thumbnailError = '';
          this.extraData.audio = json.path;
        })
        .catch( err => {
          if (err.response && err.response.data) {
            err = err.response.data.message;
          } else if (err.status === 422) {
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
      if (this.exercise.type === 0 && !this.extraData.audio) {
        alert('请上传听力资料。');
        this.$el.querySelector('[for=file-input]').classList.add('flash');
        return;
      }
      this.loading = true;
      let api = 'exercise';
      let method = this.id ? 'patch' : 'post';
      if (this.id) {
        api += '/' + this.id;
      }
      const data = assign({}, this.exercise, this.extraData);
      axios[method](api, data)
        .then( json => {
          if (json.code !== 0) {
            throw new Error('保存失败。' + json.msg);
          }

          this.message = '保存成功';
          this.status = 'success';
          setTimeout( () => {
            this.$router.push({
              name: '作业管理'
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
    }
  }
}
</script>
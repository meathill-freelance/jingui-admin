<template lang="pug">
.bg-white.px-3.pt-3.pb-1.exercise-editor
  h3.mb-4 基础信息
  form.form-horizontal(
    v-if="isLoaded",
    :action="API + 'exercise/'",
    method="post",
    enctype="multipart/form-data",
    @submit.prevent="save"
  )
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
      label.col-md-2.form-control-label(for="published_time") 上线日期
      .col-md-6
        p.form-control-static(v-if="published") {{exercise.published_at | toDate}}
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
          option(value="0") 听力练习（选择题）
          option(value="1") 口语练习
          option(value="2") 听力练习（填空题）

    hr
    uploader.form-group(v-model="extraData.audio")
    template(v-if="exercise.type === 0")
      .form-group.row
        label.col-md-2.form-control-label 问题
        .col-md-8
          select-question(v-model="extraData.questions")
      .form-group.row
        label.col-md-2.form-control-label(for="article") 听力原文
        .col-md-8
          textarea#article.form-control(
            v-model="extraData.article",
            placeholder="听力原文",
            rows="6"
          )
      .form-group.row
        label.col-md-2.form-control-label(for="explain") 问题解析
        .col-md-8
          textarea#explain.form-control(
            v-model="extraData.explain",
            placeholder="问题解析",
            rows="6",
          )
    template(v-else-if="exercise.type === 1")
      .form-group.row
        label.col-md-2.form-control-label(for="article") 全部阅读文字
        .col-md-6
          textarea#article.form-control(v-model="extraData.article" rows="6")
      template(v-for="item in 3")
        uploader.form-group(v-model="extraData.audios[item - 1]", :label="getPartLabel(item)")
        .form-group.row
          label.col-md-2.form-control-label(:for="'article-' + item") {{getPartLabel(item)}}
          .col-md-6
            textarea.form-control(
              :id="'article-' + item",
              v-model="extraData.articles[item - 1]",
              rows="3"
            )
    template(v-else)
      .form-group.row
        label.col-md-2.form-control-label(for="article") 听力原文
        .col-md-6
          textarea#article.form-control(v-model="extraData.article" rows="8")
          p.form-text.text-muted 请将需要填写的部分用 {}包裹起来，比如“have a {nice} day”，nice 即需要填写的文字。

    hr
    .alert.offset-2(:class="'alert-' + status", v-if="message") {{message}}
    .form-group.row
      .col-sm-10.offset-2
        button.btn.btn-primary(:disabled="preventSubmit")
          i.fa.fa-spin.fa-spinner(v-if="isSaving")
          i.fa.fa-check(v-else)
          | 保存
        a.btn.btn-link(href="#/exercise/") 取消

  div(v-else)
    i.fa.fa-spin.fa-spinner.fa-3x
</template>

<script>
import {assign} from 'lodash';
import axios from 'axios';
import moment from 'moment';

import SelectQuestion from 'src/components/SelectQuestion.vue';
import Datepicker from 'src/components/Datepicker.vue';
import Uploader from 'src/components/form/Uploader';
import baseMixin from 'src/mixin/base';
import exerciseMixin from "src/mixin/exercise";
import {HANZI} from 'src/data/format';

/* global API */

const tomorrow = parseInt(moment().add(1, 'days').format('X'));

export default {
  components: {
    Datepicker,
    SelectQuestion,
    Uploader,
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
        audios: [],
        articles: [],
        explain: '',
      },

      API: API,
      thumbnailError: '',
      isLoaded: true,
      isSaving: false,
      message: '',
      status: ''
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    preventSubmit() {
      return this.isSaving || this.status === 'success';
    },
    published() {
      return this.id && this.exercise.published_at < tomorrow;
    },
  },
  methods: {
    fetch() {
      return axios.get(`exercise/${this.id}`)
        .then( json => {
          this.isLoaded = true;
          this.exercise = json.exercise;
          this.extraData = json.extra;
        })
        .catch( err => {
          alert('加载作业失败。' + err);
        });
    },
    getPartLabel(index) {
      return `第${HANZI[index]}部分`;
    },
    save() {
      if (!this.extraData.audio) {
        alert('请上传听力资料。');
        this.$el.querySelector('[for=file-input]').classList.add('flash');
        return;
      }
      this.isSaving = true;
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
          this.isSaving = false;
        });
    }
  },
  beforeMount() {
    if (this.id) {
      this.isLoaded = false;
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
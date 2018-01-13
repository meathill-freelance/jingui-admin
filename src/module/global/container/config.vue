<template lang="pug">
  .bg-white.p-3
    table.table.table-bordered
      thead
        tr
          th 字段名
          th 字段值
      tbody
        tr(v-for="item in formData")
          td {{ item.name }}
          td
            .alert.alert-danger(v-if="item.error") {{ item.error }}
            .d-flex(v-if="item.isEditing")
              input.form-control.mr-2(
                :type="item.type",
                :placeholder="item.placeholder",
                v-model="item.value",
                @keydown.enter.prevent="save(item)",
              )
              spin-button.btn.btn-primary(
                @click.native="save(item)",
                :saving="item.isSaving"
              ) 保存
              button.btn.btn-link(@click="cancel(item)") 取消
            a.editable(v-else, @click="edit(item)")
              span {{ item.value }}
              i.fa.fa-edit
            transition(
              enter-active-class="animated fadeIn",
              leave-active-class="animated fadeOut",
            )
              .badge.badge-success.ml-3(v-if="item.isSuccess") 保存成功
</template>

<script>
  import axios from 'axios';
  import {pick} from 'lodash';

  import SpinButton from 'src/components/form/SpinButton.vue';
  import {convertKeyToName, fillKeys} from "src/data/global";

  export default {
    components: {
      SpinButton,
    },

    data() {
      return {
        formData: null,
      }
    },

    methods: {
      cancel(item) {
        item.value = item.origin;
        item.isEditing = false;
      },
      edit(item) {
        item.isEditing = true;
      },
      save(item) {
        item.isSaving = true;
        let method = item.id ? 'put' : 'post';
        let url = 'global/config';
        if (item.id) {
          url = url + '/' + item.id;
        }
        axios[method](url, pick(item, 'key', 'value'))
          .then(() => {
            item.isEditing = false;
            item.isSuccess = true;
            item.origin = item.value;
            clearTimeout(item.timeout);
            item.timeout = setTimeout(() => {
              item.isSuccess = false;
            }, 3000);
          })
          .catch(err => {
            item.error = err.data && err.data.msg || '保存失败';
          })
          .then(() => {
            item.isSaving = false;
          });
      },
    },

    beforeMount() {
      axios.get('global/config')
        .then(response => {
          let data = fillKeys(response.data || []);
          this.formData = data.map(item => {
            item.name = item.name || convertKeyToName(item.key);
            item.isEditing = false;
            item.isSuccess = false;
            item.origin = item.value;
            return item;
          });
        });
    },
  }
</script>
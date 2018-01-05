<template lang="pug">
  div.select-question-field(@change="onChange")
    div.card(v-for="(item, index) in localValue", :data-id="item.uid")
      h4 题目-{{index + 1}}
      .form-group
        input.form-control(
          :id="uid + '-' + index",
          v-model="item.title",
          placeholder="题目",
        )
      template(v-for="(option, index2) in item.options")
        .row
          .col-2.text-right
            .form-check.mt-2
              label.form-check-label
                input.form-check-input(
                  type="radio",
                  v-model="item.answer",
                  :name="uid + '-' + index + '-answer'",
                  :value="index2",
                )
                span 正确
          .col-10
            input.form-control.option(
              v-model="item.options[index2]",
              @keydown.enter.prevent="addOption(item)",
            )
      .row.mt-3
        .offset-2.col-10
          button.btn.btn-secondary(type="button", @click="addOption(item)")
            i.fa.fa-plus
            | 添加新答案

    button.btn.btn-secondary(type="button", @click="add")
      i.fa.fa-plus
      | 添加新题目
</template>

<script>
  import {uniqueId} from 'lodash';

  export default {
    props: {
      value: {
        type: Array,
        default: null,
      },
    },

    data() {
      return {
        uid: uniqueId('sq-'),
        localValue: null,
      };
    },

    methods: {
      createDefaultItem: function () {
        return {
          title: '题目',
          answer: '',
          options: ['答案一'],
        };
      },

      add() {
        this.localValue.push(this.createDefaultItem());
      },

      addOption(item) {
        item.options.push('');
        let uid = uniqueId('sq-input-');
        item.uid = uid;
        this.$nextTick()
          .then(() => {
            let group = this.$el.querySelector(`[data-id="${uid}"]`);
            let options = group.querySelectorAll('.option');
            options[options.length - 1].focus();
          });
      },

      processValue() {
        this.localValue = this.value || [];
        if (this.localValue.length === 0) {
          this.add();
        }
      },

      onChange() {
        this.$emit('input', this.localValue);
      },
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
  .select-question-field .card
    padding 1em
</style>
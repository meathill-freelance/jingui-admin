<!-- Copyright (C) 2017 by OpenResty Inc. All rights reserved. -->

<template lang="pug">
  button.btn(
    :type="type",
    :class="className",
    :disabled="saving",
  )
    i.fa(
      :class="iconClass",
      v-if="icon || saving",
    )
    slot
</template>

<script>
  export default {
    props: {
      type: {
        default: 'submit',
      },
      saving: false,
      icon: '',
      buttonClass: '',
    },

    computed: {
      className() {
        return this.buttonClass ? this.buttonClass : 'btn-primary';
      },

      iconClass() {
        return this.saving ? 'fa-spin fa-spinner' : this.icon;
      },
    },
  }
</script>
<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="clearfix">
            <h1 class="display-3">服务器出错</h1>
            <h4 class="pt-3">不要惊慌，这没什么大不了的。请记录您的操作过程，联络管理员。</h4>
            <p class="lead">同时报告这些信息：</p>
            <p v-text="message"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page500',
  computed: {
    message() {
      return JSON.stringify(this.$store.state.error);
    }
  }
}
</script>

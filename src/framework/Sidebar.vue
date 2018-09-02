<template lang="pug">
  .sidebar
    nav.sidebar-nav
      ul.nav
        li.nav-item
          router-link.nav-link(to="/dashboard")
            i.icon-speedometer
            | 首页
        router-link.nav-item.nav-dropdown(
          tag="li",
          :to="{ path: '/cover'}",
          disabled,
        )
          .nav-link.nav-dropdown-toggle(@click="handleClick")
            i.icon-picture
            | 微信群管理
          ul.nav-dropdown-items
            li.nav-item
              router-link.nav-link(to="/cover/new")
                i.icon-plus
                | 新建群
            li.nav-item
              router-link.nav-link(to="/cover/list")
                i.icon-picture
                | 全部微信群
        li.nav-item
          router-link.nav-link(
            to="/feedback",
          )
            i.icon-bubbles
            | 意见建议
        li.nav-item
          router-link.nav-link(
            to="/customer",
          )
            i.icon-user
            | 用户信息
        li.nav-item
          router-link.nav-link(to="/global")
            i.icon-settings
            | 全局设置
</template>

<script>

export default {
  name: 'sidebar',
  methods: {
    handleClick (e) {
      e.preventDefault();
      e.target.parentElement.classList.toggle('open');
    }
  }
}
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>

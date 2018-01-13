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
          :to="{ path: '/exercise'}",
          disabled
        )
          .nav-link.nav-dropdown-toggle(@click="handleClick")
            i.icon-puzzle
            | 作业管理
          ul.nav-dropdown-items
            li.nav-item
              router-link.nav-link(to="/exercise/new")
                i.icon-plus
                | 添加作业
            li.nav-item
              router-link.nav-link(:to="'/exercise/list'", exact)
                i.icon-puzzle
                | 全部作业
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

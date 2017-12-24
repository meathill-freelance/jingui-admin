<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <li class="nav-item">
          <router-link :to="'/dashboard'" class="nav-link"><i class="icon-speedometer"></i> 首页</router-link>
        </li>
        <router-link tag="li" class="nav-item nav-dropdown" :to="{ path: '/products'}" disabled>
          <div class="nav-link nav-dropdown-toggle" @click="handleClick"><i class="icon-puzzle"></i> 商品管理</div>
          <ul class="nav-dropdown-items">
            <li class="nav-item">
              <router-link :to="'/product/list'" class="nav-link" exact><i class="icon-puzzle"></i> 全部商品</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="'/product/category'" class="nav-link" exact><i class="icon-puzzle"></i> 商品分类</router-link>
            </li>
          </ul>
        </router-link>
        <li class="nav-item">
          <router-link :to="{ path: '/shelf/list'}" class="nav-link" exact><i class="icon-star"></i> 货架管理</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/order'" class="nav-link" exact><i class="icon-calculator"></i> 订单管理</router-link>
        </li>
      </ul>
    </nav>
  </div>
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

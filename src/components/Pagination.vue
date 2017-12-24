<template>
<nav aria-label="Page navigation">
  <ul class="pagination" @click.prevent="onClick">
    <li class="page-item" :class="hasPrevious ? '' : 'disabled'">
      <a class="page-link" href="#" aria-label="上一页" v-if="hasPrevious" :data-to="current - 1 > 0 ? current - 1 : 0">
        <i aria-hidden="true" class="fa fa-chevron-left"></i>
        <span class="sr-only">上一页</span>
      </a>
      <span class="page-link" v-else><i class="fa fa-chevron-left"></i></span>
    </li>
    <li v-for="page in pages" class="page-item" :class="current === page ? 'active' : ''">
      <a class="page-link" href="#" :data-to="page">{{page + 1}} <span class="sr-only">(current)</span> </a>
    </li>
    <li class="page-item" :class="hasNext ? '' : 'disabled'">
      <a class="page-link" href="#" aria-label="下一页" v-if="hasNext" :data-to="current < last - 2 ? current + 1 : last - 1">
        <i aria-hidden="true" class="fa fa-chevron-right"></i>
        <span class="sr-only">下一页</span>
      </a>
      <span class="page-link" v-else><i class="fa fa-chevron-right"></i></span>
    </li>
  </ul>
</nav>
</template>

<script>
export default {
  name: 'pagination',
  data() {
    return {
      current: 0
    }
  },
  computed: {
    hasNext() {
      return this.current < this.last - 1;
    },
    hasPrevious() {
      return this.current > 0;
    },
    last() {
      return Math.ceil(this.total / this.perPage);
    },
    pages() {
      let start = this.current > 5 ? this.current - 5 : 0;
      let end = this.current < this.last - 5 ? this.current + 5 : this.last;
      let array = [];
      for (; start < end; start++) {
        array.push(start);
      }
      return array;
    }
  },
  props: {
    total: Number,
    perPage: {
      type: Number,
      default: 20
    }
  },
  methods: {
    onClick(event) {
      if (event.target.classList.contains('disabled')) {
        return;
      }
      let to = Number(event.target.getAttribute('data-to'));
      if (to === this.current) {
        return;
      }
      this.current = to;
      this.$emit('change', to);
    }
  }
}
</script>
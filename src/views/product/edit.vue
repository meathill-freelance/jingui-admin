<template>
<div class="bg-white px-3 pt-3 pb-1 product-editor">
  <form :action="API + 'product/'" method="post" enctype="multipart/form-data" class="form-horizontal" @submit.prevent="save">
    <h3 class="mb-4">基础信息</h3>
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="fullname">商品全称</label>
      <div class="col-md-6">
        <input id="fullname" name="fullname" class="form-control" placeholder="商品全称" v-model="product.fullname" required maxlength="100">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="pcode">商品编码</label>
      <div class="col-md-6">
        <p class="form-control-static" v-if="id">{{product.pcode}}</p>
        <input id="pcode" name="pcode" class="form-control" placeholder="商品编码" v-model="product.pcode" v-else>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="price">零售价格</label>
      <div class="col-md-3">
        <div class="input-group">
          <span class="input-group-addon">&yen;</span>
          <input type="number" id="price" name="price" class="form-control" placeholder="零售价格" v-model="product.price" required step="0.01" min="0.01">
          <span class="input-group-addon">元</span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="cost">成本价格</label>
      <div class="col-md-3">
        <div class="input-group">
          <span class="input-group-addon">&yen;</span>
          <input type="number" id="cost" name="cost" class="form-control" placeholder="成本价格" v-model="product.cost" required step="0.01" min="0.01">
          <span class="input-group-addon">元</span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="category">商品分类</label>
      <div class="col-md-6">
        <select id="category" name="category" class="form-control" v-model="product.category">
          <option value="0">默认分类</option>
          <option v-for="(item, index) in allCategory" :value="item.id">{{item.name}}</option>
        </select>
      </div>
    </div>
    <div class="form-group uploader">
      <img :src="product.thumbnail" class="img-thumbnail" v-if="product.thumbnail">
      <input type="file" id="file-input" @change="onSelectFile" accept="image/*">
      <label class="btn btn-outline-primary btn-block animated" for="file-input" @animationend="removeFlash">
        <i class="fa fa-file-image-o"></i>
        上传图片
      </label>
      <p class="alert alert-danger" v-if="thumbnailError">
        {{thumbnailError}}
      </p>
      <p class="help-block text-center">
        支持 jpg, png 格式，文件不大于 1M
      </p>
    </div>
    <hr>
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="comment">备注</label>
      <div class="col-md-6">
        <textarea id="comment" name="comment" rows="4" class="form-control" placeholder="备注" v-model="product.comment" maxlength="200"></textarea>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-2 form-control-label" for="visible">是否可用</label>
      <div class="col-md-6">
        <label class="switch switch-3d switch-primary">
          <input type="checkbox" class="switch-input" v-model="product.visible" id="visible" name="visible" :true-value="1" :false-value="0">
          <span class="switch-label"></span>
          <span class="switch-handle"></span>
        </label>
      </div>
    </div>
    <div class="alert offset-2" :class="'alert-' + status" v-if="message">
      {{message}}
    </div>
    <div class="form-group row">
      <div class="col-sm-10 offset-2">
        <button class="btn btn-primary" :disabled="preventSubmit">
          <i class="fa fa-spin fa-spinner" v-if="loading"></i>
          <i class="fa fa-check" v-else></i>
          保存
        </button>
        <a class="btn btn-link" href="#/product/">取消</a>
      </div>
    </div>
  </form>
</div>
</template>

<script>
import _ from 'underscore';

const DICT = {
  fullname: '商品全称',
  pcode: '商品编码',
  comment: '备注'
};

export default {
  data() {
    return {
      id: 0,
      product: {
        fullname: '',
        pcode: '',
        price: 0,
        cost: 0,
        category: 0,
        comment: '',
        thumbnail: '',
        visible: 0
      },
      thumbnailError: '',
      loading: false,
      allCategory: [],
      message: '',
      status: ''
    };
  },
  computed: {
    API() {
      return this.$store.state.API;
    },
    preventSubmit() {
      return this.loading || this.status === 'success';
    }
  },
  created() {
    this.id = this.$route.params.id;
    if (this.id) {
      this.loading = true;
    }
    let promise = this.$http.get(this.API + 'category')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then( json => {
        this.allCategory = json.list;
      })
      .catch(err => {
        alert('加载商品分类失败。' + err);
      });
    if (this.id) {
      promise.then( () => {
        return this.fetch();
      });
    }
  },
  methods: {
    fetch() {
      return this.$http.get(`${this.API}product/${this.id}`)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          this.loading = false;
          json.product.price /= 100;
          json.product.cost /= 100;
          this.product = json.product;
        })
        .catch( err => {
          alert('加载商品属性失败。' + err);
        })
    },
    onSelectFile(event) {
      let file = event.target.files[0];
      if (!/\.(png|jpg|jpeg)$/i.test(file.name)) {
        alert('只能上传 *.jpg，*.png 格式的图片。');
        return;
      }
      if (file.size > 1024 * 1024) {
        alert('只能上传不大于 1M 的图片。');
        return;
      }
      let form = new FormData();
      form.append('file', file);
      this.$http.post(this.API + 'file', form)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          this.thumbnailError = '';
          this.product.thumbnail = json.path;
        })
        .catch( err => {
          if (err.status === 422) {
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
      if (!this.product.thumbnail) {
        alert('请上传商品图片。');
        this.$el.querySelector('[for=file-input]').classList.add('flash');
        return;
      }
      this.loading = true;
      let api = this.API + 'product';
      let method = this.id ? 'patch' : 'post';
      if (this.id) {
        api += '/' + this.id;
      }
      this.$http[method](api, this.product)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          if (json.code === 0) {
            if (!this.id) {
              _.mapObject(this.product, value => {
                return _.isString(value) ? '' : 0;
              });
            }
            this.message = '保存成功';
            this.status = 'success';
            setTimeout( () => {
              this.$router.push({
                name: '商品管理'
              })
            }, 2500);
          } else {
            this.message = '保存失败。' + json.msg;
            this.status = 'danger';
          }
          this.loading = false;
        })
        .catch( err => {
          if (err.status === 422) { // 提交数据有误，表单验证不通过
            err = '保存失败。' + _.map(err.body, (value, key) => {
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
          this.loading = false;
        });
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
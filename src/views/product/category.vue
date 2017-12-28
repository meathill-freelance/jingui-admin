<template>
<div class="bg-white px-3 pt-3 pb-1">
  <table class="table table-bordered">
    <thead>
    <th>分类 ID</th>
    <th>分类名称</th>
    <th>操作</th>
    </thead>
    <tbody>
    <tr v-for="(item, index) in list">
      <td>{{item.id}}</td>
      <td>{{item.name}}</td>
      <td>
        <button type="button" class="btn btn-outline-info" @click="edit(index)" v-if="item.id">
          <i class="fa fa-edit"></i>
          编辑
        </button>
        <button type="button" class="btn btn-danger" @click="remove(index, item.id)" v-if="item.id" :disabled="item.loading">
          <i class="fa fa-spin fa-spinner" v-if="item.loading"></i>
          <i class="fa fa-trash" v-else></i>
          删除
        </button>
      </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <td colspan="3">
        <button type="button" class="btn btn-outline-primary" @click="add">
          <i class="fa fa-plus"></i>
          新增分类
        </button>
      </td>
    </tr>
    </tfoot>
  </table>
  <modal :title="modalTitle" v-model="modal" @ok="save" @cancel="close" effect="fade/zoom" okText="确定" cancelText="取消" :status="modalStatus" :message="modalMessage">
    <form class="form-inline row" @submit.prevent="save">
      <label for="category-name" class="col-sm-3 form-control-label">分类名称</label>
      <div class="col-sm-9">
        <input name="name" class="form-control" placeholder="分类名称" id="category-name" v-model="categoryName" required minlength="1" maxlength="100">
      </div>
    </form>
  </modal>
</div>
</template>

<script>
  import _ from 'lodash';
  import { API } from 'config';
  import Modal from '../../components/Modal.vue';
  import STATUS from '../../components/ModalStatus';

  const DICT = {
    'name': '分类名称'
  };

  export default {
    components: {
      Modal
    },
    data() {
      return {
        modal: false,
        modalTitle: '',
        modalStatus: STATUS.NORMAL,
        modalMessage: '',
        categoryName: '',
        currentID: 0,
        list: [
          {
            id: 0,
            name: '默认分类'
          }
        ]
      }
    },
    created() {
      this.$http.get(API + 'category/')
        .then( response => {
          return response.json();
        })
        .then( json => {
          this.list = this.list.concat(json.list.map( item => {
            item.loading = false;
            return item;
          }));
        });
    },
    methods: {
      add() {
        this.modalTitle = '新增分类';
        this.modal = true;
        this.currentID = 0;
      },
      close() {
        this.modal = false;
      },
      edit(index) {
        this.modalTitle = '编辑分类';
        this.modal = true;
        this.currentIndex = index;
        this.currentID = this.list[index].id;
        this.categoryName = this.list[index].name
      },
      remove(index, id) {
        let name = this.list[index].name;
        if (!confirm(`您确定要删除“${name}”这个分类么？`)) {
          return;
        }
        this.$http.delete(`${API}category/${id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then(json => {
            this.list[index].loading = false;
            if (json.code === 0) {
              this.list.splice(index, 1);
            } else {
              alert(json.msg);
            }
          })
          .catch(err => {
            if (err.status === 400) {
              alert(err.body.msg);
            }
            this.list[index].loading = false;
          });
      },
      save() {
        if (!this.categoryName.trim()) {
          alert('请填写分类名称');
          return;
        }
        this.modalStatus = STATUS.LOADING;
        let api = API + 'category';
        let method = this.currentID ? 'patch' : 'post';
        if (this.currentID) {
          api += '/' + this.currentID;
        }
        this.$http[method](api, {
          name: this.categoryName
        })
          .then( response => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then( json => {
            if (json.code === 0) {
              if (this.currentID) {
                this.list[this.currentIndex].name = this.categoryName;
              } else {
                this.list.push({
                  id: json.id,
                  name: this.categoryName
                });
              }
              this.modalStatus = STATUS.SUCCESS;
              this.modalMessage = '操作成功';
            } else {
              this.modalStatus = STATUS.ERROR;
              this.modalMessage = '操作失败';
            }
          })
          .catch(err => {
            if (err.status === 422) { // 提交的数据有误
              err = '保存分类失败。' + _.map(err.body, (value, key) => {
                  if (value instanceof Array) {
                    value = value.join('');
                  }
                  return value.replace(key, DICT[key]);
                }).join('; ');
            }
            this.modalStatus = STATUS.ERROR;
            this.modalMessage = err;
          })
          .then( () => {
            this.currentID = this.currentIndex = 0;
            this.categoryName = '';
          });
      }
    }
  }
</script>
<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-tools"></i>
        </div>
        <h3>Postmaster Tools</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <tabbed-control tabs="Search by List Name,Subscribers by E-mail">
            <tabbed-item slot="tab_0">
              <!-- <pm-tools-search></pm-tools-search> -->
              <div>
                <div class="form-group">
                  <label class="strong" for="list_name">List Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="List Name"
                    name="list_name"
                    id="list_name"
                    v-focus
                    v-select-all
                    autocomplete="off"
                    v-model="listName"
                    v-on:keyup.13="search()"
                  >
                </div>
                <div class="controls text-right">
                  <button class="btn btn-primary" @click="search()">Search</button>
                  <button class="btn btn-secondary" @click="clear()">Clear</button>
                </div>

                <div class="search-result mt-5">
                  <transition name="fade">
                    <div class="row m-5 no-result" v-if="noListNameSearchResult">
                      <div class="col">
                        <div class="alert alert-warning">
                          <div class="info">
                            <i class="fa fa-info-circle"></i>
                          </div>
                          <div class="container">
                            <p class="py-3">
                              The search
                              <span class="strong">'{{listName}}'</span>
                              produced no results.
                              <br>Enter a new value and retry your request.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>

                  <div v-if="listNameSearchData.length">
                    <div class="row bg-primary text-white row-header">
                      <div class="col-2">Site Name</div>
                      <div class="col-3">List Name</div>
                      <div class="col-4">Description</div>
                      <div class="col-3">Max Members</div>
                    </div>
                    <div
                      class="result-grid row"
                      v-for="item in listNameSearchData"
                      v-bind:key="item.listName"
                    >
                      <div class="col-2">{{item.siteName}}</div>
                      <div class="col-3">{{item.listName}}</div>
                      <div class="col-4">{{item.description}}</div>
                      <div class="col-1">{{item.maxMembers}}</div>
                      <div class="col-2 edit-col text-right">
                        <router-link
                          tag="div"
                          :to="{name: 'pm-tools-edit', params: {listName: item.listName}}"
                          title="edit list"
                        >
                          <a href="#">
                            <i class="fa fa-pencil-square-o"></i>
                          </a>
                        </router-link>
                        <a href="#" @click.prevent="deleteList(item)" title="delete list">
                          <i class="fa fa-trash-o"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <confirm-dialog id="modalConfirmDelete" ref="modalConfirmDelete">
                    <div slot="modal-title">
                      <span class="text-primary">Confirm Delete List?</span>
                    </div>
                    <div slot="modal-body">
                      <div class="containter form-group">
                        <div class>
                          <div class="info text-warning">
                            <i class="fa fa-exclamation-triangle"></i>
                          </div>
                          <p>Confirm Delete List?</p>
                        </div>
                      </div>
                    </div>

                    <div slot="modal-footer">
                      <button class="btn btn-primary" @click="confirmDeleteList()">yes</button>
                      <button class="btn btn-secondary" @click="closeDialog()">cancel</button>
                    </div>
                  </confirm-dialog>
                </div>
              </div>
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <div>
                <div class="form-group">
                  <label class="strong" for="email">Subscriber E-mail</label>
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Subscriber E-mail"
                    name="email"
                    id="email"
                    v-focus
                    v-select-all
                    autocomplete="off"
                    v-model="emailAddress"
                    v-on:keyup.13="searchByEmail()"
                  >
                </div>
                <div class="controls text-right mb-5">
                  <button class="btn btn-primary" @click="searchByEmail()">Search</button>
                  <button class="btn btn-secondary" @click="clear()">Clear</button>
                </div>


                <div v-if="emailSearchData.length" class="my-3 mt-5">
                  <span
                    class="h5 text-primary"
                  >Total Records: {{emailSearchData.length|formatNumber}}</span>

                  <div class="row bg-primary text-white row-header">
                    <div class="col-4">List Name</div>
                    <div class="col-4">List Description</div>
                    <div class="col-4"></div>
                  </div>

                  <div
                    class="result-grid row subscribers-by-email"
                    v-for="item in emailSearchData"
                    v-bind:key="item.listName"
                  >
                    <div class="col-4">{{item.listName}}</div>
                    <div class="col-6">{{item.description}}</div>
                    <div class="col-2 text-right">
                      <router-link
                        tag="div"
                        :to="{name: 'pm-tools-edit', params: {listName: item.listName}}"
                        title="edit list"
                      >
                        <a href="#">
                          <i class="fa fa-pencil-square-o"></i>
                        </a>
                      </router-link>
                    </div>
                  </div>
                </div>


              </div>
            </tabbed-item>
          </tabbed-control>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Component } from "vue-property-decorator";
import { BaseListServePostMasterSearchMixin } from "../../../components/mixins/index";

@Component({
  name: "postmaster-tools",

  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ListManagerService"
  ]
})
export default class PostmasterTools extends BaseListServePostMasterSearchMixin {
  selectedList = {};
  listName = "";
  emailAddress = "";
  listNameSearchData = [];
  emailSearchData = [];
  noListNameSearchResult = false;
  async searchByEmail() {
    this.listNameSearchData = [];
    this.emailSearchData = [];

    if (this.emailAddress.length < 3) {
      this.toastService.error("Search too vague");
      return [];
    }

    this.spinnerService.show();

    try {
      let data = await this.ListManagerService.getListByEmailFilter(
        this.emailAddress
      );

      this.emailSearchData = data;
    } finally {
      this.spinnerService.hide();
    }
  }

  async search() {
    this.listNameSearchData = [];
    this.emailSearchData = [];
    this.noListNameSearchResult = false;

    if (this.listName.length < 3) {
      this.toastService.error("Search too vague");
      return [];
    }

    this.spinnerService.show();

    try {
      let data = await this.ListManagerService.getListByListNameFilter(
        this.listName
      );

      this.listNameSearchData = data;
      this.noListNameSearchResult = !data.length;
    } finally {
      this.spinnerService.hide();
    }
  }
  async confirmDeleteList() {
    this.spinnerService.show();

    try {
      await this.ListManagerService.deleteList(this.selectedList);
      this.toastService.success("record deleted");

      if (this.listName) {
        await this.search();
      } else if (this.emailAddress) {
        await this.searchByEmail();
      }
    } catch (e) {
      window.console.log(e);
      this.toastService.error("failed to delete record");
    } finally {
      this.selectedList = null;
      this.spinnerService.hide();
      this.closeDialog();
    }
  }

  closeDialog() {
    this.$refs.modalConfirmDelete.hide();
  }

  deleteList(model) {
    this.selectedList = model;

    this.$refs.modalConfirmDelete.show();
  }
  clear() {
    this.listNameSearchData = [];
    this.emailSearchData = [];
    this.noListNameSearchResult = false;
  }
  async mounted() {
    this.currentAction = "by-list-name";
  }
}
</script>
<style lang="scss" >
.tab-content {
  //min-height: 700px;
}
.search-result {
  min-height: 500px;
}
.search-control {
  border-top: 1px solid $carolina-blue;
  margin-top: 20px;
  padding-top: 20px;
}
.result-grid {
  line-height: 40px;
  border: 1px solid $gray-100;

  &:nth-child(even) {
    background: $gray-100;
  }
}
.subscribers-by-email:nth-of-type(odd){
background: $white;
}

ul.search-links,
ul.search-links li {
  list-style: none;
  margin: 0;
  padding: 0;
}
ul.search-links {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-around;
  justify-content: center;
  border: 1px solid $carolina-blue;
  background: lighten($carolina-blue, 40%);
  padding: 10px;
}
ul.search-links li {
  height: 30px;
  width: 230px;
  margin: 0 15px;
  text-align: center;

  a {
    text-decoration: underline;

    &.selected {
      font-weight: bold;
    }

    i {
      margin-left: -15px;
      line-height: 25px;
      position: absolute;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.search-control .fade-enter-active,
.search-control .fade-leave-active {
  position: absolute;
}
.form-group {
  position: relative;
}
.controls button:first-of-type {
  margin-right: 10px;
}
.edit-col {
  display: flex;
  justify-content: flex-end;
  a {
    margin-right: 20px;
  }
  > a:first-of-type {
    margin-right: 0;
  }
}
</style>

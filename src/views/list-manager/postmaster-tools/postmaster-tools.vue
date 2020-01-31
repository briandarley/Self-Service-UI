<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-tools" aria-hidden="true"></i>
        </div>
        <h1>Postmaster Tools</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>Use the search field to search for lists by name or use a known subscriber's email to search lists where the user is a member of.</p>
              <p>
                Lyris lists will be returned based on the search string entered. Use the edit link
                <i
                  class="fa fa-pencil-square-o"
                ></i> to edit the selected list.
              </p>
            </div>
          </div>

          <tabbed-control tabs="Search by List Name,Subscribers by E-mail">
            <tabbed-item slot="tab_0">
              <!-- <pm-tools-search></pm-tools-search> -->
              <div>
                <div class="form-group">
                  <label class="strong" for="list_name" id="lblListNameSearch">List Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search lists using like expression"
                    name="list_name"
                    id="list_name"
                    v-focus
                    v-select-all
                    autocomplete="off"
                    v-model="listName"
                    v-on:keyup.13="search()"
                    aria-label="Search lists by name, a value required"
                  />
                </div>
                <div class="submit text-right">
                  <button class="btn btn-primary mr-1" @click="search()">Search</button>
                  <button class="btn btn-secondary" @click="clear()">Clear</button>
                </div>

                <div class="search-result mt-5">
                  <transition name="fade">
                    <div class="row m-5 no-result" v-if="noListNameSearchResult">
                      <div class="col">
                        <div class="alert alert-warning">
                          <div class="info">
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                          </div>
                          <div class="container">
                            <p class="py-3">
                              The search
                              <span class="strong">'{{listName}}'</span>
                              produced no results.
                              <br />Enter a new value and retry your request.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>

                  <div v-if="listNameSearchData.length" role="table">
                    <div class="row bg-primary text-white row-header" role="rowheader">
                      <div class="col-2" role="heading">Site Name</div>
                      <div class="col-3" role="heading">List Name</div>
                      <div class="col-4" role="heading">Description</div>
                      <div class="col-3" role="heading">Max Members</div>
                    </div>
                    <div
                      class="result-grid row"
                      v-for="item in listNameSearchData"
                      v-bind:key="item.listName"
                      role="row"
                    >
                      <div role="cell" class="col-2">{{item.siteName}}</div>
                      <div role="cell" class="col-3">{{item.listName}}</div>
                      <div role="cell" class="col-4">{{item.description}}</div>
                      <div role="cell" class="col-1">{{item.maxMembers}}</div>
                      <div role="cell" class="col-2 edit-col text-right">
                        <router-link
                          :to="{name: 'pm-tools-edit', params: {listName: item.listName}}"
                          
                          title="edit list"
                        >
                          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                          <span class="hide-text">Edit List {{item.listName}}</span>
                        </router-link>
                        <a href="#" @click.prevent="deleteList(item)" title="delete list" >
                          <i class="fa fa-trash-o" aria-hidden="true"></i>
                          <span class="hide-text">Delete List {{item.listName}}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <confirm-dialog id="modalConfirmDelete" ref="modalConfirmDelete">
                    <div slot="modal-title" class="text-white">
                      <span class="text-white">Confirm Delete List?</span>
                    </div>
                    <div slot="modal-body">
                      <div class="alert alert-danger">
                        <div class="info">
                          <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                        </div>
                        <p>Confirm Delete List?</p>
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
                    placeholder="Search lists by subscriber e-mail"
                    name="email"
                    id="email"
                    v-focus
                    v-select-all
                    autocomplete="off"
                    v-model="emailAddress"
                    v-on:keyup.13="searchByEmail()"
                    aria-label="Search lists by email, a value required"
                  />
                </div>
                <div class="text-right mb-5">
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
                          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
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
    "ListManagerService",
    "ScreenReaderAnnouncerService"
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
    this.listName = "";
  }
  async mounted() {
    this.currentAction = "by-list-name";
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Lyris Post Master Tools Landing");
  }
}
</script>
<style lang="scss" src="./postmaster-tools.scss" scoped></style>


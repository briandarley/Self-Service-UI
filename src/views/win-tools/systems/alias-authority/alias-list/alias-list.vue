<template>
  <div class="user-alias-result">
    <criteria :aliasDomains="aliasDomains" @search="onSearch"></criteria>


    <div class="d-flex mt-3" style="justify-content:space-between">
      <h3 class="text-primary">Total Records {{aliasDomains.length | formatNumber}}</h3>
    </div>

    <div class="border border-primary mt-1">
      <div class="bg-primary text-white row-header">
        <div class="col">Domain</div>
        <div class="col">Enabled</div>
        <div></div>
      </div>
      <div class="result-grid" v-for="item in aliasDomains" v-bind:key="item.id">
        <div class="domain-detail">
          <div class="entity-detail">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.enabled}}</div>
            <div class="col">
              <a href="#" @click.prevent="toggleShowDomains(item)">
                <i
                  class="fa fa-angle-double-down more-info"
                  :class="{expanded: item.expanded, collapsed: item.expanded === false}"
                ></i>
              </a>
            </div>
          </div>
          <div class="entity-children" v-if="item.expanded">
            <div class="bg-primary text-white row-header">
              <div class="col">Uid</div>
              <div></div>
            </div>
            <div class="child-entities">
              <div
                class="child-entity"
                v-for="child in sortChildren(item.aliasManagers)"
                :key="child.uid"
              >
                <div>{{child.uid}}</div>

                <div>
                  <a href="#" @click.prevent="removeChild(item,child)">remove</a>
                </div>
              </div>
              <div class="bg-secondary text-center py-2">
                <button class="btn btn-primary" @click="showAddManager(item)">Add User</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

   <confirm-dialog id="confirmAddManager" ref="confirmAddManager" width="800">
      <div slot="modal-title" class="text-white">
        Confirm: Add Alias Manager?
      </div>
      <div slot="modal-body">
        <div class="form-group">
          <label for="add-manager">Onyen</label>
          <input type="text" class="form-control" placeholder="Onyen" id="add-manager" v-model="newAliasManager">
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="onConfirmAddMemberClick()">add manager</button>
        <button class="btn btn-secondary" @click="onCancelConfirmClick()">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./alias-list.js"></script>
<style lang="scss" src="./alias-list.scss" scoped></style>

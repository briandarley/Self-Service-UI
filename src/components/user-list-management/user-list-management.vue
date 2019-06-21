<template>
  <div class="user-list-management">
    
    <div class="section add-entity mt-3">
      <spinner allow-service-update="false" ref="spinner" class="control-spinner"></spinner>
      <div class="container">
        <div class="row bg-primary text-white row-header">
          <div class="col">User</div>
          <div class="col">Canonical Name</div>
          <div class="col"></div>
        </div>
        <div class="result-grid row" v-for="(item, index) in entities" :key="index">
          <div class="col">{{item.samAccountName}}</div>
          <div class="col">{{item.id}}</div>
          <div class="col">
            <a href="#" @click.prevent="removeEntity(item.samAccountName)">
              <i class="fa fa-trash-o"></i>
              <span>remove</span>
            </a>
          </div>
        </div>
        <div class="container">
          <div class="add-member">
           <div class="form-group form-inline">
              <label for>Entity Id</label>
              <input
                type="text"
                class="form-control input-xl"
                placeholder="onyen, pid, email"
                v-model="userId"
                v-select-all
                v-on:keyup.13="onLookupMember()"
              >

              <div class="submit">
                <button class="btn btn-primary" @click="onLookupMember()">Search</button>
                <button class="btn btn-secondary" @click="onClear()">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <confirm-dialog id="confirmAddEntity" ref="confirmAddEntity" width="800">
      <div slot="modal-title" class="text-white">
        Confirm: Add
        <span>User</span>
        <span>Group</span>?
      </div>
      <div slot="modal-body">
        <div class="lookup-result" v-if="multipleRecords">
          <div class="form-group select-group">
            <label>Select Group</label>
            <select name="selectGroup" id="selectGroup" class="form-control" v-model="selectedGroup">
              <option v-for="(item, index) in groupListResult" :key="index" :value="item">{{item.samAccountName}}</option>
            </select>
            <button class="btn btn-primary" @click="selectGroup()">select</button>
          </div>
        </div>
        <div class="lookup-result" v-else>
          <div>
            <ul>
              <li>
                <label>Name</label>
                <span>{{lookupEntityModel.name}}</span>
              </li>
              <li>
                <label>Type</label>
                <span>{{lookupEntityModel.type}}</span>
              </li>
              <li>
                <label>Display Name</label>
                <span>{{lookupEntityModel.displayName}}</span>
              </li>
              <li>
                <label>Email</label>
                <span>{{lookupEntityModel.email}}</span>
              </li>
              <li v-if="lookupEntityModel.distinguishedName">
                <label>Distinguished Name</label>
                <span>{{lookupEntityModel.distinguishedName}}</span>
              </li>
              <li v-if="lookupEntityModel.type === 'group'">
                <label>Total Members</label>
                <span
                  :class="{'text-danger': lookupEntityModel.totalMembers == 'processing...'}"
                >{{lookupEntityModel.totalMembers}}</span>
              </li>
            </ul>

            <div class="form-controls recursive-check">
              <div class="check-buttons text-right" v-if="lookupEntityModel.type === 'group'">
                <input
                  type="checkbox"
                  name="recursive"
                  id="chkRecursive"
                  v-model="lookupEntityModel.recursive"
                >
                <label for="chkRecursive">Include All Entities/Recursive?</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="onConfirmAddMemberClick()">add entity</button>
        <button class="btn btn-secondary" @click="onCancelConfirmClick()">cancel</button>
      </div>
    </confirm-dialog>
    
    
  </div>
</template>
<script src="./user-list-management.js"></script>
<style lang="scss" src="./user-list-management.scss" scoped></style>

<template>
 <div class="user-list-management">
    
    <div class="section add-entity mt-3">
      <spinner allowServiceUpdate="false" ref="spinnerMngrList" class="control-spinner"></spinner>
      <div class="container">
        
        <div class="container">
          <div class="add-member">
           <form @submit.prevent.prevent class="form-group form-inline" role="form">
              <label for="entityId">Entity Id</label>
              <input
                type="text"
                id="entityId"
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
            </form>
          </div>
        </div>
        <div class="row bg-primary text-white row-header">
          <div class="col">User</div>
          <div class="col">Distinguished Name</div>
          <div class="col"></div>
        </div>
        <div class="result-grid row" v-for="(item, index) in entities" :key="index">
          <div class="col">{{item.samAccountName}}</div>
          <div class="col">{{item.id}}</div>
          <div class="col">
            <a href="#" @click.prevent="removeEntity(item)">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
              <span>remove</span>
            </a>
          </div>
        </div>
        
      </div>
    </div>
    <confirm-dialog id="confirmAddManager" ref="confirmAddManager" width="800">
      <div slot="modal-title" class="text-white">
        Confirm: Add
        <span>User</span>
        <span>Group</span>?
      </div>
      <div slot="modal-body">
        <div class="lookup-result" >
          <div>
            <ul>
              <li>
                <label>Name</label>
                <span>{{lookupEntityModel.name || lookupEntityModel.samAccountName}}</span>
              </li>
              <li>
                <label>Type</label>
                <span>{{lookupEntityModel.objectClass}}</span>
              </li>
              <li>
                <label>Display Name</label>
                <span>{{lookupEntityModel.displayName}}</span>
              </li>
              <li>
                <label>Email</label>
                <span>{{lookupEntityModel.mail}}</span>
              </li>
              <li v-if="lookupEntityModel.distinguishedName">
                <label>Distinguished Name</label>
                <span>{{lookupEntityModel.distinguishedName}}</span>
              </li>
              
            </ul>

            
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
<script src="./manager-list-management.js"></script>
<style lang="scss" src="./manager-list-management.scss" scoped></style>

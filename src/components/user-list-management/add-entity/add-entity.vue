<template>
  <div class="container">
    <div class="add-member">
      <form @submit.prevent.prevent class="form-group form-inline" role="form">
        <label for="searchEntityId">Entity Id</label>
        <input
          type="text"
          id="searchEntityId"
          class="form-control input-xl"
          placeholder="onyen, pid, email"
          v-model="criteria.filterText"
          v-select-all
          v-on:keyup.13="onLookupEntity()"
          aria-label="Enter Onion, PID, or Email to find and add users to the selected group"
          autocomplete="off"
        />

        <div class="submit">
          <button class="btn btn-primary" @click="onLookupEntity()">
            Search
          </button>
          <button class="btn btn-secondary" @click="onClear()">
            Clear
          </button>
        </div>
      </form>
    </div>

    <confirm-dialog id="confirmAddEntity" ref="confirmAddEntity" width="800">
      <div slot="modal-title" class="text-white">
        Confirm: Add
        <span>Entity?</span>
      </div>
      <div slot="modal-body">
        <div class="container">

          <div class="d-flex justify-content-between">
            <h4 class="text-primary">Total Entities {{this.pagedResponse.totalRecords | formatNumber}}</h4>
           <pager
            :criteria="criteria"
            btn-count="5"
            :total-records="pagedResponse.totalRecords"
            v-on:indexChanged="indexChanged"

          ></pager>
          </div>
          
          <div class="search-result">
            <div class="bg-primary text-white row-header">
              <div>
                CN
              </div>
              
              <div>
                Type
              </div>
              <div class="control">Action</div>
            </div>
            <div class="results">
              <div
                class="result-grid"
                v-for="(entity, index) in pagedResponse.entities"
                :key="index"
              >
                
                    <div>{{ entity.cn }}</div>
                    
                    <div>
                      {{ entity.objectClass }}
                    </div>
                    <div>
                      <a href="#" @click.prevent="addEntity(entity)" class="mr-1" v-if="!entity.added"
                        >Add Entity</a
                      >
                      <span v-else>Added</span>
                    </div>
                
              </div>
            </div>
          </div>
        </div>

        <!-- list all entities from the search -->
        <!--
        <div class="lookup-result" v-if="multipleRecords">
          <div class="form-group select-group">
            <label for="selectGroup">Select Group</label>
            <select
              name="selectGroup"
              id="selectGroup"
              class="form-control"
              v-model="selectedGroup"
            >
              <option
                v-for="(item, index) in groupListResult"
                :key="index"
                :value="item"
                >{{ item.samAccountName }}</option
              >
            </select>
            <button class="btn btn-primary" @click="selectGroup()">
              select
            </button>
          </div>
        </div>
        <div class="lookup-result" v-else>
          <div>
            <ul>
              <li>
                <label>Name</label>
                <span>{{ lookupEntityModel.name }}</span>
              </li>
              <li>
                <label>Type</label>
                <span>{{ lookupEntityModel.type }}</span>
              </li>
              <li>
                <label>Display Name</label>
                <span>{{ lookupEntityModel.displayName }}</span>
              </li>
              <li>
                <label>Email</label>
                <span>{{ lookupEntityModel.email }}</span>
              </li>
              <li v-if="lookupEntityModel.distinguishedName">
                <label>Distinguished Name</label>
                <span>{{ lookupEntityModel.distinguishedName }}</span>
              </li>
              <li v-if="lookupEntityModel.type === 'group'">
                <label>Total Members</label>
                <span
                  :class="{
                    'text-danger':
                      lookupEntityModel.totalMembers == 'processing...'
                  }"
                  >{{ lookupEntityModel.totalMembers }}</span
                >
              </li>
            </ul>

            <div class="form-controls recursive-check">
              <div
                class="check-buttons text-right"
                v-if="lookupEntityModel.type === 'group'"
              >
                <input
                  type="checkbox"
                  name="recursive"
                  id="chkRecursive"
                  v-model="lookupEntityModel.recursive"
                />
                <label for="chkRecursive"
                  >Include All Entities/Recursive?</label
                >
              </div>
            </div>
          </div>
        </div>
-->
      </div>
      <div slot="modal-footer">
        
        <button class="btn btn-secondary" @click="onCancelAddEntityClick()">
          ok
        </button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./add-entity.js"></script>
<style lang="scss" src="./add-entity.scss" scoped></style>

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

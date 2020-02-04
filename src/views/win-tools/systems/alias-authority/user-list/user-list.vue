<template>
  <div class="user-alias-result">
    <criteria id="user-list-criteria" :aliasDomains="aliasDomains" @search="onSearch"></criteria>

    <div class="d-flex mt-3" style="justify-content:space-between">
      <h3 class="text-primary">Total Records {{pagedRecords.totalRecords | formatNumber}}</h3>
      <button class="btn btn-primary" @click="addAliasManager()">Add User</button>
      <pager
        :criteria="criteria"
        btn-count="5"
        :total-records="pagedRecords.totalRecords"
        v-on:indexChanged="indexChanged"
      ></pager>
    </div>

    <div class="border border-primary mt-1 user-list" role="table">
      <div class="bg-primary text-white row-header" role="rowheader">
        <div role="columnheader" class="col">Uid</div>
        <div role="columnheader" class="col"></div>
        <div role="columnheader"></div>
      </div>
      <div
        class="result-grid"
        v-for="item in pagedRecords.entities"
        v-bind:key="item.id"
        role="row"
      >
        <div class="user-detail">
          <div class="entity-detail">
            <div role="cell" class="col">{{item.uid}}</div>
            <div role="cell" class="col"></div>
            <div role="cell" class="col">
              <a
                href="#"
                @click.prevent="toggleShowDomains(item)"
                :aria-label="item.expanded ? 'Collapse user assigned aliases' : 'Expand user assigned aliases'"
              >
                <i
                  class="fa fa-angle-double-down more-info"
                  :class="{expanded: item.expanded, collapsed: item.expanded === false}"
                ></i>
                <span v-if="item.expanded">collapse</span>
                <span v-else>expand</span>
              </a>
            </div>
          </div>
          <div class="entity-children" v-if="item.expanded" role="table">
            <div class="bg-primary text-white row-header" role="rowheader">
              <div role="columnheader" class="col">Domain</div>
              <div role="columnheader" class="col">Enabled</div>
              <div></div>
            </div>
            <div class="child-entities" role="rowgroup">
              <div
                class="child-entity"
                v-for="child in sortChildren(item.aliasDomains)"
                :key="child.id"
                role="row"
              >
                <div role="cell">{{child.name}}</div>
                <div role="cell">{{child.enabled}}</div>
                <div role="cell">
                  <a
                    href="#"
                    @click.prevent="removeChild(item,child)"
                    :aria-label="'Remove alias ' + child.name + ' from list of managed aliases for user ' + item.uid"
                  >remove</a>
                </div>
              </div>
              <div class="bg-secondary text-center py-2">
                <button class="btn btn-primary" @click="showAddDomain(item)">Add Domain</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog id="confirmAddDomain" ref="confirmAddDomain" width="800">
      <div slot="modal-title" class="text-white">Confirm: Apply Domain Changes for User?</div>
      <div slot="modal-body">
        <div class="form-group">
          <label for="domainFilter">Domain</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              id="domainFilter"
              v-model="domainFilter"
              placeholder="Filter Domain"
              v-select-all
            />
            <button
              class="btn bg-transparent"
              style="margin-left: -40px; z-index: 100;"
              @click="domainFilter = null"
            >
              <i class="fa fa-times" aria-hidden="true" title="Clear Field"></i>
              <span class="screen-reader-hide">Clear Field</span>
            </button>
          </div>
        </div>
        <div class="all-records-select">
          <label class="col" for="chkSelectAll">All Domains</label>
          <div class="col check-buttons">
            <input
              type="checkbox"
              name="recursive"
              id="chkSelectAll"
              @click="selectAllClick()"
              v-model="selectAll"
            />
          </div>
        </div>
        <div id="domain-list" class="domain-list">
          <div class="records" v-for="(item, index) in filterAvailableDomains()" :key="index">
            <div class="col">
              <label :for="checkElementName(index)">{{item.name}}</label>
            </div>
            <div class="col check-buttons">
              <input
                type="checkbox"
                name="recursive"
                :id="checkElementName(index)"
                v-model="item.checked"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="onConfirmAddDomainClick()">update</button>
        <button class="btn btn-secondary" @click="onCancelConfirmClick()">cancel</button>
      </div>
    </confirm-dialog>

    <confirm-dialog id="confirmAddUser" ref="confirmAddUser">
      <div slot="modal-title" class="text-white">Confirm: Add User?</div>
      <div slot="modal-body">
        <div class="form-group">
          <label for="add-onyen">Onyen</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              id="add-onyen"
              v-model="addAliasManagerOnyen"
              placeholder="Onyen"
              v-select-all
            />
            <button
              class="btn bg-transparent"
              style="margin-left: -40px; z-index: 100;"
              @click="addAliasManagerOnyen = null"
              title="Clear Field"
            >
              <i class="fa fa-times" aria-hidden="true"></i>
              <span class="screen-reader-hide">Clear Field</span>
            </button>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="onConfirmAddAliasManagerClick()">update</button>
        <button class="btn btn-secondary" @click="onCancelConfirmClick()">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./user-list.js"></script>
<style lang="scss" src="./user-list.scss" ></style>

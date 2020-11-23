<template>
  <div class="user-list-management">
    <div class="section add-entity mt-3">
      <spinner
        allowServiceUpdate="false"
        ref="spinnerMmbrList"
        class="control-spinner"
      ></spinner>
      <div class="container">
        



        <add-entity :service="service" :group="group" @addToGroupMembers="onAddToGroupMembers"></add-entity>


<div class="d-flex mt-5" style="justify-content:space-between">
              <h3 class="text-secondary">
                Total Members {{ pagedResponse.totalRecords | formatNumber }}
              </h3>
              <pager
                :criteria="criteria"
                btn-count="5"
                :total-records="pagedResponse.totalRecords"
                v-on:indexChanged="indexChanged"
              ></pager>
            </div>

        <div class="row bg-primary text-white row-header">
          <div class="col">
            <a href="#" @click.prevent="sort('samAccountName')">User</a>
          </div>
          <div class="col">
            <a href="#" @click.prevent="sort('mail')">Email Address</a>
          </div>
          <div class="col">
            <a href="#" @click.prevent="sort('name')">Display Name</a>
          </div>
          <div class="col"></div>
        </div>
        <div class="row bg-white row-header">
          <div class="col p-0">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="filter"
              autocomplete="off"
              v-select-all
              v-model="filter.samAccountName"
            />
          </div>

          <div class="col p-0">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="filter"
              autocomplete="off"
              v-select-all
              v-model="filter.mail"
            />
          </div>

          <div class="col p-0">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="filter"
              autocomplete="off"
              v-select-all
              v-model="filter.displayName"
            />
          </div>

          <div class="col p-0"></div>
        </div>
        <div
          class="result-grid row"
          v-for="(entity, index) in pagedResponse.entities"
          :key="index"
        >
          <div class="col">
            {{ entity.samAccountName || entity.name }}</div>
          <div class="col">{{ entity.mail }}</div>
          <div class="col">{{ entity.name || entity.cn}} </div>

          <div class="col">
            <a href="#" @click.prevent="removeEntity(entity)">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
              <span>remove</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script src="./user-list-management.js"></script>
<style lang="scss" src="./user-list-management.scss" scoped></style>

<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fa-history"></i>
        </div>
        <h1>Log Viewer</h1>
      </div>
      <div class="card-body">
        <search-criteria @search="search" @clear="clear" :criteria="criteria"></search-criteria>

        <div class="d-flex mt-5" style="justify-content:space-between">
          <h3 class="text-primary">Total Entries {{pagedResponse.totalRecords | formatNumber}}</h3>
          <pager
            :criteria="criteria"
            btn-count="5"
            :total-records="pagedResponse.totalRecords"
            v-on:indexChanged="indexChanged"
          ></pager>
        </div>

        <!--Trigger-->
        <div class="search-result">
          <div class="bg-primary text-white row-header">
            <div>
              <a href="#" @click.prevent="sort('id')">ID</a>
            </div>
            <div>
              <a href="#" @click.prevent="sort('level')">Level</a>
            </div>
            <div>
              <a href="#" @click.prevent="sort('application')">Application</a>
            </div>
            <div>
              <a href="#" @click.prevent="sort('createDate')">Create Date</a>
            </div>
          </div>
          <div class="results">
            <div class="result-grid" v-for="item in pagedResponse.entities" :key="item.id">
              <div class="basic-info">
                <div>{{item.id}}</div>
                <div :class="{'text-danger': item.level == 'ERROR','text-warning': item.level == 'WARN'}">{{item.level}}</div>
                <div>{{item.application}}</div>
                <div>{{item.createDate | formatDateTime}}</div>
              </div>
              <div class="details">
                <ul>
                  <li v-if="item.method">
                    <div class="method">Method: {{item.method}}</div>
                  </li>
                  <li v-if="item.lineNumber">
                    <div class="method">Line Number: {{item.lineNumber}}</div>
                  </li>
                  <li v-if="item.pathUri">
                    <div class="method">Path Uri: {{item.pathUri}}</div>
                  </li>
                  <li v-if="item.filePath">
                    <div class="method">File Path: {{item.filePath}}</div>
                  </li>
                </ul>
              </div>
              <div class="error-message" v-if="item.message || item.exceptionDetail">
                <div>Message:</div>
                <div class="message" v-if="item.message">{{item.message}}</div>
                <div class="exception-detail" v-if="item.exceptionDetail">{{item.exceptionDetail}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex mt-2" style="justify-content:space-between">
          <div></div>
          <pager
            :criteria="criteria"
            btn-count="5"
            :total-records="pagedResponse.totalRecords"
            v-on:indexChanged="indexChanged"
          ></pager>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./log-viewer.js"></script>
<style lang="scss" src="./log-viewer.scss" scoped></style>

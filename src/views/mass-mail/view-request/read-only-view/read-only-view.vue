<template>
  <div class="container">
    <tabbed-control tabs="Detail,Contents,Comments">
      <tabbed-item slot="tab_0">
        <div class="messageDetail">
          <h5>Email Request Details</h5>
          <ul>
            <li>
              <span>Send Date</span>
              <span>{{model.sendDate | formatDate}}</span>
            </li>
            <li>
              <span>Expiration Date</span>
              <span>{{model.expirationDate | formatDate}}</span>
            </li>
            <li>
              <span>Send From</span>
              <span>{{model.sendFrom | defaultNoReplyIfEmpty}}</span>
            </li>
            <li>
              <span>Reply-To</span>
              <span>{{model.replyTo | defaultNoReplyIfEmpty}}</span>
            </li>
            <li>
              <span>Subject</span>
              <span>{{model.subject}}</span>
            </li>
            <li>
              <span>Sponsoring University</span>
              <span>{{model.sponsoringUniversity}}</span>
            </li>
            <li>
              <span>Priority</span>
              <span>{{model.priority}}</span>
            </li>
          </ul>
          <h5>Employee Recipient Criteria</h5>
          <ul v-if="hasEmployeePopulation()">
            <li v-if="hasAllEmployees()">
              <span>All Employees</span>
            </li>
            <li v-else>
              <span>DDD</span>
            </li>
          </ul>
          <ul v-else>
            <li>
              <span>No Employees</span>
            </li>
          </ul>
          <h5>Student Recipient Criteria</h5>
          <ul v-if="hasStudentPopulation()">
            <li>
              <span>All Students</span>
            </li>
          </ul>
          <ul v-else>
            <li>
              <span>No Students</span>
            </li>
          </ul>
        </div>
      </tabbed-item>
      <tabbed-item slot="tab_1">
        <div v-if="model.content" v-html="model.content.content"></div>
      </tabbed-item>
      <tabbed-item slot="tab_2">
        <div class="search-result">
          <div class="bg-primary text-white row-header">
            <div>Date</div>
            <div>Type</div>
            <div>Author</div>
          </div>
          <div class="results">
            <div class="result-grid" v-for="item in comments" :key="item.id">
              <div class="comment-info">
                <div>{{item.createDate | formatDate}}</div>
                <div v-if="item.commentTypeCode == 'INITIAL_AUTH_COMMENT'">Initial Comment</div>
                <div v-else>{{item.commentTypeCode}}</div>
                <div>{{item.createUser}}</div>
              </div>
              <div class="comment-section">
                {{item.comment}}
              </div>
            </div>
          </div>
        </div>
      </tabbed-item>
    </tabbed-control>
  </div>
</template>
<script src="./read-only-view.js"></script>
<style lang="scss" src="./read-only-view.scss" scoped></style>

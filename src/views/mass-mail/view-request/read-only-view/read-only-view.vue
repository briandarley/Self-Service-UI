<template>
  <div class="container">
    <tabbed-control tabs="Detail,Contents,Comments">
      <tabbed-item slot="tab_0">
        <div class="messageDetail">
          <h5>Email Request Details</h5>
          <ul>
            <li>
              <span>Send Date</span>
              <span>{{ model.sendDate | formatDate }}</span>
            </li>
            <li>
              <span>Expiration Date</span>
              <span>{{ model.expirationDate | formatDate }}</span>
            </li>
            <li>
              <span>Send From</span>
              <span>{{ model.sendFrom | defaultNoReplyIfEmpty }}</span>
            </li>
            <li>
              <span>Reply-To</span>
              <span>{{ model.replyTo | defaultNoReplyIfEmpty }}</span>
            </li>
            <li>
              <span>Subject</span>
              <span>{{ model.subject }}</span>
            </li>
            <li>
              <span>Sponsoring Office</span>
              <span>{{ model.sponsoringUniversity }}</span>
            </li>
            <li>
              <span>Priority</span>
              <span>{{ model.priority }}</span>
            </li>
          </ul>
          <h5 class="text-primary">Selected Audience</h5>
          <ul v-for="(item, index) in selectedPopulations" v-bind:key="index">
            <li class="d-block">
              <div class="text-primary ml-2">
                {{ item.description }}
              </div>
              <ul v-if="item.children.length" class="ml-5">
                <li
                  class="d-block"
                  v-for="(child, childIndex) in item.children"
                  v-bind:key="childIndex"
                >
                  {{ child }}
                </li>
              </ul>
            </li>
          </ul>
          <div v-if="excludedPopulations.length">
            <h5 class="text-primary" >
              Excluded Audience
            </h5>
            <ul v-for="item in excludedPopulations" v-bind:key="item.code">
              <li class="d-block">
                <div class="text-primary ml-2">
                  {{ item.description }}
                </div>
                <ul v-if="item.children.length" class="ml-5">
                  <li
                    class="d-block"
                    v-for="child in item.children"
                    v-bind:key="child.code"
                  >
                    {{ child }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
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
                <div>{{ item.createDate | formatDate }}</div>
                <div v-if="item.commentTypeCode == 'INITIAL_AUTH_COMMENT'">
                  Initial Comment
                </div>
                <div v-else>{{ item.commentTypeCode }}</div>
                <div>{{ item.createUser }}</div>
              </div>
              <div class="comment-section">
                {{ item.comment }}
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

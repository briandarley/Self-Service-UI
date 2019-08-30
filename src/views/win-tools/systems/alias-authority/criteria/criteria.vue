<template>
  <div class="border border-primary">
    <div class="bg bg-primary text-white p-2">Search Criteria</div>
    <div class="m-2">
      <div class="form-group">
        <label for>Onyen</label>
        <input type="text" class="form-control" placeholder="Onyen" v-model="criteria.uid" />
      </div>
      <div class="form-group">
        <label for>Domain</label>
        <select
          name="domain-select"
          id="domain-select"
          class="form-control"
          v-model="criteria.domainName"
        >
          <option>-select-</option>
          <option
            v-for="(item, index) in aliasDomains"
            :key="index"
            :value="item.name"
          >{{item.name}}</option>
        </select>
      </div>
      <div class="sumbit text-right">
        <button class="btn btn-primary mr-1" @click="search()">Search</button>
        <button class="btn btn-secondary" @click="clearCriteria()">Clear</button>
      </div>
    </div>
  </div>
</template>
<script src="./criteria.js"></script>
<style lang="scss" src="./criteria.scss" scoped></style>

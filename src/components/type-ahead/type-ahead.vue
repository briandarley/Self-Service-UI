<template>
  <div>
    <input type="hidden" />
    <input
      :id="id"
      class="typeahead form-control"
      :placeholder="placeHolder"
      :value="val"
      v-select-all
      type="search"
      autocomplete="off"
      :name="id + '_typeahead'"
    />
  </div>
</template>
<script src="./type-ahead.js"></script>
<style lang="scss" src="./type-ahead.scss"></style>

<template>
  <nav aria-label="Page navigation">
    
    <ul class="pagination pagination-sm justify-content-end">
      <li 
        class="page-item" 
        :class="{disabled: pageInfo.index === 0}">
        <a class="page-link" href="#" tabindex="-1" @click.prevent="previous()">Previous</a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" tabindex="-1" v-if="isIndexLessThanButtonCount" @click.prevent="previous(btnCount)">...</a>
      </li>
      <li class="page-item" v-for="index in buttons" v-bind:key="index">
        <a 
          class="page-link " 
          href="#" 
          :class="{selected: index == (pageInfo.index + 1)}"
          @click.prevent="pageTo(index)"
          
          >{{index}}</a>
      </li>
      <li class="page-item">
        <a 
          class="page-link" 
          href="#" 
          tabindex="-1" 
          v-if="isLessThanMax" 
          @click.prevent="next(btnCount)">...</a>
      </li>
      <li class="page-item" :class="{disabled: nextDisabled}">
        <a class="page-link" href="#" @click.prevent="next()">Next</a>
      </li>
    </ul>
  </nav>
</template>
<script src="./pager.js"></script>
<style lang="scss" src="./pager.scss" scoped></style>

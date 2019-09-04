<template>
  <div class="pop-over-content">

    <a href="javascript:void(0)"
       tabindex="-1"
       data-toggle="popover"
       v-bind:title="title"
       data-trigger="focus"
       v-bind:data-content="dataContent">
      <i class="fa fa-info-circle" aria-hidden="true"></i> {{linkText}}
    </a>


  </div>
</template>
<script>
  import Vue from "vue"
  import { Component } from "vue-property-decorator"

  @Component({

    name: 'pop-over',
    dependencies: ['$'],
    data: function () {
      return {
        value: ""
      }
    },
    props: ['title','dataContent', 'linkText']

  })
  export default class PopOver extends Vue {

    mounted() {
      this.$('[data-toggle="popover"]').popover(); 
    }

  }
</script>


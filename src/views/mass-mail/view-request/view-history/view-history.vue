<template>
  <div class="campaign-history section results" >
    <div class="bg-secondary text-white row-header">                                          
    <div>
      Create Date
    </div>                                                         
    <div>
      Action
    </div>
    <div>
      Onyen
    </div>
                         
    </div>                                                               
    <div class="grid-records">                                         
    <div class="grid-record" v-for="item in entities" :key="item.id">
      <div>{{item.createDate |formatDateTime}}</div>                                               
      <div>{{item.actionCode}}</div>                                               
      <div>{{item.createUser}}</div>
      
    </div>                                                              
    </div>                                                               
  </div>                                                                 
</template>
<script src="./view-history.js"></script>
<style lang="scss" src="./view-history.scss" scoped></style>

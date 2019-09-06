<template>
  <div class="tabbed-control">
    
    <ul class="nav">
      <li 
        class="nav-item" 
        v-for="(navItem, index) in items" 
        v-bind:key="index" 
        tabindex="0"
        @keydown="watchKeyDown($event,index)"
        v-bind:class="{active: navItem.active, disabled: navItem.enabled === false}">
        <a 
        class="nav-link" 
        
        :class="{disabled: navItem.enabled === false}"  
        data-toggle="tab" 
        @click="tabChanged(index)">{{navItem.label}}</a>
      </li>

    </ul>
    <div class="tab-content pt-4">
      <div class="tab-pane container" 
      v-for="(tab, index) in items" 
      :key="index" 
      :class="{active: tab.active, 'fad-in': tab.active}">
        
          <slot v-bind:name="'tab_' + index"  >
                     

          </slot>
        
      </div>
     
    </div>
  </div>

</template>
<script src="./tabbed-control.js"></script>
<style lang="scss" src="./tabbed-control.scss" ></style>

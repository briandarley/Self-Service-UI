<template>
<!-- data-simplebar -->
<transition name="fade">


  <div class="side-menu" :class="{'hide-side-menu': !showSideMenu}" >
    <div class="side-menu-pager">
      <ul :class="{'reduce-text': tree.length > 2}">
        <li v-for="item in tree" v-bind:key="item.id">
          <router-link :to="{path: '/'+ item.route}">
            <a href="#">{{item.title}}</a>
          </router-link>
          <i class="fa fa-arrow-right"></i>
        </li>
      </ul>
    </div>
    
    <!-- <ul class="nav"> -->
    <transition-group class="nav" name="fly_in" tag="ul">   
      <li
        class="nav-item"
        v-for="item in routes"
        :key="item.id"  
        :class="{'active': isMenuActive(item), 'has-children': hasChildren(item)}"
      >
        <router-link :to="{path: '/'+ item.route}" v-if="!item.redirect" class="nav-link">
        <i class="material-icons" v-if="item.iconType === 'material'">{{item.iconContent}}</i>
            <i class="fa fas" :class="item.iconContent" v-if="item.iconType === 'fontawesome'"></i>
            <p>{{item.title}}</p>
            <i class="fa" :class="{'fa-ellipsis-h': hasChildren(item)}"></i>
        </router-link>
        <a :href="item.redirect" class="nav-link" target="_blank"  v-else>
            <i class="material-icons" v-if="item.iconType === 'material'">{{item.iconContent}}</i>
            <i class="fa fas" :class="item.iconContent" v-if="item.iconType === 'fontawesome'"></i>
            <p>{{item.title}}</p>
            <i class="fa" :class="{'fa-ellipsis-h': hasChildren(item)}"></i>
          </a>



      </li>
      
    </transition-group>  
    <!-- </ul> -->

  </div>
</transition>    
</template>
<script src="./side-menu.js"></script>
<style lang="scss" src="./side-menu.scss" scoped></style>

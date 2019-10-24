<template>
  
    <div class="btn-group">
      <button
        :id="elmId"
        type="button"
        class="btn btn-default dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >Actions</button>
      <div class="dropdown-menu">
        <a class="dropdown-item text-primary" @click.prevent="action('edit')" v-if="isActive">
          <i class="material-icons">edit</i>
          <span>Edit</span>
        </a>
        <a class="dropdown-item text-danger" @click.prevent="action('cancel')" v-if="isActive">
          <i class="material-icons">cancel</i>
          <span>Cancel</span>
        </a>
         <a class="dropdown-item text-primary" @click.prevent="action('copy')">
          <i class="material-icons">file_copy</i>
          <span>Copy</span>
        </a>
        <a class="dropdown-item text-primary" @click.prevent="action('contact')" v-if="showContactAuthor">
          <i class="material-icons">email</i>
          <span>Contact Author</span>
        </a>
               
        
      </div>
    </div>
   
  
</template>
<script src="./action-menu.js"></script>
<style lang="scss" src="./action-menu.scss" scoped></style>

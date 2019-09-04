<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="far fa-trash-alt" aria-hidden="true"></i>
        </div>
        <h3>Delete List</h3>
      </div>
      <div class="card-body">
        <div class="container" v-if="!adminList.length">
          <div class="system-message">
            <div class="alert alert-warning">
              <div class="info">
                <i class="far fa-stop-circle" aria-hidden="true"></i>
              </div>
              <div class="message">
                <p class="pt-3 h4 text-secondary">It appears you have no Lyrist Lists to manage.</p>
                <p>We've tried to retrieve your lists but none were found</p>
              </div>
              
            </div>
          </div>
        </div>
        <div class="container" v-else>
          <div class="system-message">
            <div class="alert alert-info">
              <div class="info">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </div>
              <div class="message">
                <p
                  class="pt-3 h4 text-secondary"
                >Below are lists in which you are the administrator of.</p>
                <p>Select the list you wish to delete and select the delete button</p>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="list_name">List Name</label>
            <select class="form-control" name="list_name" id="list_name" v-model="selectedList">
              <option>- select list -</option>
              <option v-for="list in adminList" :key="list.listName">{{list.listName}}</option>
            </select>

            <div class="text-right my-3">
              <button class="btn btn-danger mr-2" @click="deleteList()">Delete List</button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
          
         
<script src="./delete-list.js"></script>
<style lang="scss" src="./delete-list.scss" scoped></style>

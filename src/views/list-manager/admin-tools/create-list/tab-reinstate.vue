<template>
  <div>
    
    <div class="container form-group">
      <label for="reinstate_admin_email">Admin Email</label>
      

      <select name="reinstateAdminEmail" id="reinstate_admin_email" class="form-control" v-model="selectedList">
        <option v-for="list in groupedList" :key="list.email" :value="list">{{list.email}}</option>
      </select>

      <label for="reinstate_list_to_restore">List to Restore</label>
      <select name="list_to_restore" id="reinstate_list_to_restore" class="form-control" v-model="listToReinstate" v-if="selectedList">
        <option v-for="list in selectedList.lists" :key="list.listName" :value="list.listName">{{list.listName}}</option>
      </select>

      <label for="reinstate_admin_password_reinstate">Admin Password</label>
      <input type="password" class="form-control" id="reinstate_admin_password_reinstate" v-model="model.password">

      <label for="reinstate_description_reinstate">Description</label>
      <input type="text" class="form-control" id="reinstate_description_reinstate" v-model="model.description">

      <label class="d-inline-block mr-3">Type of List</label>
      <ul class="d-inline-block radio-buttons">
        <li>
          <input type="radio" id="reinstate_mailing-type-closed" value="closed" name="mailing-type"  v-model="model.mailingType" checked>
          <label for="reinstate_mailing-type-closed">Closed</label>
        </li>
        <li>
          <input type="radio" id="reinstate_mailing-type-open" value="open" name="mailing-type"  v-model="model.mailingType">
          <label for="reinstate_mailing-type-open">Open</label>
        </li>
      </ul>
      <br>
      
      <div class="check-buttons">
        <input 
         type="checkbox"
            name="certify"
            id="reinstate_chkcertify"
            ref="chkcertify"
            v-validate="'required'"
            v-model="model.certify"
            :value="model.certify"
        >
        <label for="reinstate_chkcertify">
          By checking this box I certify that this listserv and its uses are aligned with the mission of The University of North Carolina at Chapel Hill.
          The UNC Mission Statement can be found here:
          <a
            href="https://www.unc.edu/about/mission/"
          >UNC Mission Statement</a>
        </label>
      </div>
      <div class="text-right">
        <button class="btn btn-primary mr-2" @click="submit()">Submit</button>
      </div>
    </div>
  </div>
</template>
<script src="./tab-reinstate.js"></script>
<style lang="scss" src="./tab-reinstate.scss" ></style>

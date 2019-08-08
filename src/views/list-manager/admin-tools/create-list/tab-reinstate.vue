<template>
  <div>
    <div class="container form-group">
      <label for="admin_email">Admin Email</label>
      <select name="admin_email" id="admin_email" class="form-control">
        <option value v-for="email in emailAddresses" :key="email">{{email}}</option>
      </select>
      <label for="list_to_restore">List to Restore</label>
      <select name="list_to_restore" id="list_to_restore" class="form-control">
        <option value v-for="list in deleted" :key="list">{{list}}</option>
      </select>

      <label for="admin_password_reinstate">Admin Password</label>
      <input type="password" class="form-control" id="admin_password_reinstate">

      <label for="description_reinstate">Description</label>
      <input type="text" class="form-control" id="description_reinstate" >

      <label class="d-inline-block mr-3">Type of List</label>
      <ul class="d-inline-block radio-buttons">
        <li>
          <input type="radio" id="mailing-type-closed" value="closed" name="mailing-type" checked>
          <label for="mailing-type-closed">Closed</label>
        </li>
        <li>
          <input type="radio" id="mailing-type-open" value="open" name="mailing-type">
          <label for="mailing-type-open">Open</label>
        </li>
      </ul>
      <br>
      <div class="check-buttons"></div>
      <div class="check-buttons">
        <input type="checkbox" name="certify" id="chkcertify" v-model="certify">
        <label for="chkcertify">
          By checking this box I certify that this listserv and its uses are aligned with the mission of The University of North Carolina at Chapel Hill.
          The UNC Mission Statement can be found here:
          <a
            href="https://www.unc.edu/about/mission/"
          >UNC Mission Statement</a>
        </label>
      </div>
      <div class="text-right">
        <button class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</template>
<script src="./tab-reinstate.js"></script>
<style lang="scss" src="./tab-reinstate.scss" ></style>

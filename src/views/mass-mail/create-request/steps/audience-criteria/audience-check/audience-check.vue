<template>
  <div>
    <div class="check-audience" >
      <div class="alert alert-info">
        <div class="info">
          <i class="fa fa-info-circle"></i>
        </div>
        <p class="ml-3">
          Enter a user's onyen to verify if the person entered is found within
          the population criteria selected.
        </p>

        
      </div>
      <div>

      </div>
      <div class="one-column input-w-btn">
        
        <form
          @submit.prevent.prevent
          class="form-group"
          role="form"
          ref="checkAudienceForm"
        >
          <div class="label-info">
            <label for="checkAudience">Check Audience</label>
          </div>
          <div class="form-inline">
            <input
              id="checkAudience"
              type="text"
              class="form-control"
              placeholder="onyen"
              autocomplete="off"
              v-model="onyen"
              v-select-all
            />
            <button class="btn btn-primary" @click="checkUser()">
              Check
            </button>
            <pop-over
              title="Check Audience"
              data-content="Use this to verify whether the person entered is a member of the selected audience."
            ></pop-over>
          </div>
        </form>
      </div>
    </div>

    <confirm-dialog id="confirmCheckUser" ref="confirmCheckUser" width="800">
      <div slot="modal-title" class="text-white">Check Audience Result</div>
      <div slot="modal-body">
        <div class="alert alert-warning">
          <div class="info">
            <i class="fa fa fa-exclamation-circle"></i>
          </div>
          <div>
            <p>{{ audienceCheckResult }}</p>
            <div>Validation Conflicts Occurred:</div>
            <ul>
              <li v-for="item in validationErrors" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeConfirmCheckUser()">
          Close
        </button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./audience-check.js"></script>
<style lang="scss" src="./audience-check.scss" scoped></style>

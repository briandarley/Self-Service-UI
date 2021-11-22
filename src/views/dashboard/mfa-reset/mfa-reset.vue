<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">undo</i>
        </div>
        <h1>MFA Reset</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>MFA Reset allows users to reset Microsoft's Office365 MFA. The process will remotely contact Microsoft Office365 and reset all associated devices
                This will require the user to re-verify their secondary verification for access to Office365.</p>
            </div>
          </div>
          
              <div class="submit text-center mt-4">
                <button
                  type="button"
                  class="btn btn-danger icon-button"
                  aria-label="Left Align"
                  @click="resetMfa()"
                >
                  <span>
                    <i data-v-1da7b41f class="material-icons" aria-hidden="true">undo</i>
                  </span>
                  <span>Reset</span>
                </button>
              </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./mfa-reset.js"></script>
<style lang="scss" src="./mfa-reset.scss" scoped></style>

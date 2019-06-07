<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-mail-bulk"></i>
        </div>
        <h3>Shared Mailbox</h3>
      </div>
      <div class="card-body">
        <h4 class="text-primary">Remedy 3701855, Allow a longer character limit</h4>

        <p>
          Allow a longer character limit (Currently 15 or 23 with the UNC prefix), the UNC prefix can take up to 7 characters, thus limiting the number of characters that can be used for the name. The current character limit is based on the longest possible prefix.
          Create shared mailboxes in the cloud. Currently mailboxes are created on-prem, and those have to be migrated to 365 after a DirSync cycle has occured. Creating them in 365 initially would save time.
        </p>
      </div>
    </div>
  </div>
</template>
<script src="./shared-mailbox.js"></script>
<style lang="scss" src="./shared-mailbox.scss" scoped></style>

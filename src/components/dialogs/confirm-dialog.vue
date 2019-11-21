<template>
  <div class="modal-container">
    <div :id="id" class="modal fade" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title">
              <slot name="modal-title"></slot>
            </h5>
            <!-- <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button> -->
            <button type="button" class="close text-white" @click="hide()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            
          </div>
          <div class="modal-body">
            <slot name="modal-body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="modal-footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./confirm-dialog.js"></script>
<style lang="scss" src="./confirm-dialog.scss" scoped></style>

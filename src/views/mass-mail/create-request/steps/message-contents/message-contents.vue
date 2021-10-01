<template>
  <form @submit.prevent.prevent class="container" autocomplete="off" ref="submitForm">
    <div class="border border-primary form-group">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Message Contents</div>
      </div>

      <textarea 
        name="editor1"
        id="editor1"
        rows="10"
        cols="80"
        v-model="model.content.content"></textarea>
    </div>
  </form>
</template>
<script src="./message-contents.js"></script>
<style lang="scss" src="./message-contents.scss" scoped></style>

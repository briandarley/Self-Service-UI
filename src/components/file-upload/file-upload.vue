<template>
  <div>
    <slot name="header"></slot>


    
    <form
      id="file-upload-form"
      ref="fileform"
      class="dashed-box-shadow"
      :class="{ hidden: files.length }"
    >
      <div class="drop-files">
        <i class="fa fa-file-download"></i>
        <span class="instructions">
          <a href="#" @click.prevent="triggerManualFileHandling()"
            >Choose a file</a
          >
          or drag it here.
        </span>
      </div>

      <input
        type="file"
        id="file"
        ref="file"
        @change="handleFileUpload()"
        class="hidden"
      />

    </form>
    <div class="file-listings mx-3">
      <div class="bg-secondary text-white row-header">
        <div></div>
        <div>
          File Name
        </div>
        <div>
          Type
        </div>
        <div>
          Actions
        </div>
      </div>
      <div class="results">
        <div class="result-grid" v-for="(file, key) in files" :key="key">
          <div class="record-info">
            <div class="record-info-detail">
              <div>
                <i
                  class="fa fa-file text-secondary"
                  :class="getFontAwesomeFileType(file)"
                ></i>
              </div>
              <div>
                {{ file.name }}
              </div>
              <div>{{ file.type }}</div>
              <div>
                <a href="#" @click.prevent="removeFile()" class="text-dark">Remove</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="submit text-right my-3 mr-1">
        <button
          type="button"
          @click="uploadFile()"
          class="btn btn-primary mr-1"
        >
          Upload File
        </button>
        <button type="button" class="btn btn-secondary" @click="removeFile()">
          Cancel
        </button>
      </div>
    </div>

    <slot name="footer"></slot>
  </div>
</template>
<script src="./file-upload.js"></script>
<style lang="scss" src="./file-upload.scss" scoped></style>

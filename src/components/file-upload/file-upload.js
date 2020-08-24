import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "file-upload",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  components: {},
  props: ["options", "data"],

  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})
export default class FileUpload extends Vue {
  files = [];

  async mounted() {
    this.toastService.set(this);
    if (!this.options) {
      this.toastService.error(
        "Please set the options for file upload component"
      );
    }
    this.initializeDragAndDrop();
  }

  determineDragAndDropCapable() {
    let div = document.createElement("div");

    return (
      ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
      "FormData" in window &&
      "FileReader" in window
    );
  }

  initializeDragAndDrop() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    if (this.dragAndDropCapable) {
      [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop",
      ].forEach(
        function(evt) {
          this.$refs.fileform.addEventListener(
            evt,
            function(e) {
              e.preventDefault();
              e.stopPropagation();
            }.bind(this),
            false
          );
        }.bind(this)
      );

      this.$refs.fileform.addEventListener(
        "drop",
        function(e) {
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            this.files.push(e.dataTransfer.files[i]);
            //this.getImagePreviews();
          }
        }.bind(this)
      );
    }
  }

  handleFileUpload() {
    let file = this.$refs.file.files[0];
    this.files.push(file);
    this.$emit("fileAdded");
  }

  async submitFiles() {
    try {
      if (!this.files.length) return;
      this.$emit("fileUploadBegin");

      let formData = new FormData();

      /*
        Iteate over any file sent over appending the files
        to the form data.
      */
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];

        //formData.append("files[" + i + "]", file);
        formData.append("files", file);
      }

      let response = await this.options.fileUpload(formData, this.options);
    
      if(response.status === false) {
        this.$emit("fileUploadedError", response);
      }
      else {
        this.$emit("fileUploaded", response.data);
      }
      
      
    } catch (e) {
      
      throw e;
    } finally {
      this.$emit("fileUploadComplete");
    }
    /*
        Make the request to the POST /file-drag-drop URL
      */
    // axios
    //   .post("/file-drag-drop", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     onUploadProgress: function(progressEvent) {
    //       this.uploadPercentage = parseInt(
    //         Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //       );
    //     }.bind(this),
    //   })
    //   .then(function() {
    //     window.console.log("SUCCESS!!");
    //   })
    //   .catch(function() {
    //     window.console.log("FAILURE!!");
    //   });
  }

  triggerManualFileHandling() {
    let fileHandler = this.$refs.file;
    fileHandler.click();
  }

  getFontAwesomeFileType(file) {
    let fileName = file.name.toUpperCase();
    if (fileName.endsWith(".XLSX") || fileName.endsWith(".XLS")) {
      return "fa-file-excel-o";
    }
    if (file.name.toUpperCase().endsWith(".TXT")) {
      return "fa-file-text-o";
    }
    if (file.name.toUpperCase().endsWith(".DAT")) {
      return "fa-file-csv-o";
    }
    if (file.name.toUpperCase().endsWith(".CSV")) {
      return "fa-file-csv-o";
    }
    return "fa-file-o";
  }

  async uploadFile() {
    await this.submitFiles();

    this.$emit("uploaded");
  }

  removeFile() {
    this.files = [];
    this.$emit("canceled");
  }

  downloadTemplate() {
  }
}

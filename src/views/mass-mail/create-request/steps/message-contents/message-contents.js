import {
  BaseValidateMixin
} from "./../../../../../components/mixins/index";
import {
  Component,
  Watch
} from "vue-property-decorator";
window.CKEDITOR_BASEPATH = '//cdn.ckeditor.com/4.12.1/full-all/';
require('ckeditor/ckeditor');

@Component({
    name: 'message-contents',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService'],
    props: ['value']
  })

export default class MessageContents extends BaseValidateMixin {

  model = {
    content : ''
  }
  ckEditorInstance = null;
  
  @Watch('model', {immediate:false, deep: true})
  onModelChanged(newValue)
  {
    this.$emit('input', newValue);
  }
  @Watch('value', {immediate: true, deep: true})
  onValueChanged(newValue){
    this.model = newValue;
  }

  loadEditor() {
    return new Promise((resolve) => {
      setTimeout(() => {
          this.ckEditorInstance = CKEDITOR.replace('editor1',
            {
              height: '25em'
              //Remove plugins for this iteration
              //extraPlugins: 'divarea,uploadimage',
              //imageUploadUrl: '/uploader/upload.php?type=Images'
            });

          resolve();
        },
        100);
    });
  }

  onTextChanged(e) {
   this.model.content = e.editor.getData();
  }

  beforeDestroy() {
    this.ckEditorInstance.removeAllListeners();
    CKEDITOR.remove(this.ckEditorInstance);
  }

  addDefaultImageHandlingTest() {
    CKEDITOR.replace('editor1',
      {
        //Remove plugins for this iteration
        //extraPlugins: 'uploadimage',
        //This is temporary till we get an API setup
        //imageUploadUrl: '/uploader/upload.php?type=Images'
      });
  }

  onFileUploadRequest(evt) {
    evt.stop();
  }

  addCkEditorEventHandling() {
    CKEDITOR.instances.editor1.on('change', this.onTextChanged);
    CKEDITOR.instances.editor1.on('fileUploadRequest', this.onFileUploadRequest);
  }
  

  async mounted() { 
    this.toastService.set(this);
    this.loadEditor().then(() => {
      this.addCkEditorEventHandling();
    });

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Message Content");
  }
  
  isValid(){
    let errors = this.validate(this.$refs.submitForm); 
    if(!errors || !errors.length) return true;
    return false;
  }
  
}


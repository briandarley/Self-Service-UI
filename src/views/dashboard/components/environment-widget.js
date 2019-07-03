import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'environment-widget',
    dependencies: ['$','moment','toastService','spinnerService','ConfigReaderService'],
  })

export default class EnvironmentWidget extends Vue {
  environment = "";
  build = "";
  async mounted() { 
    this.toastService.set(this);
    this.environment = await this.ConfigReaderService.getConfigurationSetting("environment")
    this.build  = await this.ConfigReaderService.getConfigurationSetting("build")
    
  }
 
}


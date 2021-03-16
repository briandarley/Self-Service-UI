import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "group-create",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "UserService",
    "ConfigReaderService"
  ],
  components: {},
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})
export default class GroupCreate extends BaseValidateMixin {
  defaultMailDomain = "@emailtest.unc.edu";

  thDataOptions = {
    name: "query-results",
    source: this.typeAheadSource,
    async: false,
    displayKey: "name",
    display: this.getTypeAheadDisplay,
    limit: 20
    //display: "name"
  };
  currentUser = {
    profile: {}
  };
  model = {
    id: 0,
    name: "",
    ouName: "",
    distinguishedName: "",
    //friendlyName: "",
    groupTypeCode: "",
    statusCode: "",
    createdBy: "",
    displayName: "",
  };

  organizationalUnits = [];

  async mounted() {
    this.toastService.set(this);
    await this.loadOrganizationalUnits();
    await this.initializeTypeAheadValue();
    this.currentUser = await this.UserService.get();

    this.defaultMailDomain = await this.ConfigReaderService.getConfigurationSetting("defaultMailDomain")
  }
  
  async loadOrganizationalUnits() {
    let result = await this.ExchangeToolsService.getOrganizationalUnits();

    this.organizationalUnits = result.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  get groupTypeDisplay() {
    if (this.model.groupTypeCode === "SHARED_MAILBOX") {
      return "Shared Mailbox";
    } else if (this.model.groupTypeCode === "RESOURCE_MAILBOX") {
      return "Resource Mailbox";
    }
    return "";
  }

  @Watch("model.displayName")
  onDisplayNameChanged(newvalue) {
    if (!newvalue) {
      this.model.name = "";
      this.model.replyToAddress = "";
      return;
    }
    let value = newvalue.replace(/[^a-zA-Z0-9_-]/g, "");
    
    this.model.name = value.substr(0,12);
    
    this.model.replyToAddress = value + this.defaultMailDomain;
  }

  goToGroupSearch() {
    this.$router.push({
      name: "ad-groups",
      // params: {
      //   id: response.id
      // }
    });
  }

  initializeTypeAheadValue() {

    this.$refs.thSelectDepartment.initializeControl(); 

    let ouItem = this.organizationalUnits.find(
      (c) => c.name == this.model.ouName
    );
    if (ouItem) {
      this.setTypeAheadValue(this.getTypeAheadDisplay(ouItem));
    }
  }
  
  setTypeAheadValue(value) {
    this.$refs.thSelectDepartment.setValue(value);
  }
  typeAheadSource(query, process) {

    //Take property value, split based on words, then return true if the filter matches the start of the word
    let filterValue = (entity, property) => {
      if (entity[property]) {
        let words = entity[property].toUpperCase().split(" ");
        if(words.some(c=> c.startsWith(filter)))
        {
          return true;
        }
        //return entity[property].toUpperCase().indexOf(filter) > -1;
      }
      return false;
    };

    let filter = query.toUpperCase();
    let items = this.organizationalUnits.filter(
      (c) =>
        filterValue(c, "name") ||
        filterValue(c, "department") ||
        filterValue(c, "description")
    ).sort((a,b)=>{
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    process(items);
  }

  getTypeAheadDisplay(item) {
    return item.name + " - " + item.department;
  }
  getTypeAheadValue(display) {
    let result = this.organizationalUnits.find(c=> (c.name + " - " + c.department) === display);
    return result;

  }

  onDepartmentalUnitChange(value) {
    //validate selection, esure what was selected/entered matches to what is available in the list
    //if valid set the model value, otherwise clear the typeahead
    let isValid = true;
 
    let stringValue = "";
    if (typeof value !== "object") {
      stringValue = value;
      isValid = this.organizationalUnits.some(
        (c) => this.getTypeAheadDisplay(c) === value || c.name === value
      );
    }
    if (isValid) {
      if(!stringValue){
        stringValue = value.name
      }
      this.model.ouName = this.organizationalUnits.find(
        (c) => this.getTypeAheadDisplay(c) === stringValue || c.name === stringValue
      ).name;
      //this.model.ouName = stringValue;
      this.setTypeAheadValue(this.model.ouName);
    } else {
      //debugger;
      this.toastService.error("Invalid Department Unit");
      this.setTypeAheadValue(null);
    }
  }
  isValid() {
    let errors = this.validate(this.$refs.submitForm);
    if (!errors || !errors.length) return true;
    return false;
  }
  async replyToAddressExists() {
    try {
      if (!this.model.replyToAddress) {
        return false;
      }
      

      let pagedResponse = await this.ExchangeToolsService.getAdUsers({proxyAddress: this.model.replyToAddress});

      if(pagedResponse.status === false || pagedResponse.totalRecords == 0) {
        return false;
      }
      
      return true;
    } catch (error) {
      window.console.log(error);
      this.toastService.error("Failed to validate Reply To Address");
    }
  }

  clear() {
    this.model = {
      id: 0,
      name: "",
      ouName: "",
      distinguishedName: "",
      groupTypeCode: "",
      statusCode: "",
      createdBy: "",
      displayName: "",
    };
    this.clearValidation();
  }

  async create() {
    this.spinnerService.show();
    try {
      //
      if (!this.isValid()) {
        this.toastService.error("Form invalid");
        return;
      }

      if (this.model.groupTypeCode === "SHARED_MAILBOX") {
        if (await this.replyToAddressExists()) {
          this.toastService.error(
            "Reply to address is invalid, Email may already be assigned to another entity"
          );
          return;
        } 
      }
      
      
      let result = await this.ExchangeToolsService.addGroupToQueue(this.model);
       
      if(result.status === false) {
        this.toastService.error(`Failed to create resource, ${result.message}`);
      }
      else {
      
        this.toastService.success("Successfully added group to queue.")
        
        this.$refs.confirmGroupCreated.show();
      
      }
      //window.console.log(result);




      // try { 
      //   
      // } catch (error) {
      //   window.console.log(error);
      //   this.toastService.error("Failed to create group");
      // }
    } catch (e) {
      window.console.log(e);
      this.toastService.error(`Failed to create resource`);
    } finally {
      this.spinnerService.hide();
      
    }
  }

  test() {
    this.$refs.confirmGroupCreated.show();
  }
  onConfirmGroupCreatedClick() {
    this.$refs.confirmGroupCreated.hide();

    this.$router.push({
      name: "ad-groups"
    
    });

  }
}

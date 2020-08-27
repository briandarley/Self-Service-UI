import Vue from "vue"
import {  Component  } from "vue-property-decorator";
import Spinner from '@/components/spinner/spinner.vue';

@Component({
    name: 'manager-list-management',
    dependencies: ['$', 'moment', 'toastService', 'spinnerService'],
    components: {
      Spinner
    },
    props: ['group', 'headerLabels','autoLoadEntities', 'service']
    
  })
export default class ManagerListManagement extends Vue {
  userId = "";
  entities = [];
  lookupEntityModel = {};
  multipleRecords = false;
  

  //Called from parent controller
  async populateEntities(parentGroup){
    this.lookupEntityModel = {
      name: parentGroup.group.name,
      samAccountName: parentGroup.group.samAccountName,
      type: 'group',
      displayName: parentGroup.group.displayName,
      email: parentGroup.group.primarySmtpAddress
      
    };

    this.entities = parentGroup.managers;
  }


  


  showDialog(){
    if (!this.$refs.confirmAddManager) return;
    this.$refs.confirmAddManager.show();
  }
  hideDialog(){
    if (!this.$refs.confirmAddManager) return;
    this.$refs.confirmAddManager.hide();
  }

  
  
  
  
  onCancelConfirmClick(){
    this.hideDialog();
  }
  showSpinner(){
    if (!this.$refs.spinnerMngrList) return;
    this.$refs.spinnerMngrList.showSpinner();
  }
  hideSpinner(){
    if (!this.$refs.spinnerMngrList) return;
    this.$refs.spinnerMngrList.hideSpinner();
  }
  toggleSpinner(){
    if (!this.$refs.spinner) return;
    this.$refs.spinner.toggleSpinner();
  }
  onClear(){
    this.userId = "";
  }
  
  async mounted() {
    
    this.toastService.set(this);
    this.$emit('controlLoaded');
    
    if(this.autoLoadEntities){
      this.showSpinner();
      try{
        
        this.entities = await this.service.getMyManagedGroupManagers(this.group.samAccountName);


        this.entities.map(c=> {
          if(!c.id)
          {
            c.id = c.distinguishedName
          }
          return c;
      })
      

      } catch(e){
        window.console.log(e);
        this.toastService.error("Failed to retrieve manager entities");
      }
      finally{
        this.hideSpinner();
      }
    }

    

  }
  

  async onConfirmAddMemberClick() {
    try {
      this.showSpinner();
      this.hideDialog();
      
      
      if (this.entities.some(c => c.samAccountName === this.lookupEntityModel.samAccountName)) {
        this.toastService.error("Entity is already a member of group")
        return;
      }
      
      let response = await this.service.addManagerToGroup(this.group.distinguishedName, this.lookupEntityModel.distinguishedName);
      if(response.status === false) {
        this.toastService.error(`Failed to add manager to list ${response.message}`);
        return;
      }
      this.entities.push(this.lookupEntityModel);

      this.toastService.success("Successfully added entity to group");
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add members to group");
    } finally {
      this.hideSpinner();
    }
  }


  async onLookupMember() {
    
    let userId = this.userId;
    this.multipleRecords = false;
    

    if (!userId) {
      this.toastService.error("Search criteria empty, please specify a search criteria");
      return;
    }

    if (userId.toUpperCase() == this.group.toUpperCase()) {
      this.toastService.error("You can't add reference to itself, silly");
      return;
    }

    try {

      this.spinnerService.show();
      let pagedResponse = await this.service.getPagedAdEntities({samAccountName: userId});

      if(pagedResponse.status === false || pagedResponse.totalRecords === 0) {
        this.toastService.error("Failed to retrieve user information given criteria");
        return;
      }
      this.lookupEntityModel = pagedResponse.entities[0];
      this.showDialog();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to locate member given criteria");
    } finally {
      this.spinnerService.hide();
    }


  }

  async removeEntity(entity) {
    try {
      if(this.entities.length <= 1){
        this.toastService.error("All groups must have at least one owner who manages membership, message approval, and other settings for the group.")
        return;
      }
      if(entity.samAccountName.toLowerCase() === "its_exchmbcreate.svc"){
        this.toastService.error("Service account cannot be removed as a manager of group.")
        return;
      }

      

      this.showSpinner();
      
      await this.service.removeManagerFromGroup(this.group.distinguishedName, entity.distinguishedName);
      this.entities = this.entities.filter(c => c.distinguishedName !== entity.distinguishedName);
      this.toastService.success("Successfully removed entity");
      this.$emit('entityRemoved', entity.samAccountName);

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to remove entity');
    } finally {
      this.hideSpinner();
    }
  }
}


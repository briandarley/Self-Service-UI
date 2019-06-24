import Vue from "vue"
import {  Component  } from "vue-property-decorator";
import Spinner from '@/components/spinner/spinner.vue';

@Component({
    name: 'manager-list-management',
    dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService'],
    components: {
      Spinner
    },
    props: ['group', 'headerLabels','autoLoadEntities']
    
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


  async removeEntity(samAccountName){
    try {
      this.showSpinner();

      await this.ExchangeToolsService.removeGroupManager(this.group, samAccountName);
      this.entities = this.entities.filter(c => c.samAccountName !== samAccountName);
      this.toastService.success("Successfully removed entity");
      this.$emit('entityRemoved', samAccountName);

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to remove entity');
    } finally {
      this.hideSpinner();
    }
  }


  showDialog(){
    if (!this.$refs.confirmAddManager) return;
    this.$refs.confirmAddManager.show();
  }
  hideDialog(){
    if (!this.$refs.confirmAddManager) return;
    this.$refs.confirmAddManager.hide();
  }

  async onLookupMember(){
    
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
      let responses = await Promise.all([this.ExchangeToolsService.getExchangeUser(userId)]);

      let exchangeUserEntity = responses[0];
      
      if (exchangeUserEntity.status !== false) {
        this.lookupEntityModel = {
          name: exchangeUserEntity.samAccountName,
          samAccountName: exchangeUserEntity.samAccountName,
          type: 'user',
          displayName: exchangeUserEntity.displayName,
          email: exchangeUserEntity.userPrincipalName,
          distinguishedName: exchangeUserEntity.distinguishedName
        };
        this.showDialog();
      } 

      if (exchangeUserEntity.status === false) {
        this.toastService.error(`Failed to retrieve entity information for entity '${userId}'`)
        return;
      }


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to locate member given criteria");
    } finally {
      this.spinnerService.hide();
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
      
      await this.ExchangeToolsService.addGroupManager(this.group, this.lookupEntityModel.samAccountName);
      this.entities.push(this.lookupEntityModel);

      this.toastService.success("Successfully added entity to group");
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add members to group");
    } finally {
      this.hideSpinner();
    }
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
  
  async mounted(){
    
    this.toastService.set(this);
    this.$emit('controlLoaded');
    
    if(this.autoLoadEntities){
      this.showSpinner();
      try{
        this.entities = await this.ExchangeToolsService.getDistributionGroupManagers(this.group);


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
  async onGroupManagerRetrieveFailed(){
   
    
    
  }
}


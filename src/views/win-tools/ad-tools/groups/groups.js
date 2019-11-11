import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'groups',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService', 'EventBus','ScreenReaderAnnouncerService']
  

})

export default class Groups extends Vue {
  records = [];
  performedSearch = false;
  lookupEntityModel = null;
  criteria = {
    managedBy: '',
    filterText: ''

  };
  async search() {
    if (!this.criteria.filterText && !this.criteria.managedBy) {
      this.toastService.error("Criteria too vague, please specify a criteria to search by");
      return;
    }
    if (!this.criteria.managedBy && this.criteria.filterText.length < 3) {
      this.toastService.error("Criteria too vague, please specify a criteria to search by");
      return;
    }
    await this.getRecords();
  }
  async getRecords() {
    this.spinnerService.show();
    try {
      this.lookupEntityModel = null;
      this.records = await this.ExchangeToolsService.getDistributionGroups(this.criteria);

      if (this.records.length === 0) {
        this.toastService.warn("No records found matching criteria");
      }
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve records")
    } finally {
      this.spinnerService.hide();
      this.EventBus.emit("attach-scroll");
    }
  }
  async clear() {

    this.performedSearch = false;
    this.records = [];
    this.criteria = {
      filterText: '',
      managedBy: ''

    }
    this.lookupEntityModel = null;
    //await this.search();
  }
  async toggleUsers(entity) {
    let samAccountName = entity.samAccountName;
    if (entity.showUsers) {
      entity.showUsers = false;
      return;
    }

    for(let i = 0; i< this.records.length; i++){
        if(this.records[i].samAccountName !== samAccountName){
          this.records[i].showUsers = false;
        }
    }
    

    this.spinnerService.show();

    try {

      entity.detail = await this.ExchangeToolsService.getAllDistributionGroupEntities(entity.name);

      entity.detail.members.sort((a, b) => {
        let item1 = a.samAccountName.toLowerCase();
        let item2 = b.samAccountName.toLowerCase();

        if (item1 < item2) return -1;
        if (item2 > item1) return 1;
        return 0;
      })
      entity.showUsers = !entity.showUsers;
      await this.rebindGrid();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve member/manager data");
    } finally {
      this.spinnerService.hide();
      this.EventBus.emit("attach-scroll");
    }

  }

  async lookupMember(groupEntity) {
    

    const searchTerm = groupEntity.searchMember;
    if(!searchTerm){
      this.toastService.error("Search criteria empty, please specify a search criteria");
      return;
    }
    if( searchTerm.toUpperCase() == groupEntity.name.toUpperCase()){
      this.toastService.error("You can't add reference to itself, silly");
      return;
    }
    this.spinnerService.show();
    try{
      
        let responses = await Promise.all([this.ExchangeToolsService.getExchangeUser(searchTerm),this.ExchangeToolsService.getDistributionGroup(searchTerm)])
        
        let  exchangeUserEntity = responses[0];
        let groupEntity = responses[1];

        
        if(exchangeUserEntity.status !== false){
          this.lookupEntityModel = {
            name: exchangeUserEntity.samAccountName,
            type: 'user',
            displayName: exchangeUserEntity.displayName,
            email: exchangeUserEntity.userPrincipalName,
            distinguishedName:  exchangeUserEntity.distinguishedName
          };

        
        }
        if( groupEntity.status !== false){
          this.lookupEntityModel = {
            name: groupEntity.name,
            type: 'group',
            displayName: groupEntity.displayName,
            email: groupEntity.primarySmtpAddress,
            totalMembers : 'processing...'
          };

          this.ExchangeToolsService.getAllDistributionGroupEntities(groupEntity.samAccountName).then(c=> {
            this.lookupEntityModel.totalMembers = c.members.length;
            
        }).catch(e=> {
          this.lookupEntityModel.totalMembers = "failed to retrieve";
        })
        
        }

        if(exchangeUserEntity.status === false &&  groupEntity.status === false){
          this.toastService.error(`Failed to retrieve entity information for entity '${searchTerm}'`)
          return;
        }


    } catch(e){
      window.console.log(e);
      this.toastService.error("Failed to locate member given criteria");
    } finally{
      this.spinnerService.hide();
    }
    //if(groupEntity.name)

  }
  clearAddMember(groupEntity) {
    groupEntity.searchMember = "";
    this.lookupEntityModel= null;
  }


  async removeMember(groupEntity, member) {
      groupEntity.detail.members = groupEntity.detail.members.filter(c=> c.samAccountName !==member.samAccountName) ;
      //item.detail.members
  }

  async rebindGrid() {
    this.records = JSON.parse(JSON.stringify(this.records));
  }
  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Active Directory - Groups");

  }

 async onManagerListLoaded(entity){
    
    //getDistributionGroupManagers
    //getDistributionGroupMembers
    //await this.$refs.groupManagers.populateEntities(entity);
    
  }

  async onGroupUserListLoaded(entity){

  }
}
import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'alias-authority',
    dependencies: ['$','moment','toastService','spinnerService','ExchangeToolsService']
 })

export default class AliasAuthority extends Vue {
  domains = [];
  userSearchResult = {};
  newUser = {
    visible: false,
    onyen: "",
    domain:""
  };
  availableDomains = [];
  criteria = {
    onyen: "",
    domain: "", 
    pageSize: 10,
    index: 0
  }
  showNewUser(){
    
    this.clearNewUser();
    this.newUser.visible = true;
    
  }
  async addNewUser(){
   try{
    this.spinnerService.show();
    if(!this.newUser.onyen){
      this.toastService.error("Please specify a valid Onyen");
      return;
    }
    if(!this.newUser.domain){
      this.toastService.error("Please specify a valid domain");
      return;
    }
    await this.ExchangeToolsService.addAuthorizedDomain(this.newUser.onyen,this.newUser.domain);

    this.toastService.success("Successfully added user")
    
    this.clearNewUser();
    await this.retrieveSearchResults();

   }catch(e){
    window.console.log(e);
    this.toastService.error("Failed to add new user");
   }
   finally{
    this.spinnerService.hide();
   }
   
  }
  
  async getAvailableDomains(){
    try{
      this.spinnerService.show();
      this.availableDomains = await this.ExchangeToolsService.getAvailableDomains();

    }catch(e){
      window.console.log(e);
      this.toastService.error("Failed to load available domains");
    }finally{
      this.spinnerService.hide();
    }

    

  }
  async mounted() { 
    this.toastService.set(this);
    await this.getAvailableDomains();
  }
  async search(){
    this.criteria.index = 0;
    await this.retrieveSearchResults();
  }

  async retrieveSearchResults(){
    try{
      this.spinnerService.show();
      let response = await this.ExchangeToolsService.getAdminAliases(this.criteria);
      
      response.entities =  response.entities.map(c=> {
        c.newDomain = "";
        return c;
      });
      
      this.userSearchResult = response;

      if(!response.entities.length)
      {
        this.toastService.warn("Search results returned no records");
      }

    }catch(e){
      window.console.log(e);
      this.toastService.error("Failed to retrieve admin aliases");
    }
    finally{
      this.spinnerService.hide();
    }

  }

  toggleShowDomains(entity){
    entity.expanded = !entity.expanded;

    this.userSearchResult =JSON.parse(JSON.stringify(this.userSearchResult ));
  }

  async indexChanged(index) {
    this.criteria.index = index;
    await this.retrieveSearchResults();
  }
  clearCriteria(){
    
    this.criteria = {
      onyen: "",
      domain: "", 
      pageSize: 10,
      index: 0
    }
    this.userSearchResult = {};
    this.clearNewUser();
  }
  clearNewUser(){
    this.newUser = {
      visible: false,
      onyen: "",
      domain:""
    };
  }
  calculateAvailableDomains(adminUser){
    let list =JSON.parse(JSON.stringify(this.availableDomains));

    let response = list.filter(function(e){
      return !this.some(c=> c.domain.toLowerCase() === e.domainName.toLowerCase())
    }, adminUser.adminAliases )
    
    return  response;
  }
  async removeAliasAdmin(adminUser){
    try{
      this.spinnerService.show();
      
      for(var i = 0; i < adminUser.adminAliases.length; i++){
        await this.ExchangeToolsService.removeAuthorizedDomain(adminUser.onyen,adminUser.adminAliases[i].domain);
      }
      this.toastService.success("Successfully removed user");
      this.clearCriteria();


    }catch(e){
      window.console.log(e);
      this.toastService.error("Failed to remove alias admin")
    }finally{
      this.spinnerService.hide();

    }
    
  }
  async removeAliasAdminDomain(adminUser,adminUserAlias){
    try{
      this.spinnerService.show();

    
      await this.ExchangeToolsService.removeAuthorizedDomain(adminUser.onyen,adminUserAlias.domain);

      let list = adminUser.adminAliases.filter(function(c) {

        return c.domain !== adminUserAlias.domain 

      })
      
      adminUser.adminAliases = list;
      this.toastService.success("Successfully removed alias from user profile")
    
    } catch(e){
      window.console.log(e);
      this.toastService.error("Failed to remove alias from user profile")
    }finally{
      this.spinnerService.hide();
    }
  }
  async addAuthorizedDomain(adminUser){
    if(!adminUser.newDomain ){
      this.toastService.error("Select a valid domain");
      return;
    }
    let list = adminUser.adminAliases.filter(function(c) {
      return c.domain !== adminUser.newDomain 
    })
    adminUser.adminAliases = list;


    adminUser.adminAliases.push({
      domain: adminUser.newDomain,
      uid:  adminUser.onyen

    });
    

    try{
      this.spinnerService.show();
    
      await this.ExchangeToolsService.addAuthorizedDomain(adminUser.onyen,adminUser.newDomain);
      this.toastService.success("Successfully added alias to user profile")
    } catch(e){
      window.console.log(e);
      this.toastService.error("Failed to add alias to user profile")
    }finally{
      this.spinnerService.hide();

      adminUser.newDomain = "";
    }

  }
}


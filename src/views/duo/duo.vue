<template>
  <div class="container">
     <div class="card card-icon">                    
       <div class="card-header text-primary">       
           <div class="icon bg-primary text-white"> 
             <i class="material-icons" aria-hidden="true">lock</i> 
            </div>                                     
            <h3>DUO MFA Required</h3>
       </div>                                         
       <div class="card-body">              
          <div class="alert alert-info">
             <div class="info">
                 <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
             </div>
             <p class="p-3">
                 The requested resource requires secondary authentication MFA. Please confirm authentication via DUO, you'll be redirected to the requested resource once successfully authenticated. 
             </p>
             
         </div>

         <div class="duo-frame-container">
            <iframe id="duo-frame" />            
         </div>
         
       </div>                                         
    </div>                                           
    
  </div>
</template>
<script src="./duo.js"></script>
<style lang="scss" src="./duo.scss" scoped></style>

import injector from 'vue-inject';

function MassMailResponseTemplates(moment) {
    return {
        getCancelNotificationTemplate(model) {
            return `Hello, 

The following message was canceled:  Id ${model.id}
Subject: [${model.messageType}] ${model.subject}

If you have questions please contact us.  

Cordially,  
UNC Mass E-mail approvers.

`;

        },
        getContactAuthorTemplate(model) {
            
            return `Hello, 

The following comments have been logged about message Id: ${model.id} Subject: [${model.subject}]. 

If you have questions please contact us.  

Cordially,  
UNC Mass E-mail approvers.            


`;
        },
        getDeniedTemplate(model) {
            let dt = moment().format('M/DD/YYYY');
            //tiny url: https://help.unc.edu/sp?id=kb_article&sys_id=0d1695d5dba77b401fb6ef070596194a
            //Created from https://go.unc.edu/shortcuts/

            return `Hello, 

            The following message has been denied for ${model.populationType} on ${dt} because XXXXXX 
            
            Id: ${model.id} Subject: [${model.subject}]. 
            
            The Mass E-mail Policy is at http://go.unc.edu/Ay36B, should you need to review it.  
            
            You are welcome to revise and re-submit your message.  If you have questions, please contact us by e-mail. 
            
            Cordially, 
            UNC Mass E-mail Approvers`;
        },
        getApprovalNotificationTemplate(model) {
            let dt = moment().format('M/DD/YYYY');

            return `Hello,

The following message has been approved for delivery to employees on ${dt} Id: ${model.id} Subject: [${model.subject}].

You will receive another message once the message has been sent.  

Cordially,
UNC Mass E-mail Approvers`;
        },
        getSendNowNotificationTemplate(model) {
            let dt = moment().format('M/DD/YYYY');

            return `Hello,

The following message submitted for immediate delivery on ${dt} Id: ${model.id} Subject: [${model.subject}].

You will receive another message once the message has been sent.  

Cordially,
UNC Mass E-mail Approvers`;
        }                

    }
}

injector.service('MassMailResponseTemplates',['moment'], MassMailResponseTemplates);
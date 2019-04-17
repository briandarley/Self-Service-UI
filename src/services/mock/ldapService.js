import injector from 'vue-inject';

function LdapService() {
    return {
        async getUseProfile() {
            
            return {
                "uid": "bdarley",
                "sn": "Darley",
                "departments": [
                    "602000"
                ],
                "displayName": "Brian Darley",
                "eduPersonAffiliation": [
                    "member",
                    "staff",
                    "employee"
                ],
                "eduPersonScopedAffiliation": [],
                "employeeType": [
                    "SPA"
                ],
                "errors": null,
                "givenName": "Brian",
                "homePostalAddressIsPublic": false,
                "homePhoneIsPublic": false,
                "homePostalAddress": "111 Ginkgo Trail, $ Chapel Hill, NC  27516 $ USA",
                "homePhone": "(941) 504-0582",
                "isActive": true,
                "uncJobs": [
                    "cn=job-0,pid=730250932,ou=People,dc=unc,dc=edu"
                ],
                "addressIsPublic": true,
                "location": "cn=primary-work-location,pid=730250932,ou=People,dc=unc,dc=edu",
                "uncAccountExpired": false,
                "eduPersonPrincipalName": "bdarley@unc.edu",
                "uncStaffAffiliationIsPublic": true,
                "campusLocation": "Chapel Hill",
                "country": "US",
                "uidNumber": "289559",
                "street": "440 W. Franklin Street",
                "emailIsPublic": true,
                "isPublic": true,
                "departmentNumbers": [
                    "602000"
                ],
                "title": "Applications Analyst",
                "uncStaffOnlyAtHospital": false,
                "massemailallowed": false,
                "homeDirectory": "/home/b/d/bdarley",
                "homeLocation": "cn=home-location,pid=730250932,ou=People,dc=unc,dc=edu",
                "mail": "bdarley@email.unc.edu",
                "pid": "730250932",
                "uncReverseDisplayName": "Darley, Brian",
                "state": "NC",
                "objectClass": [
                    "organizationalPerson",
                    "posixAccount",
                    "UNCAccount",
                    "UNCStaff",
                    "eduPerson",
                    "inetOrgPerson",
                    "UNCPerson",
                    "top"
                ],
                "cn": "Brian Darley",
                "uncEmail": [
                    "bdarley@email.unc.edu",
                    "bdarley@bdarley.net"
                ],
                "gidNumber": "100",
                "ou": "ITS - Information Security",
                "eduPersonEntitlement": "urn:mace:dir:entitlement:common-lib-terms",
                "loginShell": "/bin/bash",
                "uncPidHistory": "730250932",
                "postalAddress": "440 W. Franklin Street $ Chapel Hill, NC  27599 $ USA",
                "postalCode": "27599",
                "uncApplicantRecords": [],
                "uncAffiliateType": [],
                "uncStudentType": [],
                "uncAcademicGroupCode": null,
                "affiliationType": 18 
            };
        }
    }
}

injector.service('LdapService', LdapService);
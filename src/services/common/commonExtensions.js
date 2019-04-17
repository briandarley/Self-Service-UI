import injector from 'vue-inject';

function CommonExtensions() {
    return {
        convertToQueryParams(criteria) {
            let params = Object.keys(criteria).map(c => {
                return `${c}=${criteria[c]}`
            })

            let response = "";

            for (let i = 0; i < params.length; i++) {
                response += `${params[i]}&`
            }

            response = response.replace(/&$/, "");
            return response;
        },
        getValidEmailAddresses(smtpList) {
            function isValid(email){
                return email.endsWith('unc.edu') || email.endsWith('renci.edu') ||  email.endsWith('renci.org');
            }

            let responseList = smtpList
                .filter(c => c.toUpperCase().startsWith("SMTP"))
                .map(c => {
                    if (c.startsWith("SMTP")) {
                        return {
                            primary: true,
                            email: c.substring(5, c.length),
                            valid: isValid(c)
                        }
                    }
                    return {
                        primary: false,
                        email: c.substring(5, c.length),
                        valid: isValid(c)
                    }
                });

            return responseList;
        }
    }
}

injector.service('CommonExtensions', [], CommonExtensions);
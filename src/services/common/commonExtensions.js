import injector from 'vue-inject';

function CommonExtensions() {
    return {
        convertToQueryParams(criteria) {
            let params = Object.keys(criteria)
                .filter(c => criteria[c] != null)
                .map(c => {
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
            function isValid(email) {
                return email.endsWith('unc.edu') || email.endsWith('renci.edu') || email.endsWith('renci.org');
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
        },
        uuid4() {
            let uuid = '',
                ii;
            for (ii = 0; ii < 32; ii += 1) {
                switch (ii) {
                    case 8:
                    case 20:
                        uuid += '-';
                        uuid += (Math.random() * 16 | 0).toString(16);
                        break;
                    case 12:
                        uuid += '-';
                        uuid += '4';
                        break;
                    case 16:
                        uuid += '-';
                        uuid += (Math.random() * 4 | 8).toString(16);
                        break;
                    default:
                        uuid += (Math.random() * 16 | 0).toString(16);
                }
            }
            return uuid;
        },
        isValidDate(dateString) {
            // First check for the pattern
            if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
                return false;

            // Parse the date parts to integers
            let parts = dateString.split("/");
            let day = parseInt(parts[1], 10);
            let month = parseInt(parts[0], 10);
            let year = parseInt(parts[2], 10);

            // Check the ranges of month and year
            if (year < 1000 || year > 3000 || month == 0 || month > 12)
                return false;

            let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // Adjust for leap years
            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                monthLength[1] = 29;

            // Check the range of the day
            return day > 0 && day <= monthLength[month - 1];
        },
        isDate(value) {
            switch (typeof value) {
                case 'number':
                    return true;
                case 'string':
                    return !isNaN(Date.parse(value));
                case 'object':
                    if (value instanceof Date) {
                        return !isNaN(value.getTime());
                    }
                    default:
                        return false;
            }
        },
        toDateFromLdapTime(value){
            return new Date(value/1e4 - 1.16444736e13);
        }

    }
}

injector.service('CommonExtensions', [], CommonExtensions);
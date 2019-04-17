import injector from 'vue-inject';

function ListServService() {
    return {
        async getUserSubscriptions() {
            return [{
                    "email": "bdarley@email.unc.edu",
                    "name": "sicc"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "tutoringagainsttobacco"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "vectornti_training_courses"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "spring2g"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "uncpredent"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "chhs--yl"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "03dowjones"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "lcccallclinical"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "lcccallmembers"
                },
                {
                    "email": "bdarley@email.unc.edu",
                    "name": "muslib"
                },
                {
                    "email": "brian@unc.edu",
                    "name": "span35summer02"
                }, {
                    "email": "brian@unc.edu",
                    "name": "flpexec"
                }, {
                    "email": "brian@unc.edu",
                    "name": "ncbankingjournal"
                }, {
                    "email": "brian@unc.edu",
                    "name": "earlychildhoodtataskforce"
                }, {
                    "email": "brian@unc.edu",
                    "name": "geneticstudents"
                }, {
                    "email": "brian@unc.edu",
                    "name": "carolinarugby"
                }

            ];
        }
    }
}

injector.service('ListServService', ['moment'], ListServService);
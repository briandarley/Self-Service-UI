import injector from 'vue-inject';

function DataAnalyticsService(httpHandlerService, moment) {
    return {
        async getLockoutAnalytics(dateFrom){
            try {
               const handler = await httpHandlerService.get();

                //const handler = await httpHandlerService.getFullyQualifiedHttpHandler("http://localhost:13003/v1")

                let response = await handler.get(`/DataAnalytics/lockouts/daily-analytics/${moment(dateFrom).format("M-DD-YYYY")}`);

                return response.data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async getWeeklyProvisionAnalytics(dateFrom) {
            try {
                //todo remove when releasing
                // return [
                //     {
                //       "createDate": "2019-01-06T00:00:00",
                //       "count": 5
                //     },
                //     {
                //       "createDate": "2019-01-07T00:00:00",
                //       "count": 53
                //     },
                //     {
                //       "createDate": "2019-01-08T00:00:00",
                //       "count": 37
                //     },
                //     {
                //       "createDate": "2019-01-09T00:00:00",
                //       "count": 41
                //     },
                //     {
                //       "createDate": "2019-01-10T00:00:00",
                //       "count": 24
                //     },
                //     {
                //       "createDate": "2019-01-11T00:00:00",
                //       "count": 11
                //     },
                //     {
                //       "createDate": "2019-01-12T00:00:00",
                //       "count": 4
                //     }
                //   ];




                const handler = await httpHandlerService.get();

                //const handler = await httpHandlerService.getFullyQualifiedHttpHandler("http://localhost:13003/v1")

                let response = await handler.get(`/DataAnalytics/provisionings/weekly-analytics/${moment(dateFrom).format("M-DD-YYYY")}`);

                return response.data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
    }
}

injector.service('DataAnalyticsService', ['httpHandlerService', 'moment'], DataAnalyticsService);
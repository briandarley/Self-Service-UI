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

                const handler = await httpHandlerService.get();

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
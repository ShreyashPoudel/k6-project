import http from 'k6/http';
import {sleep, check} from 'k6';
// import {htmlReport} from "http://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

// adding virtual users and duration of the test
export const options = {
    vus : 3,
    duration : '5s',

    // thresholds -> defines performance limits
    thresholds : {
        http_req_duration : ['p(95)<200'], // 95% of the requests must finish under 500ms
    }

};

// export default function(){
// http.get('https://test.k6.io');
// sleep(1);
// }

export default function(){
    const response = http.get(BASE_URL);
    sleep(1);

    check(response,{
    // 'name of the' : response object => actual check (for example, checking the status code of the response)
    'status is 200': (r) => r.status === 200, 

})
}






// export function handleSummary(data) {
//     return{
//         "report.html": htmlReport(data),
//     }
// }

import http from 'k6/http';
import {sleep} from 'k6';
// import {htmlReport} from "http://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// adding virtual users and duration of the test
export const options = {
    vus : 5,
    duration : '30s'
};

export default function(){
http.get('https://test.k6.io');
sleep(1);
}



// export function handleSummary(data) {
//     return{
//         "report.html": htmlReport(data),
//     }
// }

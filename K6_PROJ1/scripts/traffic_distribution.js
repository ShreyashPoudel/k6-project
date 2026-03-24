import http from "k6/http";
import { sleep, check, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || "https://test.k6.io";

const traffic_split = {
  home: 0.6,
  news: 0.2,
  blog: 0.2,
};

export const options = {
  stages: [
    { duration: "5s", target: 5 }, // ramp up to 5 users over 5 seconds
    { duration: "3s", target: 5 }, // stay at 5 users for 3 seconds
    { duration: "5s", target: 0 }, // ramp down to 0 users over 5 seconds
  ],

  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of the requests must finish under 500ms
  },
};

export default function () {
  const random = Math.random();
  console.log(`Random number: ${random}`);

  if (random < traffic_split.home) {
    group("Open Home Page", () => {
      const res = http.get(BASE_URL);

      check(res, {
        "status is 200": (r) => r.status === 200,
      });
    });
    sleep(1);
  } 
  
  else if (random < traffic_split.home + traffic_split.blog) {
    group("Open Blogs Page", () => {
      const res = http.get(`${BASE_URL}/blog`);

      check(res, {
        "blog loaded": (r) => r.status === 200,
      });
    });
  } 
  
  else {
    group("Open News Page", () => {
      const res = http.get(`${BASE_URL}/news.php`);

      check(res, {
        "news loaded": (r) => r.status === 200,
      });
    });
  }
}

export function handleSummary(data) {
  return {
    "traffic.html": htmlReport(data),
  };
}

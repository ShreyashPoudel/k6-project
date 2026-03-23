import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Test configuration - 5 virtual users for 30 seconds
export const options = {
    vus: 5,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.1'],   // Error rate should be less than 10%
    },
};

export default function() {
    // Make GET request to example.com
    const response = http.get('http://example.com');

    // Add checks to validate the response
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'body contains example': (r) => r.body.includes('Example'),
    });

    // Sleep for 1 second between requests
    sleep(1);
}

// Generate HTML report after test completion
export function handleSummary(data) {
    return {
        "example_com_report.html": htmlReport(data),
        "stdout": textSummary(data, { indent: " ", enableColors: true }),
    };
}

// Default text summary function
function textSummary(data, options) {
    const { indent = "", enableColors = false } = options || {};

    const summary = `
${indent}Test Summary:
${indent}============
${indent}VUs: ${data.metrics.vus?.values?.value || 'N/A'}
${indent}Duration: ${formatDuration(data.state.testRunDurationMs)}
${indent}Iterations: ${data.metrics.iterations?.values?.count || 0}
${indent}HTTP Requests: ${data.metrics.http_reqs?.values?.count || 0}
${indent}Failed Requests: ${data.metrics.http_req_failed?.values?.count || 0} (${((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%)
${indent}Average Response Time: ${(data.metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms
${indent}95th Percentile: ${(data.metrics.http_req_duration?.values?.p95 || 0).toFixed(2)}ms`;

    return summary;
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
}
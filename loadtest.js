import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// A simple counter for http requests
export const requests = new Counter('http_reqs');

// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 10, duration: '10m' },
    { target: 40, duration: '20m' },
    { target: 10, duration: '1m' },
    { target: 2, duration: '1m' },
    { target: 0, duration: '1m' },
  ]
};

function generateRandomInteger(max) {
  return Math.floor(Math.random() * max);
}

export default function () {
  // browse the app
  const BASE_URL = `http://${__ENV.PUBLIC_IP}/`;
  const requests = ['ping', '', 'error','ping', '', 'error'];
  // call random url
  const random = generateRandomInteger(requests.length);
  const url = requests[random];
  const dest = `${BASE_URL}${url}`;
  // console.log(`sending request to ${dest}`);
  const reqr = http.get(dest);
}

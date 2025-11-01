export function generateByteValues(inputString) {
  let bytes = [];

  for (let i = 0; i < inputString.length; i++) {
    const code = inputString.charCodeAt(i);
    bytes = bytes.concat([code]);
  }

  return bytes;
}

export function parseXMLResponseForValue(response, value) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(response, "text/xml");
  // eslint-disable-next-line xss/no-mixed-html
  return xml.querySelector(value).innerHTML;
}

export function generateUnixTimestamp() {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  return timestamp;
}

export function makeAJAXRequest(verb, url, async, data, onSuccess, onFail) {
  let request = new XMLHttpRequest();
  request.open(verb, url, async);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        onSuccess(this.responseText);
      } else {
        onFail(this.responseText);
      }
    }
  };
  request.send(data);
  request = null;
}

export function generateQueryStringFromJson(jsonObject) {
  let queryString = "?";
  Object.keys(jsonObject).forEach(
    function (key) {
      queryString += `${key}=${jsonObject[key]}&`;
    },
  );
  return queryString.slice(0, -1);
}

// Makes the ordinal string version of the supplied cardinal number
// E.g 1 -> "1st", 2 -> "2nd"
export function ordinalize(i) {
  const j = i % 10;
  const k = i % 100;

  if (j == 1 && k != 11) {
    return `${i}st`;
  }

  if (j == 2 && k != 12) {
    return `${i}nd`;
  }

  if (j == 3 && k != 13) {
    return `${i}rd`;
  }

  return `${i}th`;
}

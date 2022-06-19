// https://stackoverflow.com/questions/54626186/how-to-download-file-with-javascript
// https://www.aspsnippets.com/Articles/JavaScript-Save-BLOB-as-PDF-File.aspx
function callback_get_pdf(xmlHTTP, filename) {
  // to be called with an xmlRequest for a desired file
  var link = document.createElement("a");
  uri_split = xmlHTTP.responseURL.split(".");
  extension = "." + uri_split[uri_split.length - 1]
  link.download = filename + extension;
  if (extension !== ".pdf") {
    // we currently don't allow other downloads than pdf
    // be very careful, downloading mp4 can be very long for example
    return;
  }
  // we must create a new blob, that's a thing for pdf downloads askip
  // https://attacomsian.com/blog/javascript-download-file
  var blob = xmlHTTP.response;
  blob = new Blob([xmlHTTP.response], {
    type: "application/octetstream"
  });
  link.href = URL.createObjectURL(blob);
  link.target = "_blank"
  link.click();
  // we remove the elements to avoid explosion
  link.remove();
}

function callback_get_last_link(xmlHttp, filename) {
  // Takes care of dodging moodle workaround that puts the real link in another html file
  resp = xmlHttp.response;
  elem = resp.getElementsByClassName("resourceworkaround");
  for (resource in elem) {
    if (elem[resource].childElementCount > 0) {
      // we obtain the real link to the resource and get it as a blob
      last_link = elem[resource].firstElementChild.href;
      httpGetAsync(last_link, "blob", callback_get_pdf, filename)
    }
  }
}

// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
// https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest
function httpGetAsync(theUrl, response_type, callback, filename) {
  var xmlHttp = new XMLHttpRequest();
  // not required for me but in case, makes sure we forward cookies for tequila login
  xmlHttp.withCredentials = true
  xmlHttp.responseType = response_type;
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status == 200) {
      // we call the callback only when request is done and successful
      callback(xmlHttp, filename)
    }
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);

}

links = document.getElementsByClassName("aalink")
test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
for (const link_id in links) {
  if (links[link_id].href != undefined && links[link_id].href.includes("moodle.epfl.ch/mod/resource")) {
    // we make sure to query only resources (not forums or quizzes)
    httpGetAsync(links[link_id].href, "document", callback_get_last_link, links[link_id].text);
  }
}

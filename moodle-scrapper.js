// https://stackoverflow.com/questions/54626186/how-to-download-file-with-javascript
// https://www.aspsnippets.com/Articles/JavaScript-Save-BLOB-as-PDF-File.aspx
function callback_get_pdf(xmlHTTP, filename) {
  var link = document.createElement("a");
  uri_split = xmlHTTP.responseURL.split(".");
  extension = "." + uri_split[uri_split.length - 1]
  link.download = filename + extension;
  if (extension !== ".pdf") {
    console.log("non pdf file")
    return
  }
  var blob = xmlHTTP.response;
  blob = new Blob([xmlHTTP.response], {
    type: "application/octetstream"
  });
  link.href = URL.createObjectURL(blob);
  link.target = "_blank"
  link.click();
  link.remove()
}

function callback_get_last_link(xmlHttp, filename) {
  console.log("Document queried successfully");
  resp = xmlHttp.response;
  elem = resp.getElementsByClassName("resourceworkaround");
  for (resource in elem) {
    if (elem[resource].childElementCount > 0) {
      last_link = elem[resource].firstElementChild.href;
      httpGetAsync(last_link, "blob", callback_get_pdf, filename)
    }
  }
}

// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGetAsync(theUrl, response_type, callback, filename) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.withCredentials = true
  xmlHttp.responseType = response_type;
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4 && xmlHttp.status == 200) {
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
    httpGetAsync(links[link_id].href, "document", callback_get_last_link, links[link_id].text);
  }
}

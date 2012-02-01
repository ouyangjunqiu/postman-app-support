/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var headerDetails = {
    "accept-ranges":"Content-Types that are acceptable",
    "age":"The age the object has been in a proxy cache in seconds",
    "allow":"Valid actions for a specified resource. To be used for a 405 Method not allowed",
    "cache-control":"Tells all caching mechanisms from server to client whether they may cache this object. It is measured in seconds",
    "connection":"Options that are desired for the connection",
    "content-encoding":"The type of encoding used on the data.",
    "content-language":"The language the content is in",
    "content-length":"The length of the response body in octets (8-bit bytes)",
    "content-location":"An alternate location for the returned data",
    "content-md5":"A Base64-encoded binary MD5 sum of the content of the response",
    "content-disposition":"An opportunity to raise a \"File Download\" dialogue box for a known MIME type",
    "content-range":"Where in a full body message this partial message belongs",
    "content-type":"The mime type of this content",
    "date":"The date and time that the message was sent",
    "etag":"An identifier for a specific version of a resource, often a message digest",
    "expires":"Gives the date/time after which the response is considered stale",
    "last-modified":"The last modified date for the requested object, in RFC 2822 format",
    "link":"Used to express a typed relationship with another resource, where the relation type is defined by RFC 5988",
    "location":"Used in redirection, or when a new resource has been created.",
    "p3p":"This header is supposed to set P3P policy, in the form of P3P:CP=\"your_compact_policy\". However, P3P did not take off, most browsers have never fully implemented it, a lot of websites set this header with fake policy text, that was enough to fool browsers the existence of P3P policy and grant permissions for third party cookies.",
    "pragma":"Implementation-specific headers that may have various effects anywhere along the request-response chain.",
    "proxy-authenticate":"Request authentication to access the proxy.",
    "refresh":"Used in redirection, or when a new resource has been created. This refresh redirects after 5 seconds. This is a proprietary, non-standard header extension introduced by Netscape and supported by most web browsers.",
    "retry-after":"If an entity is temporarily unavailable, this instructs the client to try again after a specified period of time (seconds).",
    "server":"A name for the server",
    "set-cookie":"an HTTP cookie",
    "strict-transport-security":"A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains.",
    "trailer":"The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer-coding.",
    "transfer-encoding":"The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity.",
    "vary":"Tells downstream proxies how to match future request headers to decide whether the cached response can be used rather than requesting a fresh one from the origin server.",
    "via":"Informs the client of proxies through which the response was sent.",
    "warning":"A general warning about possible problems with the entity body.",
    "www-authenticate":"Indicates the authentication scheme that should be used to access the requested entity.",
    "x-requested-with":"Mainly used to identify Ajax requests. Most JavaScript frameworks send this header with value of XMLHttpRequest",
    "x-do-not-track":"Requests a web application to disable their tracking of a user. Note that, as of yet, this is largely ignored by web applications. It does however open the door to future legislation requiring web applications to comply with a user's request to not be tracked. Mozilla implements the DNT header with a similar purpose.",
    "dnt":"Requests a web application to disable their tracking of a user. This is Mozilla's version of the X-Do-Not-Track header (since Firefox 4.0 Beta 11). Safari and IE9 also have support for this header. On March 7, 2011, a draft proposal was submitted to IETF.",
    "x-forwarded-for":"A de facto standard for identifying the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer",
    "x-frame-options":"Clickjacking protection: \"deny\" - no rendering within a frame, \"sameorigin\" - no rendering if origin mismatch",
    "x-xss-protection":"Cross-site scripting (XSS) filter",
    "x-content-type-options":"The only defined value, \"nosniff\", prevents Internet Explorer from MIME-sniffing a response away from the declared content-type",
    "x-forwarded-proto":"A de facto standard for identifying the originating protocol of an HTTP request, since a reverse proxy (load balancer) may communicate with a web server using HTTP even if the request to the reverse proxy is HTTPS",
    "x-powered-by":"Specifies the technology (ASP.NET, PHP, JBoss, e.g.) supporting the web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)"
};

var requests;
var bodyFileData;
var dataMode = "params";
var requestStartTime = 0;
var requestEndTime = 0;
var requestMethod = 'GET';
var dataInputType = "text";
var availableUrls = [];
var currentSidebarSection = "history";
var currentResponse;

var postman = {};
postman.currentRequest = {};
postman.currentRequest.url = "";
postman.currentRequest.body = "";
postman.currentRequest.headers = [];
postman.currentRequest.method = "GET";
postman.history = {};
postman.history.requests = [];
postman.settings = {};
postman.indexedDB = {};
postman.indexedDB.db = null;
postman.response = {};
postman.response.state = {};
postman.response.state.size = "normal";

var postmanCodeMirror;

// IndexedDB implementations still use API prefixes
var indexedDB = window.indexedDB || // Use the standard DB API
    window.mozIndexedDB || // Or Firefox's early version of it
    window.webkitIndexedDB;            // Or Chrome's early version
// Firefox does not prefix these two:
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

var socialButtons = {
    "facebook":'<iframe src="http://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Ffdmmgilgnpjigdojojpjoooidkmcomcm&amp;send=false&amp;layout=button_count&amp;width=250&amp;show_faces=true&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21&amp;appId=26438002524" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:250px; height:21px;" allowTransparency="true"></iframe>',
    "twitter":'<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://chrome.google.com/webstore/detail/fdmmgilgnpjigdojojpjoooidkmcomcm" data-text="I am using Postman to kick some API ass!" data-count="horizontal" data-via="a85">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>',
    "plusOne":'<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script><g:plusone size="medium" href="https://chrome.google.com/webstore/detail/fdmmgilgnpjigdojojpjoooidkmcomcm"></g:plusone>'
};

function Collection() {
    this.id = "";
    this.name = "";
    this.customVars = {};
    this.requests = {};
}

function CollectionRequest() {
    this.collectionId = "";
    this.id = "";
    this.url = "";
    this.method = "";
    this.headers = "";
    this.data = "";
    this.dataMode = "params";
    this.timestamp = 0;
}

function Request() {
    this.id = "";
    this.url = "";
    this.method = "";
    this.headers = "";
    this.data = "";
    this.dataMode = "params";
    this.timestamp = 0;
}

function Response() {
    this.id = "";
    this.headers = "";
    this.text = "";
}

function startNewRequest() {
    $("#url").val("");
    $('#headers').val("");
    clearFields();

    //clearHeaders
    //close edit params
    $('.method-selectors li').removeClass('active');
    $('.method-selector-get').addClass('active');
    showParamsEditor("headers");
    showRequestMethodUi('GET');
    $('#url').focus();
}

function clearFields() {
    $("#response").css("display", "");
    $("#loader").css("display", "");
    $("#responsePrint").css("display", "none");

    $("#responseStatus").html("");
    $("#responseHeaders").val("");
    $("#codeData").text("");

    $("#respHeaders").css("display", "none");
    $("#respData").css("display", "none");

    $('#codeData').attr('data-formatted', 'false');
}

postman.initializeHeadersFromString = function (data) {
    if (data === null || data === "") {
        postman.currentRequest.headers = [];
    }
    else {
        var vars = [], hash;
        var hashes = data.split('\n');
        var header;

        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split(":");
            header = {
                "name":jQuery.trim(hash[0]),
                "value":jQuery.trim(hash[1])
            };

            vars.push(header);
        }

        postman.currentRequest.headers = vars;
    }
}

function limitStringLineWidth(string, numChars) {
    var remainingChars = string;
    var finalString = "";
    numLeft = string.length;
    do {
        finalString += remainingChars.substr(0, numChars);
        remainingChars = remainingChars.substr(numChars);
        numLeft -= numChars;
        if (numLeft < 5) {
            numLeft -= numChars;
            finalString += remainingChars.substr(0, numChars)
        }
        else {
            finalString += "<br/>";
        }
    } while (numLeft > 0);

    return finalString;
}

function getRequestMethod() {
    return requestMethod;
}

function ensureProperUrl(url) {
    var a = "http";
    if (url.indexOf(a) != 0) {
        url = "http://" + url;
    }
    return url;
}

function sendRequest() {
    if ($("#url").val() != "") {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = readResponse;
        try {
            var headers = $("#headers").val();
            var url = $("#url").val();

            url = ensureProperUrl(url);

            var method = getRequestMethod();

            var data = "";
            var bodyData = "";

            xhr.open(method, url, true);

            headers = headers.split("\n");
            for (var i = 0; i < headers.length; i++) {
                var header = headers[i].split(": ");
                if (header[1]) {
                    xhr.setRequestHeader(header[0], header[1]);
                }
            }

            if (jQuery.inArray(method, ["post", "put"]) > -1) {
                if (dataMode === 'raw') {
                    data = $("#body").val();
                    bodyData = data;
                }
                else if (dataMode === 'params') {
                    bodyData = new FormData();

                    //Iterate through all key/values

                    $('input[data-section=body]').each(function () {
                        var valueEl = $(this).next();
                        var type = valueEl.attr('type');

                        if ($(this).val() !== '') {
                            if (type === 'file') {
                                var domEl = $(this).next().get(0);
                                var len = domEl.files.length;
                                for (var i = 0; i < len; i++) {
                                    bodyData.append($(this).val(), domEl.files[i]);
                                }
                            }
                            else {
                                bodyData.append($(this).val(), valueEl.val());
                            }
                        }
                    });

                    data = $('#body').val();
                }

                //Check if a file is being sent
                xhr.send(bodyData);
            } else {
                xhr.send();
            }

            requestStartTime = new Date().getTime();
            saveRequest(url, method, $("#headers").val(), data, dataMode);
            $('#submitRequest').button("loading");
        }
        catch (e) {
            console.log(e);
            $("#responseStatus").html("<span style=\"color:#FF0000\">" + chrome.i18n.getMessage("bad_request") + "</span>");
            $("#respHeaders").css("display", "none");
            $("#respData").css("display", "none");

            $("#loader").css("display", "none");
            $("#responsePrint").css("display", "");
        }
    } else {
        console.log("no uri");
        $("#responseStatus").html("<span style=\"color:#FF0000\">" + chrome.i18n.getMessage("bad_request") + "</span>");
        $("#respHeaders").css("display", "none");
        $("#respData").css("display", "none");

        $("#loader").css("display", "none");
        $("#responsePrint").css("display", "");
    }

    clearFields();
}

function setResponseHeaders(headersString) {
    var headers = headersString.split("\n");
    var count = headers.length;
    var finalHeaders = [];
    console.log(headers);
    for (var i = 0; i < count; i++) {
        var h = headers[i];
        var hParts = h.split(":");

        if (hParts && hParts.length > 0) {
            var header = {
                "name":hParts[0],
                "value":hParts[1],
                "description":headerDetails[hParts[0].toLowerCase()]
            };

            if (hParts[0] != "") {
                finalHeaders.push(header);
            }
        }
    }

    $('#responseHeaders').html("");
    $("#itemResponseHeader").tmpl(finalHeaders).appendTo("#responseHeaders");
    $('.responseHeaderName').popover();
}

function readResponse() {
    currentResponse = new Response();

    $('#response').css("display", "block");
    $('#submitRequest').button("reset");

    $('#responseStatus').css("display", "block");
    $('#responseHeaders').css("display", "block");
    $('#codeData').css("display", "block");

    if (this.readyState == 4) {
        try {
            if (this.status == 0) {
                $('#modalResponseError').modal({
                    keyboard:true,
                    backdrop:"static"
                });

                $('#modalResponseError').modal('show');
            }
            var responseCode = {
                'code':this.status,
                'name':httpStatusCodes[this.status]['name'],
                'detail':httpStatusCodes[this.status]['detail']
            };

            $('#pstatus').html('');
            $('#itemResponseCode').tmpl([responseCode]).appendTo('#pstatus');
            $('.responseCode').popover();

            setResponseHeaders(this.getAllResponseHeaders());

            var debugurl = /X-Debug-URL: (.*)/i.exec($("#responseHeaders").val());
            if (debugurl) {
                $("#debugLink").attr('href', debugurl[1]).html(debugurl[1]);
                $("#debugLinks").css("display", "");
            }

            currentResponse.text = this.responseText;

            $("#respHeaders").css("display", "");
            $("#respData").css("display", "");

            $("#loader").css("display", "none");
            $("#responsePrint").css("display", "");

            requestEndTime = new Date().getTime();
            var diff = requestEndTime - requestStartTime;

            $('#ptime .data').html(diff + " ms");
            $('#pbodysize .data').html(diff + " bytes");

            //Set chili options according to the Content-Type header
            var contentType = this.getResponseHeader("Content-Type");

            var type = 'html';
            var format = 'html';

            if (contentType.search(/json/i) != -1) {
                type = 'json';
                format = 'javascript';
            }

            $('#language').val(format);
            setResponseFormat(format, currentResponse.text, "parsed");
        }
        catch (e) {
            console.log("Something went wrong while receiving the response");
        }
    }
    else {
    }

    setContainerHeights();
    refreshScrollPanes();
}

//Manages showing/hiding the PUT/POST additional UI
function showRequestMethodUi(type) {
    postman.currentRequest.method = type.toUpperCase();
    $('#methods ul li').removeClass('active');
    var t = type.toLowerCase();
    $('.method-selector-' + t).addClass('active');
    requestMethod = t;

    if (jQuery.inArray(type, ["POST", "PUT"]) > -1) {
        $("#data").css("display", "block");
        showBodyParamsEditor();
    } else {
        closeParamsEditor('body');
        $("#data").css("display", "none");
    }
}

function init() {
    $("#response").css("display", "none");
    $("#loader").css("display", "");
    $("#responsePrint").css("display", "none");
    $("#sep").css("display", "none");

    $("#data").css("display", "none");

    $("#responseStatus").html("");
    $("#respHeaders").css("display", "none");
    $("#respData").css("display", "none");

    $("#submitRequest").click(function () {
        sendRequest();
    });

    showParamsEditor("headers");
}

function setupDB() {
    postman.indexedDB.onerror = function (event) {
        console.log(event);
    };

    postman.indexedDB.open = function () {
        var request = indexedDB.open("postman", "POSTman request history");
        request.onsuccess = function (e) {
            var v = "0.42";
            postman.indexedDB.db = e.target.result;
            var db = postman.indexedDB.db;

            //We can only create Object stores in a setVersion transaction
            if (v != db.version) {
                console.log(v, "Version is not the same");
                var setVrequest = db.setVersion(v);

                setVrequest.onfailure = function (e) {
                    console.log(e);
                };

                setVrequest.onsuccess = function (e) {
                    console.log(e);
                    if (db.objectStoreNames.contains("requests")) {
                        db.deleteObjectStore("requests");
                    }
                    if (db.objectStoreNames.contains("collections")) {
                        db.deleteObjectStore("collections");
                    }
                    if (db.objectStoreNames.contains("collection_requests")) {
                        db.deleteObjectStore("collection_requests");
                    }

                    var requestStore = db.createObjectStore("requests", {keyPath:"id"});
                    var collectionsStore = db.createObjectStore("collections", {keyPath:"id"});
                    var collectionRequestsStore = db.createObjectStore("collection_requests", {keyPath:"id"});

                    requestStore.createIndex("timestamp", "timestamp", { unique:false});
                    collectionsStore.createIndex("timestamp", "timestamp", { unique:false});

                    collectionRequestsStore.createIndex("timestamp", "timestamp", { unique:false});
                    collectionRequestsStore.createIndex("collectionId", "collectionId", { unique:false});

                    postman.indexedDB.getAllRequestItems();
                    postman.indexedDB.getCollections();
                };
            }
            else {
                postman.indexedDB.getAllRequestItems();
                postman.indexedDB.getCollections();
            }

        };

        request.onfailure = postman.indexedDB.onerror;
    };

    postman.indexedDB.addCollection = function (collection) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collections"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("collections");

        var request = store.put({
            "id":collection.id,
            "name":collection.name,
            "timestamp":new Date().getTime()
        });

        request.onsuccess = function (e) {
            $('#messageNoCollection').remove();
            postman.indexedDB.getCollections();
            postman.indexedDB.getAllRequestsInCollection(collection.id);
        };

        request.onerror = function (e) {
            console.log(e.value);
        }
    };

    postman.indexedDB.addCollectionWithRequest = function (collection, collectionRequest) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collections"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("collections");

        var request = store.put({
            "id":collection.id,
            "name":collection.name
        });

        request.onsuccess = function (e) {
            collectionRequest.collectionId = collection.id;

            $('#itemCollectionSelectorList').tmpl([collection]).appendTo('#selectCollection');
            $('#itemCollectionSidebarHead').tmpl([collection]).appendTo('#collectionItems');

            addSidebarCollectionHeadListener(collection);
            refreshScrollPanes();

            postman.indexedDB.addCollectionRequest(collectionRequest, true);
        };

        request.onerror = function (e) {
            console.log(e.value);
        }
    }

    postman.indexedDB.addCollectionRequest = function (req, toRefreshSidebar) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collection_requests"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("collection_requests");

        var collectionRequest = store.put({
            "collectionId":req.collectionId,
            "id":req.id,
            "url":req.url.toString(),
            "method":req.method.toString(),
            "headers":req.headers.toString(),
            "data":req.data.toString(),
            "dataMode":req.dataMode.toString(),
            "timestamp":req.timestamp
        });

        collectionRequest.onsuccess = function (e) {
            var targetElement = "#collectionRequests-" + req.collectionId;
            addAvailableUrl(req.url);
            addUrlAutoComplete();

            req.url = limitStringLineWidth(req.url, 43);
            $('#itemCollectionSidebarRequest').tmpl([req]).appendTo(targetElement);
            addSidebarRequestListener(req);
            refreshScrollPanes();
            $('#messageNoCollection').remove();
        };

        collectionRequest.onerror = function (e) {
            console.log(e.value);
        }
    };

    postman.indexedDB.getCollections = function () {
        var db = postman.indexedDB.db;

        if (db == null) {
            console.log("Db is null");
            return;
        }

        $('#collectionItems').html("");
        $('#selectCollection').html("<option>Select</option>");

        var trans = db.transaction(["collections"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("collections");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);
        numCollections = 0;
        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!!result == false) {
                if (numCollections == 0) {
                    var obj = new Object();
                    $('#messageNoCollectionTmpl').tmpl([obj]).appendTo('#sidebarSection-collections');
                }

                return;
            }

            var collection = result.value;
            numCollections++;
            $('#itemCollectionSelectorList').tmpl([collection]).appendTo('#selectCollection');
            $('#itemCollectionSidebarHead').tmpl([collection]).appendTo('#collectionItems');
            refreshScrollPanes();

            postman.indexedDB.getAllRequestsInCollection(collection.id);
            //This wil call onsuccess again and again until no more request is left

            addSidebarCollectionHeadListener(collection);

            result.
            continue
            ();
        };

        cursorRequest.onerror = function (e) {
            console.log(e);
        };
    };

    postman.indexedDB.getAllRequestsInCollection = function (id) {
        $('#collectionRequests-' + id).html("");
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collection_requests"], IDBTransaction.READ_WRITE);

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!!result == false) {
                return;
            }

            var request = result.value;
            var targetElement = "#collectionRequests-" + request.collectionId;

            addAvailableUrl(request.url);
            addUrlAutoComplete();

            request.url = limitStringLineWidth(request.url, 40);
            $('#itemCollectionSidebarRequest').tmpl([request]).appendTo(targetElement);
            addSidebarRequestListener(request);
            refreshScrollPanes();

            //This wil call onsuccess again and again until no more request is left
            result.
            continue
            ();
        };
        cursorRequest.onerror = postman.indexedDB.onerror;
    };

    postman.indexedDB.addRequest = function (id, url, method, headers, data, dataMode) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["requests"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("requests");
        var historyRequest = {
            "id":id,
            "url":url.toString(),
            "method":method.toString(),
            "headers":headers.toString(),
            "data":data.toString(),
            "dataMode":dataMode.toString(),
            "timestamp":new Date().getTime()
        };

        var index = postman.history.requestExists(historyRequest);
        if (index >= 0) {
            var deletedId = postman.history.requests[index].id;
            postman.indexedDB.deleteRequest(deletedId);
            postman.history.requests.splice(index, 1);
        }

        var request = store.put(historyRequest);

        request.onsuccess = function (e) {
            //Re-render all the todos
            addAvailableUrl(url);
            addUrlAutoComplete();
            removeRequestFromSidebar(deletedId, false);
            renderRequestToSidebar(url, method, id, "top");
            addSidebarRequestListener(historyRequest);
            postman.history.requests.push(historyRequest);
        };

        request.onerror = function (e) {
            console.log(e.value);
        }
    };

    postman.indexedDB.getRequest = function (id) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["requests"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("requests");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!!result == false)
                return;

            loadRequestInEditor(result);
            return result;
        };
        cursorRequest.onerror = postman.indexedDB.onerror;
    };

    postman.indexedDB.getCollectionRequest = function (id) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collection_requests"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("collection_requests");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!!result == false)
                return;

            loadRequestInEditor(result);
            return result;
        };
        cursorRequest.onerror = postman.indexedDB.onerror;
    };

    postman.indexedDB.getAllRequestItems = function () {
        var db = postman.indexedDB.db;
        if (db == null) {
            return;
        }

        var trans = db.transaction(["requests"], IDBTransaction.READ_WRITE);
        var store = trans.objectStore("requests");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("timestamp");
        var cursorRequest = index.openCursor(keyRange);
        var historyRequests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!!result == false) {
                for (var i = 0; i < historyRequests.length; i++) {
                    var r = historyRequests[i];
                    addAvailableUrl(r.url);
                    renderRequestToSidebar(r.url, r.method, r.id, "top");
                    addSidebarRequestListener(r);
                }

                addUrlAutoComplete();

                $('#historyItems').fadeIn();

                postman.history.requests = historyRequests;

                if (postman.history.requests.length == 0) {
                    $('#messageNoHistoryTmpl').tmpl([new Object()]).appendTo('#sidebarSection-history');
                }

                return;
            }

            var request = result.value;
            historyRequests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result.
            continue
            ();
        };

        cursorRequest.onerror = postman.indexedDB.onerror;
    };

    postman.indexedDB.deleteRequest = function (id) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["requests"], IDBTransaction.READ_WRITE, 0);
        var store = trans.objectStore(["requests"]);

        var request = store.delete(id);

        request.onsuccess = function (e) {
            removeRequestFromSidebar(id);

        };

        request.onerror = function (e) {
            console.log(e);
        };
    };

    postman.indexedDB.deleteHistory = function () {
        var db = postman.indexedDB.db;
        var clearTransaction = db.transaction(["requests"], IDBTransaction.READ_WRITE);
        var clearRequest = clearTransaction.objectStore(["requests"]).clear();
        clearRequest.onsuccess = function (event) {
            $('#historyItems').html("");
            $('#messageNoHistoryTmpl').tmpl([new Object()]).appendTo('#sidebarSection-history');
        };
    }

    postman.indexedDB.deleteCollectionRequest = function (id) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collection_requests"], IDBTransaction.READ_WRITE, 0);
        var store = trans.objectStore(["collection_requests"]);

        var request = store.delete(id);

        request.onsuccess = function (e) {
            removeRequestFromSidebar(id);
        };

        request.onerror = function (e) {
            console.log(e);
        };
    };

    postman.indexedDB.deleteAllCollectionRequests = function (id) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collection_requests"], IDBTransaction.READ_WRITE);

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!!result == false) {
                return;
            }

            var request = result.value;
            postman.indexedDB.deleteCollectionRequest(request.id);
            result.
            continue
            ();
        };
        cursorRequest.onerror = postman.indexedDB.onerror;
    };

    postman.indexedDB.deleteCollection = function (id) {
        var db = postman.indexedDB.db;
        var trans = db.transaction(["collections"], IDBTransaction.READ_WRITE, 0);
        var store = trans.objectStore(["collections"]);

        var request = store.delete(id);

        request.onsuccess = function (e) {
            removeCollectionFromSidebar(id);
            removeCollectionFromSelector(id);
            var numCollections = $('#collectionItems').children().length;
            if (numCollections == 1) {
                $('#messageNoCollectionTmpl').tmpl([new Object()]).appendTo('#sidebarSection-collections');
            }
        };

        request.onerror = function (e) {
            console.log(e);
        };
    };
}


function initDB() {
    postman.indexedDB.open(); //Also displays the data previously saved
}

//History management functions
function saveRequest(url, method, headers, data, dataMode) {
    if (postman.settings.autoSaveRequest) {
        var id = guid();
        var maxHistoryCount = postman.settings.historyCount;
        var requestsCount = postman.history.requests.length;
        console.log(maxHistoryCount, requestsCount);
        if (requestsCount >= maxHistoryCount) {
            //Delete the last request
            var lastRequest = postman.history.requests[requestsCount - 1];
            postman.indexedDB.deleteRequest(lastRequest.id);
        }
        postman.indexedDB.addRequest(id, url, method, headers, data, dataMode);
    }

}

function showEmptyHistoryMessage() {
    $('#emptyHistoryMessage').css("display", "block");
}

function hideEmptyHistoryMessage() {
    $('#emptyHistoryMessage').css("display", "none");
}

function renderRequestToSidebar(url, method, id, position) {
    if (url.length > 80) {
        url = url.substring(0, 80) + "...";
    }
    url = limitStringLineWidth(url, 40);

    var request = {
        "url":url,
        "method":method,
        "id":id,
        "position":position
    };

    if (position === 'top') {
        $('#itemHistorySidebarRequest').tmpl([request]).prependTo('#historyItems');
    }
    else {
        $('#itemHistorySidebarRequest').tmpl([request]).appendTo('#historyItems');
    }

    $('#messageNoHistory').remove();
    refreshScrollPanes();
}

function removeRequestFromSidebar(id, toAnimate) {
    var historyRequests = postman.history.requests;
    var k = -1;
    for (var i = 0; i < historyRequests.length; i++) {
        if (historyRequests[i].id === id) {
            k = i;
            break;
        }
    }

    if (k >= 0) {
        postman.history.requests.splice(k, 1);
        if (postman.history.requests.length == 0) {
            $('#messageNoHistoryTmpl').tmpl([new Object()]).appendTo('#sidebarSection-history');
        }
    }

    if (toAnimate) {
        $('#sidebarRequest-' + id).slideUp(100);
    }
    else {
        $('#sidebarRequest-' + id).remove();
    }

    refreshScrollPanes();
}

function removeCollectionFromSidebar(id) {
    $('#collection-' + id).slideUp(100);
    refreshScrollPanes();
}

function removeCollectionFromSelector(id) {
    var target = '#selectCollection option[value="' + id + '"]';
    $(target).remove();
}
function loadRequest(id) {
    postman.indexedDB.getRequest(id);
}

function loadCollectionRequest(id) {
    postman.indexedDB.getCollectionRequest(id);
}

function loadRequestInEditor(request) {
    showRequestHelper("normal");
    var method = request.method.toLowerCase();
    postman.currentRequest.method = method.toUpperCase();

    $('#url').val(request.url);

    //Set proper class for method and the variable

    $('#headers').val(request.headers);
    postman.initializeHeadersFromString(request.headers);
    showParamsEditor('headers');

    $('#urlParamsEditor').css("display", "none");
    $('#response').css("display", "none");

    if (method === 'post' || method === 'put') {
        var dataMode = request.dataMode.toLowerCase();

        $('#data').css("display", "block");
        $('#body').val(request.data);
        $('#body').css("display", "block");

        $('#data .pills li').removeClass("active");
        if (dataMode == 'params') {
            $('#selector-container-params').addClass("active");
            showParamsEditor("body");
        }
        else if (dataMode == 'raw') {
            $('#selector-container-raw').addClass("active");
            closeParamsEditor("body");
        }
    }
    else {
        $('#body').val("")
        $('#data').css("display", "none");
        closeParamsEditor("body");
    }

    $('#methods ul li').removeClass('active');
    $('#method-' + method).parent().addClass('active');
    requestMethod = method;

    closeParamsEditor("url");
    clearResponse();

    $('body').scrollTop(0);
}

function clearResponse() {
    $('#responseStatus').css("display", "none");
    $('#responseHeaders').css("display", "none");
    $('#codeData').css("display", "none");
}

function deleteRequest(id) {
    postman.indexedDB.deleteRequest(id);
}

function deleteCollectionRequest(id) {
    postman.indexedDB.deleteCollectionRequest(id);
}

function deleteCollection(id) {
    postman.indexedDB.deleteCollection(id);
}

function lang() {
    $('._msg_').each(function () {
        var val = $(this).html();
        $(this).html(chrome.i18n.getMessage(val));
    });
    $('._msg_val_').each(function () {
        var val = $(this).val();
        $(this).val(chrome.i18n.getMessage(val));
    });
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


//Sets the param strings for header and url params
function setParamsFromEditor(section) {
    var paramString = "";
    var h = [];
    //Goes through each item in the param editor and generates a param string
    $('input[data-section="' + section + '"]').each(function () {
        var val = $(this).next().val();
        if (val !== "" && $(this).val() !== "") {
            if (section !== 'headers') {
                paramString += $(this).val() + "=" + val + "&";
            }
            else {
                paramString += $(this).val() + ": " + val + "\n";
            }

            if (section == "headers") {
                var header = {
                    name:$(this).val(),
                    value:val
                };

                h.push(header);
            }
        }
    });


    paramString = paramString.substr(0, paramString.length - 1);

    if (section === 'url') {
        var url = $('#url').val();
        var baseUrl = url.split("?")[0];
        $('#' + section).val(baseUrl + "?" + paramString);
        postman.currentRequest.url = $('#url').val();
    }
    else if (section === 'body') {
        $('#' + section).val(paramString);
        postman.currentRequest.body = paramString;
    }
    else if (section === 'headers') {
        postman.currentRequest.headers = h;
        $('#' + section).val(paramString);
    }
}

function showParamsEditor(section) {
    var data = $('#' + section).val();

    var params;
    var placeHolderKey = "Key";
    var placeHolderValue = "Value";

    if (section === 'headers') {
        params = getHeaderVars(data);
        placeHolderKey = "Header";
        placeHolderValue = "Value";
    }
    else if (section === 'body') {
        params = getUrlVars(data);
    }
    else {
        params = getUrlVars(data);
    }

    var editorHtml = "";
    var i = 0;
    var paramsLength = params.length;
    var rowData = {};
    var rows = [];
    $('#' + section + '-ParamsFields').html("");
    for (var index = 0; i < paramsLength; index++) {
        var element = params[index];
        var key = element.key;
        var value = element.value;

        if (key != "") {
            rowData = {
                section:section,
                placeHolderKey:placeHolderKey,
                placeHolderValue:placeHolderValue,
                key:key,
                value:value,
                inputType:"text",
                canBeClosed:true
            };
            rows.push(rowData);
        }


        i++;
    }

    rowData = {
        section:section,
        placeHolderKey:placeHolderKey,
        placeHolderValue:placeHolderValue,
        key:"",
        value:"",
        inputType:"text",
        canBeClosed:false
    };

    rows.push(rowData);

    $('#itemParamsEditor').tmpl(rows).appendTo('#' + section + '-ParamsFields');
    $('#' + section + '-ParamsEditor').fadeIn();
    addEditorListeners(section);
}

function deleteParam(section) {
    alert("To delete " + section + " param");
}

function closeParamsEditor(section) {
    $('#' + section + '-ParamsFields div:last input').unbind('focus', sectionParamsLastInputFocusHandler);
    $('#' + section + '-ParamsFields input').unbind('blur', sectionParamsInputBlurHandler);
    $('#' + section + '-ParamsEditor input.key').autocomplete("destroy");
    $('#' + section + '-ParamsEditor').css("display", "none");
}

function addParamInEditor(section, data) {
    var placeHolderKey = "Key";
    var placeHolderValue = "Value";

    if (section === 'headers') {
        placeHolderKey = "Header";
        placeHolderValue = "Value";
    }


    var key = "";
    var value = "";
    var send = "";

    if (data) {
        key = data.key;
        value = data.value;
    }

    var rowData = {
        section:section,
        placeHolderKey:placeHolderKey,
        placeHolderValue:placeHolderValue,
        key:key,
        value:value,
        canBeClosed:false,
        inputType:"text"
    };

    $('#itemParamsEditor').tmpl([rowData]).appendTo('#' + section + '-ParamsFields');
    addEditorListeners(section);
}

function changeParamInEditor(target) {
    if (target == "file") {

    }
}

function addHeaderListeners() {
}

function addBodyListeners() {
    $('#body').blur(function () {
        showParamsEditor('body');
    });
}

function removeBodyListeners() {
    $('#body').unbind("focus");
    $('#body').unbind("blur");
}

function setContainerHeights() {
    refreshScrollPanes();
}

function refreshScrollPanes() {
    var newMainWidth = $('#container').width() - $('#sidebar').width();
    $('#main').width(newMainWidth + "px");

    $('#sidebar').jScrollPane({
        mouseWheelSpeed:24
    });
}

function initializeSettings() {
    if (localStorage['historyCount']) {
        postman.settings.historyCount = localStorage['historyCount'];
    }
    else {
        postman.settings.historyCount = 100;
        localStorage['historyCount'] = postman.settings.historyCount;
    }

    if (localStorage['autoSaveRequest']) {
        postman.settings.autoSaveRequest = localStorage['autoSaveRequest'];
    }
    else {
        postman.settings.autoSaveRequest = true;
        localStorage['autoSaveRequest'] = postman.settings.autoSaveRequest;
    }

    $('#historyCount').val(postman.settings.historyCount);
    $('#autoSaveRequest').val(postman.settings.autoSaveRequest);

    $('#historyCount').change(function () {
        postman.settings.historyCount = $('#historyCount').val();
        localStorage['historyCount'] = postman.settings.historyCount;
    });

    $('#autoSaveRequest').change(function () {
        var val = $('#autoSaveRequest').val();
        if (val == 'yes') {
            postman.settings.autoSaveRequest = true;
        }
        else {
            postman.settings.autoSaveRequest = false;
        }

        localStorage['autoSaveRequest'] = postman.settings.autoSaveRequest;
    });
}

function addSidebarCollectionHeadListener(collection) {
    var targetElement = '#collection-' + collection.id + " .sidebar-collection-head";
    $(targetElement).mouseenter(function () {
        var actionsEl = jQuery('.collection-head-actions', this);
        actionsEl.css('display', 'block');
    });

    $(targetElement).mouseleave(function () {
        var actionsEl = jQuery('.collection-head-actions', this);
        actionsEl.css('display', 'none');
    });

    var targetElementName = '#collection-' + collection.id + " .sidebar-collection-head-name";
    var targetElementLabel = '#collection-' + collection.id + " .collection-head-actions .label";

    $(targetElementName).bind("click", function () {
        var id = $(this).attr('data-id');
        toggleCollectionRequestList(id);
    });

    $(targetElementLabel).bind("click", function () {
        var id = $(this).parent().parent().parent().attr('data-id');
        toggleCollectionRequestList(id);
    });
}

function toggleCollectionRequestList(id) {
    var target = "#collectionRequests-" + id;
    var label = "#collection-" + id + " .collection-head-actions .label";
    if ($(target).css("display") == "none") {
        $(label).html("Hide");
        $(target).slideDown(100);
    }
    else {
        $(label).html("Show");
        $(target).slideUp(100);
    }
}

function addSidebarRequestListener(request) {
    var targetElement = '#sidebarRequest-' + request.id;
    $(targetElement).mouseenter(function () {
        var actionsEl = jQuery('.request-actions', this);
        actionsEl.css('display', 'block');
    });

    $(targetElement).mouseleave(function () {
        var actionsEl = jQuery('.request-actions', this);
        actionsEl.css('display', 'none');
    });
}

var sectionParamsLastInputFocusHandler = function (evt) {
    //Select parent element
    var fieldsParent = $(this).parents(".editorFields");
    var id = fieldsParent.attr("id");
    var section = id.split("-")[0];

    $('#' + section + '-ParamsFields div:last input').unbind('focus', sectionParamsLastInputFocusHandler);

    var parent = $(this).parent();

    //Add a delete link
    var deleteHtml = "<a href=\"javascript:void(0);\" class=\"deleteParam\">";
    deleteHtml += "<img class=\"deleteButton\" src=\"images/delete.png\"/>";
    deleteHtml += "</a>";
    parent.append(deleteHtml);

    addParamInEditor(section);
    return true;
};

var sectionParamsInputBlurHandler = function (evt) {
    var fieldsParent = $(this).parents(".editorFields");
    var id = fieldsParent.attr("id");
    var section = id.split("-")[0];
    setParamsFromEditor(section);
};

var sectionParamsSelectChangeHandler = function (evt) {
    //var paramType = $('#' + section + '-ParamsFields div select').val();
    var paramType = $(this).val();

    placeHolderKey = "Key";
    placeHolderValue = "Value";

    var key = "";
    var value = "";
    var send = "";

    var fieldsParent = $(this).parents(".editorFields");
    var id = fieldsParent.attr("id");
    var section = id.split("-")[0];

    if (paramType) {
        var rowData = {
            section: section,
            placeHolderKey:placeHolderKey,
            placeHolderValue:placeHolderValue,
            key:key,
            value:value,
            inputType:"text",
            canBeClosed:false
        };

        if ($(this).siblings().length > 2) {
            rowData.canBeClosed = true;
        }

        if (paramType === "text") {
            rowData.selectedText = "selected";
            rowData.selectedFile = "";
        }
        else {
            rowData.selectedText = "";
            rowData.selectedFile = "selected";
        }

        rowData.inputType = paramType;

        $('#itemParamsEditor').tmpl([rowData]).appendTo($(this).parent().empty());
        addEditorListeners(section);
    }
    else {
    }
};

var deleteParamHandler = function(evt) {
    var fieldsParent = $(this).parents(".editorFields");
    var id = fieldsParent.attr("id");
    if (id) {
        var section = id.split("-")[0];
        $(this).parent().remove();
        setParamsFromEditor(section);
    }
}

function addEditorListeners(section) {
    $('#' + section + '-ParamsFields div:last input').bind("focus", sectionParamsLastInputFocusHandler);
    $('#' + section + '-ParamsFields div input').bind("blur", sectionParamsInputBlurHandler);
    $('#' + section + '-ParamsFields div select').bind("change", sectionParamsSelectChangeHandler);
    $('.deleteParam').bind("click", deleteParamHandler);
    if (section === 'headers') {
        addHeaderAutoComplete();
    }

    $('#' + section + '-ParamsFields div input').unbind('keydown', 'esc', escInputHandler);
    $('#' + section + '-ParamsFields div select').unbind('keydown', 'esc', escInputHandler);
    $('#' + section + '-ParamsFields div input').bind('keydown', 'esc', escInputHandler);
    $('#' + section + '-ParamsFields div select').bind('keydown', 'esc', escInputHandler);
}

function setCurrentDataFormat(method) {
    $('#data ul li').removeClass('active');
    $('#data-' + method).parent().addClass('active');
}

function showBodyParamsEditor() {
    dataMode = "params";
    showParamsEditor('body');

    $('#bodyDataContainer').css("display", "none");
    setCurrentDataFormat('params');
    removeBodyListeners();
    addBodyListeners();
}

function showRawEditor() {
    dataMode = "raw";
    closeParamsEditor('body');

    setCurrentDataFormat('raw');
    $('#bodyDataContainer').css("display", "block");
    removeBodyListeners();
    addBodyListeners();
}

//Headers list from Wikipedia http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
function addHeaderAutoComplete() {
    var availableHeaders = [
        //Standard headers
        "Accept",
        "Accept-Charset",
        "Accept-Encoding",
        "Accept-Language",
        "Authorization",
        "Cache-Control",
        "Connection",
        "Cookie",
        "Content-Length",
        "Content-MD5",
        "Content-Type",
        "Date",
        "Expect",
        "From",
        "Host",
        "If-Match",
        "If-Modified-Since",
        "If-None-Match",
        "If-Range",
        "If-Unmodified-Since",
        "Max-Forwards",
        "Pragma",
        "Proxy-Authorization",
        "Range",
        "Referer",
        "TE",
        "Upgrade",
        "User-Agent",
        "Via",
        "Warning",
        //Non standard headers
        "X-Requested-With",
        "X-Do-Not-Track",
        "DNT"
    ];

    $("#headers-ParamsFields .key").autocomplete({
        source:availableHeaders,
        delay:50
    });
}

function addUrlAutoComplete() {
    $("#url").autocomplete({
        source:availableUrls,
        delay:50
    });
}

function changeResponseFormat(format) {
    $('#langFormat li').removeClass('active');
    $('#langFormat-' + format).addClass('active');

    if (format === 'raw') {
        postmanCodeMirror.toTextArea();
        $('#codeData').val(currentResponse.text);
        var codeDataWidth = $(document).width() - $('#sidebar').width() - 60;
        $('#codeData').css("width", codeDataWidth + "px");
        $('#codeData').css("height", "600px");
    }
    else {
        $('#codeData').css("display", "none");
        var mime = $('#codeData').attr('data-mime');
        setResponseFormat(mime, currentResponse.text, "parsed", true);
    }

}

function setResponseFormat(mime, response, format, forceCreate) {
    $('#langFormat li').removeClass('active');
    $('#langFormat-' + format).addClass('active');
    $('#codeData').css("display", "none");

    $('#codeData').attr("data-mime", mime);

    var codeDataArea = document.getElementById("codeData");
    var foldFunc;
    var mode;
    if (mime === 'javascript') {
        mode = 'javascript';
        try {
            var jsonObject = JSON.parse(response);
            var response = JSON.stringify(jsonObject, null, '\t');
        }
        catch (e) {
        }
        foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
    }
    else if (mime === 'html') {
        mode = 'xml';
        foldFunc = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
    }

    if (!postmanCodeMirror || forceCreate) {
        postmanCodeMirror = CodeMirror.fromTextArea(codeDataArea,
            {
                mode:mode,
                lineNumbers:true,
                fixedGutter:true,
                onGutterClick:foldFunc,
                theme:'eclipse',
                lineWrapping: true
            });

        postmanCodeMirror.setValue(response);
    }
    else {
        postmanCodeMirror.setValue(response);
        postmanCodeMirror.setOption("onGutterClick", foldFunc);
        postmanCodeMirror.setOption("mode", mode);
        postmanCodeMirror.setOption("lineWrapping", true);
        postmanCodeMirror.setOption("theme", "eclipse");
    }

    $('#codeData').val(response);
}

function attachSidebarListeners() {
    $('#sidebarContainer .pills li').bind("click", function () {
        $('#sidebarContainer .pills li').removeClass("active");
        $(this).addClass("active");
        var section = jQuery('a', this).attr('data-id');
        showSidebarSection(section, currentSidebarSection);
    });
}

function showSidebarSection(section, previousSection) {
    $('#sidebarSection-' + previousSection).css("display", "none");
    currentSidebarSection = section;
    $('#sidebarSection-' + section).fadeIn();
}

function initCollectionSelector() {
    $('#collectionSelector').change(function (event) {
        var val = $('#collectionSelector').val();
    });
}

function submitAddToCollectionForm() {
    var existingCollectionId = $('#selectCollection').val();
    var newCollection = $('#newCollection').val();

    var collection = new Collection();

    var collectionRequest = new CollectionRequest();
    collectionRequest.id = guid();

    collectionRequest.headers = $("#headers").val();
    collectionRequest.url = $("#url").val();
    collectionRequest.method = getRequestMethod();
    collectionRequest.data = $('#body').val();
    collectionRequest.dataMode = dataMode;
    collectionRequest.time = new Date().getTime();

    if (newCollection) {
        //Add the new collection and get guid
        collection.id = guid();
        collection.name = newCollection;
        postman.indexedDB.addCollectionWithRequest(collection, collectionRequest);

        $('#newCollection').val("");
    }
    else {
        //Get guid of existing collection
        collection.id = existingCollectionId;
        collectionRequest.collectionId = collection.id;
        postman.indexedDB.addCollectionRequest(collectionRequest, true);
    }

    //Have guid here
    //Add the request to a collection
    $('#formModalAddToCollection').modal('hide');
}

function submitNewCollectionForm() {
    var newCollection = $('#newCollectionBlank').val();

    var collection = new Collection();

    if (newCollection) {
        //Add the new collection and get guid
        collection.id = guid();
        collection.name = newCollection;
        postman.indexedDB.addCollection(collection);

        $('#newCollectionBlank').val("");
    }

    $('#formModalNewCollection').modal('hide');
}
postman.history.requestExists = function (request) {
    var index = -1;
    var method = request.method.toLowerCase();

    if (method === 'post' || method === 'put') {
        return -1;
    }

    var requests = postman.history.requests;

    for (var i = 0; i < requests.length; i++) {
        var r = requests[i];
        if (r.url.length != request.url.length ||
            r.headers.length != request.headers.length ||
            r.method != request.method) {
            index = -1;
        }
        else {
            if (r.url === request.url) {
                if (r.headers === request.headers) {
                    index = i;
                }
            }
        }

        if (index >= 0) {
            break;
        }
    }

    return index;
};

function closeNewCollectionForm() {
    $('#formModalNewCollection').modal('hide');
}

function closeAddToCollectionForm() {
    $('#formModalAddToCollection').modal('hide');
}

function closeAboutPostman() {
    $('#modalAboutPostman').modal('hide');
}

function closeModal(id) {
    $('#' + id).modal('hide');
}

function showModal(id) {
    $('#' + id).modal('show');
}

function closeSettings() {
    $('#modalSettings').modal('hide');
}

function addAvailableUrl(url) {
    if ($.inArray(url, availableUrls) == -1) {
        availableUrls.push(url);
    }
}

function attachSocialButtons() {
    var currentContent = $('#aboutPostmanTwitterButton').html();
    if (currentContent === "" || !currentContent) {
        $('#aboutPostmanTwitterButton').html(socialButtons.twitter);
    }

    currentContent = $('#aboutPostmanPlusOneButton').html();
    if (currentContent === "" || !currentContent) {
        $('#aboutPostmanPlusOneButton').html(socialButtons.plusOne);
    }

    currentContent = $('#aboutPostmanFacebookButton').html();
    if (currentContent === "" || !currentContent) {
        $('#aboutPostmanFacebookButton').html(socialButtons.facebook);
    }
}

function clearHistory() {
    postman.indexedDB.deleteHistory();
}

function toggleSidebarSection(section) {
    if (section === 'history') {
        $('#historyOptions').css("display", "block");
        $('#collectionsOptions').css("display", "none");
    }
    else if (section === 'collections') {
        $('#historyOptions').css("display", "none");
        $('#collectionsOptions').css("display", "block");
    }
}

function dropboxSync() {
    if (!dropbox.isLoggedin()) {
        $('#modalDropboxSync').modal('show');
        dropbox.login_v1();
    } else {
        dropbox.oauthRequest({
            url:"https://api.dropbox.com/1/oauth/access_token",
            method:"POST"
        }, [], function hello(data) {
            console.log(data);
        });
        /*dropbox.getAccount(function accountData(data) {
         console.log(data);
         });*/
    }
}

function checkDropboxLogin() {
    if (dropbox.afterAuthentication === true) {
        $('#modalDropboxSync .modal-body p').html('Succesfully connected to Dropbox!');
        $('#modalDropboxSync').modal('show');
    }
}

function toggleResponseBodySize() {
    if (postman.response.state.size == "normal") {
        postman.response.state.size = "maximized";
        $('#responseBodyToggle img').attr("src", "images/full-screen-exit-alt-2.png");
        postman.response.state.width = $('#respData').width();
        postman.response.state.height = $('#respData').height();
        postman.response.state.display = $('#respData').css("display");
        postman.response.state.position = $('#respData').css("position");

        $('#respData').css("position", "absolute");
        $('#respData').css("left", 0);
        $('#respData').css("top", 0);
        $('#respData').css("width", $(document).width() - 20);
        $('#respData').css("height", $(document).height());
        $('#respData').css("z-index", 100);
        $('#respData').css("background-color", "white");
        $('#respData').css("padding", "10px");
    }
    else {
        postman.response.state.size = "normal";
        $('#responseBodyToggle img').attr("src", "images/full-screen-alt-4.png");
        $('#respData').css("position", postman.response.state.position);
        $('#respData').css("left", 0);
        $('#respData').css("top", 0);
        $('#respData').css("width", postman.response.state.width);
        $('#respData').css("height", postman.response.state.height);
        $('#respData').css("z-index", 10);
        $('#respData').css("background-color", "white");
        $('#respData').css("padding", "0px");
    }
}

function minimizeResponseBody() {
    $('#respData').css("padding", "0px");
}

var escInputHandler = function (evt) {
    $(evt.target).blur();
};

function setupKeyboardShortcuts() {

    var selectGetHandler = function (evt) {
        showRequestMethodUi('GET');
        return false;
    };

    var selectPostHandler = function (evt) {
        showRequestMethodUi('POST');
        return false;
    };

    var selectPutHandler = function (evt) {
        showRequestMethodUi('PUT');
        return false;
    };

    var selectDeleteHandler = function (evt) {
        showRequestMethodUi('DELETE');
        return false;
    };

    var selectHeadHandler = function (evt) {
        showRequestMethodUi('HEAD');
        return false;
    };

    var selectOptionsHandler = function (evt) {
        showRequestMethodUi('OPTIONS');
        return false;
    };

    var clearHistoryHandler = function (evt) {
        clearHistory();
        return false;
    };

    var urlFocusHandler = function (evt) {
        $('#url').focus();
        return false;
    };

    var newRequestHandler = function (evt) {
        startNewRequest();
    };

    $('input').bind('keydown', 'esc', escInputHandler);
    $('textarea').bind('keydown', 'esc', escInputHandler);
    $('select').bind('keydown', 'esc', escInputHandler);

    $(document).bind('keydown', 'alt+1', selectGetHandler);
    $(document).bind('keydown', 'alt+2', selectPostHandler);
    $(document).bind('keydown', 'alt+3', selectPutHandler);
    $(document).bind('keydown', 'alt+4', selectDeleteHandler);
    $(document).bind('keydown', 'alt+5', selectHeadHandler);
    $(document).bind('keydown', 'alt+6', selectOptionsHandler);
    $(document).bind('keydown', 'alt+c', clearHistoryHandler);
    $(document).bind('keydown', 'backspace', urlFocusHandler);
    $(document).bind('keydown', 'alt+n', newRequestHandler);

    $(document).bind('keydown', 'h', function () {
        $('#headers-ParamsFields div:first-child input:first-child').focus();
        return false;
    });

    $(document).bind('keydown', 'return', function () {
        sendRequest();
        return false;
    });

    $(document).bind('keydown', 'p', function () {
        if(requestMethod === "post" || requestMethod === "put") {
            $('#body-ParamsFields div:first-child input:first-child').focus();
            return false;
        }
    });

    $(document).bind('keydown', 'f', function () {
        toggleResponseBodySize();
    });

    $(document).bind('keydown', 'shift+/', function () {
        showModal('modalShortcuts');
    });

    $(document).bind('keydown', 'a', function () {
        $('#formModalAddToCollection').modal({
            keyboard:true,
            backdrop:"static"
        });
        $('#formModalAddToColllection').modal('show');
        $('#selectCollectionContainer').focus();

        //Focus on the form element
        return false;
    });
}

function setHeadersParamString(headers) {
    var headersLength = headers.length;
    var paramString = "";
    for (var i = 0; i < headersLength; i++) {
        var h = headers[i];
        if (h.name && h.name !== "") {
            paramString += h.name + ": " + h.value + "\n";
        }
    }
    $('#headers').val(paramString);
}

function processBasicAuthRequestHelper() {
    var headers = postman.currentRequest.headers;

    var headersLength = headers.length;
    var pos = -1;

    //Improve this or put it inside a function
    for (var i = 0; i < headersLength; i++) {
        var h = headers[i];
        if (h.name === "Authorization") {
            pos = i;
            break;
        }
    }

    var authHeaderKey = "Authorization";
    var username = $('#requestHelper-basicAuth-username').val();
    var password = $('#requestHelper-basicAuth-password').val();
    var rawString = username + ":" + password;
    var encodedString = "Basic " + btoa(rawString);

    if (pos >= 0) {
        headers[pos] = {
            name:"Authorization",
            value:encodedString
        };
    }
    else {
        headers.push({name:"Authorization", value:encodedString});
    }

    postman.currentRequest.headers = headers;
    setHeadersParamString(headers);
    showParamsEditor("headers");
}

function hideRequestHelper(type) {
    $('#requestHelpers').css("display", "none");

    if (type === 'basicAuth') {
        processBasicAuthRequestHelper();
    }
    else if (type === 'oAuth1') {
        processOAuth1RequestHelper();
    }
    return false;
}

function showRequestHelper(type) {
    $("#requestTypes ul li").removeClass("active");
    $('#requestTypes ul li[data-id=' + type + ']').addClass('active');
    if (type != "normal") {
        $('#requestHelpers').css("display", "block");
    }
    else {
        $('#requestHelpers').css("display", "none");
    }

    if(type.toLowerCase() === 'oauth1') {
        generateOAuth1RequestHelper();
    }

    $('.requestHelpers').css("display", "none");
    $('#requestHelper-' + type).css("display", "block");
    return false;
}

function setupRequestHelpers() {
    $("#requestTypes ul li").bind("click", function () {
        $("#requestTypes ul li").removeClass("active");
        $(this).addClass("active");
        var type = $(this).attr('data-id');
        showRequestHelper(type);
    });
}

function generateOAuth1RequestHelper() {
    $('#requestHelper-oauth1-timestamp').val(OAuth.timestamp());
    $('#requestHelper-oauth1-nonce').val(OAuth.nonce(6));
}

function generateSignature() {
    if ($('#url').val() == '') {
        $('#requestHelpers').css("display", "block");
        alert('Please enter the URL first.');
        return null;
    }
    var message = {
        action:$('#url').val().trim(),
        method:$('#methods li.active a').html(),
        parameters:[]
    };
    //all the fields defined by oauth
    $('input.signatureParam').each(function () {
        if ($(this).val() != '') {
            message.parameters.push([$(this).attr('key'), $(this).val()]);
        }
    });
    //all the extra GET parameters
    $('#body-ParamsFields input.key, #url-ParamsFields input.key').each(function () {
        if ($(this).val() != '') {
            message.parameters.push([$(this).val(), $(this).next().val()]);
        }
    });

    var accessor = {};
    if ($('input[key="oauth_consumer_secret"]').val() != '') {
        accessor.consumerSecret = $('input[key="oauth_consumer_secret"]').val();
    }
    if ($('input[key="oauth_token_secret"]').val() != '') {
        accessor.tokenSecret = $('input[key="oauth_token_secret"]').val();
    }

    return OAuth.SignatureMethod.sign(message, accessor);
}

function setBodyParamString(url, params) {
    var paramsLength = params.length;
    var paramArr = [];
    for (var i = 0; i < paramsLength; i++) {
        var p = params[i];
        if (p.name && p.name !== "") {
            paramArr.push(p.name + "=" + p.value);
        }
    }
    $('#body').val(paramArr.join('&'));
}

function setUrlParamString(url, params) {
    var paramArr = [];
    var urlParams = getUrlVars(url);
    for (var i = 0; i < urlParams.length; i++) {
        var p = urlParams[i];
        if (p.key && p.key !== "") {
            paramArr.push(p.key + "=" + p.value);
        }
    }
    for (var i = 0; i < params.length; i++) {
        var p = params[i];
        if (p.name && p.name !== "") {
            paramArr.push(p.name + "=" + p.value);
        }
    }

    var baseUrl = url.split("?")[0];
    $('#url').val(baseUrl + "?" + paramArr.join('&'));
}

function processOAuth1RequestHelper() {
    var params = [];

    var signatureKey = "oauth_signature";
    var signature = generateSignature();
    if (signature == null) {
        return;
    }

    params.push({name:signatureKey, value:signature});

    $('input.signatureParam').each(function(){
        if ($(this).val() != '') {
            params.push({name:$(this).attr('key'), value:$(this).val()});
        }
    });

    if(postman.currentRequest.method === 'GET') {
        var url = $('#url').val();
        //postman.currentRequest.headers = body + ;
        setUrlParamString(url, params);
        showParamsEditor("url");
    } else {
        var body = postman.currentRequest.body;
        //postman.currentRequest.headers = body + ;
        setBodyParamString(body, params);
        showParamsEditor("body");
    }

}

$(document).ready(function () {
    setupDB();
    initDB();
    initializeSettings();
    lang();
    init();

    $('a[rel="twipsy"]').twipsy();

    addHeaderListeners();
    addUrlAutoComplete();
    attachSidebarListeners();
    setupKeyboardShortcuts();
    initCollectionSelector();
    setContainerHeights();
    setupRequestHelpers();
    refreshScrollPanes();


    $('#modalShortcuts').modal({
        keyboard:true,
        backdrop:"static"
    });

    //checkDropboxLogin();

    $('#formAddToCollection').submit(function () {
        submitAddToCollectionForm();
        return false;
    });

    $('#formNewCollection').submit(function () {
        submitNewCollectionForm();
        return false;
    });

    $(window).resize(function () {
        setContainerHeights();
    });
});
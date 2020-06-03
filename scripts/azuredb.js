
const retrySendAfterConnectionFailureMinutes = 1;
const siteUrl = "https://deep-map.azurewebsites.net";

//var syncWorker = new Worker('scripts/sync.js');
var mostrecenttimestamp = 0;
var sendPlaceQueue = [];
var isSendQueueEmptyObservable = new ObservableWrapper(() => window.imageUploadQueue.length == 0 && sendPlaceQueue.length == 0);

/** While photos, pics etc are being uploaded, retain the dataUrl. 
 * @param mediaId Bare id (no url prefix) with file extension
 * @param data Data read from file locally, as data URL
 */
function cacheLocalMedia(mediaId, data) {
    if (mediaId.match(/\.pdf$/i)) return;
    if (!data) {
        delete RecentUploads[mediaId];
    } else {
        RecentUploads[mediaId] = data;
    }
}
function mediaSource(mediaId) {
    return RecentUploads[mediaId] ? RecentUploads[mediaId] : PicUrl(mediaId);
}


/**
 * Upload place to server. On network failure, sets timer to retry.
 * This uploads the place data with list of associated files, but the files are uploaded separately.
 * 
 * @param {Place} place : Place on the map with text, pics, and other files. 
 */
function sendPlace(place) {
    let user = usernameOrSignIn();
    if (!user) return;
    sendPlaceQueue.push(place);
    sendNextPlace();
}

function placeKeys(id) {
    let keys = id.split("|");
    return { PartitionKey: keys[0].replace("+", " "), RowKey: keys[1] };
}

function sendNextPlace() {
    if (window.sendPlaceTimer) { clearTimeout(window.sendPlaceTimer); window.sendPlaceTimer = null; }
    isSendQueueEmptyObservable.Notify();
    if (sendPlaceQueue.length == 0) {
        return;
    }
    let place = sendPlaceQueue[0];
    // Translate internal Place to flat table data:
    let keys = placeKeys(place.id);
    let data = {
        PartitionKey: keys.PartitionKey,
        RowKey: keys.RowKey,
        Longitude: place.loc.e, Latitude: place.loc.n,
        Text: place.text, Tags: place.tags,
        Media: JSON.stringify(place.pics, function (k, v) {
            // Don't stringify internal links to img, map pin, etc
            if (!isNaN(k)) return v; // Array indices => include all array members
            if ("id caption date type sound youtube orientation".indexOf(k) >= 0) return v; // Properties to include
            return null;
        }),
        User: place.user || usernameIfKnown(),
        Group: place.group, Level: "",
        Next: place.nextRowKey,
        Deleted: place.deleted
        // Last-Modified and UpateTrail are set by the server
    };
    // Stringify the whole thing, allowing for UTF chars
    let json = JSON.stringify(data);
    json = json.replace(/[\u007F-\uFFFF]/g, function (chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
    });
    let url = siteUrl + "/api/uploadPlace?code=" + window.keys.Client_UpdatePlace_FK;

    let req = new XMLHttpRequest();
    req.addEventListener("loadend", function (event) {
        if (req.status >= 200 && req.status < 400) {
            window.sendPlaceQueue.shift();
            window.sendPlaceTimer = setTimeout(function () { sendNextPlace(); }, 100);
        } else if (req.status == 0) {
            clearTimeout(window.sendPlaceTimer);
            window.sendPlaceTimer = setTimeout(function () { sendNextPlace(); }, retrySendAfterConnectionFailureMinutes * 60000);
        }
    });
    req.open("POST", url);
    req.setRequestHeader('content-type', 'application/json');
    req.send(json);
}

function uploadComment(comment) {
    let json = JSON.stringify(comment);
    json = json.replace(/[\u007F-\uFFFF]/g, function (chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
    });
    let req = new XMLHttpRequest();
    req.open("POST", siteUrl + "/api/uploadComment?code=" + window.keys.Client_UpdateComment_FK);
    req.setRequestHeader("content-type", 'application/json');
    req.send(json);
}


/**
 * Send a request
 * @param {String} uri  Full URL
 * @param {*} onload    (json_response) => void
 */
function getFile(uri, onload) {
    let req = new XMLHttpRequest();

    if (onload) {
        req.addEventListener("loadend", function (event) {
            if (this.status == 0 || this.status >= 400) { /* alert(s("connectionAlert", "Connection problem:") + " " + this.statusText);*/ }
            else {
                try {
                    if (this.response) {
                        var theList = JSON.parse(this.response);
                        onload(theList);
                    } else {
                        onload(null);
                    }
                } catch (ex) { 
                    /* alert(s("connectionWebAlert", "Connection problem - no internet...?"));*/ 
                    window.ex = ex;
                }
            }
        });
    }
    req.open("GET", uri);
    req.setRequestHeader('content-type', 'application/json');
    req.send();
}

function list(onLoad) {
    getFile('list.php', onload);
}

function getComments(place, onload) {
    if (place.commentCache) onload(place.commentCache);
    else { getFile(siteUrl + "/api/comments?id=" + place.id, (cc) => { place.commentCache = cc; onload(cc); }); }
}

function PicUrl(imgid) {
    return siteUrl + "/media/" + imgid;
}

/**
 * Load places from the server.
 * @param {*} onload 
 * @param {boolean} recent Get just places changed since last load.
 */
function dbLoadPlaces(onload, recent = false, project = window.project.id) {
    getFile(siteUrl + `/api/places?project=${project}` + (recent ? "&after=" + mostrecenttimestamp : ""), function (data) {
        var places = [];
        for (var i = 0; i < data.length; i++) {
            // Note latest timestamp so that we can later ask for an incremental update:
            var d = data[i];
            var dateString = "";
            if (d.LastModified) {
                if (d.LastModified > mostrecenttimestamp) {
                    mostrecenttimestamp = d.LastModified;
                }
                dateString = Place.DateString(d.LastModified);
            }
            var place = {
                __proto__: Place.prototype,
                id: d.PartitionKey + "|" + d.RowKey,
                group: d.Group,
                loc: { e: d.Longitude, n: d.Latitude },
                text: d.Text,
                pics: JSON.parse(d.Media),
                tags: d.Tags,
                user: d.User,
                modified: dateString,
                deleted: d.Deleted,
                nextRowKey: d.Next
            };
            place.pics.forEach(function (pic) {
                pic.__proto__ = Picture.prototype;
            });
            places.push(place);
        }
        if (onload) onload(places);
    });
}


function dbGetKeys(onload) {
    if (window.localStorage.keys) {
        window.keys = JSON.parse(window.localStorage.keys);
        gotKeys(onload);
        return;
    }

    getFile(siteUrl + '/api/keys', function (items) {
        window.keys = items;
        window.localStorage = JSON.stringify(window.keys);
        gotKeys(onload);
    });
}
function gotKeys(onload) {
    onload();
    window.blobService = AzureStorage.createBlobService('deepmap', window.keys.Client_BlobService_K);
}

function dbDeletePlace(id, onSuccess) {
    let user = usernameOrSignIn();
    if (!user) return;
    let k = id.split("|");
    let url = siteUrl + "/api/deletePlace?code={2}&partitionKey={0}&rowKey={1}".format(k[0], k[1], window.keys.Client_DeletePlace_FK);
    getFile(url, onSuccess);
}

function dbDeletePic(id, andThen) {
    //https://azure.github.io/azure-storage-node/BlobService.html#deleteBlobIfExists
    window.blobService.deleteBlobIfExists("deepmap", "media/" + id, function (error, result, response) {
        if (error) alert(s("deletePic", "Delete pic:") + " " + response);
        else {
            if (andThen) andThen();
        }
    });
}

//
// Upload
//
window.imageUploadQueue = [];


// Sends the picture or other file straight from the input File.
// This sends the file encoded in binary.
function sendFile(pic) {
    if (!pic) return;

    window.imageUploadQueue.push({ pic: pic, blob: pic.file });
    uploadImages();
}

// Reduces a large picture before sending it. However, the
// reduction encodes the image in Base64 (i.e. Ascii-encoded), which 
// is about 1/3 bigger than binary. 
function sendImage(pic, img) {
    if (!pic || !img) return;
    // If the file isn't too big, just send it as binary:
    if (!pic.isPicture || pic.file.size < 1e6) { sendFile(pic); return; }
    // Otherwise, reduce it, but send as Base64:
    window.imageUploadQueue.push({ pic: pic, blob: reducePic(img) });
    uploadImages();
}

var reducer = null;

// Reduce the size of an image by at least half in each dimension.
function reducePic(img) {
    if (!reducer) reducer = document.createElement("canvas");
    var scale = Math.min(1000 / img.naturalHeight, 1400 / img.naturalWidth);
    reducer.height = img.naturalHeight * scale;
    reducer.width = img.naturalWidth * scale;
    var ctx = reducer.getContext("2d", { alpha: false, antialias: true });
    ctx.drawImage(img, 0, 0, reducer.width, reducer.height);
    return b64toBlob(reducer.toDataURL("image/jpeg", 0.7), "image/jpeg");
}

// Convert Base64 (i.e. long char string) to binary image file
// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
function b64toBlob(b64Data) {
    const sliceSize = 512; // optimal size for processing chunks
    const contentType = b64Data.match(/:(.*?);/)[1]; // e.g. image/jpeg
    var startOfData = b64Data.indexOf(",") + 1;
    const byteCharacters = atob(b64Data.substr(startOfData));
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}


/**
 * Upload queued photos and files.
 */
function uploadImages() {
    if (window.imageUploadTimer) { clearTimeout(window.imageUploadTimer); window.imageUploadTimer = null; }
    isSendQueueEmptyObservable.Notify();
    if (window.imageUploadQueue.length == 0) {
        return;
    }
    var item = window.imageUploadQueue[0];
    var filename = "media/" + item.pic.id.replace(/\?.*/, ""); // strip cache-clearing tricks
    //var file = new File([item.blob], filename);
    var file = item.blob; file.name = filename;
    // https://azure.github.io/azure-storage-node/BlobService.html#createBlockBlobFromBrowserFile
    window.blobService.createBlockBlobFromBrowserFile("deepmap", filename, file, {}, function (error, result, response) {
        if (!error) {
            //var ix = window.imageUploadQueue.indexOf(item);
            //window.imageUploadQueue.splice(ix, 1);
            var completedItem = window.imageUploadQueue.shift();
            if (completedItem) {
                // clear image cache
                cacheLocalMedia(completedItem.pic.id, null);
            }
            window.imageUploadTimer = setTimeout(uploadImages, 100);
        } else {
            // Probably failed because out of wifi or mobile signal.
            // Try again in a while:
            window.imageUploadTimer = setTimeout(uploadImages, retrySendAfterConnectionFailureMinutes * 60000);
        }
    });
}


// Warn if user tries to close window while there still edited pins waiting to be uploaded:
window.addEventListener("beforeunload", function (e) {
    if (isSendQueueEmptyObservable.Value) return "";
    var confirmationMessage = s("stillUploadingAlert", "Still uploading photos or files. Close anyway?");
    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
});



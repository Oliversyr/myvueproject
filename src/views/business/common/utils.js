// 文件下载
import axios from 'axios';

let  Pl_httpDownFile = function(config){
    // console.log(1111111111111111111555555, config)
    if(typeof config === "undefined"){
        console.error("config undefined");
        return ;
    }
    if(typeof config.progress === "undefined"){
        console.error("config.progress undefined");
        return ;
    }
    if(typeof config.finishFun !== "function"){
        console.error("config.finishFun isn't function ");
        return ;
    }

    var progress = config.progress ;
    progress.useTime=0;
    progress.speed=0;
    progress.percent=0;
    progress.fileSize=0;
    progress.loadSize=0;

    /*function readBlobAsDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function(e) { callback(e.target.result);};
        a.readAsDataURL(blob);
    }*/

   /* function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }*/
//test:
//     var blob = dataURLtoBlob('data:text/plain;base64,' + config.url);

    // var blob = dataURLtoBlob('data:text/plain;base64,' + config.url);
    /*readBlobAsDataURL(config.url, function (dataurl){
        console.log(dataurl);
    });*/
// console.log(1111111111111111111555555, blob)

    /*axios.get(config.url, {
        responseType: 'blob',
        headers: {'Content-Type': 'text/plain'}
    }).then((data) => {
        cosole.log('aaaaaaaaaaaa', data);
    })*/

    var url = config.url ;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.responseType = "blob";
    var lastLoaded = 0, speed = 0, lastTime = + new Date, startTime = lastTime;
    var isFinish = false ;
    xhr.onreadystatechange = function () {
        setTimeout(function(){
            progress.useTime = (+ new Date - startTime);
            if (xhr.readyState == 4) {
                var finishData = {};
                if(xhr.status==200){
                    finishData.blobData = xhr.response ;
                    finishData.retCode = 0 ;
                    console.log(111111111111111111111111)
                    if(isFinish===false && progress.fileSize==progress.loadSize){
                        isFinish = true ;
                        config.finishFun.call(this,finishData);
                    }

                }else{console.log(1111111111111111111555555)
                    if(isFinish===false){
                        isFinish = true ;
                        finishData.retCode = -1 ;
                        finishData.blobData = xhr.status==404?"升级文件不存在":xhr.statusText ;
                        config.finishFun.call(this,finishData);
                    }
                }

            }
        },0);
    };

    xhr.addEventListener("progress", function(e){
        setTimeout(function(){
            var currTime = + new Date;
            var currLoaded = e.loaded;
            var dT = currTime - lastTime;
            var dL = currLoaded - lastLoaded;
            lastTime = currTime;
            lastLoaded = currLoaded;
            var curSpeed = dL / dT;
            progress.speed = curSpeed.toFixed(2);
            var percent = currLoaded / e.total*100;
            var fileSize = e.total / 1024  ;
            var loadSize = currLoaded / 1024  ;
            progress.percent = percent.toFixed(2);
            progress.fileSize = fileSize.toFixed(2);
            progress.loadSize = loadSize.toFixed(2);
        },0);
    });
    xhr.send(null);
};



  /**
   * 浏览器方法
   * 文件下载另存为
   */
let BrowserSaveAs = function(){
    var view = window ;
    var
      doc = view.document
      // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
      , get_URL = function() {
          return view.URL || view.webkitURL || view;
      }
      , URL = view.URL || view.webkitURL || view
      , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
      , can_use_save_link =  !view.externalHost && "download" in save_link
      , click = function(node) {
          var event = doc.createEvent("MouseEvents");
          event.initMouseEvent(
            "click", true, false, view, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
          );
          node.dispatchEvent(event);
      }
      , webkit_req_fs = view.webkitRequestFileSystem
      , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
      , throw_outside = function (ex) {
          (view.setImmediate || view.setTimeout)(function() {
              throw ex;
          }, 0);
      }
      , force_saveable_type = "application/octet-stream"
      , fs_min_size = 0
      , deletion_queue = []
      , process_deletion_queue = function() {
          var i = deletion_queue.length;
          while (i--) {
              var file = deletion_queue[i];
              if (typeof file === "string") { // file is an object URL
                  URL.revokeObjectURL(file);
              } else { // file is a File
                  file.remove();
              }
          }
          deletion_queue.length = 0; // clear queue
      }
      , dispatch = function(filesaver, event_types, event) {
          event_types = [].concat(event_types);
          var i = event_types.length;
          while (i--) {
              var listener = filesaver["on" + event_types[i]];
              if (typeof listener === "function") {
                  try {
                      listener.call(filesaver, event || filesaver);
                  } catch (ex) {
                      throw_outside(ex);
                  }
              }
          }
      }
      , FileSaver = function(blob, name) {
          // First try a.download, then web filesystem, then object URLs
          var
            filesaver = this
            , type = blob.type
            , blob_changed = false
            , object_url
            , target_view
            , get_object_url = function() {
                var object_url = get_URL().createObjectURL(blob);
                deletion_queue.push(object_url);
                return object_url;
            }
            , dispatch_all = function() {
                dispatch(filesaver, "writestart progress write writeend".split(" "));
            }
            // on any filesys errors revert to saving with object URLs
            , fs_error = function() {
                // don't create more object URLs than needed
                if (blob_changed || !object_url) {
                    object_url = get_object_url(blob);
                }
                if (target_view) {
                    target_view.location.href = object_url;
                } else {
                    window.open(object_url, "_blank");
                }
                filesaver.readyState = filesaver.DONE;
                dispatch_all();
            }
            , abortable = function(func) {
                return function() {
                    if (filesaver.readyState !== filesaver.DONE) {
                        return func.apply(this, arguments);
                    }
                };
            }
            , create_if_not_found = {create: true, exclusive: false}
            , slice
          ;
          filesaver.readyState = filesaver.INIT;
          if (!name) {
              name = "download";
          }
          if (can_use_save_link) {
              object_url = get_object_url(blob);
              // FF for Android has a nasty garbage collection mechanism
              // that turns all objects that are not pure javascript into 'deadObject'
              // this means `doc` and `save_link` are unusable and need to be recreated
              // `view` is usable though:
              doc = view.document;
              save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
              save_link.href = object_url;
              save_link.download = name;
              var event = doc.createEvent("MouseEvents");
              event.initMouseEvent(
                "click", true, false, view, 0, 0, 0, 0, 0
                , false, false, false, false, 0, null
              );
              save_link.dispatchEvent(event);
              filesaver.readyState = filesaver.DONE;
              dispatch_all();
              return;
          }
          // Object and web filesystem URLs have a problem saving in Google Chrome when
          // viewed in a tab, so I force save with application/octet-stream
          // http://code.google.com/p/chromium/issues/detail?id=91158
          if (view.chrome && type && type !== force_saveable_type) {
              slice = blob.slice || blob.webkitSlice;
              blob = slice.call(blob, 0, blob.size, force_saveable_type);
              blob_changed = true;
          }
          // Since I can't be sure that the guessed media type will trigger a download
          // in WebKit, I append .download to the filename.
          // https://bugs.webkit.org/show_bug.cgi?id=65440
          if (webkit_req_fs && name !== "download") {
              name += ".download";
          }
          if (type === force_saveable_type || webkit_req_fs) {
              target_view = view;
          }
          if (!req_fs) {
              fs_error();
              return;
          }
          fs_min_size += blob.size;
          req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
              fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                  var save = function() {
                      dir.getFile(name, create_if_not_found, abortable(function(file) {
                          file.createWriter(abortable(function(writer) {
                              writer.onwriteend = function(event) {
                                  target_view.location.href = file.toURL();
                                  deletion_queue.push(file);
                                  filesaver.readyState = filesaver.DONE;
                                  dispatch(filesaver, "writeend", event);
                              };
                              writer.onerror = function() {
                                  var error = writer.error;
                                  if (error.code !== error.ABORT_ERR) {
                                      fs_error();
                                  }
                              };
                              "writestart progress write abort".split(" ").forEach(function(event) {
                                  writer["on" + event] = filesaver["on" + event];
                              });
                              writer.write(blob);
                              filesaver.abort = function() {
                                  writer.abort();
                                  filesaver.readyState = filesaver.DONE;
                              };
                              filesaver.readyState = filesaver.WRITING;
                          }), fs_error);
                      }), fs_error);
                  };
                  dir.getFile(name, {create: false}, abortable(function(file) {
                      // delete file if it already exists
                      file.remove();
                      save();
                  }), abortable(function(ex) {
                      if (ex.code === ex.NOT_FOUND_ERR) {
                          save();
                      } else {
                          fs_error();
                      }
                  }));
              }), fs_error);
          }), fs_error);
      }
      , FS_proto = FileSaver.prototype
      , saveAs = function(blob, name) {
          return new FileSaver(blob, name);
      }
    ;
    FS_proto.abort = function() {
        var filesaver = this;
        filesaver.readyState = filesaver.DONE;
        dispatch(filesaver, "abort");
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
      FS_proto.onwritestart =
        FS_proto.onprogress =
          FS_proto.onwrite =
            FS_proto.onabort =
              FS_proto.onerror =
                FS_proto.onwriteend =
                  null;
    view.addEventListener("unload", process_deletion_queue, false);
};

export {
    Pl_httpDownFile,
    BrowserSaveAs
}
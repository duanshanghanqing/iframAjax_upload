(function(){
    window.multiFileUpload = function(option){
        var id = option && option.formId;
        var fileForm = document.getElementById(id);
        fileForm.onsubmit = function(){
            try {//使用ajax上传
                new FormData();
                ajax_upload(fileForm);
                return false;
            }catch(e){//使用iframe上传
                iframe_upload(fileForm);
            }
        };
        //使用ajax上传
        function ajax_upload(fileForm){
            var files;
            (function(){
                var nodes = fileForm.childNodes;
                for(var i=0;i<nodes.length;i++){
                    if(nodes[i].tagName == "INPUT"){//判断是不是p元素
                        if(nodes[i].getAttribute("type") ==="file"){
                            if(nodes[i].files !== {} || nodes[i].files!==null || nodes[i].files!==undefined || nodes[i].files !==""){
                                files = nodes[i].files;
                            }
                        }
                    }
                }
            })();

            console.log(files);
            var url = fileForm.action;

            var i = 0;
            var xhr;
            function fileUpload(index){
                // 1.准备FormData
                var fd = new FormData();
                fd.append("type", "ajax");
                fd.append("myfile", files[index]);

                // 2.创建xhr对象
                xhr = new XMLHttpRequest();

                // 监听状态，实时响应
                // xhr 和 xhr.upload 都有progress事件，xhr.progress是下载进度，xhr.upload.progress是上传进度
                //这里监听上传进度事件，文件在上次的过程中，会多次触发该事件，返回一个event事件对象
                xhr.upload.onprogress = function(event) {
                    option.uploadedBeing && option.uploadedBeing(event);
                };

                // 传输开始事件
                xhr.onloadstart = function(event) {
                    option.uploaduStart && option.uploaduStart(event);
                };
                // xhr.abort();//调用该方法停止ajax上传，停止当前的网络请求

                //每个文件上传成功
                xhr.onload = function(event) {
                    option.uploadSuccess && option.uploadSuccess(event);
                    option.serviceCallback && option.serviceCallback(xhr.responseText);
                    setTimeout(function(){
                        index++
                        if(index<files.length){
                            fileUpload(index);
                        }
                    },1000);
                };

                // ajax过程发生错误事件
                xhr.onerror = function(event) {
                    option.uploadError && option.uploadError(event);
                };

                // ajax被取消，文件上传被取消，说明调用了 xhr.abort();  方法，所触发的事件
                xhr.onabort = function(event) {
                    obj.uploadCancelled && obj.uploadCancelled(event);
                };

                // loadend传输结束，不管成功失败都会被触发
                xhr.onloadend = function (event) {
                    option.uploadEnd && option.uploadEnd(event);
                };

                // 发起ajax请求传送数据
                xhr.open('POST',url , true);
                xhr.send(fd);//发送文件
            }
            fileUpload(i);

            return {
                abort:function(){//ajax被取消，文件上传被取消
                    xhr.abort();//调用该方法停止ajax上传，停止当前的网络请求
                }
            };
        };
        //使用 iframe 上传
        function iframe_upload(fileForm){
            var body = document.getElementsByTagName("body")[0];
            var iframe = document.createElement("iframe");
            iframe.setAttribute("name","frm");
            iframe.style.display="none";
            body.appendChild(iframe);
            fileForm.setAttribute("target","frm");
            (function(){
                var nodes = fileForm.childNodes;
                for(var i=0;i<nodes.length;i++){
                    if(nodes[i].tagName == "INPUT"){
                        if(nodes[i].getAttribute("type") ==="file"){
                            option && option.uploaduStart(nodes[i]);
                        }
                    }
                }
            })();
            window.uploadFinished = function(data){
                (function(){
                    var nodes = fileForm.childNodes;
                    for(var i=0;i<nodes.length;i++){
                        if(nodes[i].tagName == "INPUT"){//判断是不是p元素
                            if(nodes[i].getAttribute("type") ==="file"){
                                nodes[i].files =null;
                                nodes[i].value = "";
                            }
                        }
                    }
                })();
                body.removeChild(iframe);
                option && option.uploadSuccess(data);
                option && option.uploadEnd(data);
                option && option.serviceCallback(data);
            }
        }
    }
})();
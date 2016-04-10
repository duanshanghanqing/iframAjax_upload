# 一个ajax文件上传demo

## 使用方法

### html
    <input type="file" name="myfile" value="" id="ajax_myfile" multiple/><br/><br/>
    <input type="button" value="上传按钮" id="ajax_button"><br/><br/>
    <input type="button" value="停止上传" id="ajax_stop"><br/><br/>


### script
    <script src="ajax_upload.js"></script>
    <script>
        var ajax_button = document.getElementById("ajax_button");
        ajax_button.onclick=function(){
            var files = document.getElementById("ajax_myfile").files
            var  res = multiFileUpload({
                url:"/upload3",//上传地址
                files:files,//上传的文件
                uploaduStart:function(event){//开始上传
                    console.log('开始上传');
                },
                uploadedBeing:function(event){//上传进度事件，文件在上次的过程中，会多次触发该事件，返回一个event事件对象
                    if (event.lengthComputable) {//返回一个  长度可计算的属性，文件特别小时，监听不到，返回false
                        //四舍五入
                        var percent = Math.round(event.loaded * 100 / event.total);//event.loaded:表示当前已经传输完成的字节数。
                        //event.total:当前要传输的一个总的大小.通过传输完成的除以总的，就得到一个传输比率
                        console.log('进度', percent);
                    }
                },
                uploadSuccess:function(event){//上传成功
                    console.log('上传成功');
                    //console.log(xhr.responseText);//得到服务器返回的数据
                },
                uploadError:function(event){//上传出错
                    console.log('发生错误');
                },
                uploadCancelled:function(event){//取消上传
                    console.log('操作被取消');
                },
                uploadEnd:function(event){//上传结束
                    console.log('传输结束，不管成功失败都会被触发');
                },
                serviceCallback:function(data){//服务器回掉返回的数据
                    console.log(data);
                }
            });
    
            var ajax_stop = document.getElementById("ajax_stop");
            ajax_stop.onclick=function(){
                res.abort();
            }
        }
    
    </script>
    
### node后台

    var express = require('express');
    var router = express.Router();//创建路由
    
    //使用文件上传模块
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();//调用构造函数，创建对象
    
    var fs = require('fs');//使用fs文件处理模块
    
    //ajax文件上传
    router.post('/upload3', multipartMiddleware, function(req, res) {
        console.log(req.body);//获取普通表单提交的数据
        console.log(req.files);//获取上传的文件
    
        //把上传的文件存放到指定的目录中
        var file= fs.createReadStream(req.files.myfile.path);//把当前上传的文件从临时目录读取出来，输出流
        file.pipe(fs.createWriteStream('./file/'+req.files.myfile.originalFilename));//写入到指定的目录，输入流
    
        //在删除临时文件
        fs.unlink(req.files.myfile.path);
    
        res.json({ fname: './file/'+req.files.myfile.originalFilename });//向客户端返回上传文件保存的地址
    });
    
    module.exports = router;        
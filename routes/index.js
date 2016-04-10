var express = require('express');
var router = express.Router();//创建路由

//使用文件上传模块
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();//调用构造函数，创建对象

var fs = require('fs');//使用fs文件处理模块

//index.html
router.all('/', function (req, res) {
    res.sendFile('../public/index.html');
});


//接收iframe和ajax提交的文件
router.post('/upload', multipartMiddleware, function(req, res) {
    console.log(req.body);
    console.log(req.files);


    //把上传的文件存放到指定的目录中
    var file= fs.createReadStream(req.files.myfile.path);//把当前上传的文件从临时目录读取出来，输出流
    file.pipe(fs.createWriteStream('./file/'+req.files.myfile.originalFilename));//写入到指定的目录，输入流

    //在删除临时文件
    fs.unlink(req.files.myfile.path);

    if(req.body.type === "ajax"){
        res.json({ fname: './file/'+req.files.myfile.originalFilename });//向客户端返回上传文件
    }else{
        //服务器端返回一段调用父窗口方法的js代码。并将上传的信息传过去
        setTimeout(function() {
            var ret = ["<script>",
                "window.parent.uploadFinished('./file/" + req.files.myfile.originalFilename + "');",
                "</script>"];
            res.send(ret.join(""));
        }, 3000);
    }
});

module.exports = router;
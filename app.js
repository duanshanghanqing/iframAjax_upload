var express = require('express');//导入express框架
var path = require('path');//导入路径转换包
var bodyParser = require('body-parser');//导入把接收客户端的数据转换成json的包，需要自己安装

var app = express();

//使用body-parser这个中间件
// json类型body
app.use(bodyParser.json());
// query string类型body
app.use(bodyParser.urlencoded({
    extended: false
}));


// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//默认地址下执行index.js这个模块
app.use('/', require('./routes/index.js'));

// 设置端口
var DEFAULT_PORT = 8888;
app.listen(DEFAULT_PORT);
console.log('express server is started at port: %d', DEFAULT_PORT);
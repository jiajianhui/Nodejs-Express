// node的http模块搭建的后端服务

const http = require('http')

const server = http.createServer(function(req, res) {
    res.statusCode = 200  //响应状态码
    res.setHeader('Content-type', 'Content-Type', 'text/html')  //响应头
    res.end('hello world')  //返回客户端的内容
})


//在3000端口监听
server.listen(3000, function() {
    console.log('服务已启动');
})
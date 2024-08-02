// 使用express搭建后端服务

// 1、引入express
const { log, error } = require('console');
const express = require('express');
const { default: test } = require('node:test');

// 2、声明一个express对象
const app = express()

// 3、创建相关接口
    //接口为get接口； 路径为根路径；响应内容为hello express（给客户端发送的内容）
app.get('/', function(req, res) {  
    res.send('hello express')
})
app.get("/user", function (req, res) {  //req——Request为请求对象  res——Response为响应对象，比如给客户端响应内容（发送内容）和状态
  console.log(req.query);  //打印前端带过来的参数
  res.send("hello user");  //响应内容为user
});

// 4、监听端口
app.listen(4000, function() {
    console.log('express服务已启动');
})

// -----------------------------------------

// 路由机制
// 请求方式+接口url——app.METHOD(URL, CALLBACK)

// 使用nodemon插件——nodemon能够检测工作区代码的变化，并自动重启

// 路由方法——Express 支持对应于 HTTP 方法的以下路由方法：`get`、`post`、`put`、`delete`等等
// app.METHOD(URL, CALLBACK);

// `app.all()`，该方法用于在所有请求方法的路径中装入中间件函数；不管是`get`, `post`方式去请求`/about`路径的接口，都会经过这个回调函数然后返回对应的数据。
app.all('/about', function(req, res) {
    res.send({
        name: '齐天大圣',
        age: 100
    })
})



// ----------------------------
// 路由路径
// 1、字符串——上面的都是字符串

// 2、字符串模式
app.get('/ab?cd', function(req, res) {  //不管路径中有无b，都会发送内容
    res.send("ab?cd");
})

app.get("/e+f", function (req, res) {   //只要路径中有至少一个e（f必须有），都会发送内容
  res.send("e+f");
});

app.get("/g*h", function (req, res) {   //g和h之间可放置任何内容，也可为空，都会发送内容
  res.send("g*h");
});

// 3、正则路由路径
// app.get(/a/, function (req, res) {   //只要路径中有a，就会发送内容
//   res.send("/a/");
// });

app.get(/.*fly$/, function (req, res) {   //路径中只要以fly结尾，就会发送内容
  res.send("/.*fly$/");
});



// ------路由拆分，模块更简洁------
// 1、定义一个模块；使用Router()返回一个router对象
const goods = express.Router()

// 2、定义相关接口
goods.get('/', function(req, res) {
    res.send('goods')
})
goods.get("/detail", function (req, res) {
  res.send("goods/detail");
});

// 3、注册路由
app.use('/goods', goods)



// ------中间件，在用户发起任何请求都会执行该函数------
// *****注意一定要写next函数*****
// 1、定义全局中间件
function middleWare(req, res, next) {
    console.log('这是一个全局中间件');
    next()
}

// 1-1定义一个日志打印中间件
function logger(req, res, next) {
    const currentTime = new Date
    console.log(`[${currentTime.toLocaleString()}] ${req.method} ${req.url}`);
    next()
}

// 2、注册中间件
app.use(middleWare, logger)

// --测试全局中间件--
app.get('/test', function(req, res) {
    res.send('test')
})
// --测试局部中间件--
app.get("/jubu", function(req, res, next) {
    console.log('这是一个局部中间件');
    next()
}, function (req, res) {
  res.send("jubu");
});

app.listen(2000, function() {
    console.log('2000端口已启动');
})




// ------模版引擎，渲染页面------

// 启用静态文件服务
app.use(express.static('public'))  //注册静态资源中间件

//1、指定模版存放目录
app.set('views', 'views')

// 2、指定模版引擎为 Handlebars
app.set('view engine', 'hbs')

// 3、渲染模版
app.get('/aa', function(req, res) {
    res.render('aa')
})

app.get("/bb", function (req, res) {
    // 给模版引擎动态传递参数
  res.render("bb", {name: '小明', age: 18});
});

// 
app.get("/cc", function (req, res) {
  throw new Error()
});

app.listen(1000, function() {
    console.log('1000端口已启动');
})


// ------处理404和500错误------
// 对于 404，只需在所有路由之后再加一个中间件，用来接收所有路由均匹配失败后的请求
// 对于错误处理，前面所有中间件抛出异常时都会进入错误处理函数，可以使用 Express 自带的，也可以自定义。

// ******处理404和500错误的中间件，必须要添加到所有路由的后面，不然不能处理全部的错误******

// `*` 表示匹配任何路径。将此中间件放在所有路由后面，即可捕获所有访问路径均匹配失败的请求，然后渲染404的那个模版引擎就可以了
app.use('*', (req, res) => {
    res.status(404).render('404', {url: req.originalUrl})
})

// 只要某个路由中抛出一个错误后，客户端就会渲染500.hbs这个模版文件。
app.use((err, req, res, next) => {
  res.status(500).render("500");
});
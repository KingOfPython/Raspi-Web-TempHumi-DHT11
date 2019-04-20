var express = require('express');
var ejs = require('ejs');
var app = express();

var fs = require('fs');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: '*****',
    password: '*****',
    database: 'project_db'
})
connection.connect();


// localhost:8000/show
app.get('/show', function (req, res) {

    fs.readFile('../html/list.html', 'utf8', function (error, data) {
        if (error) {
            console.log('readFile error');
        } else {
            // db로부터 데이터를 100건 까지만 읽어 온다.
            var qstr = 'SELECT * FROM collect_data ORDER BY time DESC LIMIT 100';

            connection.query(qstr, function (err, rows) {
                if (error) {
                    console.log('error:', error.message);
                } else {
                    // 조회된 결과를 'dataList' 변수에 할당한 후 'list.html' 에 전달한다.
                    res.send(ejs.render(data,{
                        dataList:rows
                    }));
                }
            });
        }
    });
});

// 웹 서버 생성
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('listening at http://%s:%s', host, port)
});

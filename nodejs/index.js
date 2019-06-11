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

// connection.connect();
// db 끊키는 문제 해결 (19.05.21:12:10 추가)
// https://github.com/mysqljs/mysql/issues/431#issuecomment-15606772
// https://berr.tistory.com/222
function handleDisconnect(conn){
    conn.on('error', function(err){
        if (!err.fatal){
            return;
        }
        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }
        console.log('Re-connecting lost connection: ' + err.stack);
        connection =  mysql.createConnection({
            host: 'localhost',
            user: '*****',
            password: '*****',
            database: 'project_db'
        });             // 보안 고려 하여 코드 수정 필요
        handleDisconnect(connection);
        conn.connect();
    })
}
handleDisconnect(connection);

// localhost:8000/show
app.get('/show', function (req, res) {

    fs.readFile('../web/list.html', 'utf8', function (error, data) {
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

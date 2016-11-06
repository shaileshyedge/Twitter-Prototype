var ejs= require('ejs');
var mysql = require('mysql');
var pooldb = require('./ConnectionPool.js');

function fetchData(callback,sqlQuery)
{
    var  connection = pooldb.takeConnection();

    connection.query(sqlQuery, function(err,rows,fields){

        if(err)
        {
            console.log("Error :"+err.message);

        }
        else
        {
            pooldb.giveConnection(connection);
            callback(err, rows);
        }
    })
}


exports.fetchData = fetchData;

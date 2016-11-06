var mysql = require('mysql');

pool = null;
last = 0;
function createPool(NoOfConnections){

    pool = [];
    for(var i=0; i < NoOfConnections; ++i)
    {
        pool.push(mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'Knightriders1',
            dateStrings : true,
            database : 'twitter_db',
            port	 : 3306
        }));

    }
}

function takeConnection ()
{
    if(!pool)
    {
        initializeConnection();
    }
    var connection = pool[last];
    last++;
    if (last == pool.length)
        last = 0;
    return connection;
}

function initializeConnection(){
    createPool(100);
}

function giveConnection(conn)
{
    pool.push(conn);
}
exports.initializeConnection = initializeConnection;
exports.takeConnection = takeConnection;
exports.giveConnection = giveConnection;

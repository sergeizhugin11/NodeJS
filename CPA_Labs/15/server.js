const http = require("http");
const url = require('url');
console.log("Server running on port 5000.");

const MongoClient = require('mongodb').MongoClient;

http.createServer(function (request, response) {
    if (request.method == 'GET') {
        if (url.parse(request.url).pathname === '/api/faculties') {
            MongoClient.connect("mongodb+srv://Sergei:Iamafksorry3368@cluster0-mibsi.mongodb.net/test?retryWrites=true&w=majority", function (err, client) {
                var db = client.db('BSTU');
                db.collection('faculty', function (err, collection) {
                    let obj = [];
                    collection.find().toArray(function (err, items) {
                        if (err) {
                            console.log('Error geting item');
                            response.send('Error geting item');
                        }
                        console.log('Document Inserted Successfully');
                        console.log(items);
                        response.end(JSON.stringify(items));
                    });
                    
                });

            });
        }
    }
    else if (request.method == 'POST') {
        if (url.parse(request.url).pathname === '/api/faculties') {
            request.on('data', (data) => {
                MongoClient.connect("mongodb+srv://Sergei:Iamafksorry3368@cluster0-mibsi.mongodb.net/test?retryWrites=true&w=majority", function (err, client) {
                    var db = client.db('BSTU');
                    db.collection('faculty', function (err, collection) {
                        collection.insert({ faculty: JSON.parse(data.toString()).faculty, faculty_name: JSON.parse(data.toString()).faculty_name }, function (err, doc) {
                        });
                        if (err) {
                            console.log('Error inserting item');
                            response.send('Error inserting item');
                        }
                    });
                    console.log('Document Updated Successfully');
                    response.end(request.body);
                });
            })
        }
    }
    else if (request.method == 'PUT') {
        if (url.parse(request.url).pathname === '/api/faculties') {
            request.on('data', (data) => {
                MongoClient.connect("mongodb+srv://Sergei:Iamafksorry3368@cluster0-mibsi.mongodb.net/test?retryWrites=true&w=majority", function (err, client) {
                    var db = client.db('BSTU');
                    db.collection('faculty', function (err, collection) {
                        collection.update({ faculty: JSON.parse(data.toString()).faculty }, { $set: { faculty_name: JSON.parse(data.toString()).faculty_name } },
                            function (err, result) {
                                if (err) {
                                    console.log('Error updating item');
                                    response.end('Error updating item');
                                }
                                console.log('Document Updated Successfully');

                            });
                        response.end(request.body);
                    });
                });
            });
        }
    }
    else if (request.method == 'DELETE') {
        if (url.parse(request.url).pathname.split('/').length === 4 && url.parse(request.url).pathname.split('/')[url.parse(request.url).pathname.split('/').length - 1]) {
            MongoClient.connect("mongodb+srv://Sergei:Iamafksorry3368@cluster0-mibsi.mongodb.net/test?retryWrites=true&w=majority", function (err, client) {
                const xyz = url.parse(request.url).pathname.split('/')[url.parse(request.url).pathname.split('/').length - 1];
                var db = client.db('BSTU');
                db.collection('faculty', function (err, collection) {
                    collection.findOneAndDelete({ faculty: xyz }, function (err, result) {
                        if (err || !result.value) {
                            console.log('Error deleting item');
                            response.send('Error deleting item');
                        }
                        console.log('Document Removed Successfully');
                        response.end(JSON.stringify(result.value));
                    });
                });
            });
        }
    }
}).listen(5000);
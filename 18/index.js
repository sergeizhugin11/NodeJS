const http = require('http');
const url = require('url');
const fs = require('fs');
const facultiesHandler = require('./api/faculties/facultiesHandler.js');
const pulpitsHandler = require('./api/pulpits/pulpitsHandler.js');
const subjectsHandler = require('./api/subjects/subjectsHandler.js');
const auditoriumsHandler = require('./api/auditoriums/auditoriumsHandler.js');
const auditoriumTypesHandler = require('./api/auditorium-types/auditoriumTypesHandler.js');

http.createServer(function (request, response) {
    if (request.method == 'GET') {
	if(url.parse(request.url).pathname === '/'){
		response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8;'});
		response.end(fs.readFileSync(__dirname + '/public/index.html'));
	}
        if (url.parse(request.url).pathname === '/api/faculties') {
	    facultiesHandler.get(request, response);
        }
	else if(url.parse(request.url).pathname === '/api/pulpits')
	{
	    pulpitsHandler.get(request, response);
	}
	else if(url.parse(request.url).pathname === '/api/subjects')
	{
	    subjectsHandler.get(request, response);
	}	
	else if(url.parse(request.url).pathname === '/api/auditoriums')
	{
	    auditoriumsHandler.get(request, response);
	}	
	else if(url.parse(request.url).pathname === '/api/auditorium-types')
	{
	    auditoriumTypesHandler.get(request, response);
	}
    }
    else if (request.method == 'POST') {
	if (url.parse(request.url).pathname === '/api/faculties') {
	    facultiesHandler.post(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/pulpits') {
	    pulpitsHandler.post(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/subjects') {
	    subjectsHandler.post(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/auditoriums') {
	    auditoriumsHandler.post(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/auditorium-types') {
	    auditoriumTypesHandler.post(request, response);
        }
    } 
    else if (request.method == 'PUT') {
	if (url.parse(request.url).pathname === '/api/faculties') {
	    facultiesHandler.put(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/pulpits') {
	    pulpitsHandler.put(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/subjects') {
	    subjectsHandler.put(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/auditoriums') {
	    auditoriumsHandler.put(request, response);
        }
	else if (url.parse(request.url).pathname === '/api/auditorium-types') {
	    auditoriumTypesHandler.put(request, response);
        }
    }
    else if (request.method == 'DELETE') {
	if ((url.parse(request.url).pathname).includes('/api/faculties')) {
	    facultiesHandler.delete(request, response);
        }
	else if (url.parse(request.url).pathname.includes('/api/pulpits')) {
	    pulpitsHandler.delete(request, response);
        }
	else if (url.parse(request.url).pathname.includes('/api/subjects')) {
	    subjectsHandler.delete(request, response);
        }
	else if (url.parse(request.url).pathname.includes('/api/auditoriums')) {
	    auditoriumsHandler.delete(request, response);
        }
	else if (url.parse(request.url).pathname.includes('/api/auditorium-types')) {
	    auditoriumTypesHandler.delete(request, response);
        }
    }
}).listen(3000);

const db = require('./../../db/dbHandler.js').Pulpits;
const url = require('url');

module.exports = {
    get: (request, response) => {
        db.findAll()
            .then(pulpits => response.end(JSON.stringify(pulpits)))
            .catch(err => {
                response.statusCode = 400;
                response.end(JSON.stringify({error: err.toString()}));
            });
    },
    post: (request, response) => {
		let body = '';
		request.on('data', chunk => { body += chunk });
		request.on('end', () => {
        db.create(JSON.parse(body)).then(newPulpit => response.end(JSON.stringify(newPulpit)))
            .catch(err => {
                response.statusCode = 400;
                response.end(JSON.stringify({error: err.toString()}));
            });
		});
    },
    put: (request, response) => {
		let body = '';
		request.on('data', chunk => { body += chunk });
		request.on('end', () => {
        db.update(JSON.parse(body), {
            where: { pulpit: JSON.parse(body).pulpit }
        }).then(isUpdatedArray => {
            if (isUpdatedArray[0]) {
                response.end(JSON.stringify(JSON.parse(body)));
            } else {
                response.statusCode = 400;
                response.end(JSON.stringify({error: 'No such records have been found'}));
            }
        }).catch(err => {
            response.statusCode = 400;
            response.end(JSON.stringify({error: err.toString()}));
        });
		});
    },
    delete: (request, response) => {
        const deletedPulpit = { auditorium_type: url.parse(request.url).pathname.split('/')[url.parse(request.url).pathname.split('/').length - 1] };
        db.destroy({
            where: deletedPulpit
        }).then(isDeleted => {
            if (isDeleted) {
                response.end(JSON.stringify(deletedPulpit));
            } else {
                response.statusCode = 400;
                response.end(JSON.stringify({error: 'No such records have been found'}));
            }
        }).catch(err => {
            response.statusCode = 400;
            response.end(JSON.stringify({error: err.toString()}));
        });
    }
};

const db = require('./../../db/dbHandler.js').Auditoriums;
const url = require('url');

module.exports = {
    get: (request, response) => {
        db.findAll()
            .then(auditoriums => response.end(JSON.stringify(auditoriums)))
            .catch(err => {
               response.statusCode = 400;
               response.end(JSON.stringify({error: err.toString()}));
            });
    },
    post: (request, response) => {
		let body = '';
		request.on('data', chunk => { body += chunk });
		request.on('end', () => {
        db.create(JSON.parse(body)).then(newAuditorium => response.end(JSON.stringify(newAuditorium)))
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
            where: { auditorium: JSON.parse(body).auditorium }
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
        const deletedAuditorium = { auditorium: url.parse(request.url).pathname.split('/')[url.parse(request.url).pathname.split('/').length - 1] };
        db.destroy({
            where: deletedAuditorium
        }).then(isDeleted => {
            if (isDeleted) {
                response.end(JSON.stringify(deletedAuditorium));
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

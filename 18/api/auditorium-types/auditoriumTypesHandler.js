const db = require('./../../db/dbHandler.js').AuditoriumTypes;
const url = require('url');

module.exports = {
    get: (request, response) => {
        db.findAll()
            .then(auditoriumTypes => response.end(JSON.stringify(auditoriumTypes)))
            .catch(err => {
                response.statusCode = 400;
                response.end(JSON.stringify({error: err.toString()}));
            });
    },
    post: (request, response) => {
		let body = '';
		request.on('data', chunk => { body += chunk });
		request.on('end', () => {
        db.create(JSON.parse(body)).then(newAuditoriumType => response.end(JSON.stringify(newAuditoriumType)))
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
            where: { auditorium_type: JSON.parse(body).auditorium_type }
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
        const deletedAuditoriumType = { auditorium_type: url.parse(request.url).pathname.split('/')[url.parse(request.url).pathname.split('/').length - 1] };
        db.destroy({
            where: deletedAuditoriumType
        }).then(isDeleted => {
            if (isDeleted) {
                response.end(JSON.stringify(deletedAuditoriumType));
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

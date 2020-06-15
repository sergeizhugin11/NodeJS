const db = require('./../../db/dbHandler.js').Faculties;
const url = require('url');

module.exports = {
    get: (request, response) => {
        db.findAll()
            .then(faculties => response.end(JSON.stringify(faculties)))
            .catch(err => {
                response.statusCode = 400;
                response.end(JSON.stringify({error: err.toString()}));
            });
    },
    post: (request, response) => {
		let body = '';
		request.on('data', chunk => { body += chunk });
		request.on('end', () => {
        db.create(JSON.parse(body)).then(newFaculty => response.end(JSON.stringify(newFaculty)))
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
            where: { faculty: JSON.parse(body).faculty }
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
        const deletedFaculty = { faculty: url.parse(request.url).pathname.split('/')[url.parse(request.url).pathname.split('/').length - 1] };
        db.destroy({
            where: deletedFaculty
        }).then(isDeleted => {
            if (isDeleted) {
               response.end(JSON.stringify(deletedFaculty));
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

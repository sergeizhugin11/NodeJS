const db = require('./../../db/dbHandler.js').Subjects;
const url = require('url');

module.exports = {
    get: (request, response) => {
        db.findAll()
            .then(subjects => response.end(JSON.stringify(subjects)))
            .catch(err => {
                response.statusCode = 400;
                response.end(JSON.stringify({error: err.toString()}));
            });
    },
    post: (request, response) => {
		let body = '';
		request.on('data', chunk => { body += chunk });
		request.on('end', () => {
        db.create(JSON.parse(body)).then(newSubject => response.end(JSON.stringify(newSubject)))
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
            where: { subject: JSON.parse(body).subject }
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
        const deletedSubject = { subject: url.parse(request.url).pathname.split('/')[url.parse(request.url).pathname.split('/').length - 1] };
        db.destroy({
            where: deletedSubject
        }).then(isDeleted => {
            if (isDeleted) {
                response.end(JSON.stringify(deletedSubject));
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

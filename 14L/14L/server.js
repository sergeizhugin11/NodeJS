const sql = require("mssql");
const express = require("express");
const app = express();
const jsonParser = express.json();
console.log("Server running on port 5000.");

const config = {
  user: "Sergey",
  password: "12345678",
    server: "DESKTOP-BK605PH",
  options: {
      encrypt: false,
      database: "node18"
  }
};

let connection = new sql.ConnectionPool(config).connect();
connection.catch(err => {
  console.log(err);
});

app.use(express.static(__dirname + "/"));

app.get("/", function(request, response) {
  response.sendFile('index.html');
});


app.get("/api/faculties", jsonParser, function(request, response) {
  connection
    .then(pool => {
        return pool.query(`use node18;select * from faculty`);
    })
    .then(result => {
      console.log(result.recordset);
      response.send(result.recordset);
    });
});

app.get("/api/pulpits", jsonParser, function(request, response) {
  connection
    .then(pool => {
        return pool.query(`use node18;select * from pulpit`);
    })
    .then(result => {
      console.log(result.recordset);
      response.send(result.recordset);
    });
});

app.get("/api/subjects", jsonParser, function(request, response) {
  connection
    .then(pool => {
        return pool.query(`use node18;select * from subject`);
    })
    .then(result => {
      console.log(result.recordset);
      response.send(result.recordset);
    });
});

app.get("/api/auditoriumstypes", jsonParser, function(request, response) {
  connection
    .then(pool => {
        return pool.query(`use node18;select * from auditorium_type`);
    })
    .then(result => {
      console.log(result.recordset);
      response.send(result.recordset);
    });
});

app.get("/api/auditorims", jsonParser, function(request, response) {
  connection
    .then(pool => {
        return pool.query(`use node18;select * from auditorium`);
    })
    .then(result => {
      console.log(result.recordset);
      response.send(result.recordset);
    });
});

app.post("/api/faculties", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;INSERT INTO faculty (faculty, faculty_name) VALUES ('${
          request.body.faculty
        }', '${request.body.faculty_name}');`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.post("/api/pulpits", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;INSERT INTO pulpit (pulpit, pulpit_name, faculty) VALUES ('${
          request.body.pulpit
        }', '${request.body.pulpit_name}', '${request.body.faculty}');`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.post("/api/subjects", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;INSERT INTO subject (subject, subject_name, pulpit) VALUES ('${
          request.body.subject
        }', '${request.body.subject_name}', '${request.body.pulpit}');`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.post("/api/auditoriumstypes", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;INSERT INTO auditorium_type (auditorium_type, auditorium_typename) VALUES ('${
          request.body.auditorium_type
        }', '${request.body.auditorium_typename}');`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.post("/api/auditoriums", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;INSERT INTO auditorium (auditorium, auditorium_type, auditorium_capacity, auditorium_name) VALUES ('${
          request.body.auditorium
        }', '${request.body.auditorium_type}', '${
          request.body.auditorium_capacity
        }', '${request.body.auditorium_name}');`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.put("/api/faculties", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;UPDATE faculty SET faculty_name='${request.body.faculty_name}'
     WHERE faculty = '${request.body.faculty}';`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.put("/api/pulpits", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;UPDATE pulpit SET pulpit_name='${request.body.pulpit_name}'
     WHERE pulpit = '${request.body.pulpit}';`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.put("/api/subjects", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;UPDATE subject SET subject_name='${request.body.subject_name}'
     WHERE subject = '${request.body.subject}';`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.put("/api/auditoriumstypes", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;UPDATE auditorium_type SET auditorium_typename='${
          request.body.auditorium_typename
        }'
     WHERE auditorium_type = '${request.body.auditorium_type}';`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.put("/api/auditoriums", jsonParser, function(request, response) {
  connection
    .then(pool => {
      return pool.query(
        `use node18;UPDATE auditorium SET auditorium_capacity='${
          request.body.auditorium_capacity
        }'
     WHERE auditorium = '${request.body.auditorium}';`
      );
    })
    .then(result => {
      console.log(request.body);
      response.send(request.body);
    });
});

app.get(/x/, (req, res) => {
    res.setHeader('WWW-Authenticate', 'Basic Realm=Users');
    res.sendStatus(400);
})

app.delete("/api/faculties/:xyz", jsonParser, function(request, response) {
  const xyz = request.params["xyz"];
  connection
    .then(pool => {
      return pool.query(
        `use node18;DELETE FROM faculty
     WHERE faculty = '${xyz}';`
      );
    })
    .then(result => {
      console.log(xyz);
      response.send(xyz);
    });
});

app.delete("/api/pulpits/:xyz", jsonParser, function(request, response) {
  const xyz = request.params["xyz"];
  connection
    .then(pool => {
      return pool.query(
        `use node18;DELETE FROM pulpit
     WHERE pulpit = '${xyz}';`
      );
    })
    .then(result => {
      console.log(xyz);
      response.send(xyz);
    });
});

app.delete("/api/subjects/:xyz", jsonParser, function(request, response) {
  const xyz = request.params["xyz"];
  connection
    .then(pool => {
      return pool.query(
        `use node18;DELETE FROM subject
     WHERE subject = '${xyz}';`
      );
    })
    .then(result => {
      console.log(xyz);
      response.send(xyz);
    });
});

app.delete("/api/auditoriumstypes/:xyz", jsonParser, function(
  request,
  response
) {
  const xyz = request.params["xyz"];
  connection
    .then(pool => {
      return pool.query(
        `use node18;DELETE FROM auditorium_type
     WHERE auditorium_type = '${xyz}';`
      );
    })
    .then(result => {
      console.log(xyz);
      response.send(xyz);
    });
});

app.delete("/api/auditoriums/:xyz", jsonParser, function(request, response) {
  const xyz = request.params["xyz"];
  connection
    .then(pool => {
      return pool.query(
        `use node18;DELETE FROM auditorium
     WHERE auditorium = '${xyz}';`
      );
    })
    .then(result => {
      console.log(xyz);
      response.send(xyz);
    });
});

app.listen(process.env.PORT || 5000);

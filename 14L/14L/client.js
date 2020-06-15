(function() {
  document.getElementById("b1").addEventListener("click", () => {
      fetch("http://localhost:5000/api/pulpits", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    })
      .then(response => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
        } else {
          return response.json();
        }
      })
      .then(json => {
        console.log(JSON.stringify(json));
        document.getElementById("info").innerHTML = JSON.stringify(json);
      });
  });

  document.getElementById("b2").addEventListener("click", () => {
    fetch("/api/pulpits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: `{"pulpit":"krek", "pulpit_name": "keep e ppp","faculty": "kit" }`
    })
      .then(response => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
        } else {
          return response.json();
        }
      })
      .then(json => {
        console.log(JSON.stringify(json));
        document.getElementById("info").innerHTML = JSON.stringify(json);
      });
  });

  document.getElementById("b3").addEventListener("click", () => {
    fetch("/api/pulpits", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: `{"pulpit":"krek", "pulpit_name": "rerererep","faculty": "kit" }`
    })
      .then(response => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
        } else {
          return response.json();
        }
      })
      .then(json => {
        console.log(JSON.stringify(json));
        document.getElementById("info").innerHTML = JSON.stringify(json);
      });
  });

  document.getElementById("b4").addEventListener("click", () => {
    fetch("/api/pulpits/krek", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: `{"pulpit":"krek", "pulpit_name": "rerererep","faculty": "kit" }`
    })
      .then(response => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
        } else {
          return response.text();
        }
      })
      .then(json => {
        console.log(json);
        document.getElementById("info").innerHTML = json;
      });
  });
})();

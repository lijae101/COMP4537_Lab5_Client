document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("header").innerHTML = pageTitle;
    const queryBtn = document.getElementById("submitQuery");
    queryBtn.innerHTML = submitQuery;
    const insertBtn = document.getElementById("SubmitPredefined");
    insertBtn.innerHTML = sendPredetermined;

    //Send XML HTTP Post Request to insert predefined rows
    insertBtn.addEventListener("click", function() {

        //Change this later
        const url = "https://starfish-app-oym3l.ondigitalocean.app/insertPredefined";
        
        const patientData = [
            { name: "Sara Brown", dateofbirth: "1901-01-01" },
            { name: "John Smith", dateofbirth: "1941-01-01" },
            { name: "Jack Ma", dateofbirth: "1961-01-01" },
            { name: "Elon Musk", dateofbirth: "1999-01-01" }
        ];

    
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Predefined rows inserted successfully");
                console.log(xhr.responseText);
                document.getElementById("serverRes").innerHTML = xhr.responseText;
            } else {
                console.log("Error inserting predefined rows");
            }
        };

        xhr.send(JSON.stringify(patientData));

});

    //Send XML HTTP Post Request to submit query
    queryBtn.addEventListener("click", function() {
        

        const sqlQuery = document.getElementById("sqlQuery").value.trim();
        const resultDiv = document.getElementById("qResult");

        if(!sqlQuery) {
            resultDiv.innerHTML = "Please enter a query";
            return;
        }

        //Check if query is SELECT or INSERT
        const isSelect = sqlQuery.toUpperCase().startsWith("SELECT");
        const isInsert = sqlQuery.toUpperCase().startsWith("INSERT");

        if(!isSelect && !isInsert) {
            resultDiv.innerHTML = "Only SELECT and INSERT queries are supported";
            return;
        }

        const url = `https://starfish-app-oym3l.ondigitalocean.app/lab5/api/v1/sql?query=${encodeURIComponent(sqlQuery)}`;
        const xhr = new XMLHttpRequest();

        if(isSelect) {
            xhr.open("GET", url, true);
        } else if (isInsert) {
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if(isSelect)
                   resultDiv.innerHTML = "<table border='1'><tr>" + Object.keys(JSON.parse(xhr.responseText)[0]).map(key => "<th>" + key + "</th>").join("") + "</tr>" + JSON.parse(xhr.responseText).map(row => "<tr>" + Object.values(row).map(value => "<td>" + value + "</td>").join("") + "</tr>").join("") + "</table>";
                    else if(isInsert)
                    resultDiv.innerHTML = xhr.responseText;
                } else {
                    resultDiv.innerHTML = "<p>Query failed. Server error.</p>";
                }
            }
        };
        
        if (isSelect) {
            xhr.send();
        } else if (isInsert) {
            xhr.send(JSON.stringify({ query: sqlQuery }));
        }
    });
});


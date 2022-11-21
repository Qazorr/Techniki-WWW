const data_url = "http://sphinx.if.uj.edu.pl/techwww/data";
const slowdata_url = "http://sphinx.if.uj.edu.pl/techwww/slowdata";
const async = false

const http_slow = new XMLHttpRequest()
http_slow.open("GET", slowdata_url+'?delay=3', async)

http_slow.onload = function () {
    var data = JSON.parse(http_slow.responseText)
    survey = data["StackOverflow Developer Survey 2021"];
    editors = ['editors'];

    for (const [editor, version] of Object.entries(survey["editors"])) {
        editors.push(`${editor} ${version}`);
    }
    create_table('table', [editors])
};

http_slow.send()

const http = new XMLHttpRequest();
http.open("GET", data_url, async);

http.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(http.responseText)
    }
    survey = data["StackOverflow Developer Survey 2021"];
    databases = ['Databases'];
    frameworks = ['Web frameworks'];

    for (const [db, version] of Object.entries(survey["Databases"])) {
        databases.push(`${db} ${version}`);
    }
    for (const [framework, version] of Object.entries(survey["Web frameworks"])) {
        frameworks.push(`${framework} ${version}`);
    }
    create_table('table2', [databases, frameworks])
};

http.send();

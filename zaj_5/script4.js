const data_url = "http://sphinx.if.uj.edu.pl/techwww/data";
const slowdata_url = "http://sphinx.if.uj.edu.pl/techwww/slowdata";

fetch(slowdata_url+'?delay=2')
    .then((response) => response.json())
    .then((data) => {
        survey = data["StackOverflow Developer Survey 2021"];
        editors = ['editors'];

        for (const [editor, version] of Object.entries(survey["editors"])) {
            editors.push(`${editor} ${version}`);
        }
        create_table('table2', [editors])
    });

fetch(data_url)
    .then((response) => response.json())
    .then((data) => {
        survey = data["StackOverflow Developer Survey 2021"];
        editors = ['data'];
        databases = ['Databases'];
        frameworks = ['Web frameworks'];

        for (const [db, version] of Object.entries(survey["Databases"])) {
            databases.push(`${db} ${version}`);
        }
        for (const [framework, version] of Object.entries(survey["Web frameworks"])) {
            frameworks.push(`${framework} ${version}`);
        }
        create_table('table', [databases, frameworks])
    });

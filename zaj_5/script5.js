const data_url = "http://sphinx.if.uj.edu.pl/techwww/data";
const slowdata_url = "http://sphinx.if.uj.edu.pl/techwww/slowdata";

async function func() {
    let fetched_slow = await fetch(slowdata_url + '?delay=1')
    let data_slow = await fetched_slow.json()
    data_slow = data_slow["StackOverflow Developer Survey 2021"]
    
    let fetched = await fetch(data_url)
    let data = await fetched.json()
    data = data["StackOverflow Developer Survey 2021"]

    editors = ['editors'];
    for (const [editor, version] of Object.entries(data_slow["editors"])) {
        editors.push(`${editor} ${version}`);
    }
    
    databases = ['Databases'];
    frameworks = ['Web frameworks'];
    for (const [db, version] of Object.entries(data["Databases"])) {
        databases.push(`${db} ${version}`);
    }
    for (const [framework, version] of Object.entries(data["Web frameworks"])) {
        frameworks.push(`${framework} ${version}`);
    }

    create_table('table2', [editors])
    create_table('table', [databases, frameworks])
}

func()
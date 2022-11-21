function create_table(id, columns) {
    const table_div = document.getElementById(id)
    const table = document.createElement('table')
    let no_columns = 0
    for (const col of columns) {
        no_columns = Math.max(no_columns, col.length)
    }

    for (let i = 0; i < no_columns; i++) {
        let values = [];
        for (const col in columns) {
            if (Object.hasOwnProperty.call(columns, col)) {
                const element = columns[col][i];
                if (element) {
                    values.push(element)
                } else {
                    values.push("-")
                }
            }
        }

        let row = document.createElement("tr");

        for (let j = 0; j < columns.length; j++) {
            let data_child = document.createElement("td");
            if (i == 0) {
                data_child = document.createElement("th");
            }
            text = document.createTextNode(values[j]);
            data_child.appendChild(text);
            row.appendChild(data_child);
        }
        table.appendChild(row);
    }
    table_div.appendChild(table);
}
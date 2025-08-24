// testing using node.js
output = format_transpose("name\tage\n1\t3")
console.log(output)

function to_table(text, delimiter) {
  var table = []

  rows = text.split("\n")

  for(const row of rows) {
    table.push(row.split(delimiter))
  }

  return table
}

function max_length(table) {
  var lengths = []
  
  // init to length 0
  for(var j = 0; j < table[0].length; j++) {
    lengths.push(0)
  }

  // find max length per column
  for(var i = 0; i < table.length; i++) {
    for(var j = 0; j < table[i].length; j++) {
      if(table[i][j].length > lengths[j]) {
        lengths[j] = table[i][j].length
      }
    }
  }
  
  return lengths
}

function format_bq(input) {
  var output = ""

  table = to_table(input, "\t")
  lengths = max_length(table)

  // add padding to columns line up
  for(var i = 0; i < table.length; i++) {
    // add header separator
    if(i == 1) {
      for(var j = 0; j < table[i].length; j++) {
        output += "-".padEnd(lengths[j], "-") + "  "
      }

      output += "\n"
    }

    for(var j = 0; j < table[i].length; j++) {
      output += table[i][j].padEnd(lengths[j], " ") + "  "
    }
    output += "\n"
  } 
  
  return output
}

function format_code(input) {
  output = input.replace(/FROM\n\s*/g, 'FROM ')
  output = output.replace(/WHERE\n\s*/g, 'WHERE ')
  output = output.replace(/LIMIT\n\s*/g, 'LIMIT ')
  return output 
}

function alias(uri) {
  uri_elements = uri.split(".")
  table_name = uri_elements[uri_elements.length-1]
  table_name = table_name.replace("_bv", "").toLowerCase()

  words = table_name.split("_")
  words.reverse()

  var table_alias = ""
  if (words.length > 1) {
    table_alias = words[1].substring(0, 1) +  words[0].substring(0, 1)
  }
  else {
    table_alias = words[0].substring(0, 2)
  }

  return table_alias
}

function format_sql(input) {
  table_alias = alias(input)

  output = "SELECT\n  " + table_alias + ".*," +
           "\n  COUNT(1) AS cnt" +
           "\nFROM `" + input + "` AS " + table_alias  +
           "\nGROUP BY 1" +
           "\nORDER BY 1 DESC" +
           "\nLIMIT 5;"
  return output 
}

function format_lowercase(input) {
  return input.toLowerCase()
}

function format_uppercase(input) {
  return input.toUpperCase()
}

function format_json(input) {
  const columns = input.split(",")

  var obj_arr = new Array()
  for (const column of columns) {
    var obj = new Object()
    obj.name = column.trim()
    obj.type = "STRING"
    obj_arr.push(obj)
  }
  const json = JSON.stringify(obj_arr, undefined, 2)

  return json 
}

function format_list(input) {
  const values = input.replaceAll(",", "").split("\n")

  var output = "(\n"
  for (const value of values) {
    output += "  '" + value.trim() + "',\n"
  }
  output = output.slice(0, -2)
  output += "\n)"

  return output 
}

function format_transpose(input) {
  var output = ""

  // find delimiter
  if (input.indexOf("\t") != -1 ) {
    delimiter = "\t"
  }
  else {
    delimiter = ","
  }

  // CSV or TXT to table
  table = to_table(input, delimiter)

  // maximum length of column for padding
  max_col_length = 0
  for(var j = 0; j < table[0].length; j++) {
    if (table[0][j].length > max_col_length) {
      max_col_length = table[0][j].length
    }
  }

  // columns to rows 
  for(var j = 0; j < table[0].length; j++) {
    column_name = table[0][j] + ":"
    output += column_name.padEnd(max_col_length+2, " ") + table[1][j] + "\n"
  }
  
  return output
}

function format_sort(input) {
  return input.split("\n").sort().join("\n")
}

function format() {
  input = document.getElementById("input").value
  
  const radios = document.querySelectorAll('input[name="format"]');
  let action = ""
  for (const radio of radios) {
    if (radio.checked) {
      action = radio.value
      break;
    }
  }

  switch(action) {
    case "bq":
      output = format_bq(input)
      break;
    case "code":
      output = format_code(input)
      break;
    case "sql":
      output = format_sql(input)
      break;
    case "lowercase":
      output = format_lowercase(input)
      break;
    case "uppercase":
      output = format_uppercase(input)
      break;
    case "json":
      output = format_json(input)
      break;
    case "list":
      output = format_list(input)
      break;
    case "transpose":
      output = format_transpose(input)
      break;
    case "sort":
      output = format_sort(input)
      break;
  }

  document.getElementById("output").innerHTML = output 
}

function copy() {
  output = document.getElementById("output").value
  navigator.clipboard.writeText(output);
}

function copy_html() {
  output = document.getElementById("output").value
  output = output.replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;")

  var html = ""
  html += "<html><body>"
  html += "<p style = 'font-family:monospace;font-size:12px;'>"
  html += "<span style = 'color:#0a59ad;background:#ffffff;'>"
  html += output
  html += "</span>"
  html += "</p>"
  html += "</body></html>"
  
  var type = "text/html"
  var blob = new Blob([html], { type })
  var data = [new ClipboardItem({ [type]: blob })]
  navigator.clipboard.write(data)
}

function copy_markdown() {
  output = document.getElementById("output").value
  output = "```\n" + output + "```"
  navigator.clipboard.writeText(output);
}

import json

with open("iso_codes.js", "w+") as f:
    with open("languages.json") as l_json:
        l = json.load(l_json)
        with open("iso_codes.json") as iso_json:
            i = json.load(iso_json)
            for x in l:
                # print(l[x])
                for x2 in i:
                    if i[x2]["name"] == x:
                        found = i[x2]["639-1"]
                        f.write(l[x] + ': "' + found + '",\n')

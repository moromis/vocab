from os import getcwd, walk

filenames = next(walk(getcwd()), (None, None, []))[2]  # [] if no file
with open("languages.json", "w+") as js:
    out = "{\n"
    for f in filenames:
        if ".js" in f:
            language = f.replace("\n", "").replace(".js", "")
            out = out + '"' + language.capitalize() + '": ' + '"' + language + '",\n'
    out = out + "}"
    js.write(out)

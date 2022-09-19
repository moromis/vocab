from os import getcwd, walk

filenames = next(walk(getcwd()), (None, None, []))[2]  # [] if no file
with open("languages.js", "w+") as js:
    for f in filenames:
        if ".js" in f:
            out = ""
            language = f.replace("\n", "").replace(".js", "")
            out = out + language.capitalize() + ": " + '"' + language + '",\n'
            js.write(out)

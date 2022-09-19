import os
import sys
from os import listdir, mkdir
from os.path import isfile, join

path = sys.argv[1]

cwd = os.path.join(os.getcwd(), path)
newdir = os.path.join(os.getcwd(), path + "_js")
if not os.path.isdir(newdir):
    mkdir(newdir)
onlyfiles = [os.path.join(cwd, f) for f in os.listdir(cwd) if 
os.path.isfile(os.path.join(cwd, f)) and ".txt" in f]

for f in onlyfiles:
    out = "export default [\n"
    with open(f) as txt:
        for s in txt.readlines():
            out = out + '"' + s.replace("\n", "") + '",\n'
    out = out + "];"
    with open(f.replace("txt", "js").replace(cwd, newdir), "w+") as js:
        js.write(out)


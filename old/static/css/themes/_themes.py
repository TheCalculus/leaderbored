# monkeytype theme stealer
BASE = "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/themes/"

import json
import requests

content = {}

with open("_themeslist.json", "r") as f:
    file = f.read()
    content = json.loads(file)

for theme in content:
    name = theme["name"]
    r = requests.get(BASE + name + ".css", allow_redirects=False)
    open(name + ".css", "wb").write(r.content)
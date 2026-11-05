"""Crawl the SRMIST program finder: every programme plus real filter membership."""
import gzip, hashlib, os, html, json, re, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

OUT = sys.argv[1]
BASE = "https://www.srmist.edu.in/program-finder/"
AJAX = "https://www.srmist.edu.in/wp-admin/admin-ajax.php"
UA = {"User-Agent": "Mozilla/5.0 (SRM redesign prototype data import)", "Accept-Encoding": "gzip"}


CACHE = os.path.join(os.path.dirname(OUT), "cache")
os.makedirs(CACHE, exist_ok=True)


def get(url, data=None):
    key = os.path.join(CACHE, hashlib.sha1((url + repr(data)).encode()).hexdigest())
    if data is None and os.path.exists(key):
        return open(key, encoding="utf-8").read()
    text = fetch(url, data)
    if data is None:
        open(key, "w", encoding="utf-8").write(text)
    return text


def fetch(url, data=None):
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, data=data, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                raw = r.read()
                if r.headers.get("Content-Encoding") == "gzip":
                    raw = gzip.decompress(raw)
                return raw.decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 403 and data is not None:
                return "-1"
            time.sleep(2 + attempt * 3)
            last = e
        except Exception as e:  # noqa: BLE001
            time.sleep(2 + attempt * 3)
            last = e
    raise last


def clean(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", s))).strip()


def parse(page):
    found = re.search(r'"found_posts":(\d+)', page)
    items = []
    for art in re.findall(r'<article id="post-(\d+)"[\s\S]*?</article>', page):
        pass
    for m in re.finditer(r'<article id="post-(\d+)"([\s\S]*?)</article>', page):
        pid, body = m.groups()
        t = re.search(r'<h1 class="elementor-heading-title[^"]*"><a href="([^"]+)">([\s\S]*?)</a>', body)
        if not t:
            continue
        meta = {}
        mw = re.search(r'meta-wrapper">([\s\S]*?)</div>', body)
        if mw:
            for k, v in re.findall(r"([A-Za-z ]+?)\s*:\s*<span>([\s\S]*?)</span>", mw.group(1)):
                meta[clean(k)] = clean(v)
        items.append({"id": int(pid), "url": t.group(1), "name": clean(t.group(2)), **({"meta": meta} if meta else {})})
    return (int(found.group(1)) if found else 0), items


def crawl(params):
    """Return list of items for a filter (all pages)."""
    q = "jsf=epro-posts" + (("&" + params) if params else "")
    total, items = parse(get(f"{BASE}?{q}"))
    pages = (total + 5) // 6
    with ThreadPoolExecutor(6) as ex:
        for _, more in ex.map(lambda p: parse(get(f"{BASE}?{q}&pagenum={p}")), range(2, pages + 1)):
            items += more
    uniq = {i["id"]: i for i in items}
    if len(uniq) != total:
        print(f"  ! {params}: expected {total}, got {len(uniq)}", file=sys.stderr)
    return list(uniq.values())


first = get(BASE)
opts = lambda name: [  # noqa: E731
    (v, clean(l)) for v, l in re.findall(
        r'class="jet-checkboxes-list__input"[^>]*?name="' + re.escape(name) + r'"[^>]*?value="([^"]*)"[\s\S]{0,600}?jet-checkboxes-list__label">([^<]*)<', first)
]
sel = lambda sid: [  # noqa: E731
    (v, clean(l)) for v, l in re.findall(r'<option[^>]*value="([^"]+)"[^>]*>([^<]*)<',
                                          re.search(r'<select id="' + sid + r'">([\s\S]*?)</select>', first).group(1))
]
campus_sel = re.search(r'<select class="jet-select__control select-hidden">([\s\S]*?)</select>', first).group(1)
campuses = [(v, clean(l)) for v, l in re.findall(r'<option[^>]*value="([^"]+)"[^>]*>([^<]*)<', campus_sel)]
nonce = re.findall(r'ajax_display = \{[^}]*"nonce":"([^"]+)"', first)

data = {"source": BASE, "fetched": time.strftime("%Y-%m-%d"), "filters": {}}
print("all programmes…", file=sys.stderr)
programs = {p["id"]: p for p in crawl("")}

dims = {
    "level": ("program_level", opts("program_level")),
    "mode": ("mode_of_delievry", opts("mode_of_delievry")),
    "type": ("program-type", opts("program-type")),
    "college": ("college_lists", sel("hide_colleges_dropdown")),
    "department": ("department_lists", [(v, l) for v, l in sel("hide_department_dropdown") if l]),
}
for key, (var, options) in dims.items():
    data["filters"][key] = []
    for value, label in options:
        print(f"{key}={label}", file=sys.stderr)
        members = crawl(f"meta={var}:{urllib.parse.quote(value)}")
        for m in members:
            programs.setdefault(m["id"], m)
            programs[m["id"]].setdefault(key, []).append(value)
        data["filters"][key].append({"value": value, "label": label, "count": len(members)})


def ajax(action, field, value):
    for n in nonce:
        body = urllib.parse.urlencode({"action": action, f"selected{field}ID": value, f"selected{field}": value, "security": n}).encode()
        r = get(AJAX, body)
        if r.strip() != "-1":
            return json.loads(r)
    return {}


data["filters"]["campus"] = []
for value, label in campuses:
    cols = ajax("filter_pf_college_list", "Campus", value).get("college") or []
    data["filters"]["campus"].append({"value": value, "label": label, "colleges": [str(c["ID"]) for c in cols]})
for c in data["filters"]["college"]:
    deps = ajax("filter_pf_department_list", "College", c["value"]).get("department") or []
    c["departments"] = [str(d["ID"]) for d in deps]

data["programs"] = sorted(programs.values(), key=lambda p: p["name"].lower())
json.dump(data, open(OUT, "w"), indent=1, ensure_ascii=False)
print(f"done: {len(data['programs'])} programmes", file=sys.stderr)

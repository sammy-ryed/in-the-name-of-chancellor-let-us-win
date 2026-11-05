"""Shape the raw SRMIST crawl into the finder's data file."""
import json, re, sys

raw = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
F = raw["filters"]

# Leading degree token(s): abbreviations with dots, short all-caps words, or known words.
WORD = r"(?:[A-Z][A-Za-z]{0,5}\.(?:[A-Za-z]{1,6}\.?)*|[A-Z]{2,6}|Pharm\.?D|Ph\.?\s?D\.?|Integrated|Diploma|PG|Fellowship)"
LEAD = re.compile(rf"^((?:{WORD})(?:[\s\-–,]*(?:{WORD}))*)(?:\s*\((?:Hons?\.?|Honours)\))?", re.U)
CONNECT = re.compile(r"^(?:\s*[-–:,]\s*|\s+)?(?:\(?(?:Hons?\.?|Honours)\)?\s*)?(?:in|of|on|-|–|:)?\s+", re.I)


PHRASE = re.compile(r"^(Bachelor|Masters?|Minor Degree|Certificate Course|Postgraduate Diploma)\s+(?:of|in)\s+(.+)$")
TRAIL_ABBR = re.compile(r"\s*\(((?:[A-Z][A-Za-z]*\.){2,}[A-Za-z.]*|[A-Z]{2,6})\)$")
KEEP = {"Integrated", "Diploma", "PG", "Fellowship", "Minor", "Degree", "Certificate", "Course", "Bachelor", "Master", "Postgraduate", "CS", "–"}
TABLE = {"PhD": "Ph.D", "DM": "D.M", "MD": "M.D", "MCA": "M.C.A", "BBA": "B.B.A", "M.OT": "M.O.T", "MPH": "M.P.H", "MSW": "M.S.W", "Masters": "Master", "PSY.D": "Psy.D", "Psy": "Psy"}


def canon(c):
    if "," in c:
        return ", ".join(canon(x.strip()) for x in c.split(",") if x.strip())
    c = re.sub(r"\((?:Hons?\.?|Honours)\)", "(Hons.)", c)
    out = []
    for part in c.split():
        if part.startswith("(") or part in KEEP:
            out.append(part)
            continue
        part = TABLE.get(part.rstrip("."), part.rstrip("."))
        out.append(part + "." if "." in part else part)
    return " ".join(out).replace("M.S. – CS", "M.S. CS").replace("Psy D", "Psy.D.")


def split(name):
    name = re.sub(r"^([A-Z])\s*\.\s+(?=[A-Z][a-z]{1,4}\b)", r"\1.", name).replace("*", "").strip()
    subject, degree = split_raw(name)
    if degree:
        subject = re.sub(r"^w/s in\s+", "", subject)
        if "," not in degree:  # keep "Bachelor of Arts and Legum Baccalaureus" whole for dual degrees
            subject = re.sub(r"^(?:Bachelor|Masters?) (?:of|in)\s+", "", subject)
        return subject, canon(degree)
    return subject, None


def split_raw(name):
    ph = PHRASE.match(name)
    if ph:
        degree, rest = ph.group(1), ph.group(2)
        hons = re.search(r"\s*\((?:Hons?\.?|Honours)\)$", rest)
        if hons:
            rest, degree = rest[: hons.start()], f"{degree} (Hons.)"
        ab = TRAIL_ABBR.search(rest)
        if ab:
            rest, degree = rest[: ab.start()], ab.group(1)
        return rest, degree
    m = LEAD.match(name)
    if not m:
        return name, None
    degree = m.group(0).strip(" -–:")
    rest = name[m.end():]
    integ = re.match(r"\s*\((Integrated)\)", rest)
    if integ:
        degree, rest = f"{degree} (Integrated)", rest[integ.end():]
    rest = CONNECT.sub("", rest, count=1).strip(" -–:")
    hons = re.search(r"\s*\((Hons?\.?|Honours)\)$", rest)
    if hons:
        rest, degree = rest[: hons.start()], f"{degree} (Hons)"
    if rest.startswith("(") and rest.endswith(")"):
        rest = rest[1:-1]
    if len(rest) < 3 or not re.search(r"[a-z]", rest):
        return name, None
    return rest[0].upper() + rest[1:], degree


def duration(d):
    d = d.replace("*", "").strip()
    d = re.sub(r"\s*(?:-|–|to)\s*", "–", d) if re.match(r"^\d+\s*(?:-|–|to)\s*\d+", d) else d
    if re.fullmatch(r"[\d–.]+", d):
        d += " Years"
    d = re.sub(r"\byears?\b", lambda m: "Years", d, flags=re.I)
    d = re.sub(r"\bmonths?\b", "Months", d, flags=re.I)
    return re.sub(r"\b1 Years\b", "1 Year", d).replace("Year Internship", "Year internship").replace("Years internship", "Years internship")


labels = {k: {o["value"]: o["label"] for o in F[k]} for k in ("level", "mode", "type")}
programmes = []
for p in raw["programs"]:
    subject, degree = split(p["name"])
    level_names = [labels["level"][v] for v in p.get("level", [])]
    programmes.append({
        "id": p["id"],
        "name": p["name"],
        "subject": subject,
        "certification": degree or (", ".join(level_names) if level_names else "—"),
        "url": p["url"],
        **({"duration": duration(p["meta"]["Duration"])} if p.get("meta", {}).get("Duration") else {}),
        "level": p.get("level", []),
        "mode": p.get("mode", []),
        "type": p.get("type", []),
        "college": p.get("college", []),
        "department": p.get("department", []),
    })
programmes.sort(key=lambda p: (p["subject"].lower(), p["certification"].lower()))

opt = lambda k: [{"value": o["value"], "label": o["label"], "count": o["count"]} for o in F[k]]  # noqa: E731
used_depts = [o for o in F["department"] if o.get("count")]
# Disambiguate repeated department names using the college that lists them.
by_label = {}
for d in used_depts:
    by_label.setdefault(d["label"], []).append(d)
college_of = {}
for c in F["college"]:
    for d in c.get("departments", []):
        college_of.setdefault(d, c["label"])
departments = []
for d in used_depts:
    label = d["label"]
    if len(by_label[label]) > 1 and d["value"] in college_of:
        label = f"{label} ({college_of[d['value']]})"
    departments.append({"value": d["value"], "label": label})
departments.sort(key=lambda d: re.sub(r"^department of\s+", "", d["label"].lower()).strip())

# The source links Acharapakkam to two empty colleges; link colleges whose own name states a campus.
for campus in F["campus"]:
    place = campus["label"].split(",")[0].split(" - ")[0].strip()
    for c in F["college"]:
        if place and place in c["label"] and c["value"] not in campus["colleges"]:
            campus["colleges"].append(c["value"])

data = {
    "source": raw["source"],
    "fetched": raw["fetched"],
    "levels": opt("level"),
    "modes": opt("mode"),
    "types": opt("type"),
    "campuses": [{"value": c["value"], "label": c["label"], "colleges": c["colleges"]} for c in F["campus"] if c["colleges"]],
    "colleges": [{"value": c["value"], "label": c["label"], "departments": c.get("departments", [])} for c in F["college"] if c.get("count")],
    "departments": departments,
    "programmes": programmes,
}
json.dump(data, open(out_path, "w"), ensure_ascii=False, separators=(",", ":"))
unsplit = [p["name"] for p in programmes if p["subject"] == p["name"]]
print(f"{len(programmes)} programmes, {len(unsplit)} without a parsed degree", file=sys.stderr)
for n in unsplit[:40]:
    print("  ", n, file=sys.stderr)

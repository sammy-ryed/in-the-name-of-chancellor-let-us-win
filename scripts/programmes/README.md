# Program Finder data

`src/features/programmes/finder/programmes.json` is a snapshot of
https://www.srmist.edu.in/program-finder/. To refresh it:

```sh
python3 scripts/programmes/crawl.py /tmp/srm/raw.json      # ~10 min; caches pages in /tmp/srm/cache
python3 scripts/programmes/build_data.py /tmp/srm/raw.json src/features/programmes/finder/programmes.json
```

`crawl.py` reads every programme, then re-queries the site once per filter value
(level, delivery mode, full/part time, college, department) to record real
membership, and fetches the site's campus → college → department cascades.
`build_data.py` splits titles into subject and degree, normalises degree and
duration spellings, and links a college to a campus when the college's own
name states the campus (the source leaves Acharapakkam's populated college unlinked).

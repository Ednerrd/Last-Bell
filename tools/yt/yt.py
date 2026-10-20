#!/usr/bin/env python3
"""YouTube clips for research: search titles, pull auto-captions as plain text.
  python3 tools/yt/yt.py search "Usyk vs Dubois breakdown" [n]
  python3 tools/yt/yt.py get VIDEO_ID [VIDEO_ID ...]
Text lands in tools/yt/raw/<id>.txt (gitignored: raw transcripts are never committed,
notes go in research/ in our own words). Installs yt-dlp on first run (the container resets)."""
import os, re, subprocess, sys

RAW = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'raw')

def ytdlp(*a):
    try:
        return subprocess.run(['yt-dlp', *a], capture_output=True, text=True)
    except FileNotFoundError:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'yt-dlp'], check=True)
        return subprocess.run(['yt-dlp', *a], capture_output=True, text=True)

def search(q, n=8):
    r = ytdlp('--flat-playlist', '--print', '%(id)s | %(duration_string)s | %(channel)s | %(title)s', f'ytsearch{n}:{q}')
    print(r.stdout.strip() or r.stderr.strip()[-400:])

def clean(vtt):
    out, last = [], None
    for ln in vtt.splitlines():
        if not ln.strip() or '-->' in ln or ln.startswith(('WEBVTT', 'Kind:', 'Language:')):
            continue
        ln = re.sub(r'<[^>]+>', '', ln).strip()
        if ln and ln != last:
            out.append(ln)
            last = ln
    return ' '.join(out)

def get(vid):
    os.makedirs(RAW, exist_ok=True)
    base = os.path.join(RAW, vid)
    r = ytdlp('--skip-download', '--write-subs', '--write-auto-subs', '--sub-langs', 'en.*,en',
              '--sub-format', 'vtt', '--print', 'before_dl:%(channel)s | %(title)s',
              '-o', base, f'https://www.youtube.com/watch?v={vid}')
    vtts = sorted(f for f in os.listdir(RAW) if f.startswith(vid + '.') and f.endswith('.vtt'))
    if not vtts:
        print(f'{vid}: no captions', r.stderr.strip()[-300:]); return
    head = r.stdout.strip().splitlines()[0] if r.stdout.strip() else vid
    txt = clean(open(os.path.join(RAW, vtts[0]), encoding='utf-8').read())
    for f in vtts: os.remove(os.path.join(RAW, f))
    open(base + '.txt', 'w', encoding='utf-8').write(f'# {head}\n# https://youtu.be/{vid}\n\n{txt}\n')
    print(f'{vid}: {len(txt.split())} words -> {base}.txt  ({head})')

if __name__ == '__main__':
    if len(sys.argv) < 3: print(__doc__); sys.exit(1)
    if sys.argv[1] == 'search': search(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 8)
    else: [get(v) for v in sys.argv[2:]]

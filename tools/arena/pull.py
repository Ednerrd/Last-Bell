"""Pull captions for The Arena's Shorts (ids in shorts.txt) into raw/.

Run on a home connection (YouTube blocks cloud IPs):
    pip install youtube-transcript-api
    python tools/arena/pull.py
Resumable: skips ids already in raw/. raw/ is gitignored (their content, not ours);
only our own notes go in research/.
"""
import os, sys, time, random
from youtube_transcript_api import YouTubeTranscriptApi

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, 'raw')
os.makedirs(RAW, exist_ok=True)
api = YouTubeTranscriptApi()

rows = [l.rstrip('\n').split(' ', 1) for l in open(os.path.join(HERE, 'shorts.txt'), encoding='utf-8') if l.strip()]
got = miss = skip = 0
for i, (vid, title) in enumerate(rows, 1):
    out = os.path.join(RAW, vid + '.txt')
    if os.path.exists(out):
        skip += 1
        continue
    try:
        t = api.fetch(vid, languages=['en', 'en-US', 'es'])
        text = ' '.join(s.text.replace('\n', ' ') for s in t.snippets)
    except Exception as e:
        name = type(e).__name__
        if 'Block' in name or 'TooMany' in name:
            sys.exit(f'Blocked by YouTube at {i}/{len(rows)} ({name}). Wait an hour, rerun; it resumes.')
        text = f'[no captions: {name}]'
        miss += 1
    else:
        got += 1
    with open(out, 'w', encoding='utf-8') as f:
        f.write(f'{title}\nhttps://www.youtube.com/shorts/{vid}\n\n{text}\n')
    print(f'{i}/{len(rows)} {vid} {"ok" if text[0] != "[" else "none"}')
    time.sleep(random.uniform(2, 4))  # be polite, avoid the bot wall

print(f'done: {got} pulled, {miss} without captions, {skip} already had')

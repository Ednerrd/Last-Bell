# Measuring tools

Python + Playwright, chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Point `OUTDIR` at a scratch folder that holds the html under test. Run one or two browsers at a time (more lowers fps and inflates spikes).

| Tool | Use |
|---|---|
| `mkrec.py SRC DST ANCHOR` | Copy SRC with a per-frame recorder hook after the line containing ANCHOR (`"carry(v, J[i], AR[i], dt));"`). |
| `rec.py` | Env `SECS`, `HTML`, `OUT`, `OUTDIR`. Records a live fight at 1x. |
| `ana2.py rec.json` | Spikes per minute by cause, plus the 20 worst frames. |
| `spk.py a.json b.json …` | Spikes per minute and per 100 punches thrown. |
| `sheet.py` | Env `HTML`, `TAG`, `NF`, `WAIT`. Contact sheet of NF 60fps frames from a combo exchange: `contact_TAG.png`. |
| `hz.py HTML HZ` | Drives a fight to KO at a given refresh rate; checks erupt steps and replay frames. |
| `labtest.py` | Smoke test of `lab.html`: two stars, fight to the result, rematch. |
| `shot3d.py HTML THREE OUT` | Headless screenshot of the 3D proto (`npm i three@0.170.0` in scratch for THREE). |
| `perf3d.py` | Checks the 3D phone-test panel end to end. |

Ed can't send video easily. ffmpeg is installed: if he uploads a clip to `clips/`, split it into frames.

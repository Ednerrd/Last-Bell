#!/bin/bash
# The full check, on 4 cores, resumable: a container restart only loses the jobs in flight. Rerun the same line and it picks up where it stopped.
#   tests/check.sh TAG [parts]        parts: s (styles 2x300/pair) a (audit 3x500) l (levels sk 300, 4 pairs) f (finish 4x150) sp (specials 200/pair) g (guards 300)
#   default parts: s a l f            PATCH="..." and LB=file.html pass through to every job
#   tests/check.sh TAG report         print everything that's on disk for TAG
#   tests/check.sh TAG clean          delete TAG's results (start over)
# Results: /tmp/styles_TAG.txt, /tmp/styles_TAGsp.txt, /tmp/levels_TAG.txt, /tmp/finish_TAG.txt, /tmp/res_TAG.txt, /tmp/audit_TAG_k.txt
T=$1; shift; cd "$(dirname "$0")/.."
B="outboxer slugger swarmer counter boxerpuncher"
cnt() { cat "$1" 2>/dev/null | grep -c "$2"; }
if [ "$1" = clean ]; then rm -f /tmp/styles_$T.txt /tmp/styles_${T}sp.txt /tmp/levels_$T.txt /tmp/finish_$T.txt /tmp/res_$T.txt /tmp/audit_${T}_*.txt; exit; fi
if [ "$1" = report ]; then
  [ -f /tmp/styles_$T.txt ] && node tests/styles.js agg $T | head -6
  [ -f /tmp/styles_${T}sp.txt ] && { echo; echo "specials vs base:"; node tests/styles.js agg ${T}sp | head -15; }
  [ -f /tmp/res_$T.txt ] && { echo; echo "guards vs standard:"; node tests/agg.js $T; }
  [ -f /tmp/levels_$T.txt ] && { echo; node tests/levels.js agg $T | sed -n 2,7p; }
  [ -f /tmp/finish_$T.txt ] && { echo; node tests/finish.js agg $T | head -2; }
  ls /tmp/audit_${T}_*.txt >/dev/null 2>&1 && { echo; for f in /tmp/audit_${T}_*.txt; do echo "$(grep -m1 '^per fighter' $f | awk '{print $6,$8,$10}') $(grep -m1 '^KDs per fight' $f | awk '{print $7}')"; done | tr -d '%' | awk '{t+=$1;l+=$2;c+=$3;s+=$4;n++} END{printf "audit %dx500: thrown %.1f landed %.1f connect %.1f%% stops %.1f%%\n",n,t/n,l/n,c/n,s/n}'; }
  exit
fi
P=${*:-s a l f}; J=$(mktemp); trap 'rm -f $J' EXIT
for p in $P; do case $p in
 s) for a in $B; do for b in $B; do [[ "$a" < "$b" ]] || continue; k=$(cnt /tmp/styles_$T.txt "\"a\":\"$a\",\"b\":\"$b\""); while [ $k -lt 2 ]; do echo "TAG=$T node tests/styles.js 300 82 $a-$b" >> $J; k=$((k+1)); done; done; done;;
 a) for k in 1 2 3; do [ -s /tmp/audit_${T}_$k.txt ] || echo "node tests/audit.js 500 > /tmp/audit_${T}_$k.tmp && mv /tmp/audit_${T}_$k.tmp /tmp/audit_${T}_$k.txt" >> $J; done;;
 l) for pr in IvN PvI WvP PvN; do [ "$(cnt /tmp/levels_$T.txt "\"$pr\"")" = 0 ] && echo "PR=$pr TAG=$T node tests/levels.js 300 sk" >> $J; done;;
 f) k=$(cnt /tmp/finish_$T.txt .); while [ $k -lt 4 ]; do echo "TAG=$T node tests/finish.js 150" >> $J; k=$((k+1)); done;;
 sp) for sp in volume angle awkward switch body pboxer spoiler jabgrab feinter; do for b in $B; do [ "$(cnt /tmp/styles_${T}sp.txt "\"a\":\"$sp\",\"b\":\"$b\"")" = 0 ] && echo "TAG=${T}sp node tests/styles.js 200 82 $sp-$b" >> $J; done; done;;
 g) for g in high peekaboo philly cross handslow; do [ "$(cnt /tmp/res_$T.txt "\"g\":\"$g\"")" = 0 ] && echo "node tests/bal2.js 300 82 $g $T" >> $J; done;;
esac; done
echo "check $T: $(wc -l < $J) jobs to run"
tr '\n' '\0' < $J | xargs -0 -P 4 -I{} bash -c "{} >/dev/null 2>&1 || echo 'FAILED: {}'"
echo "check $T: done. tests/check.sh $T report"

import json,math,collections,sys
R=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'rec.json')); n=len(R)
mins=(R[-1]['now']-R[0]['now'])/60000
TH={'hip':4,'head':6,'gN':9,'gF':9}
def cause(i,k):
    a,b=R[i-1]['f'][k],R[i]['f'][k]; c=R[i+1]['f'][k]
    out=[]
    for x,y in ((a,b),(b,c)):
        hit=(x['hitT'] or 0)>.15
        if x['aT'] and y['aT'] and (x['aT']!=y['aT'] or y['aP']<x['aP']-.05): out.append('combo chain at aP>=.8 (pose+lunge reset)')
        elif x['aT'] and not y['aT']: out.append('punch cancelled/ended at aP %.1f'%x['aP'] if x['aP']<.9 else 'punch end')
        elif y['aT'] and not x['aT']: out.append('punch start'+(' (from def %s)'%x['def'] if x['def'] else ''))
        if (y['hitT'] or 0)>(x['hitT'] or 0)+.05: out.append('hit reaction start (%s)'%y['hitKind'])
        if x['def']!=y['def']: out.append(('def change while hitT>.15 (no smoothing)' if hit else 'def change %s->%s'%(x['def'],y['def'])))
        if x['st']!=y['st'] and not out: out.append('state %s->%s'%(x['st'],y['st']))
        if y['aT']=='uppercut' and x['aP']<.4<=y['aP']: out.append('uppercut hip/lean discontinuity at aP .4')
        if y['aT'] and PUN.get(y['aT'])=='jab' and x['aP']<.2<=y['aP']: out.append('jab extension start (by design)')
        if y['aT'] and PUN.get(y['aT'])!='jab' and x['aP']<.35<=y['aP']: out.append('punch extension start (by design)')
        if y['aT'] and x['aP']<.6<=y['aP']: out.append('punch contact/retract turn (by design)')
    if out: return out
    for x,y in ((a,b),(b,c)):
        if abs(y['push']-x['push'])>1.5: out.append('bodyPush')
        if abs(y['lunge']-x['lunge'])>1.5: out.append('lunge')
        if abs(y['settle']-x['settle'])>3: out.append('settle')
    if out: return out
    if R[i]['steps']!=1: return ['tick aliasing (%d steps this frame)'%R[i]['steps']]
    if b['aT']: return ['in-punch curve aP %.2f'%b['aP']]
    return ['other (idle anim/footwork)']
PUN={'jab':'jab','bodyJab':'jab'}
tot=collections.Counter(); by=collections.defaultdict(collections.Counter); worst=[]
for i in range(2,n-1):
  for k in (0,1):
    seen=set()
    for pt in TH:
      p0,p1,p2=R[i-1]['f'][k][pt],R[i]['f'][k][pt],R[i+1]['f'][k][pt]
      d2=math.hypot(p2['x']-2*p1['x']+p0['x'],p2['y']-2*p1['y']+p0['y'])
      if d2>TH[pt]:
        tot[pt]+=1; cs=cause(i,k); key=cs[0].split(' (')[0] if 'at aP' not in cs[0] else cs[0]
        by[pt][cs[0] if 'design' in cs[0] or 'chain' in cs[0] or 'hitT' in cs[0] else key]+=1; worst.append((d2,i,k,pt,cs))
print('thresholds (world units / frame^2):',TH)
print('spikes/min:',{p:round(tot[p]/mins,1) for p in TH})
for pt in TH: print(' ',pt+':',', '.join('%s %.0f'%(c,v/mins) for c,v in by[pt].most_common(10)))
worst.sort(reverse=True)
print('worst 20:')
for d2,i,k,pt,cs in worst[:20]: print('  %5.1f f%-5d F%d %-4s %s'%(d2,i,k,pt,'; '.join(cs)))

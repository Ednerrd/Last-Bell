import json,sys,math
for fn in sys.argv[1:]:
    R=json.load(open(fn)); mins=(R[-1]['now']-R[0]['now'])/60000
    TH={'hip':4,'head':6,'gN':9,'gF':9}; c={k:0 for k in TH}; thr=0; hitsp=0
    for e in R:
        for ev in e['ev']:
            if ev['type']=='throw': thr+=1
    for i in range(2,len(R)):
        for k in (0,1):
            for p in TH:
                a,b,cc=R[i-2]['f'][k][p],R[i-1]['f'][k][p],R[i]['f'][k][p]
                ax=(cc['x']-2*b['x']+a['x']); ay=(cc['y']-2*b['y']+a['y'])
                if math.hypot(ax,ay)>TH[p]:
                    c[p]+=1
    print(fn, 'thrown/min %.0f'%(thr/mins), {p:round(c[p]/mins) for p in c}, 'per100thrown', {p:round(100*c[p]/max(1,thr)) for p in c})

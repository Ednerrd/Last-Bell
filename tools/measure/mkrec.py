import sys
src,dst,anchor=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(src).read()
line="    if (window.__rec) window.__rec({ dt, f: f.map((v, i) => ({ x: v.x, z: v.z, dir: v.dir, st: v.state, aT: v.aT, aP: v.aP, def: v.def, defP: v.defP, hitT: v.hitT, hitKind: v.hitKind, mv: v.mv, feint: v.feint, ctr: v.ctr, lunge: 0, push: 0, settle: 0, hip: toWorld(v, J[i].hip), head: toWorld(v, J[i].head), gN: toWorld(v, AR[i].gN), gF: toWorld(v, AR[i].gF), footF: toWorld(v, J[i].footF) })) });\n"
i=s.index(anchor); j=s.index('\n',i)+1
s=s[:j]+line+s[j:]
open(dst,'w').write(s)

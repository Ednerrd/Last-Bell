// The fight recording made by tools/unity/record.js (format v1, see HANDOFF_ANTIGRAVITY.md).
// The JS engine is the truth: this only reads what it did.
using System.Collections.Generic;

namespace LastBell
{
    public struct BoxerFrame
    {
        public float x, z, yaw;
        public string state;     // idle, move, punch, clinch, stun, slump, down
        public int punch;        // index into FightData.punches, -1 = none
        public float punchP;     // 0..1 through the punch, the hand lands ~.6
        public bool feint;
        public float hitT;       // 1 -> 0 after he gets hit
        public string hitZone;   // head / body
        public float hitPow;
        public float downP;      // 0..1 going down
        public bool rise, sit;
        public float tired;      // 0 fresh .. 1 gassed
        public string def;       // block roll slip duck pull parry, "" = none
        public float defP;
        public float dmg, cut, swL, swR;
        public bool hurt;
    }

    public struct Frame
    {
        public float t, clock;
        public int round;
        public bool live, clinch;
        public BoxerFrame red, blue;
        public BoxerFrame Get(int side) { return side == 0 ? red : blue; }
    }

    public class PunchInfo { public string id, name, kind, zone, arm; public float dur; }
    public class FighterInfo { public string name, style, guard, stance; public float reach; }

    public class FightEvent
    {
        public string type;
        public int frame;
        public Dictionary<string, object> raw;
        public int Int(string k, int d = -1) { object o; return raw.TryGetValue(k, out o) && o != null ? MiniJson.I(o) : d; }
        public string Str(string k) { object o; return raw.TryGetValue(k, out o) ? MiniJson.S(o) : ""; }
        public bool Bool(string k) { object o; return raw.TryGetValue(k, out o) && o is bool && (bool)o; }
    }

    public class FightData
    {
        public int seed;
        public float dt;
        public float ringX, ringZ;
        public FighterInfo[] fighters;
        public PunchInfo[] punches;
        public Frame[] frames;
        public List<FightEvent> events = new List<FightEvent>();
        public Dictionary<string, object> result;

        public static FightData Parse(string json)
        {
            var root = (Dictionary<string, object>)MiniJson.Parse(json);
            var d = new FightData();
            d.seed = MiniJson.I(root["seed"]);
            d.dt = MiniJson.F(root["dt"]);
            var ring = (Dictionary<string, object>)root["ring"];
            d.ringX = MiniJson.F(ring["x"]); d.ringZ = MiniJson.F(ring["z"]);

            var fl = (List<object>)root["fighters"];
            d.fighters = new FighterInfo[fl.Count];
            for (int i = 0; i < fl.Count; i++)
            {
                var o = (Dictionary<string, object>)fl[i];
                d.fighters[i] = new FighterInfo { name = MiniJson.S(o["name"]), style = MiniJson.S(o["style"]), guard = MiniJson.S(o["guard"]), stance = MiniJson.S(o["stance"]), reach = MiniJson.F(o["reach"]) };
            }

            var pl = (List<object>)root["punches"];
            d.punches = new PunchInfo[pl.Count];
            for (int i = 0; i < pl.Count; i++)
            {
                var o = (Dictionary<string, object>)pl[i];
                d.punches[i] = new PunchInfo { id = MiniJson.S(o["id"]), name = MiniJson.S(o["name"]), kind = MiniJson.S(o["kind"]), zone = MiniJson.S(o["zone"]), arm = MiniJson.S(o["arm"]), dur = MiniJson.F(o["dur"]) };
            }

            var states = (List<object>)root["states"];
            // columns by name, so new columns in the recorder don't break this
            var fk = Index((List<object>)root["fighterKeys"]);
            var rk = Index((List<object>)root["frameKeys"]);

            var frs = (List<object>)root["frames"];
            d.frames = new Frame[frs.Count];
            for (int i = 0; i < frs.Count; i++)
            {
                var a = (List<object>)frs[i];
                var f = new Frame();
                f.t = MiniJson.F(a[rk["t"]]);
                f.round = MiniJson.I(a[rk["round"]]);
                f.live = MiniJson.B(a[rk["live"]]);
                f.clinch = MiniJson.B(a[rk["clinch"]]);
                f.clock = rk.ContainsKey("clock") && rk["clock"] < a.Count ? MiniJson.F(a[rk["clock"]]) : 0f;
                f.red = Boxer((List<object>)a[rk["red"]], fk, states);
                f.blue = Boxer((List<object>)a[rk["blue"]], fk, states);
                d.frames[i] = f;
            }

            foreach (var e in (List<object>)root["events"])
            {
                var o = (Dictionary<string, object>)e;
                d.events.Add(new FightEvent { type = MiniJson.S(o["type"]), frame = MiniJson.I(o["i"]), raw = o });
            }
            d.result = root["result"] as Dictionary<string, object>;
            return d;
        }

        static Dictionary<string, int> Index(List<object> keys)
        {
            var m = new Dictionary<string, int>();
            for (int i = 0; i < keys.Count; i++) m[MiniJson.S(keys[i])] = i;
            return m;
        }

        static BoxerFrame Boxer(List<object> a, Dictionary<string, int> k, List<object> states)
        {
            System.Func<string, object> g = n => { int j; return k.TryGetValue(n, out j) && j < a.Count ? a[j] : null; };
            var b = new BoxerFrame();
            b.x = MiniJson.F(g("x")); b.z = MiniJson.F(g("z")); b.yaw = MiniJson.F(g("yaw"));
            int st = MiniJson.I(g("state"));
            b.state = st >= 0 && st < states.Count ? MiniJson.S(states[st]) : "idle";
            b.punch = g("punch") == null ? -1 : MiniJson.I(g("punch"));
            b.punchP = MiniJson.F(g("punchP"));
            b.feint = MiniJson.B(g("feint"));
            b.hitT = MiniJson.F(g("hitT"));
            b.hitZone = MiniJson.S(g("hitZone"));
            b.hitPow = MiniJson.F(g("hitPow"));
            b.downP = MiniJson.F(g("downP"));
            b.rise = MiniJson.B(g("rise"));
            b.sit = MiniJson.B(g("sit"));
            b.tired = MiniJson.F(g("tired"));
            b.def = MiniJson.S(g("def"));
            b.defP = MiniJson.F(g("defP"));
            b.dmg = MiniJson.F(g("dmg"));
            b.cut = MiniJson.F(g("cut"));
            b.swL = MiniJson.F(g("swL"));
            b.swR = MiniJson.F(g("swR"));
            b.hurt = MiniJson.B(g("hurt"));
            return b;
        }

        public string ResultText()
        {
            if (result == null) return "";
            object w; result.TryGetValue("winner", out w);
            string method = result.ContainsKey("method") ? MiniJson.S(result["method"]) : "";
            int rd = result.ContainsKey("round") ? MiniJson.I(result["round"]) : 0;
            string time = result.ContainsKey("time") ? MiniJson.S(result["time"]) : "";
            if (w == null) return "DRAW (" + method + ")";
            var f = fighters[MiniJson.I(w)];
            return f.name.ToUpper() + " WINS by " + method + ", round " + rd + " " + time;
        }
    }
}

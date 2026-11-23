// Plays back a recorded Last Bell fight (Resources/fight.json, made by tools/unity/record.js).
// Press Play in any scene: it builds the ring, the two boxers, the camera and the HUD by itself.
using System.Collections.Generic;
using UnityEngine;

namespace LastBell
{
    public class FightPlayer : MonoBehaviour
    {
        public const float S = 0.021f;      // meters per engine unit: the ring comes out ~6 m across
        public string resource = "fight";   // Resources/<name>.json
        public float speed = 1f;
        public bool paused;

        FightData F;
        BoxerRig[] rigs = new BoxerRig[2];
        Camera cam;
        float cursor;          // frame index, fractional
        int nextEvent;
        float slowT;           // slow motion after a knockdown
        readonly List<KeyValuePair<string, float>> ticker = new List<KeyValuePair<string, float>>();
        readonly List<KeyValuePair<Transform, float>> sparks = new List<KeyValuePair<Transform, float>>();
        int[] landed = new int[2], thrown = new int[2], kds = new int[2];
        string error;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Boot()
        {
#if UNITY_2023_1_OR_NEWER
            if (Object.FindFirstObjectByType<FightPlayer>() != null) return;
#else
            if (Object.FindObjectOfType<FightPlayer>() != null) return;
#endif
            new GameObject("Last Bell").AddComponent<FightPlayer>();
        }

        void Start()
        {
            Application.targetFrameRate = 60;
            var ta = Resources.Load<TextAsset>(resource);
            if (ta == null) { error = "No Resources/" + resource + ".json. Run: node tools/unity/record.js"; return; }
            try { F = FightData.Parse(ta.text); }
            catch (System.Exception e) { error = "Couldn't read the fight: " + e.Message; return; }
            BuildRing();
            rigs[0] = BoxerRig.Build(0, F.fighters[0], new Color(0.85f, 0.12f, 0.12f));
            rigs[1] = BoxerRig.Build(1, F.fighters[1], new Color(0.12f, 0.3f, 0.9f));
            SetupCamera();
        }

        // engine (x, z) -> Unity. +z in the engine is nearer the 2D camera, so z flips: the camera sits at -z.
        public static Vector3 W(float x, float z) { return new Vector3(x * S, 0, -z * S); }
        // engine yaw (atan2(dz, dx)) -> Unity heading in degrees, with the z flip
        public static float Yaw(float yaw) { return 90f + yaw * Mathf.Rad2Deg; }

        void BuildRing()
        {
            float hx = F.ringX * S, hz = F.ringZ * S;
            Box("floor", new Vector3(0, -0.6f, 0), new Vector3(40, 0.1f, 40), new Color(0.07f, 0.07f, 0.09f));
            Box("apron", new Vector3(0, -0.3f, 0), new Vector3(2 * hx + 1.6f, 0.6f, 2 * hz + 1.6f), new Color(0.12f, 0.12f, 0.16f));
            Box("canvas", new Vector3(0, -0.05f, 0), new Vector3(2 * hx + 1.2f, 0.1f, 2 * hz + 1.2f), new Color(0.82f, 0.82f, 0.78f));
            float px = hx + 0.45f, pz = hz + 0.45f;
            var corners = new[] { new Vector2(-px, -pz), new Vector2(px, -pz), new Vector2(px, pz), new Vector2(-px, pz) };
            var cc = new[] { new Color(0.8f, 0.1f, 0.1f), Color.white, new Color(0.1f, 0.25f, 0.85f), Color.white };
            for (int i = 0; i < 4; i++)
            {
                var p = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                Object.Destroy(p.GetComponent<Collider>());
                p.name = "post"; p.transform.position = new Vector3(corners[i].x, 0.7f, corners[i].y);
                p.transform.localScale = new Vector3(0.1f, 0.7f, 0.1f);
                p.GetComponent<Renderer>().material.color = cc[i];
            }
            var rope = new Color(0.9f, 0.9f, 0.9f);
            foreach (float y in new[] { 0.45f, 0.85f, 1.25f })
            {
                Box("rope", new Vector3(0, y, -pz), new Vector3(2 * px, 0.035f, 0.035f), rope);
                Box("rope", new Vector3(0, y, pz), new Vector3(2 * px, 0.035f, 0.035f), rope);
                Box("rope", new Vector3(-px, y, 0), new Vector3(0.035f, 0.035f, 2 * pz), rope);
                Box("rope", new Vector3(px, y, 0), new Vector3(0.035f, 0.035f, 2 * pz), rope);
            }
#if UNITY_2023_1_OR_NEWER
            bool hasLight = Object.FindFirstObjectByType<Light>() != null;
#else
            bool hasLight = Object.FindObjectOfType<Light>() != null;
#endif
            if (!hasLight)
            {
                var l = new GameObject("light").AddComponent<Light>();
                l.type = LightType.Directional; l.intensity = 1.1f;
                l.transform.rotation = Quaternion.Euler(55, -20, 0);
            }
        }

        static void Box(string name, Vector3 pos, Vector3 scale, Color c)
        {
            var g = GameObject.CreatePrimitive(PrimitiveType.Cube);
            Object.Destroy(g.GetComponent<Collider>());
            g.name = name; g.transform.position = pos; g.transform.localScale = scale;
            g.GetComponent<Renderer>().material.color = c;
        }

        void SetupCamera()
        {
            cam = Camera.main;
            if (cam == null) { cam = new GameObject("Main Camera").AddComponent<Camera>(); cam.tag = "MainCamera"; }
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.04f, 0.04f, 0.06f);
            cam.fieldOfView = 40f;
            cam.transform.position = new Vector3(0, 2.4f, -F.ringZ * S - 6.5f);
            cam.transform.LookAt(new Vector3(0, 1f, 0));
        }

        void Update()
        {
            if (F == null) return;
#if ENABLE_LEGACY_INPUT_MANAGER
            // keyboard shortcuts (old Input Manager only; the on-screen buttons always work)
            if (Input.GetKeyDown(KeyCode.Space)) paused = !paused;
            if (Input.GetKeyDown(KeyCode.Alpha1)) speed = 1;
            if (Input.GetKeyDown(KeyCode.Alpha2)) speed = 2;
            if (Input.GetKeyDown(KeyCode.Alpha4)) speed = 4;
            if (Input.GetKeyDown(KeyCode.R)) Restart();
            if (Input.GetKeyDown(KeyCode.N)) NextRound();
#endif

            float sp = speed;
            if (slowT > 0) { slowT -= Time.deltaTime; sp = Mathf.Min(sp, 0.35f); }
            if (!paused) cursor = Mathf.Min(cursor + Time.deltaTime / F.dt * sp, F.frames.Length - 1);

            int i = Mathf.FloorToInt(cursor), j = Mathf.Min(i + 1, F.frames.Length - 1);
            float a = cursor - i;
            Frame f0 = F.frames[i], f1 = F.frames[j];
            // a jump (corner break skipped) doesn't lerp across it
            if (f1.t - f0.t > F.dt * 3) a = 0;

            Vector3[] pos = new Vector3[2];
            for (int s = 0; s < 2; s++)
            {
                BoxerFrame b0 = f0.Get(s), b1 = f1.Get(s);
                pos[s] = Vector3.Lerp(W(b0.x, b0.z), W(b1.x, b1.z), a);
            }
            float dist = Vector3.Distance(pos[0], pos[1]);
            for (int s = 0; s < 2; s++)
            {
                BoxerFrame b0 = f0.Get(s), b1 = f1.Get(s);
                float y;
                if (Mathf.Abs(b0.yaw) < 1e-4f && Mathf.Abs(b1.yaw) < 1e-4f)
                {
                    // no facing yet (before the movement pass kicks in): face the other man
                    var d = pos[1 - s] - pos[s];
                    y = Mathf.Atan2(d.x, d.z) * Mathf.Rad2Deg;
                }
                else y = Mathf.LerpAngle(Yaw(b0.yaw), Yaw(b1.yaw), a);
                BoxerFrame b = b0;
                b.punchP = b0.punch == b1.punch && b1.punchP >= b0.punchP ? Mathf.Lerp(b0.punchP, b1.punchP, a) : b0.punchP;
                b.downP = Mathf.Lerp(b0.downP, b1.downP, a);
                b.defP = b0.def == b1.def ? Mathf.Lerp(b0.defP, b1.defP, a) : b0.defP;
                rigs[s].Apply(b, pos[s], y, dist, f0.clinch, f0.live, F.punches, Time.time);
            }

            Events(i);
            Sparks();
            FollowCamera(pos[0], pos[1]);
        }

        void Events(int upTo)
        {
            while (nextEvent < F.events.Count && F.events[nextEvent].frame <= upTo)
            {
                var e = F.events[nextEvent++];
                int a = e.Int("a"), d = e.Int("d");
                string who = a >= 0 && a < 2 ? F.fighters[a].name : "";
                string pname = PunchName(e.Str("p"));
                switch (e.type)
                {
                    case "throw": if (a >= 0) thrown[a]++; break;
                    case "hit":
                        if (!e.Bool("blocked") && a >= 0)
                        {
                            landed[a]++;
                            var D = rigs[d];
                            Spark(e.Str("zone") == "body" ? D.BodyWorld() : D.HeadWorld(), e.Bool("crit") ? 0.35f : 0.18f);
                            if (e.Bool("crit")) Say(who + " lands a big " + pname + "!");
                        }
                        break;
                    case "knockdown":
                        if (a >= 0) kds[a]++;
                        Say("DOWN GOES " + F.fighters[d].name.ToUpper() + "!"); slowT = 1.6f; break;
                    case "up": Say(F.fighters[Mathf.Max(0, e.Int("d", e.Int("a", 0)))].name + " beats the count"); break;
                    case "stoppage": Say("IT'S STOPPED!"); slowT = 1.2f; break;
                    case "cut": Say("There's a cut!"); break;
                    case "bell":
                        if (e.Bool("start")) Say("Round " + e.Int("round", 1));
                        else if (e.Bool("end")) Say("End of round " + e.Int("round", 1));
                        break;
                    case "end": Say(F.ResultText()); break;
                }
            }
        }

        string PunchName(string id)
        {
            foreach (var p in F.punches) if (p.id == id) return p.name;
            return id;
        }

        void Say(string s) { ticker.Insert(0, new KeyValuePair<string, float>(s, 3.5f)); if (ticker.Count > 4) ticker.RemoveAt(4); }

        void Spark(Vector3 at, float size)
        {
            var g = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            Object.Destroy(g.GetComponent<Collider>());
            g.transform.position = at; g.transform.localScale = Vector3.one * size;
            g.GetComponent<Renderer>().material.color = new Color(1f, 0.9f, 0.4f);
            sparks.Add(new KeyValuePair<Transform, float>(g.transform, 0.18f));
        }

        void Sparks()
        {
            for (int i = sparks.Count - 1; i >= 0; i--)
            {
                var t = sparks[i].Value - Time.deltaTime;
                if (t <= 0) { Object.Destroy(sparks[i].Key.gameObject); sparks.RemoveAt(i); continue; }
                sparks[i].Key.localScale *= 1.04f;
                sparks[i] = new KeyValuePair<Transform, float>(sparks[i].Key, t);
            }
            for (int i = ticker.Count - 1; i >= 0; i--)
            {
                float t = ticker[i].Value - Time.deltaTime;
                if (t <= 0) ticker.RemoveAt(i); else ticker[i] = new KeyValuePair<string, float>(ticker[i].Key, t);
            }
        }

        void FollowCamera(Vector3 a, Vector3 b)
        {
            var mid = (a + b) * 0.5f;
            float spread = Mathf.Abs(a.x - b.x);
            var want = new Vector3(mid.x * 0.7f, 2.4f, mid.z - 6.2f - spread * 0.6f);
            float k = 1f - Mathf.Exp(-Time.deltaTime * 2.5f);
            cam.transform.position = Vector3.Lerp(cam.transform.position, want, k);
            var look = Vector3.Lerp(cam.transform.position + cam.transform.forward, new Vector3(mid.x, 1.05f, mid.z), k);
            cam.transform.LookAt(look);
        }

        void Restart()
        {
            cursor = 0; nextEvent = 0; slowT = 0; ticker.Clear();
            landed = new int[2]; thrown = new int[2]; kds = new int[2];
        }

        void NextRound()
        {
            if (F == null) return;
            int rd = F.frames[Mathf.FloorToInt(cursor)].round;
            int k = Mathf.FloorToInt(cursor);
            while (k < F.frames.Length - 1 && F.frames[k].round == rd) k++;
            // catch up the event counters without the noise
            while (nextEvent < F.events.Count && F.events[nextEvent].frame <= k)
            {
                var e = F.events[nextEvent++]; int a = e.Int("a");
                if (e.type == "throw" && a >= 0) thrown[a]++;
                if (e.type == "hit" && !e.Bool("blocked") && a >= 0) landed[a]++;
                if (e.type == "knockdown" && a >= 0) kds[a]++;
            }
            cursor = k;
        }

        // ---------- HUD (IMGUI: works on the phone too, scaled to a 720-high canvas)
        GUIStyle big, mid, small, smallC, btn;

        void OnGUI()
        {
            float sc = Screen.height / 720f;
            GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, new Vector3(sc, sc, 1));
            float W = Screen.width / sc;
            if (big == null)
            {
                big = new GUIStyle(GUI.skin.label) { fontSize = 34, fontStyle = FontStyle.Bold, alignment = TextAnchor.MiddleCenter };
                mid = new GUIStyle(GUI.skin.label) { fontSize = 22, alignment = TextAnchor.MiddleCenter };
                small = new GUIStyle(GUI.skin.label) { fontSize = 18 };
                btn = new GUIStyle(GUI.skin.button) { fontSize = 22 };
                big.normal.textColor = mid.normal.textColor = small.normal.textColor = Color.white;
                smallC = new GUIStyle(small) { alignment = TextAnchor.MiddleCenter };
            }
            if (error != null) { GUI.Label(new Rect(0, 300, W, 60), error, mid); return; }
            if (F == null) return;

            var f = F.frames[Mathf.FloorToInt(cursor)];
            int c = Mathf.Clamp(Mathf.FloorToInt(f.clock), 0, 180);
            GUI.Label(new Rect(0, 10, W, 44), "RD " + f.round + "   " + (c / 60) + ":" + (c % 60).ToString("00"), big);

            for (int s = 0; s < 2; s++)
            {
                var fi = F.fighters[s];
                var st = new GUIStyle(small) { alignment = s == 0 ? TextAnchor.UpperLeft : TextAnchor.UpperRight };
                st.normal.textColor = s == 0 ? new Color(1f, 0.5f, 0.5f) : new Color(0.55f, 0.7f, 1f);
                string line = fi.name + "  " + fi.style + " / " + fi.guard + " / " + fi.stance +
                              "\nlanded " + landed[s] + " of " + thrown[s] + (kds[s] > 0 ? "   KDs " + kds[s] : "");
                GUI.Label(new Rect(16, 60, W - 32, 60), line, st);
            }

            for (int i = 0; i < ticker.Count; i++)
                GUI.Label(new Rect(0, 140 + i * 32, W, 30), ticker[i].Key, i == 0 ? mid : smallC);

            bool over = cursor >= F.frames.Length - 1;
            if (over) GUI.Label(new Rect(0, 300, W, 60), F.ResultText(), big);

            float y = 720 - 70, bw = 110, gap = 10, x = (W - (bw * 5 + gap * 4)) / 2;
            if (GUI.Button(new Rect(x, y, bw, 54), paused ? "Play" : "Pause", btn)) paused = !paused; x += bw + gap;
            if (GUI.Button(new Rect(x, y, bw, 54), "1x", btn)) speed = 1; x += bw + gap;
            if (GUI.Button(new Rect(x, y, bw, 54), "2x", btn)) speed = 2; x += bw + gap;
            if (GUI.Button(new Rect(x, y, bw, 54), "4x", btn)) speed = 4; x += bw + gap;
            if (GUI.Button(new Rect(x, y, bw, 54), over ? "Again" : "Next Rd", btn)) { if (over) Restart(); else NextRound(); }
        }
    }
}

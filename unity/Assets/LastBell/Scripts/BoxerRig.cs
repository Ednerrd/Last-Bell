// A placeholder boxer built from primitives (capsules + spheres): stance, guard, punches over punchP,
// defense, getting hit, going down. Step 4 swaps this for the real body (proto/boxer3d.js is the reference).
using UnityEngine;

namespace LastBell
{
    public class BoxerRig : MonoBehaviour
    {
        public int side;
        public FighterInfo info;
        public Transform body, torso, head, gloveL, gloveR, legL, legR;
        Renderer headR;
        Color skin = new Color(0.78f, 0.58f, 0.44f);
        float leadSide;      // local x of the lead hand: orthodox lead = left (-1), southpaw +1
        float legPhase, bobPhase;
        Vector3 lastPos;
        bool hasLast;

        public static BoxerRig Build(int side, FighterInfo info, Color team)
        {
            var root = new GameObject(info.name + " (" + info.style + ")");
            var r = root.AddComponent<BoxerRig>();
            r.side = side; r.info = info;
            r.leadSide = info.stance == "southpaw" ? 1f : -1f;
            r.bobPhase = side * 1.7f;

            r.body = new GameObject("body").transform; r.body.SetParent(root.transform, false);
            r.legL = Part(PrimitiveType.Capsule, r.body, new Vector3(-0.12f, 0.42f, 0f), new Vector3(0.17f, 0.42f, 0.17f), r.skin);
            r.legR = Part(PrimitiveType.Capsule, r.body, new Vector3(0.12f, 0.42f, 0f), new Vector3(0.17f, 0.42f, 0.17f), r.skin);
            // feet in stance: lead foot forward
            r.legL.localPosition += new Vector3(0, 0, r.leadSide < 0 ? 0.14f : -0.14f);
            r.legR.localPosition += new Vector3(0, 0, r.leadSide < 0 ? -0.14f : 0.14f);
            Part(PrimitiveType.Cylinder, r.body, new Vector3(0, 0.86f, 0), new Vector3(0.42f, 0.12f, 0.32f), team); // trunks

            r.torso = new GameObject("torso").transform; r.torso.SetParent(r.body, false); r.torso.localPosition = new Vector3(0, 1.0f, 0);
            Part(PrimitiveType.Capsule, r.torso, new Vector3(0, 0.2f, 0), new Vector3(0.46f, 0.36f, 0.3f), r.skin);
            r.head = new GameObject("head").transform; r.head.SetParent(r.torso, false); r.head.localPosition = new Vector3(0, 0.62f, 0);
            var h = Part(PrimitiveType.Sphere, r.head, new Vector3(0, 0.08f, 0), new Vector3(0.24f, 0.28f, 0.25f), r.skin);
            r.headR = h.GetComponent<Renderer>();
            Part(PrimitiveType.Cube, r.head, new Vector3(0, 0.12f, 0.12f), new Vector3(0.16f, 0.03f, 0.03f), new Color(0.15f, 0.1f, 0.08f)); // brow: shows which way he faces
            r.gloveL = Part(PrimitiveType.Sphere, r.torso, Vector3.zero, Vector3.one * 0.17f, team);
            r.gloveR = Part(PrimitiveType.Sphere, r.torso, Vector3.zero, Vector3.one * 0.17f, team);
            return r;
        }

        static Transform Part(PrimitiveType t, Transform parent, Vector3 pos, Vector3 scale, Color c)
        {
            var g = GameObject.CreatePrimitive(t);
            var col = g.GetComponent<Collider>(); if (col != null) Object.Destroy(col);
            g.transform.SetParent(parent, false);
            g.transform.localPosition = pos; g.transform.localScale = scale;
            g.GetComponent<Renderer>().material.color = c;
            return g.transform;
        }

        // the guard at rest, in torso space (x = lead side when multiplied by leadSide)
        void Guard(out Vector3 lead, out Vector3 rear)
        {
            float L = leadSide;
            switch (info.guard)
            {
                case "high": lead = new Vector3(L * 0.12f, 0.58f, 0.22f); rear = new Vector3(-L * 0.11f, 0.6f, 0.15f); break;
                case "peekaboo": lead = new Vector3(L * 0.08f, 0.62f, 0.2f); rear = new Vector3(-L * 0.08f, 0.62f, 0.18f); break;
                case "philly": lead = new Vector3(L * 0.18f, 0.14f, 0.14f); rear = new Vector3(-L * 0.1f, 0.6f, 0.14f); break;
                case "cross": lead = new Vector3(-L * 0.04f, 0.4f, 0.26f); rear = new Vector3(L * 0.05f, 0.48f, 0.22f); break;
                case "handslow": lead = new Vector3(L * 0.2f, 0.18f, 0.3f); rear = new Vector3(-L * 0.16f, 0.32f, 0.2f); break;
                default: lead = new Vector3(L * 0.16f, 0.5f, 0.3f); rear = new Vector3(-L * 0.14f, 0.56f, 0.16f); break;
            }
        }

        static float Ext(float p)
        {
            // out to the target by .6 (when the engine resolves the punch), back by 1
            return p < 0.6f ? Mathf.SmoothStep(0, 1, p / 0.6f) : 1f - Mathf.SmoothStep(0, 1, (p - 0.6f) / 0.4f);
        }

        static Vector3 Bez(Vector3 a, Vector3 c, Vector3 b, float t)
        {
            return Vector3.Lerp(Vector3.Lerp(a, c, t), Vector3.Lerp(c, b, t), t);
        }

        public void Apply(BoxerFrame f, Vector3 worldPos, float yawDeg, float dist, bool clinch, bool live, PunchInfo[] punches, float time)
        {
            transform.position = worldPos;
            transform.rotation = Quaternion.Euler(0, yawDeg, 0);

            // legs swing with ground speed
            float spd = 0;
            if (hasLast && Time.deltaTime > 0) spd = (worldPos - lastPos).magnitude / Time.deltaTime;
            lastPos = worldPos; hasLast = true;
            legPhase += Mathf.Min(spd, 4f) * Time.deltaTime * 9f;
            float sw = Mathf.Min(spd, 2f) * 10f * Mathf.Sin(legPhase);
            legL.localRotation = Quaternion.Euler(sw, 0, 0);
            legR.localRotation = Quaternion.Euler(-sw, 0, 0);

            Vector3 lead, rear; Guard(out lead, out rear);
            lead.y -= f.tired * 0.18f; rear.y -= f.tired * 0.14f;

            float pitch = 0, twist = 0, roll = 0, bodyY = 0, bodyPitch = 0, bodyX = 0;

            // the bounce (render only)
            if (live && (f.state == "idle" || f.state == "move"))
                bodyY += Mathf.Sin(time * 7f + bobPhase) * 0.02f * (1f - f.tired * 0.7f);

            // punch
            if (f.punch >= 0 && f.punch < punches.Length && f.state == "punch")
            {
                var P = punches[f.punch];
                bool isLead = P.arm == "lead";
                float sideX = isLead ? leadSide : -leadSide;
                float p = f.feint ? Mathf.Min(f.punchP, 0.35f) : f.punchP;
                float e = Ext(p) * (f.feint ? 0.45f : 1f);
                float reach = Mathf.Clamp(dist - 0.32f, 0.35f, 0.78f);
                var target = new Vector3(sideX * 0.02f, P.zone == "body" ? 0.22f : 0.6f, reach);
                Vector3 from = isLead ? lead : rear, pos;
                if (P.kind == "hook") pos = Bez(from, new Vector3(sideX * 0.5f, target.y, target.z * 0.55f), target, e);
                else if (P.kind == "upper") pos = Bez(from, new Vector3(sideX * 0.12f, 0.02f, target.z * 0.45f), target, e);
                else pos = Vector3.Lerp(from, target, e);
                if (isLead) lead = pos; else rear = pos;
                twist += (isLead ? -1f : 1f) * leadSide * (P.kind == "hook" ? 26f : 16f) * e;
                if (P.zone == "body") { bodyY -= 0.1f * e; pitch += 10f * e; }
            }

            // defense
            if (!string.IsNullOrEmpty(f.def))
            {
                float w = Mathf.Sin(Mathf.PI * Mathf.Clamp01(f.defP));
                switch (f.def)
                {
                    case "block":
                        lead = Vector3.Lerp(lead, new Vector3(leadSide * 0.09f, 0.62f, 0.18f), w);
                        rear = Vector3.Lerp(rear, new Vector3(-leadSide * 0.09f, 0.62f, 0.16f), w);
                        break;
                    case "roll": bodyY -= 0.14f * w; roll += 14f * leadSide * w; break;
                    case "slip": roll += 15f * leadSide * w; bodyX += 0.08f * leadSide * w; break;
                    case "duck": bodyY -= 0.28f * w; pitch += 16f * w; break;
                    case "pull": pitch -= 15f * w; break;
                    case "parry": rear = Vector3.Lerp(rear, new Vector3(leadSide * 0.06f, 0.55f, 0.36f), w); break;
                }
            }

            // clinch: arms wrap
            if (clinch && f.state != "down")
            {
                lead = Vector3.Lerp(lead, new Vector3(leadSide * 0.26f, 0.42f, 0.42f), 0.8f);
                rear = Vector3.Lerp(rear, new Vector3(-leadSide * 0.26f, 0.42f, 0.42f), 0.8f);
                pitch += 12f;
            }

            // getting hit
            float k = Mathf.Clamp01(f.hitT) * Mathf.Clamp01(f.hitPow + 0.25f);
            float headPitch = 0;
            if (f.hitZone == "body") pitch += 16f * k; else { headPitch -= 28f * k; pitch -= 7f * k; }

            // hurt / stunned: the legs go
            if (f.state == "stun" || f.state == "slump" || f.hurt)
            {
                float a = f.state == "slump" ? 10f : 5f;
                roll += Mathf.Sin(time * 3.1f) * a; bodyX += Mathf.Sin(time * 2.3f) * 0.05f;
                lead.y -= 0.12f; rear.y -= 0.12f;
            }

            // knockdown
            float d = Mathf.Clamp01(f.downP);
            if (d > 0)
            {
                bodyPitch = -78f * d; bodyY -= 0.05f * d;
                lead = Vector3.Lerp(lead, new Vector3(leadSide * 0.35f, 0.1f, 0.1f), d);
                rear = Vector3.Lerp(rear, new Vector3(-leadSide * 0.35f, 0.1f, 0.1f), d);
            }

            body.localPosition = new Vector3(bodyX, bodyY, 0);
            body.localRotation = Quaternion.Euler(bodyPitch, 0, 0);
            torso.localRotation = Quaternion.Euler(pitch, twist, roll);
            head.localRotation = Quaternion.Euler(headPitch, 0, 0);
            // lead hand is the left glove for an orthodox man
            if (leadSide < 0) { gloveL.localPosition = lead; gloveR.localPosition = rear; }
            else { gloveR.localPosition = lead; gloveL.localPosition = rear; }

            // face: damage reddens it, a fresh hit flashes it
            var c = Color.Lerp(skin, new Color(0.75f, 0.3f, 0.28f), Mathf.Clamp01(f.dmg) * 0.8f);
            headR.material.color = Color.Lerp(c, Color.white, k * 0.5f);
        }

        public Vector3 HeadWorld() { return head.position + Vector3.up * 0.08f; }
        public Vector3 BodyWorld() { return torso.position + Vector3.up * 0.2f; }
    }
}

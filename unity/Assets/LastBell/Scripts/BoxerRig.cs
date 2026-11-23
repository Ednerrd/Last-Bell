// A placeholder boxer built from primitives, with jointed limbs: two-bone IK for the arms (shoulder -> elbow -> glove)
// and the legs (hip -> knee -> ankle), so the hands and feet go where the fight says and the elbows and knees follow.
// Step 4 swaps this for the real body (proto/boxer3d.js is the reference).
//
// Spaces: the root faces +z (Unity), +x is his right. "body" is pivoted at the feet (it only falls on a knockdown and sways);
// "torso" is pivoted at the pelvis (lean, twist, duck, bounce, the step-in), and the arms, gloves and head hang off it.
// Legs are solved in body space, arms in torso space. Pitch +x leans forward, twist +y turns his top clockwise seen from above.
using UnityEngine;

namespace LastBell
{
    public class BoxerRig : MonoBehaviour
    {
        // ---- sizes (meters), a ~1.78 m man
        const float HIP_Y = 0.90f;                       // pelvis height standing in stance
        const float THIGH = 0.46f, SHIN = 0.44f;         // hip -> knee -> ankle
        const float UPPER = 0.30f, FORE = 0.36f;         // shoulder -> elbow -> glove center (forearm + hand); tested: tucks the elbow ~.33 under the glove in every guard
        const float ANKLE_Y = 0.08f;
        static readonly Vector3 SHOULDER = new Vector3(0.20f, 0.52f, 0f);   // torso space, x is mirrored per side
        static readonly Vector3 HIP = new Vector3(0.10f, -0.05f, 0f);       // relative to the pelvis, in body space

        public int side;
        public FighterInfo info;
        public Transform body, torso, head;
        Transform upperL, foreL, upperR, foreR, gloveL, gloveR;
        Transform thighL, shinL, thighR, shinR, footL, footR, kneeL, kneeR, elbowL, elbowR;
        Renderer headR;
        Color skin;
        float L;             // the lead side's x sign: orthodox lead = left (-1), southpaw +1
        float legPhase, bobPhase, moveAmt;
        Vector3 lastPos;
        bool hasLast;

        public static BoxerRig Build(int side, FighterInfo info, Color team)
        {
            var root = new GameObject(info.name + " (" + info.style + ")");
            var r = root.AddComponent<BoxerRig>();
            r.side = side; r.info = info;
            r.L = info.stance == "southpaw" ? 1f : -1f;
            r.bobPhase = side * 1.7f;
            r.skin = side == 0 ? new Color(0.86f, 0.66f, 0.52f) : new Color(0.52f, 0.36f, 0.26f);
            var shoe = new Color(0.12f, 0.12f, 0.14f);
            var trunkTrim = Color.Lerp(team, Color.white, 0.55f);

            r.body = new GameObject("body").transform; r.body.SetParent(root.transform, false);
            r.torso = new GameObject("torso").transform; r.torso.SetParent(r.body, false);
            r.torso.localPosition = new Vector3(0, HIP_Y, 0);

            // legs (body space, placed every frame)
            r.thighL = Part(PrimitiveType.Capsule, r.body, team, "thighL");   // trunks cover the thighs
            r.thighR = Part(PrimitiveType.Capsule, r.body, team, "thighR");
            r.shinL = Part(PrimitiveType.Capsule, r.body, r.skin, "shinL");
            r.shinR = Part(PrimitiveType.Capsule, r.body, r.skin, "shinR");
            r.kneeL = Part(PrimitiveType.Sphere, r.body, r.skin, "kneeL"); r.kneeL.localScale = Vector3.one * 0.12f;
            r.kneeR = Part(PrimitiveType.Sphere, r.body, r.skin, "kneeR"); r.kneeR.localScale = Vector3.one * 0.12f;
            r.footL = Part(PrimitiveType.Cube, r.body, shoe, "footL"); r.footL.localScale = new Vector3(0.1f, 0.08f, 0.25f);
            r.footR = Part(PrimitiveType.Cube, r.body, shoe, "footR"); r.footR.localScale = new Vector3(0.1f, 0.08f, 0.25f);

            // torso (torso space, fixed)
            Fixed(PrimitiveType.Cylinder, r.torso, new Vector3(0, -0.02f, 0), new Vector3(0.36f, 0.11f, 0.27f), team);      // trunks
            Fixed(PrimitiveType.Cylinder, r.torso, new Vector3(0, 0.095f, 0), new Vector3(0.345f, 0.025f, 0.26f), trunkTrim); // waistband
            Fixed(PrimitiveType.Sphere, r.torso, new Vector3(0, 0.17f, 0.005f), new Vector3(0.32f, 0.26f, 0.23f), r.skin);    // belly
            Fixed(PrimitiveType.Sphere, r.torso, new Vector3(0, 0.38f, 0.01f), new Vector3(0.44f, 0.34f, 0.26f), r.skin);     // chest
            Fixed(PrimitiveType.Sphere, r.torso, new Vector3(-SHOULDER.x, SHOULDER.y, 0), Vector3.one * 0.14f, r.skin);       // delts
            Fixed(PrimitiveType.Sphere, r.torso, new Vector3(SHOULDER.x, SHOULDER.y, 0), Vector3.one * 0.14f, r.skin);
            Fixed(PrimitiveType.Cylinder, r.torso, new Vector3(0, 0.55f, 0.01f), new Vector3(0.11f, 0.05f, 0.11f), r.skin);  // neck
            r.head = new GameObject("head").transform; r.head.SetParent(r.torso, false); r.head.localPosition = new Vector3(0, 0.58f, 0.01f);
            r.headR = Fixed(PrimitiveType.Sphere, r.head, new Vector3(0, 0.12f, 0.02f), new Vector3(0.2f, 0.25f, 0.23f), r.skin).GetComponent<Renderer>();
            Fixed(PrimitiveType.Cube, r.head, new Vector3(0, 0.15f, 0.115f), new Vector3(0.15f, 0.025f, 0.03f), new Color(0.12f, 0.08f, 0.06f)); // brow
            Fixed(PrimitiveType.Sphere, r.head, new Vector3(0, 0.11f, 0.13f), new Vector3(0.04f, 0.05f, 0.04f), r.skin);   // nose
            Fixed(PrimitiveType.Sphere, r.head, new Vector3(0, 0.2f, -0.01f), new Vector3(0.205f, 0.12f, 0.22f), new Color(0.1f, 0.07f, 0.05f)); // hair

            // arms (torso space, placed every frame)
            r.upperL = Part(PrimitiveType.Capsule, r.torso, r.skin, "upperL");
            r.upperR = Part(PrimitiveType.Capsule, r.torso, r.skin, "upperR");
            r.foreL = Part(PrimitiveType.Capsule, r.torso, r.skin, "foreL");
            r.foreR = Part(PrimitiveType.Capsule, r.torso, r.skin, "foreR");
            r.elbowL = Part(PrimitiveType.Sphere, r.torso, r.skin, "elbowL"); r.elbowL.localScale = Vector3.one * 0.085f;
            r.elbowR = Part(PrimitiveType.Sphere, r.torso, r.skin, "elbowR"); r.elbowR.localScale = Vector3.one * 0.085f;
            r.gloveL = Part(PrimitiveType.Sphere, r.torso, team, "gloveL"); r.gloveL.localScale = new Vector3(0.135f, 0.15f, 0.17f);
            r.gloveR = Part(PrimitiveType.Sphere, r.torso, team, "gloveR"); r.gloveR.localScale = new Vector3(0.135f, 0.15f, 0.17f);
            return r;
        }

        static Transform Part(PrimitiveType t, Transform parent, Color c, string name)
        {
            var g = GameObject.CreatePrimitive(t);
            var col = g.GetComponent<Collider>(); if (col != null) Object.Destroy(col);
            g.name = name;
            g.transform.SetParent(parent, false);
            g.GetComponent<Renderer>().material.color = c;
            return g.transform;
        }

        static Transform Fixed(PrimitiveType t, Transform parent, Vector3 pos, Vector3 scale, Color c)
        {
            var tr = Part(t, parent, c, t.ToString());
            tr.localPosition = pos; tr.localScale = scale;
            return tr;
        }

        // ---------- IK
        // Two bones from s (lengths a, b) reaching for h; the joint bends toward the pole. h is clamped to what the limb can reach.
        public static Vector3 Solve(Vector3 s, ref Vector3 h, float a, float b, Vector3 pole)
        {
            var d = h - s;
            float len = d.magnitude, max = a + b - 0.002f, min = Mathf.Abs(a - b) + 0.01f;
            if (len < 1e-5f) { d = Vector3.forward; len = 1e-5f; }
            var dir = d / len;
            if (len > max) { len = max; h = s + dir * len; }
            if (len < min) { len = min; h = s + dir * len; }
            float x = (a * a - b * b + len * len) / (2f * len);
            float y = Mathf.Sqrt(Mathf.Max(0f, a * a - x * x));
            var p = pole - dir * Vector3.Dot(pole, dir);
            if (p.sqrMagnitude < 1e-8f) p = Vector3.down - dir * Vector3.Dot(Vector3.down, dir);
            return s + dir * x + p.normalized * y;
        }

        // a capsule from a to b
        static void Seg(Transform t, Vector3 a, Vector3 b, float thick)
        {
            var d = b - a; float len = d.magnitude;
            t.localPosition = (a + b) * 0.5f;
            t.localRotation = len > 1e-5f ? Quaternion.FromToRotation(Vector3.up, d / len) : Quaternion.identity;
            t.localScale = new Vector3(thick, len * 0.5f + thick * 0.2f, thick);
        }

        // ---------- the guard at rest, glove centers in torso space
        void Guard(out Vector3 lead, out Vector3 rear, out float blade)
        {
            blade = 14f;   // lead shoulder turned toward the other man
            switch (info.guard)
            {
                case "high": lead = new Vector3(L * 0.10f, 0.70f, 0.27f); rear = new Vector3(-L * 0.09f, 0.71f, 0.22f); break;
                case "peekaboo": lead = new Vector3(L * 0.065f, 0.69f, 0.24f); rear = new Vector3(-L * 0.06f, 0.68f, 0.22f); blade = 6f; break;
                case "philly": lead = new Vector3(L * 0.17f, 0.30f, 0.17f); rear = new Vector3(-L * 0.08f, 0.66f, 0.21f); blade = 30f; break;
                case "cross": lead = new Vector3(-L * 0.02f, 0.52f, 0.27f); rear = new Vector3(L * 0.03f, 0.64f, 0.22f); blade = 10f; break;
                case "handslow": lead = new Vector3(L * 0.17f, 0.36f, 0.30f); rear = new Vector3(-L * 0.15f, 0.46f, 0.20f); blade = 22f; break;
                default: lead = new Vector3(L * 0.13f, 0.63f, 0.32f); rear = new Vector3(-L * 0.11f, 0.66f, 0.23f); break;
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

            // ground speed drives the steps
            float spd = 0;
            if (hasLast && Time.deltaTime > 0) spd = (worldPos - lastPos).magnitude / Time.deltaTime;
            lastPos = worldPos; hasLast = true;
            moveAmt = Mathf.Lerp(moveAmt, Mathf.Clamp01(spd / 1.2f), 1f - Mathf.Exp(-Time.deltaTime * 8f));
            legPhase += Mathf.Min(spd, 3f) * Time.deltaTime * 7f;

            Vector3 lead, rear; float blade; Guard(out lead, out rear, out blade);
            float sag = f.tired * 0.16f;
            lead.y -= sag; rear.y -= sag * 0.8f;

            float pitch = 4f, twist = -L * blade, roll = 0, hipDY = 0, lunge = 0, bodyPitch = 0, bodyX = 0, headPitch = 0;
            // elbow hints (torso space): where each elbow wants to be. Default: tucked under its glove (see Tuck); a punch blends in its own.
            Vector3 hintLead = Vector3.zero, hintRear = Vector3.zero; float hintLeadW = 0, hintRearW = 0; bool clinchArms = false;
            Vector3 shL = new Vector3(L * SHOULDER.x, SHOULDER.y, 0), shR = new Vector3(-L * SHOULDER.x, SHOULDER.y, 0);
            if (info.guard == "peekaboo") { hipDY -= 0.06f; pitch += 8f; }

            // the bounce (render only)
            if (live && (f.state == "idle" || f.state == "move"))
                hipDY += Mathf.Sin(time * 7f + bobPhase) * 0.018f * (1f - f.tired * 0.7f);

            // ---- punch
            if (f.punch >= 0 && f.punch < punches.Length && f.state == "punch")
            {
                var P = punches[f.punch];
                bool isLead = P.arm == "lead";
                float sx = isLead ? L : -L;                     // the punching arm's side
                float p = f.feint ? Mathf.Min(f.punchP, 0.35f) : f.punchP;
                float e = Ext(p) * (f.feint ? 0.45f : 1f);
                bool body = P.zone == "body";
                // where his target is, in my torso space: their head (or belly) is dist ahead
                float tz = dist - (body ? 0.17f : 0.11f);
                float ty = body ? 0.22f : 0.68f;
                // too far for the arm: step in and lean (the 2D lab's lunge)
                float armZ = (UPPER + FORE) * 0.92f + (isLead ? 0.02f : 0.12f);
                lunge = Mathf.Clamp(tz - armZ, 0f, 0.40f) * e;
                tz -= lunge;
                var target = new Vector3(sx * 0.03f, ty, tz);
                Vector3 from = isLead ? lead : rear, pos, hint;
                float turn;
                if (P.kind == "hook")
                {
                    pos = Bez(from, new Vector3(sx * 0.48f, ty + 0.02f, tz * 0.45f), new Vector3(-sx * 0.02f, ty, tz - 0.06f), e);
                    hint = new Vector3(sx * 0.42f, ty - 0.02f, tz * 0.45f);   // elbow up and out, level with the fist
                    turn = 30f;
                }
                else if (P.kind == "upper")
                {
                    pos = Bez(from, new Vector3(sx * 0.12f, 0.18f, tz * 0.4f), new Vector3(sx * 0.03f, ty - 0.04f, tz - 0.04f), e);
                    hint = new Vector3(pos.x + sx * 0.08f, pos.y - 0.3f, pos.z - 0.2f);   // elbow low, under the fist
                    turn = 22f;
                    hipDY -= 0.05f * Mathf.Sin(Mathf.PI * Mathf.Clamp01(p / 0.6f));   // dip and drive up
                }
                else
                {
                    pos = Vector3.Lerp(from, target, e);
                    hint = new Vector3(pos.x + sx * 0.12f, pos.y - 0.25f, pos.z * 0.5f);   // elbow down, not flared
                    turn = isLead ? 10f : 34f;
                }
                if (isLead) { lead = pos; hintLead = hint; hintLeadW = e; }
                else { rear = pos; hintRear = hint; hintRearW = e; }
                // the turn: a jab pushes the lead shoulder on (-L), everything else turns the hips over (+L)
                twist += (isLead && P.kind == "straight" ? -L : L) * turn * e;
                // the punching shoulder rolls forward
                if (isLead) shL.z += 0.05f * e; else shR.z += 0.05f * e;
                pitch += 6f * e + lunge * 30f;
                if (body) { hipDY -= 0.12f * e; pitch += 8f * e; }
            }

            // ---- defense
            if (!string.IsNullOrEmpty(f.def))
            {
                float w = Mathf.Sin(Mathf.PI * Mathf.Clamp01(f.defP));
                switch (f.def)
                {
                    case "block":
                        lead = Vector3.Lerp(lead, new Vector3(L * 0.08f, 0.72f, 0.2f), w);
                        rear = Vector3.Lerp(rear, new Vector3(-L * 0.08f, 0.72f, 0.18f), w);
                        pitch += 6f * w; break;
                    case "roll": hipDY -= 0.15f * w; roll += 16f * L * w; pitch += 8f * w; break;
                    case "slip": roll += 16f * L * w; bodyX += 0.07f * L * w; break;
                    case "duck": hipDY -= 0.24f * w; pitch += 18f * w; break;
                    case "pull": pitch -= 16f * w; lunge -= 0.06f * w; break;
                    case "parry": rear = Vector3.Lerp(rear, new Vector3(L * 0.05f, 0.62f, 0.38f), w); break;
                }
            }

            // ---- clinch: arms wrap over his shoulders
            if (clinch && f.state != "down")
            {
                float cz = Mathf.Clamp(dist - 0.25f, 0.25f, 0.5f);
                lead = Vector3.Lerp(lead, new Vector3(L * 0.22f, 0.55f, cz), 0.85f);
                rear = Vector3.Lerp(rear, new Vector3(-L * 0.22f, 0.5f, cz), 0.85f);
                clinchArms = true;
                pitch += 14f; hipDY -= 0.04f;
            }

            // ---- getting hit
            float k = Mathf.Clamp01(f.hitT) * Mathf.Clamp01(f.hitPow + 0.25f);
            if (f.hitZone == "body") { pitch += 18f * k; hipDY -= 0.06f * k; }
            else { headPitch -= 26f * k; pitch -= 7f * k; }

            // ---- hurt / stunned: the legs go
            if (f.state == "stun" || f.state == "slump" || f.hurt)
            {
                float a = f.state == "slump" ? 10f : 5f;
                roll += Mathf.Sin(time * 3.1f) * a; bodyX += Mathf.Sin(time * 2.3f) * 0.05f;
                lead.y -= 0.14f; rear.y -= 0.14f; hipDY -= 0.05f;
            }

            // ---- knockdown: falls back off his feet
            float dn = Mathf.Clamp01(f.downP);
            if (dn > 0)
            {
                bodyPitch = -80f * dn; hipDY -= 0.25f * dn;
                lead = Vector3.Lerp(lead, new Vector3(L * 0.38f, 0.25f, 0.15f), dn);
                rear = Vector3.Lerp(rear, new Vector3(-L * 0.38f, 0.25f, 0.15f), dn);
            }

            // ---- place the body
            body.localPosition = new Vector3(bodyX, 0, 0);
            body.localRotation = Quaternion.Euler(bodyPitch, 0, 0);
            var pelvis = new Vector3(0, HIP_Y + hipDY, lunge * 0.85f);
            torso.localPosition = pelvis;
            torso.localRotation = Quaternion.Euler(pitch, twist, roll);
            head.localRotation = Quaternion.Euler(headPitch - pitch * 0.4f, -twist * 0.35f, 0);  // eyes stay on the man

            // ---- legs (body space): lead foot forward, rear foot back and turned out; steps when moving
            float s = Mathf.Sin(legPhase), lift = 0.05f * moveAmt;
            var footLead = new Vector3(L * 0.13f, ANKLE_Y, 0.22f + 0.07f * moveAmt * s + lunge);
            var footRear = new Vector3(-L * 0.15f, ANKLE_Y, -0.2f - 0.07f * moveAmt * s + lunge * 0.3f);
            footLead.y += lift * Mathf.Max(0f, s); footRear.y += lift * Mathf.Max(0f, -s);
            // the pelvis turns a bit with the shoulders
            var hipRot = Quaternion.Euler(0, twist * 0.4f, 0);
            var hipLead = pelvis + hipRot * new Vector3(L * HIP.x, HIP.y, 0);
            var hipRear = pelvis + hipRot * new Vector3(-L * HIP.x, HIP.y, 0);
            Vector3 kLead = Solve(hipLead, ref footLead, THIGH, SHIN, new Vector3(L * 0.25f, 0, 1f));
            Vector3 kRear = Solve(hipRear, ref footRear, THIGH, SHIN, new Vector3(-L * 0.35f, 0, 1f));
            bool leftIsLead = L < 0;
            Leg(leftIsLead ? thighL : thighR, leftIsLead ? shinL : shinR, leftIsLead ? kneeL : kneeR, leftIsLead ? footL : footR, hipLead, kLead, footLead, -L * 8f);
            Leg(leftIsLead ? thighR : thighL, leftIsLead ? shinR : shinL, leftIsLead ? kneeR : kneeL, leftIsLead ? footR : footL, hipRear, kRear, footRear, -L * 40f);

            // ---- arms (torso space)
            Vector3 hL = Vector3.Lerp(Tuck(lead, L, clinchArms), hintLead, hintLeadW);
            Vector3 hR = Vector3.Lerp(Tuck(rear, -L, clinchArms), hintRear, hintRearW);
            Vector3 eLead = Solve(shL, ref lead, UPPER, FORE, hL - shL);
            Vector3 eRear = Solve(shR, ref rear, UPPER, FORE, hR - shR);
            Arm(leftIsLead ? upperL : upperR, leftIsLead ? foreL : foreR, leftIsLead ? elbowL : elbowR, leftIsLead ? gloveL : gloveR, shL, eLead, lead);
            Arm(leftIsLead ? upperR : upperL, leftIsLead ? foreR : foreL, leftIsLead ? elbowR : elbowL, leftIsLead ? gloveR : gloveL, shR, eRear, rear);

            // ---- face: damage reddens it, a fresh hit flashes it
            var c = Color.Lerp(skin, new Color(0.75f, 0.3f, 0.28f), Mathf.Clamp01(f.dmg) * 0.7f);
            headR.material.color = Color.Lerp(c, Color.white, k * 0.45f);
        }

        // the elbow tucked: under the glove, a bit behind it and to the outside. In a clinch it goes out over his shoulders.
        static Vector3 Tuck(Vector3 glove, float sx, bool clinch)
        {
            return clinch ? new Vector3(sx * 0.4f, glove.y, glove.z * 0.4f) : new Vector3(glove.x + sx * 0.1f, glove.y - 0.32f, glove.z - 0.12f);
        }

        static void Leg(Transform thigh, Transform shin, Transform knee, Transform foot, Vector3 hip, Vector3 k, Vector3 ankle, float toeOut)
        {
            Seg(thigh, hip, k, 0.17f);
            Seg(shin, k, ankle, 0.12f);
            knee.localPosition = k;
            var r = Quaternion.Euler(0, toeOut, 0);
            foot.localRotation = r;
            foot.localPosition = ankle + r * new Vector3(0, -0.04f, 0.05f);
        }

        static void Arm(Transform upper, Transform fore, Transform elbow, Transform glove, Vector3 sh, Vector3 el, Vector3 hand)
        {
            Seg(upper, sh, el, 0.105f);
            Seg(fore, el, hand, 0.085f);
            elbow.localPosition = el;
            glove.localPosition = hand;
            var d = hand - el;
            glove.localRotation = d.sqrMagnitude > 1e-6f ? Quaternion.LookRotation(d.normalized, Vector3.up) : Quaternion.identity;
        }

        public Vector3 HeadWorld() { return head.position + head.up * 0.12f; }
        public Vector3 BodyWorld() { return torso.position + torso.up * 0.22f; }
    }
}

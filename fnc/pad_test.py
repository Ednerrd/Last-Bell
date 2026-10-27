"""FNC pad test: two virtual Xbox pads, then every input one at a time so you can
write down what FNC does with it. Windows only (RPCS3 sees them as XInput pads).

  pip install vgamepad        (installs the ViGEmBus driver the first time)
  python pad_test.py          (P1 only)   python pad_test.py 2   (P2 only)

Set up a Fight Now in RPCS3 first, pause, run this, unpause within the countdown.
"""
import sys
import time
import vgamepad as vg

B = vg.XUSB_BUTTON
HOLD = 0.12   # how long a flick / tap is held
GAP = 2.0     # time to watch what happened

# right stick flicks: (name, x, y)
FLICKS = [
    ("RS up", 0, 1), ("RS up-left", -.7, .7), ("RS up-right", .7, .7),
    ("RS left", -1, 0), ("RS right", 1, 0),
    ("RS down-left", -.7, -.7), ("RS down-right", .7, -.7), ("RS down", 0, -1),
]
# buttons: (name, button)  PS3 names in brackets
BUTTONS = [
    ("A [Cross]", B.XUSB_GAMEPAD_A), ("B [Circle]", B.XUSB_GAMEPAD_B),
    ("X [Square]", B.XUSB_GAMEPAD_X), ("Y [Triangle]", B.XUSB_GAMEPAD_Y),
    ("LB [L1]", B.XUSB_GAMEPAD_LEFT_SHOULDER), ("RB [R1]", B.XUSB_GAMEPAD_RIGHT_SHOULDER),
]


def flick(p, x, y, hold=HOLD):
    p.right_joystick_float(x_value_float=x, y_value_float=y); p.update()
    time.sleep(hold)
    p.right_joystick_float(x_value_float=0.0, y_value_float=0.0); p.update()


def tap(p, b, hold=HOLD):
    p.press_button(button=b); p.update()
    time.sleep(hold)
    p.release_button(button=b); p.update()


def trigger(p, side, hold=.6):
    f = p.left_trigger_float if side == "L" else p.right_trigger_float
    f(value_float=1.0); p.update()
    time.sleep(hold)
    f(value_float=0.0); p.update()


def run(p, who):
    print(f"\n== {who}: right stick flicks ==")
    for name, x, y in FLICKS:
        print(f"{who} {name}"); flick(p, x, y); time.sleep(GAP)
    print(f"\n== {who}: right stick flicks with RT held (power?) ==")
    for name, x, y in FLICKS[:3]:
        print(f"{who} RT + {name}")
        p.right_trigger_float(value_float=1.0); p.update(); time.sleep(.15)
        flick(p, x, y)
        p.right_trigger_float(value_float=0.0); p.update(); time.sleep(GAP)
    print(f"\n== {who}: buttons ==")
    for name, b in BUTTONS:
        print(f"{who} {name}"); tap(p, b); time.sleep(GAP)
    for side in ("L", "R"):
        print(f"{who} {side}T held .6 s"); trigger(p, side); time.sleep(GAP)
    print(f"\n== {who}: left stick (should walk) ==")
    for name, x, y in [("LS forward", 1, 0), ("LS back", -1, 0), ("LS up", 0, 1), ("LS down", 0, -1)]:
        print(f"{who} {name}")
        p.left_joystick_float(x_value_float=x, y_value_float=y); p.update(); time.sleep(.8)
        p.left_joystick_float(x_value_float=0.0, y_value_float=0.0); p.update(); time.sleep(GAP)


if __name__ == "__main__":
    pads = [vg.VX360Gamepad(), vg.VX360Gamepad()]
    print("Two virtual pads plugged in. In RPCS3: Pads > handler XInput, Player 1 = XInput #1, Player 2 = XInput #2.")
    print("(Unplug your real controller first or it takes #1.)")
    who = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    for s in range(10, 0, -1):
        print(f"starting in {s}...", end="\r"); time.sleep(1)
    run(pads[who - 1], f"P{who}")
    print("\nDone. Pads stay plugged in until you press Enter.")
    input()

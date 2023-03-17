import keyboard
import sys
import time

if (len(sys.argv) != 5):
    print("Número errado de argumentos passados")
    sys.exit(-1)

event = keyboard.read_event()
time.sleep(0.2)
event2 = keyboard.read_event()

if(event.name == "'" and event2.name == "'"):
    keyboard.press_and_release('backspace')
    keyboard.press_and_release('backspace')
    keyboard.write(sys.argv[1],delay=0.02)
    keyboard.press_and_release('tab')
    keyboard.write(sys.argv[2],delay=0.02)
    keyboard.press_and_release('tab')
    keyboard.write(sys.argv[3],delay=0.02)
    keyboard.press_and_release('enter')

    event3 = keyboard.read_event()
    time.sleep(0.2)
    event4 = keyboard.read_event()

    if (event3.name == "'" and event4.name == "'"):
        keyboard.press_and_release('backspace')
        keyboard.press_and_release('backspace')
        keyboard.write(sys.argv[4],delay=0.02)
        keyboard.press_and_release('enter')

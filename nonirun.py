import frida


def message_handler(message, payload):
    if message["type"] == "send":
        print(message['payload'])
    else:
        print("[message]", message)
        

device = frida.get_usb_device()
# device = frida.get_device_manager().add_remote_device('192.168.3.174:2333')
# device = frida.get_device_manager().add_remote_device('192.168.43.254:2333')

# pid = device.spawn('com.tanma.unirun')
# device.resume(pid)

unirun = None
for app in device.enumerate_applications():
    if app.name == 'UNIRUN':
        unirun = app
        break
if unirun:
    pid = unirun.pid
else:
    pid = device.spawn('com.tanma.unirun')
    device.resume(pid)

input('Enter anything to continue')
session = device.attach(pid)

with open('fakerun.js') as f:
    script = session.create_script(f.read())

script.on('message', message_handler)
script.load()
input()
import os
import subprocess
import threading
import time
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

CONFIG = "./config.json"


#config 읽기
with open(CONFIG, 'rt', encoding='utf-8') as handle:
    json_string = handle.read()
config_dict = json.loads(json_string)
hostID = config_dict["hostID"]
firebaseKEY = config_dict["firebaseKEY"]
databaseURL = config_dict["databaseURL"]


cred = credentials.Certificate(firebaseKEY)

firebase_admin.initialize_app(cred, {
    'databaseURL': databaseURL
})

def send_to_firebase(second=1.0) :
    print("send to firebase...")

    #config의 모든 program 상태를 firebase로 push
    for key in config_dict :
        send_json = {}
        check = key.find('prog-')
        if check == -1:
            continue
        prog_name = config_dict[key]["name"]
        prog_pid = config_dict[key]["pid"]
        location = config_dict[key]["location"]
        if location == '':
            continue
        with open(location, 'rt', encoding='utf-8') as handle:
            push_string = handle.read()
        push_dict = json.loads(push_string)

        ## 프로그램이 실행중인지 검사
        cmd = "ps -ef | awk '{print $2}' | grep %d$ | wc -l" % prog_pid
        is_running = int(subprocess.check_output(cmd, shell=True))

        if is_running == 0 :
            push_dict["status"] = False
            print(prog_name, 'is not running..')
        else :
            push_dict["status"] = True
            print(prog_name, 'is running..')
        ref = db.reference(hostID + '/' + prog_name)
        ref.update(push_dict)

    threading.Timer(second, send_to_firebase).start()

### main
send_to_firebase(second=2.0)
    





# About this project
여러 컴퓨터의 여러 프로그램들을 한 눈에 모니터링 할 수 있게 한다.

해당 branch는 모니터링 하고자하는 컴퓨터에서 데이터들을 firebase로 보내기 위한 push 프로그램 소스코드 파일이다.

# How to start
### 1. 프로그램 소스코드 다운받기.
``` shell
  $ git clone https://github.com/HGUfuzzing/monitoring.git
  $ cd monitoring
```

### 2. config.json 파일 수정 (1)
  - hostID 설정 (이 컴퓨터(서버)를 식별하는 ID다).
  - firebaseKEY 경로 설정
  - databaseURL 설정

### 3. 모니터링 하고자하는 프로그램들을 실행시킨다.
  - 이때 각 프로그램에서 체크하고 싶은 데이터들을 json 파일로 주기적으로 저장하도록 한다.

### 4. config.json 파일 수정 (2)
  - 모니터링 하려는 각 프로그램들의 정보를 추가한다. (이때 해당 오브젝트의 key의 접두어는 "prog-"로 한다).
  - 각 프로그램의 이름을 name에
  - 각 프로그램의 process id를 pid에
  - 각 프로그램의 json file의 경로를 location에 등록한다.

##### (config.json 예시)
``` json
{
    "hostID" : "Hyeonseop's Computer",
    "firebaseKEY": "/home/ubuntu/swfestival/privatekey/serviceAccountKey.json",
    "databaseURL": "https://server-monitor-ing.firebaseio.com",

    "prog-1": {
        "name" : "real-afl-1",
        "pid" : 4125,
        "location" : "/home/ubuntu/swfestival/AFL/info.json"
    },

    "prog-2": {
        "name" : "afl-2",
        "pid" : 2,
        "location" : "/home/ubuntu/swfestival/json/afl-2.json"
    },

    "prog-3": {
        "name" : "ML program 1",
        "pid" : 500,
        "location" : "/home/ubuntu/swfestival/json/ML-1.json"
    },

    "prog-4": {
        "name" : "ML program 2",
        "pid" : 4,
        "location" : "/home/ubuntu/swfestival/json/ML-2.json"
    }

    
}
```

### 5. send_to_firebase.py 를 실행시킨다.
``` shell
$ python ./send_to_firebase.py
```

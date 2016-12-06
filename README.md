# FHIR_Tester
**FHIR Tester** is a Test platform for FHIR Genomics. 

## Overview

**FHIR Tester** can perform automative test for both FHIR Genomics servers and SMART Platform ( [SMART Health IT – Connecting health system data to innovators’ apps](http://smarthealthit.org) ) Apps. For server that follows FHIR standards, FHIR Tester can test server’s capability of handling FHIR Genomics resources. Or user can define their own test process wit FHIR Test sandbox provided by FHIR Tester. For SMART apps, FHIR Tester can execute user defined front-end test process, with Front-end Test language, Monkey ( [GitHub - ideaworld/Monkey: A frontend testing formal language](https://github.com/ideaworld/Monkey) ), FHIR Tester also provides standard SMART app launch process and FHIR Genomics auth process.

## Deployment

> FHIR Tester backend is for the back-end service, which provides test task performing.  
> FHIR Tester static is for the front-end  

### FHIR Tester Backend Deployment
> This documents assume that you already have MySQL, Python ,Redis, and pip installed in your system.   
> Python: 2.7  
> MySQL: 5.6^  
> Redis 3.2.3^  

#### Install Requirements
1. In Directory FHIR_Tester, run command
```bash
pip install -r requirements.txt
```

#### Setup Database & Redis
1. Create database named fhirtest.
2. In Directory FHIR_Tester_backend.
3. Open FHIR_Tester/settings.py
4. In line 68, set your database setting. In line 83, set your Redis address:port
5. In Directory FHIR_Tester_backend, run command
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Compile CPP code
> The CPP code is used to monitor user defined test process with a certain time and memory.  

> CPP Code compile may relay on your operating system.  
>   
**Debian**:
> CPP Code for Linux is under FHIR_Tester_backend/home/linux_cpp  
```bash
 gcc -c -std=c++11 -Wall Runner.cpp -fPIC
g++ Runner.o -o Runner.so -Wl,--gc-sections -fPIC -shared
```
Put Runner.so under FHIR_Tester_backend/home/

**Mac OS X**
> CPP Code for Mac is under FHIR_Tester_backend/home/  

```bash
clang++ -c -std=c++11 -Wall -fPIC -I/System/Library/Frameworks/Python.framework/Versions/2.7/include/python2.7 -I/System/Library/Frameworks/Python.framework/Versions/2.7/include/python2.7  Runner.cpp
clang++ -std=c++11 -stdlib=libc++ -shared -I/System/Library/Frameworks/Python.framework/Versions/2.7/include/python2.7 -I/System/Library/Frameworks/Python.framework/Versions/2.7/include/python2.7 -L/System/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/config -lpython2.7 -ldl -framework CoreFoundation Runner.o -o Runner.so
```

#### Start service
> Make Redis & MySQL is running before you start FHIR Tester Service  

Under FHIR_Tester_backend, run
> You may need open a new terminal window, or add & to the end of the first command to start both of them.  
```bash
python manage.py runserver
python manage.py celery worker
```

The first one is for HTTP/WebSockets handle. Second is for Celery Multithread.

### FHIR Tester Front-end Deployment
> Assume you have bower, jsx and npm installed  
FHIR Tester Front-end is developed with react and bootstrap. It can be served with any http server.

1. Under FHIR_Tester_static, run
```bash
bower install
npm install
```

2. In file js/build/config.js, line 3, set app.host to your server address. (For example http://localhost:8000)
In file js/build/conn.js, line 7, set your server address as well.

3. Under directory FHIR_Tester_static/js, run
```bash
jsx --watch src build
```
then ctrl+c to exit.

4. Use any Http server to serve those static files. For example, python simple http server, run
```bash
python -m SimpleHTTPServer [port]
```


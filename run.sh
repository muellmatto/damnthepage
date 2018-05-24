#!/bin/bash
gunicorn -w 4 -b 127.0.0.1:64005 -k eventlet damnthepage:damn

import os
import sys
import re
import time
import getpass
import datetime
import platform
import base64, pickle

import urllib
import httplib
import subprocess


def _get_network_sessions():

    print 'Active Internet Connections (including servers)'
    

    try:
        netstat = subprocess.Popen(["/bin/netstat","-atn"], stdout=subprocess.PIPE, close_fds=True).communicate()[0]
    except:
        netstat = subprocess.Popen(["/usr/sbin/netstat","-atn"], stdout=subprocess.PIPE, close_fds=True).communicate()[0]

    

    # XXX resolve services

    connections = {}
    listen_connections = []    
    established_connections = []

    for line in netstat.split('\n'):
    
        if("tcp4" in line or "udp4" in line):

            line = re.split(" +", line)

            proto = line[0]
            recvq = line[1]
            sendq = line[2]
            local_address = line[3]
            foreign_address = line[4]
            state = line[5]
            
            
            if(state=="LISTEN"):
            
                listen_connections.append( [state, proto, recvq, sendq, local_address, foreign_address] )

            if(state=="ESTABLISHED"):
            
                established_connections.append( [state, proto, recvq, sendq, local_address, foreign_address] )


    connections['listen'] = listen_connections
    connections['established'] = established_connections
    connections['description'] = "Active Internet Connections (including servers)"


    return connections
    
    
    
network_sessions = _get_network_sessions()

print network_sessions



    

import time
from datetime import datetime,timedelta
import json
import os
from flask import Flask
from flask import request

__author__ = 'souzadt'

# Create Flask application
app = Flask(__name__)

sensor_columns = ['DeviceID', 'BeatTime', 'BeatCount',
                  'ComputedHeartRate', 'PreviousBeat',
                  'BatteryLevel', 'BatteryVoltage', 'BatteryStatus',
                  'datatype', 'datetime', 'ticksTim']


game_columns = ['datatype', 'datetime','ticksTime',
                'DeviceID', 'BallPosX', 'BallPosY',
                'BallSpeed', 'Player1X', 'Player1Y',
                'Player2X', 'Player2Y', 'ScorePlayer1',
                'ScorePlayer2', 'Player1State', 'Player2State']

# define global variable

player1 = {} #device: 4b53ebe7c92042d59c95dd2f66a52b99 ##Dell
player2 = {} #device: 44c9efaf67334f99a2de1c6dd0821cc9 ##Asus
hvr1 = {} #device: 11429 ID:822CA525
hvr2 = {} #deivice: 21505 ID:6054012C

#date to file
date_time_to_file = datetime.now().strftime('%Y_%m_%d_%H_%M_%S')

#outfile names
file_name_player1 = date_time_to_file + "_game_4b53ebe7c92042d59c95dd2f66a52b99.json"
file_name_player2 = date_time_to_file + "_game_44c9efaf67334f99a2de1c6dd0821cc9.json"
file_name_hvr1 = date_time_to_file + "_sensor_11429.json"
file_name_hvr2 = date_time_to_file + "_sensor_21505.json"

#put data in outfile
def writeJsonData(request_time, request_data):
    global player1 
    global player2
    global hvr1
    global hvr2
    #hrv data == 0
    if request_data["datatype"] == 0:
        if request_data["DeviceID"] == 11429:
            if len(hvr1) < 20:
                hvr1.update({str(request_time):request_data})
            else:
                if not os.path.exists(str('./'+file_name_hvr1)) :
                    out_file = open(file_name_hvr1, "w") 
                    json.dump(hvr1, out_file, indent = 6)
                    out_file.close()
                    hvr1 = {}
                else:
                    out_file = open(file_name_hvr1, "a+") 
                    json.dump(hvr1, out_file, indent = 6)
                    out_file.close()
                    hvr1 = {}
                              
        if request_data["DeviceID"] == 21505:
            if len(hvr2) < 20:
                hvr2.update({str(request_time):request_data})
                
            else:
                if not os.path.exists(str('./'+file_name_hvr2)) :
                    out_file = open(file_name_hvr2, "w") 
                    json.dump(hvr2, out_file, indent = 6)
                    out_file.close()
                    hvr2 = {}
                else:
                    out_file = open(file_name_hvr2, "a+") 
                    json.dump(hvr2, out_file, indent = 6)
                    out_file.close()
                    hvr2 = {}

    #game position data == 1
    elif request_data["datatype"] == 1:
        if request_data["DeviceID"] == '4b53ebe7c92042d59c95dd2f66a52b99':
            if len(player1) < 20:
                player1.update({str(request_time):request_data})
            else:
                if not os.path.exists(str('./'+file_name_player1)) :
                    out_file = open(file_name_player1, "w") 
                    json.dump(player1, out_file, indent = 6)
                    out_file.close()
                    player1 = {}
                else:
                    out_file = open(file_name_player1, "a+") 
                    json.dump(player1, out_file, indent = 6)
                    out_file.close()
                    player1 = {}
                
                    
        if request_data["DeviceID"] == '44c9efaf67334f99a2de1c6dd0821cc9':
            if len(player2) < 20:
                player2.update({str(request_time):request_data})
                
            else:
                if not os.path.exists(str('./'+file_name_player2)) :
                    out_file = open(file_name_player2, "w") 
                    json.dump(player2, out_file, indent = 6)
                    out_file.close()
                    player2 = {}
                else:
                    out_file = open(file_name_player2, "a+") 
                    json.dump(player2, out_file, indent = 6)
                    out_file.close()
                    player2 = {}
                                               
        
###fucntion to retrieve json data
@app.route("/getdata", methods=['GET', 'POST'])
def getdata():
    
    if request.method == "POST":
        #request with data 
        datetime0 = datetime.now()
        t0 = time.perf_counter()
        myrequest = request.get_json()
        request_time = datetime0 + timedelta(0, time.perf_counter()-t0)
        
        #write json file
        writeJsonData(request_time, myrequest)
      
        return ("POST")
    else:
        return("GET")
        pass


if __name__ == "__main__":
    
    app.run(host ='192.168.0.103', port=5000)
    #app.run()
    
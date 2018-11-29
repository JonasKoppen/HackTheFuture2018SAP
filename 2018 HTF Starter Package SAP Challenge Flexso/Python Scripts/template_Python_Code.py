#import libraries
import requests,  base64, os, random

#connection params to IoT Services
hostiot4 ='flexso.eu10.cp.iot.sap/iot/gateway/rest'
path = '/measures/XXXX'
url = "https://"+hostiot4+path

#Devcie en Sensor paramas
artifact_id="XXXX"
sensorAlternateId='XXXX'
capabilityAltID='HTF_CAP'

#Data
artifact_signals = []


#Convert images to base64
def imageToBase64 ():
	global artifact_signals
	files = os.listdir('./images/')
	print(files)
	for f in files:
		with open("./images/" + f, "rb") as image_file:
			encoded_string = base64.b64encode(image_file.read())
			artifact_signal = encoded_string.decode("utf-8")
			artifact_signals.append(artifact_signal)

#Post data to IoT Services
def postiotcf ():
	global artifact_signals
	for signal in artifact_signals:
		longitude=random.randint(-180, 180)
		latitude=random.randint(-90, 90)
		payload ="{ \"capabilityAlternateId\": \""+str(capabilityAltID)+"\",\"sensorAlternateId\": \""+str(sensorAlternateId)+"\", \"measures\":" + "{\"artifact_id\":" + "\"" + str(artifact_id) + "\"" +", \"longitude\":" + "\"" + str(longitude)+ "\"" +", \"latitude\":" + "\"" + str(latitude)+ "\"" +", \"artifact_signal\":" + "\"" + signal + "\"" +"}"+"}"
		headers = {'content-type': "application/json", 'cache-control': "no-cache" }
		print("Payload to post: ", payload )
		response = requests.request("POST", url, data=payload, headers=headers,cert=('./credentials.crt', './credentials.key'))
		print(response.status_code, response.text)
	return

try:
	imageToBase64()
	postiotcf()
	
except KeyboardInterrupt:
	print("The artifact stopt sending signals!")
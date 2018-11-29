import requests # http://docs.python-requests.org/en/master/
import time, sys, platform, os
import base64


try:
	files = os.listdir('./images/')
	print(files)
	for f in files:
		with open("./images/" + f, "rb") as image_file:
			encoded_string = base64.b64encode(image_file.read())
			print(encoded_string)
	
except KeyboardInterrupt:
	print("Stopped by the user!")
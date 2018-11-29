sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/List',
	'sap/m/StandardListItem',
   "sap/m/MessageToast"
], function (Controller, MessageBox, JSONModel, Button, Dialog, List, StandardListItem, MessageToast) {
	"use strict";

	return Controller.extend("com.flexso.HackTheFuture.controller.Main", {

		onInit: function () {
			this.getIotData();
		},

		getIotData: function () {
			// url to get the artifact signals of your device : 
			// '/devices/XX/measures'  -> XX = your device id
			console.log("getIOTData");
			var promise = new Promise(function (resolve, reject) {
				$.ajax({
					type: "GET",
					url: "/devices/109/measures",
					headers: "",
					success: function (data) {
						console.log(data);
						resolve(data);
					},
					error: function (Error) {
						reject((Error));
					},
					contentType: false,
					async: true,
					data: null,
					cache: false,
					processData: false
				});
			});
			var me = this;

			return Promise.resolve(promise).then(function (result) {
				return me.groupData(result);
			});
		},

		groupData: function (result) {
			var out = [];
			for(var i in result)
			{
				switch(i%4)
				{
					case 0:
						out[(i-i%4)/4] = result[i].measure;
						break;
					case 1:
						out[(i-i%4)/4].longitude = result[i].measure.longitude;
						break;
					case 2:
						out[(i-i%4)/4].latitude = result[i].measure.latitude;
						break;
					case 3:
						out[(i-i%4)/4].artifact_signal = result[i].measure.artifact_signal;
						break;
				}
			}
			console.log(out);
			return JSON.stringify(out);
		},

		triggerML: function (oEvent) {
		},

		getMlAuthToken: function () {
			var promise = new Promise(function (resolve, reject) {
				$.ajax({
					type: "GET",
					url: "/token?grant_type=client_credentials",
					headers: "",
					success: function (data) {
						resolve(data);
					},
					error: function (Error) {
						reject((Error));
					},
					contentType: false,
					async: true,
					data: null,
					cache: false,
					processData: false
				});
			});

			return Promise.resolve(promise).then(function (result) {
				return "Bearer " + result.access_token;
			});
		},

		sendToMl: function () {
		
			//Use the following format to send to ML (image name can always be 'ArtifactSignal.jpg')
			//image is a variable
			//var formData = new FormData();
			//formData.append("files", image, "ArtifactSignal.jpg");
			
			//url to post on : '/ml-dest/api/v2/image/classification/models/HTF/versions/2'
			

		},

		base64toBlob: function (b64Data, contentType, sliceSize) {

			sliceSize = sliceSize || 512;

			var byteCharacters = atob(b64Data);
			var byteArrays = [];

			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);

				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				var byteArray = new Uint8Array(byteNumbers);

				byteArrays.push(byteArray);
			}

			var blob = new Blob(byteArrays, {
				type: contentType
			});
			return blob;
		}

	});
});


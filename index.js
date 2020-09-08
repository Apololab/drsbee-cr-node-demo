/*
*	
	Demo project to test drsbee client. 
	Apololab SA.
*/

var drsbee = require("drsbee.client");
var readline = require('readline');


let config = drsbee.BackendConfiguration.DEV_CR;
let infoWebService = new drsbee.InfoWebService(config);

let userWebService = new drsbee.UserWebService(config);

let patientWebService = new drsbee.PatientWebService(config);

let encounterWebService = new drsbee.EncounterWebService(config);

let drugWebService = new drsbee.DrugWebService(config);

let catalogWebService = new drsbee.CatalogWebService(config);



console.log("\n");
console.log("\n");
console.log("THIS IS A DEMO PROJECT PROJECT TO SHOW HOW TO USE THE DRSBEE CLIENT TO MAKE PRESCRIPTIONS");
console.log("\n");
console.log("First we get all catalogs");

let timeOutPromise = catalogWebService.getTimeUnitsAsync();
let allergyPromise = catalogWebService.getAllergyOcurrenceReactionsAsync();
let adherencePromise = catalogWebService.getAdherencesAsync();
let perceptionPromise = catalogWebService.getPerceptionsAsync();
let allergenStatusPromise = catalogWebService.getAllergenStatusesAsync();
let treatmentStatusesPromise = catalogWebService.getTreatmentStatusesAsync();
let diagnosticStatusesPromise = catalogWebService.getDiagnosticStatusesAsync();
let medicalSpecialitiesPromise = catalogWebService.getMedicalSpecialitiesAsync();
let countriesPromise = catalogWebService.getCountriesAsync();
let gendersPromise = catalogWebService.getGendersAsync();
let ethnicitiesPromise = catalogWebService.getEthnicitiesAsync();
let occupationsPromise = catalogWebService.getOccupationsAsync();
let insurancesPromise = catalogWebService.getInsurancesAsync();
let maritalStatusesPromise = catalogWebService.getMaritalStatusesAsync();
let identificationTypesPromise = catalogWebService.getIdentificationTypesAsync();
let contactTypesPromise = catalogWebService.getContactTypesAsync();
let prescriptionsAbbreviaturesPromise = catalogWebService.getPrescriptionAbbreviaturesAsync();
let doseUnitsPromise = catalogWebService.getDoseUnitsAsync();
let administrationRoutesPromise = catalogWebService.getAdministrationRoutesAsync();

Promise.all([timeOutPromise, allergyPromise, adherencePromise, perceptionPromise, allergenStatusPromise, treatmentStatusesPromise,
				diagnosticStatusesPromise, medicalSpecialitiesPromise, countriesPromise, gendersPromise, ethnicitiesPromise, 
				occupationsPromise, insurancesPromise, maritalStatusesPromise, identificationTypesPromise, contactTypesPromise,
				prescriptionsAbbreviaturesPromise, doseUnitsPromise, administrationRoutesPromise]).then(values => { 
  	console.log("All catalogs retrieved");
  	initProcess();
  	//console.log(values);
}, reason => {
  	console.log(reason);
});


const rl = readline.createInterface({
  	input: process.stdin,
  	output: process.stdout
});


function initProcess () {
	console.log("\n");
	console.log("\n");
	console.log("We get the environment info");
	infoWebService.getBackendEnvironmentAsync().then(function(val) {
	  	console.log(val);
	  	login();
	})
	.catch(function(reason) {
	    console.log('Get environment info failed ('+reason+') aquí.');
		rl.close();
	});
}

function login() {
	console.log("\n");
	console.log("\n");
	console.log("Menu:");
	console.log("\t 1 - Login");
	console.log("\t 2 - Exit");
	rl.question('Select an option ', (answer) => {
		
	  	switch (answer) {
			case "1":
				userWebService.loginAsHealthprofessionalAsync("doctor@test.com", "MedioQueso2020").then(function(val) {
			      	//console.log(val);
			      	searchPatient();
			    })
			  	.catch(function(reason) {
					console.log('Login failed - ('+reason+')');
					rl.close();
			    });
				break;
			case "2":
				rl.close();
				break;
		}
	});
}


function searchPatient() {
	console.log("\n");
	rl.question('Type a patient id or name: ', (answer) => {
	  	
	  	console.log(answer);
	  	patientWebService.searchPatientsAsync(answer, true, 20).then(val => {
	  		selectPatient(val);
	  	})
	  	.catch(reason => {
		      console.log('Patient search failed - ('+reason+')');
		      selectPatient(null);
	    });
	});


	/*patientWebService.getBasicPatientByIdentificationAsync("987654322", "1", true).then(val => {
  		console.log(val);
  	})
  	.catch(reason => {
	      console.log('Patient search failed - ('+reason+')');
    });*/
};

function selectPatient(patientResult) {
	console.log("\n");
	var i = 1;
	if (patientResult != null) {
		patientResult.forEach(element => { 
			console.log(`${i} - ${element.firstName} ${element.lastName} - ID: ${element.identification}`);
			i++;
		});
	}
	console.log("\n");
  	console.log("\n");
  	console.log("We will use a default patient");
  	encounterWebService.beginEncounterPatientAsync("67").then(val => {
  		console.log(val);
  		let encounter = val;

  		// TEST 
		console.log("\n");
		console.log("We get near pharmacies data");
  		encounterWebService.getNearPharmaciesForEncounterAsync(-84.5326935, 10.3857364).then(val => {
	  		console.log(val);
	  		searchDrug(encounter);
	  	})
	  	.catch(reason => {
		     console.log('Get near pharmacies failed - ('+reason+')');
	    });

  	})
  	.catch(reason => {
	     console.log('Begin encounter failed - ('+reason+')');
	     rl.close();
    });

    

    /*
    // This is to init an encounter with a new patient, you can test it if you do not want/need to use an existing patient
    console.log("\n");
  	console.log("We will use a default new patient");
    encounterWebService.beginEncounterNewPatientAsync("987654324", "1", "Test Name", "Test Last Name", "61961996", 8, 4, 1980, "Test").then(val => {
  		console.log(val);
  		let encounter = val;
  		searchDrug(encounter);
  	})
  	.catch(reason => {
	     console.log('Begin encounter failed - ('+reason+')');
	     rl.close();
    });
    */
};

function searchDrug(currentEncounter) {
	console.log("\n");
	
	rl.question('Type the name of a drug: ', (answer) => {

		rl.close();

		// We are using the age and vademecum ID by default
	  	console.log("\n");
	  	console.log("We will use a default pharmacies Ids");
		let availabilityInPharmacyIdsByGroupId = {"12":["123","124","127","128","125","126"],"1":["1","9","7","17","15","8","18","16","21"],"10":["19"],"13":["129","130"],"4":["76"],"11":["120"],"6":["20"]};
	  	drugWebService.findDrugsByFilterWithAvailabilityAsync(answer, availabilityInPharmacyIdsByGroupId, 24, "2").then(val => {
	      	var i = 1;
	      	let drusgsByName = val.drugsByName;
	      	drusgsByName.forEach(element => { 
				console.log(`${i} - ${element.description}`);
				i++;
			});

	      	manageAddedDrug(currentEncounter);
	    })
	  	.catch(reason => {
	  		rl.close();
	      	console.log('Drug search failed - ('+reason+')');
			manageAddedDrug(currentEncounter);
	    });

	    /*
	  	// We are using the age and vademecum ID by default
	  	// You can also search drugs this way. This way do not verify availability on near pharamcies previously obtained
	  	drugWebService.findDrugsByFilterAsync(answer, 24, "2").then(val => {
	      	var i = 1;
	      	let drusgsByName = val.drugsByName;
	      	drusgsByName.forEach(element => { 
				console.log(`${i} - ${element.description}`);
				i++;
			});

	      	manageAddedDrug(currentEncounter);
	    })
	  	.catch(reason => {
	  		rl.close();
	      	console.log('Drug search failed - ('+reason+')');
			manageAddedDrug(currentEncounter);
	    });
		*/
	});
};

function manageAddedDrug(currentEncounter) {
	console.log("\n");
  	console.log("\n");
  	console.log("We will use a default drug");
  	console.log("Now we get drug suggestions by drug id");
	drugWebService.getDrugSuggestionByDrugIdAsync([7], 70, 24).then(val => {
      	console.log(val);

		console.log("\n");
	  	console.log("\n");
	  	console.log("Now we check the prescription");

      	var encounterPrescriptionCheck = {"additionalDrugIdByVademecumId":{},"encounter":{"accessToPatientProfile":false,"patientClinicalData":{"weight":70.0,"weightLastModificationDate":"2018-09-03T17:26:07Z","weightCalculated":false,"phoneNumber":"61961996","email":"rafa.quesada.al@hotmail.com"},"statusCode":"1","physicianIdentification":"206190142","physicianIdentificationTypeCode":"1","physicianAddress":"Ciudad Quesada, San Carlos, 200m este de la guardia rural","physicianPhoneNumber":"8856-8954","physicianEmail":"doctor@test.com","patientIdentification":"116370944","patientIdentificationTypeCode":"1","physicianNameTitle":"Dra.","prescription":{"references":[],"nonDrugs":[],"drugs":[{"dose":1.0,"doseUnitCode":"1","allowsGenerics":true,"refills":0,"drugDescription":"ACEPRESS","drugId":"7","vademecumId":"2","vademecumDescription":"Vademecum Apolo","duration":1,"doseUnitDescription":"Tableta","administrationRouteDescription":"Oral","frequencyTimeUnitCode":"2","durationTimeUnitCode":"4","administrationRouteId":"10","frequency":1,"prescriptionAbbreviatureCode":"1","hours":[{"hour":8,"minutes":0}],"drugDescriptionPhrase":"ACEPRESS TABLETA 150 mg"}],"diagnostics":[],"healthProblemReferences":[],"patientPaymentDate":"0001-01-01T00:00:00Z","drsbeePaymentDate":"0001-01-01T00:00:00Z","consultCost":0.0,"prescriptionCost":0.0,"othersCost":0.0,"patientPaymentDismissed":false,"totalCost":0.0},"patientName":"Rafael Angel Quesada Alpizar","patientBirthDate":"1996-04-07T00:00:00Z","physicianName":"María Rojas","encounterMedicalForms":[],"physicianMedicalSpeciality":"Cirugía ortopédica","physicianId":"1","date":"2020-09-07T13:50:04Z","statusDescription":"En progreso","id":"39808","patientId":"67"},"ehrModifications":{"drugTreatments":[],"healthProblems":[],"nonDrugTreatments":[],"allergies":[],"patientMedicalForms":[],"patientAttachments":[]},"checkOutdatedDrugs":false,"considerSelectedAdmRouteForInteractions":false};
	    encounterPrescriptionCheck.encounter = currentEncounter;
	    encounterWebService.checkEncounterPrescriptionAsync(encounterPrescriptionCheck).then(val => {
	      	console.log("checkEncounterPrescriptionAsync ===>");
	      	console.log(val);


	      	console.log("\n");
		  	console.log("\n");
		  	console.log("Now we check the concomitants treatments");
		  	console.log("This one can fail if the physician has no access to the patient profile");
	      	patientWebService.getSameDayDrugTreatments("67", "2020-09-07T18:56:30Z", [480], 1, "2", 1, "2").then(val => {
		      	console.log("getSameDayDrugTreatments ===>");
		      	console.log(val);
		      	reviewAndFinish(currentEncounter);
		    })
		  	.catch(reason => {
		      	console.log('Get concomitants treatments failed - ('+reason+')');
		      	reviewAndFinish(currentEncounter);
		    });
      	})
	  	.catch(reason => {
	      	console.log('Check prescription failed - ('+reason+')');
	    });

    })
  	.catch(reason => {
      	console.log('Get drug suggestion failed - ('+reason+')');
    });
};


function reviewAndFinish(currentEncounter) {
  	console.log("\n");
  	console.log("Now we review the encounter before finish");
	var prescriptionDocumentRequest = {"drugs":[{"dose":1.0,"doseUnitCode":"1","allowsGenerics":true,"refills":0,"drugDescription":"ACEPRESS","drugId":"7","vademecumId":"2","vademecumDescription":"Vademecum Apolo","notes":"","notesToPharmacy":"","duration":1,"doseUnitDescription":"Tableta","administrationRouteDescription":"Oral","frequencyTimeUnitCode":"2","durationTimeUnitCode":"2","administrationRouteId":"10","frequency":1,"prescriptionAbbreviatureCode":"1","hours":[{"hour":8,"minutes":0}],"drugDescriptionPhrase":"ACEPRESS TABLETA 150 mg"}],"nonDrugs":[],"healthProblemReferences":[],"encounterId":"39808","forceSignature":false};
  	prescriptionDocumentRequest.encounterId = currentEncounter.id
  	encounterWebService.reviewEncounter(prescriptionDocumentRequest).then(val => {
      	console.log("reviewEncounter ===>");
      	console.log(val);

      	var completeEncounter = {"emailNotifications":[],"encounter":{"accessToPatientProfile":true,"patientProfile":{"profileImage":{"url":"https://backend-dev.drsbee.com/drsbee/rest/storage/personimage/a478d5d4-e6ce-47bf-aa65-b5bcbfa9975e","fileName":"picture.jpeg","contentType":"image/jpeg"},"firstEncounterDate":"2019-01-31T21:03:27Z","deathCertificateNumber":"","nationalityCountryCode":"188","nationalityCountryDescription":"Costa Rica","residenceCountryCode":"188","occupationCode":"130","lastName":"Quesada Alpizar","emergencyContact":{"email":"","firstName":"test","phoneNumber":"111","lastName":"test","identification":"@&$&@$$&$"},"genderCode":"2","phoneNumber":"61961996","email":"rafa.quesada.al@hotmail.com","occupationDescription":"Programador","id":"67","maritalStatusCode":"D","maritalStatusDescription":"Casado","socialSecurity":"","genderDescription":"Masculino","deceased":false,"firstName":"Rafael Angel","birthDate":"1996-04-07T00:00:00Z","birthDateGlobal":{"day":7,"month":4,"year":1996,"text":"abr 7, 1996"},"identification":"116370944","identificationTypeCode":"1","identificationTypeDescription":"Cédula Costarricense","residenceCountryDescription":"Costa Rica"},"patientClinicalData":{"weight":70.0,"weightLastModificationDate":"2018-09-03T17:26:07Z","weightCalculated":false,"phoneNumber":"61961996","email":"rafa.quesada.al@hotmail.com"},"statusCode":"1","physicianIdentification":"111910607","physicianIdentificationTypeCode":"1","physicianAddress":"test","physicianPhoneNumber":"","physicianEmail":"doctor3@test.com","patientIdentification":"116370944","patientIdentificationTypeCode":"1","physicianNameTitle":"Dra.","patientName":"Rafael Angel Quesada Alpizar","patientBirthDate":"1996-04-07T00:00:00Z","physicianCode":"10000","physicianName":"Maria Jesus Navarro Charpantier","encounterMedicalForms":[],"physicianMedicalSpeciality":"Cirugía vascular","physicianId":"11","date":"2020-09-07T18:56:50Z","statusDescription":"En progreso","id":"39830","patientId":"67"},"smsNotifications":[],"ehr":{"drugTreatments":[],"healthProblems":[],"nonDrugTreatments":[],"allergies":[],"patientMedicalForms":[],"patientAttachments":[]},"locationLatitude":10.385736399999999,"locationLongitude":-84.5326935,"consultCost":0.0,"prescriptionCost":0.0,"othersCost":0.0};
    	completeEncounter.encounter = currentEncounter;
    	console.log("\n");
  		console.log("Now we finish the encounter");
    	encounterWebService.finishEncounterAsync(completeEncounter).then(val => {
      		console.log("finishEncounterAsync ===>");
	      	console.log(val);

	      	console.log("\n");
	  		console.log("Now we get the physician remaining prescriptions");
	    	userWebService.getHealthProfessionalRemainingPrescriptionsAsync().then(val => {
	      		console.log("getHealthProfessionalRemainingPrescriptionsAsync ===>");
		      	console.log(val);
		    })
		  	.catch(reason => {
		      	console.log('Get physician remaining prescriptions failed - ('+reason+')');
		    });
	    })
	  	.catch(reason => {
	      	console.log('Finish encounter failed - ('+reason+')');
	    });
    })
  	.catch(reason => {
      	console.log('Review encounter failed - ('+reason+')');
    });
}
import firebase_admin 
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./unipayf24-firebase-adminsdk-htopk-7786ba0ef8.json")  
firebase_admin.initialize_app(cred)
db = firestore.client()

#load json to firebase
def transformed_information(document):
    { 
        #Takes in json and load to firebase. load document information back into firebase 


    }
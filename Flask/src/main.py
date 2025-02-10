from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin 
from firebase_admin import credentials, firestore, auth
import numpy as np
import os
import sys
import joblib 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models.run_model import run_model

app = Flask(__name__)
CORS(app) 

os.environ["LOKY_MAX_CPU_COUNT"] = "4"
cred = credentials.Certificate("../unipayf24-firebase-adminsdk-htopk-7786ba0ef8.json")  
firebase_admin.initialize_app(cred)
db = firestore.client()


class LoanTerms: 
    def __init__(self, loanAmount, interestRate, termLength, repaymentSchedule, startDate, endDate, monthlyPayment, status):
      self.loanAmount = loanAmount
      self.interestRate = interestRate
      self.termLength = termLength 
      self.repaymentSchedule = repaymentSchedule
      self.startDate = startDate
      self.endDate = endDate
      self.monthlyPayment = monthlyPayment
      self.status = status
    def to_dict(self): 
      return {
            "loanAmount": self.loanAmount,
            "interestRate": self.interestRate,
            "termLength": self.termLength,
            "repaymentSchedule": self.repaymentSchedule,
            "startDate": self.startDate,
            "endDate": self.endDate,
            "monthlyPayment": self.monthlyPayment,
            "status": self.status
        }
    def create_loanTerms(self, user_id, app_id): 
      try: 
         doc_ref = db.collection("users").document(user_id).collection("loanApplications").document(app_id)
         doc_ref.update({"loanTerms": self.to_dict()})
  
      except Exception as e: 
         print("Error updating document", e)


def interest_rate(user_id, app_id):
       try: 
          doc_ref = db.collection("users").document(user_id).collection("loanApplications").document(app_id)
        
          model_input = {
            "income": 55000,  # Annual income in USD
            "employment_length": 3,  # Years employed
            "loan_amount": 15000,  # Loan amount requested in USD
            "loan_percent_income": 0.27,  # Loan as a percentage of income (15,000 / 55,000)
            "credit_history_length": 5,  # Credit history in years
            "home_ownership": 2,  # Possible values: "Own", "Mortgage", "Rent"
            "default_on_file": 1  # 1 if prior defasult, 0 if no defaults
          }
        
        #Initialize Model 
          model = joblib.load("../models/predicted_interest.joblib")
          features = np.array(list(model_input.values()), dtype=np.float32).reshape(1, -1)
          prediction = model.predict(features)
          proba = round(float(prediction[0]), 2) 


          doc_ref.update({"loanTerms.interestRate": proba})

          return proba
          
       except Exception as e: 
         print("Error updating document", e)

def fetch_application(user_id: str, app_id: str):
    try: 
       doc_ref = db.collection("users").document(user_id).collection("loanApplications").document(app_id)
       doc = doc_ref.get()
       if doc.exists: 
          return doc.to_dict()
       else: 
          return {"error": "Document not found"}
    except Exception as e: 
       return {"error": str(e)}
       
def elt():
   
    document = process_pdf() #output: extracted json 
    transformed_document = load_document(schema_name, json_schema, document)#output: structured json
    transformed_information(transformed_document)#output: upload to firebase

@app.route("/api/application_submitted", methods=['POST'])
def application_submitted(): 
    try: 
        # extract the token from the request headers
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized, missing token"}), 401

        id_token = auth_header.split("Bearer ")[-1]

        # verify token
        try:
            decoded_token = auth.verify_id_token(id_token)
            authenticated_user_id = decoded_token["uid"]
        except Exception as e:
            return jsonify({"error": "Invalid or expired token", "details": str(e)}), 403

        data = request.get_json()
        user_id = data.get("user_id")
        app_id = data.get("app_id")

        #authenticated user matches the request's user_id
        if authenticated_user_id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403

        #Loan Terms Dictionary 
        loanAmount = 10000
        interestRate = 0
        termLength = 12
        repaymentSchedule = "monthly"
        startDate = "2025-01-01"
        endDate = "2026-01-01"
        monthlyPayment = 850
        status = "pending"

        #LoanTerms object and process the loan
        obj = LoanTerms(
            loanAmount, interestRate, termLength, repaymentSchedule, startDate, endDate, monthlyPayment, status
        )
        obj.create_loanTerms(user_id, app_id)

        calculated_interest_rate = interest_rate(user_id, app_id)
        print(calculated_interest_rate)

        return jsonify({"message": "Loan application submitted successfully", "interest_rate": calculated_interest_rate})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
  
  app.run(debug=True)


  




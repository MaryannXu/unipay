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
from models.fico_model import calculate_fico_score

app = Flask(__name__)
CORS(app, resources={r"/api/": {"origins":["http://localhost:3000", "https://flask-fire-611946450050.us-central1.run.app"]}}) 

os.environ["LOKY_MAX_CPU_COUNT"] = "4"
cred = credentials.Certificate("./unipayf24-firebase-adminsdk-htopk-7786ba0ef8.json")  
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
         doc = doc_ref.get()

         if doc.exists:
            print("document exists. add loan terms")
            existing_data = doc.to_dict()
            existing_loan_terms = existing_data.get("loanTerms", {})
            existing_loan_terms.update(self.to_dict())  # Merge without overwriting other fields
            doc_ref.set({"loanTerms": existing_loan_terms}, merge=True)
         else:
            print("document does not exist")
            doc_ref.set({"loanTerms": self.to_dict()}, merge=True)
  
      except Exception as e: 
         print("Error updating document", e)
      return self.to_dict()

class Fico_Application:
   def __init__(self, ficoScore, payment_history_score, credit_utilization_score, 
             credit_history_score, new_credit_score, credit_mix_score):
        self.ficoScore = ficoScore
        self.payment_history_score = payment_history_score
        self.credit_utilization_score = credit_utilization_score
        self.credit_history_score = credit_history_score
        self.new_credit_score = new_credit_score
        self.credit_mix_score = credit_mix_score

   def to_dict(self): 
      return {
            "ficoScore": self.ficoScore,
            "payment_history_score": self.payment_history_score,
            "credit_utilization_score": self.credit_utilization_score,
            "credit_history_score": self.credit_history_score, 
            "new_credit_score": self.new_credit_score, 
            "credit_mix_score": self.credit_mix_score
        }
   def create_fico_score(self, user_id, app_id): 
    try: 
        doc_ref = db.collection("users").document(user_id).collection("creditScoreResponses").document(app_id)
        doc = doc_ref.get()
        


        if doc.exists:
            print("Document exists. Adding fico_score.")
            existing_data = doc.to_dict()
            existing_loan_terms = existing_data.get("fico_score_data", {})
            existing_loan_terms.update(self.to_dict())  # Merge without overwriting other fields
            doc_ref.set({"fico_score_data": existing_loan_terms}, merge=True)
        else:
            print("document does not exist")
            doc_ref.set({"fico_score_data": self.to_dict()}, merge=True)
            
    except Exception as e: 
        print("Error updating document", e)
    return self.to_dict()

def interest_rate(user_id, app_id):
       try: 
          doc_ref = db.collection("users").document(user_id).collection("loanApplications").document(app_id)
          doc = doc_ref.get()

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

          return proba
          
       except Exception as e: 
         print("Error updating document", e)


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
        calculated_interest_rate = interest_rate(user_id, app_id)
        print(calculated_interest_rate)

        obj = LoanTerms(
            loanAmount, calculated_interest_rate, termLength, repaymentSchedule, startDate, endDate, monthlyPayment, status
        )
        newLoanTerms = obj.create_loanTerms(user_id, app_id)


        return jsonify({"message": "Loan application submitted successfully", "interest_rate": calculated_interest_rate, "new terms":newLoanTerms})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/fico_score", methods=['POST'])
def calculated_fico_score(): 
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
        
        doc_ref = db.collection("users").document(user_id).collection("creditScoreResponses").document(app_id)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({"error": "Document not found"}), 404
            
        doc_data = doc.to_dict()
        
        # Extract responses array from the document
        responses = doc_data.get("responses", [])
        
        # Convert responses array to dictionary for easier access
        data_dict = {}
        for item in responses:
            data_dict.update(item)
        
        def to_number(value):
            try:
                return float(value) if value not in ["N/A", None, ""] else 0.0
            except ValueError:
                return 0.0
                
        features = {
            "account_balance": to_number(data_dict.get("account_balance", "N/A")),
            "credit_length": to_number(data_dict.get("credit_length", "N/A")),
            "credit_limit": to_number(data_dict.get("credit_limit", "N/A")),
            "credit_line_status": to_number(data_dict.get("credit_line_status", "N/A")),
            "credit_overdue": to_number(data_dict.get("credit_overdue", "N/A")),
            "total_loans": to_number(data_dict.get("total_loans", "N/A")),
            "total_credit_cards": to_number(data_dict.get("total_credit_cards", "N/A")),
        }
        
        fico_score, payment_history_score, credit_utilization_score, credit_history_score, new_credit_score, credit_mix_score = calculate_fico_score(features)

        obj = Fico_Application(fico_score, payment_history_score, credit_utilization_score, credit_history_score, new_credit_score, credit_mix_score)
        new_fico_score = obj.create_fico_score(user_id, app_id)
        return jsonify({"message": "fico score application submitted successfully", "fico Score": fico_score})

    except Exception as e:
        print(f"Error in calculated_fico_score: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
  
  app.run(debug=True)


  




import joblib 
import numpy as np
import os


os.environ["LOKY_MAX_CPU_COUNT"] = "4"

#Perform borrower assessment(s)
def model(model_path, data): 
    model = joblib.load({model_path})
    features = np.array(data, dtype=np.float32).reshape(1, -1)
    prediction = model.predict(features)
    proba = prediction 
    return proba

def run_model( model_path): 

        #Create Dictionary Using Required Fields
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
        model = joblib.load(model_path)
        features = np.array(list(model_input.values()), dtype=np.float32).reshape(1, -1)
        prediction = model.predict(features)
        proba = prediction 
        
        return round(float(prediction[0]), 2)


if __name__ == "__main__":
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
        model = joblib.load("./predicted_interest.joblib")
        features = np.array(list(model_input.values()), dtype=np.float32).reshape(1, -1)
        prediction = model.predict(features)
        proba = prediction 
        
        print(proba)

  





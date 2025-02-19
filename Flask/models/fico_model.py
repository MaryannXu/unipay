def calculate_fico_score(data):
    
    
    payment_history_weight = 0.35
    credit_utilization_weight = 0.30
    credit_history_length_weight = 0.15
    new_credit_weight = 0.10
    credit_mix_weight = 0.10
    
    #payments
    if data["credit_overdue"] > 0: 
        payment_history_score = 300
    else: 
        payment_history_score = 850

    #credit utilization: 
    if data["credit_limit"] > 0: 
        credit_utilization_ratio = data["account_balance"]/data["credit_limit"]
    else: 
        credit_utilization_ratio = 1
    if credit_utilization_ratio > 1:
        credit_utilization_score = 300
    elif credit_utilization_ratio > 0.8:
        credit_utilization_score = 400
    elif credit_utilization_ratio > 0.5:
        credit_utilization_score = 500
    elif credit_utilization_ratio > 0.3:
        credit_utilization_score = 600
    elif credit_utilization_ratio > 0.1:
        credit_utilization_score = 750
    else:
        credit_utilization_score = 850

    #credit history length
    credit_history_length = data["total_loans"]
    if credit_history_length > 5:
        credit_history_score = 850
    elif credit_history_length > 4:
        credit_history_score = 750
    elif credit_history_length > 2:
        credit_history_score = 650
    elif credit_history_length > 1:
        credit_history_score = 500
    else:
        credit_history_score = 350

    #open credit lines and credit mix 
    if data["credit_line_status"] == "none":
        credit_lines = 0
        credit_mix = 0
    elif data["credit_line_status"] == "loans": 
        credit_lines = data["total_loans"]
        credit_mix = 1
    elif data["credit_line_status"] == "credit": 
        credit_lines = data["total_credit_cards"]
        credit_mix = 1
    elif data["credit_line_status"] == "both":
        credit_lines = data["total_credit_cards"] + data["total_loans"]
        credit_mix = 2
    else:
        # Handle unexpected credit_line_status values
        # This ensures we always have values assigned
        credit_lines = data.get("total_credit_cards", 0) + data.get("total_loans", 0)
        credit_mix = 0
    if credit_lines > 5:
        new_credit_score = 300
    elif credit_lines > 3:
        new_credit_score = 500
    elif credit_lines > 2:
        new_credit_score = 650
    else:
        new_credit_score = 850
    

    #credit mix score 
    credit_mix_score = 300 + (credit_mix * 250)
    
    #final fico score
    fico_score = (
        payment_history_score * payment_history_weight +
        credit_utilization_score * credit_utilization_weight +
        credit_history_score * credit_history_length_weight +
        new_credit_score * new_credit_weight +
        credit_mix_score * credit_mix_weight
    )
    fico_score = (min(max(int(fico_score), 300), 850))

    return  (fico_score, payment_history_score, credit_utilization_score, 
             credit_history_score, new_credit_score, credit_mix_score) # Ensure score is within 300-850 range


if __name__ == "__main__":
    data = {
        "credit_overdue": 0,  # 0 means no overdue payments
        "account_balance": 0,  # Current account balance
        "credit_limit": 0,  # Total credit limit across all accounts
        "total_loans": 0,  # Number of loans the user has
        "credit_line_status": "both",  # Can be "none", "loans", "credit", or "both"
        "total_credit_cards": 0  # Number of active credit card accounts
    }
    
    fico_score = calculate_fico_score(data)
    print(fico_score)

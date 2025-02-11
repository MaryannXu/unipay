import os
from dotenv import load_dotenv
from openai import OpenAI
import openai
import json


schemas = {
    "studentInfo_schema": [{
        "student_info": {
            "personal": [{
                "name": "string",
                "origin_country": "string",
                "highest_attained_degree": "string",
                "admission_status": "string"
            }],
            "prior_university": [{
                "university": "string",
                "grad_date": "YYYY-MM-DD",
                "degree_type": "string",
                "major": "string",
                "gpa": "number"
            }],
            "current_university": [{
                "university": "string",
                "start_date": "YYYY-MM-DD",
                "grad_date": "YYYY-MM-DD",
                "degree_type": "string",
                "major": "string",
                "gpa": "number"
            }]
        }
    }],
    "Employement_Statement": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "employer": "string",
            "job_title": "string",
            "start_date": "YYYY-MM-DD",
            "end_date": "YYYY-MM-DD",
            "income": "number"
        }]
    }],
    "Bank_Statement": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "account_holder_name": "string",
            "bank_name": "string",
            "account_type": "string",
            "account_number": "string",
            "transaction_history": [{
                "date": "YYYY-MM-DD",
                "description": "string",
                "amount": "number",
                "transaction_type": "string"
            }],
            "current_balance": "number",
            "average_monthly_balance": "number"
        }]
    }],
    "Proof_of_Scholarship": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "scholarship_name": "string",
            "issuing_organization": "string",
            "scholarship_amount": "number",
            "scholarship_period_start": "YYYY-MM-DD",
            "scholarship_period_end": "YYYY-MM-DD"
        }]
    }],
    "University_Billing": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "university_name": "string",
            "student_name": "string",
            "student_id": "string",
            "tuition_amount_total": "number",
            "tuition_balance_remaining": "number",
            "payment_due_date": "YYYY-MM-DD"
        }]
    }],
    "Proof_of_Attendance_Current": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "university_name": "string",
            "student_name": "string",
            "student_id": "string",
            "enrollment_status": "string",
            "current_semester": "string",
            "program": "string",
            "degree_type": "string",
            "expected_graduation_date": "YYYY-MM-DD",
            "issuing_authority": "string",
            "gpa": "number"
        }]
    }],
    "Proof_of_Admission_Current": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "university_name": "string",
            "student_name": "string",
            "admission_status": "string",
            "admission_date": "YYYY-MM-DD",
            "program": "string"
        }]
    }],
    "Proof_of_Attendance_Past": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "university_name": "string",
            "student_name": "string",
            "program": "string",
            "enrollment_start_date": "YYYY-MM-DD",
            "enrollment_end_date": "YYYY-MM-DD",
            "degree_completed": "boolean",
            "academic_transcript_ref": "string"
        }]
    }],
    "Proof_of_Diploma": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "university_name": "string",
            "student_name": "string",
            "degree_name": "string",
            "field_of_study": "string",
            "graduation_date": "YYYY-MM-DD",
            "diploma_certificate_number": "string",
            "issuing_authority": "string"
        }]
    }],
    "Proof_of_Visa": [{
        "user_id": "number",
        "document_id": "number",
        "document_type": "string",
        "upload_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "document_metadata": [{
            "visa_type": "string",
            "visa_holder_name": "string",
            "passport_number": "string",
            "visa_issue_date": "YYYY-MM-DD",
            "visa_expiry_date": "YYYY-MM-DD",
            "country_of_issuance": "string",
            "visa_status": "string",
            "visa_sponsor": "string"
        }]
    }]
}


def configure_env():
    # Load environment variables
    load_dotenv()

def schema_type(selected_schema):
    schema = schemas.get(selected_schema)
    if schema:
        return schema
    else:
        return None

def extract_information(extracted_text, document_class):

    configure_env()
    api_key = os.getenv("OPENAI_API_KEY")  
    if not api_key:
        raise ValueError("API key not found in environment variables.")
    
    openai.api_key = api_key  

    # System prompt
    system_prompt = f"""
        You are an ENR-like data extraction tool that extracts international student data from PDFs.

        1. Please extract the data in this {document_class} PDF document, grouping data according to theme/sub-groups, and output into JSON.

        2. Please keep the keys and values of the JSON in the original language.

        3. The type of data you might encounter in the document includes but is not limited to: total tuition cost, GPA, related grade metrics, and university acceptance, etc.

        4. If the page contains no student data, please output an empty JSON object and don't make up any data.

        5. If there are blank data fields in the document, include them as "null" values in the JSON object.

        6. If there are tables in the document, capture all rows and columns in the JSON object. Even if a column is blank, include it as a key in the JSON object with a null value.

        7. If a row is blank, denote missing fields with "null" values.

        8. Don't interpolate or make up data.

        9. Maintain the table structure for cost, grades, and data similar (i.e., capture all rows and columns in the JSON object).
    """
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"), 
    )
    # OpenAI chat API call
    response = client.chat.completions.create(
        model="gpt-3.5-turbo", 
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": extracted_text},
        ],
        temperature=0.0,
    )
    response_message = response.choices[0].message.content
 #   print(response_message)
    return response_message

def transform_emplyment_statement(json_raw, json_schema):
    # Load environment variables
    configure_env()
    
    # Retrieve the OpenAI API key from the environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables.")
    
    # Set the API key for OpenAI
    openai.api_key = api_key

    # System prompt tailored for document classification
    schema = schema_type(json_schema)
    system_prompt = f"""
You are a data transformation tool that takes in JSON data and a reference JSON schema, and outputs JSON data strictly adhering to the schema.

### Instructions:
1. **Validation**:
   - Ensure all values conform to the expected data types and formats specified in the schema.
   - For fields with predefined categories (e.g., "degree_type"), only use valid values as per the schema. If the input data does not match, set the value to "null".

2. **Translation**:
   - Translate all input data into English if not already in English.

3. **Formatting**:
   - Ensure dates are formatted as "YYYY-MM-DD".
   - Preserve numerical precision (e.g., for GPA).

4. **Handling Missing or Invalid Data**:
   - If a field is missing in the input JSON or the value is invalid (e.g., "major" in "degree_type"), set it to "null".
   - Do not guess or infer data. Only transform and map the data that fits the schema.

5. **Output Requirements**:
   - Include all fields in the schema, even if the values are "null".
   - Maintain the structure of the schema, including nested objects and arrays.

6. **Error-Prone Fields**:
   - Pay special attention to fields like:
     - "degree_type": Ensure this matches the schema's allowed values (e.g., "Bachelor's", "Master's", "PhD").
     - "dates": Ensure all dates are valid and formatted correctly.
     - "numbers": Ensure numerical fields (e.g., GPA) are not corrupted or misformatted.
     - "program": area of study(ex. "business", "mechanical engineering")

7. **Examples**:
   - If the input contains "degree_type": "major" and the schema expects "degree_type" as "Bachelor's", "Master's", or "PhD", set the field to "null".
   - If a date is written as "Jan 1, 2025", convert it to "2025-01-01".
   - If a field like "program" is blank, set it to "null".

### Schema:
{schema}
"""


    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
    )
    response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Transform the following raw JSON data according to the provided schema. Ensure all data is in English and formatted as specified by values in the schema. Here is the raw JSON: {json_raw}"}
                    ]
                }
            ],
            temperature=0.0,
    )
    return json.loads(response.choices[0].message.content)

def transform_bank_statement(json_raw, json_schema):
    # Load environment variables
    configure_env()
    
    # Retrieve the OpenAI API key from the environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables.")
    
    # Set the API key for OpenAI
    openai.api_key = api_key

    # System prompt tailored for document classification
    schema = schema_type(json_schema)
    system_prompt = f"""
You are a data transformation tool that takes in JSON data and a reference JSON schema, and outputs JSON data strictly adhering to the schema.

### Instructions:
1. **Validation**:
   - Ensure all values conform to the expected data types and formats specified in the schema.
   - For fields with predefined categories (e.g., "degree_type"), only use valid values as per the schema. If the input data does not match, set the value to "null".

2. **Translation**:
   - Translate all input data into English if not already in English.

3. **Formatting**:
   - Ensure dates are formatted as "YYYY-MM-DD".
   - Preserve numerical precision (e.g., for GPA).

4. **Handling Missing or Invalid Data**:
   - If a field is missing in the input JSON or the value is invalid (e.g., "major" in "degree_type"), set it to "null".
   - Do not guess or infer data. Only transform and map the data that fits the schema.

5. **Output Requirements**:
   - Include all fields in the schema, even if the values are "null".
   - Maintain the structure of the schema, including nested objects and arrays.

6. **Error-Prone Fields**:
   - Pay special attention to fields like:
     - "degree_type": Ensure this matches the schema's allowed values (e.g., "Bachelor's", "Master's", "PhD").
     - "dates": Ensure all dates are valid and formatted correctly.
     - "numbers": Ensure numerical fields (e.g., GPA) are not corrupted or misformatted.
     - "program": area of study(ex. "business", "mechanical engineering")

7. **Examples**:
   - If the input contains "degree_type": "major" and the schema expects "degree_type" as "Bachelor's", "Master's", or "PhD", set the field to "null".
   - If a date is written as "Jan 1, 2025", convert it to "2025-01-01".
   - If a field like "program" is blank, set it to "null".

### Schema:
{schema}
"""


    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
    )
    response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Transform the following raw JSON data according to the provided schema. Ensure all data is in English and formatted as specified by values in the schema. Here is the raw JSON: {json_raw}"}
                    ]
                }
            ],
            temperature=0.0,
    )
    return json.loads(response.choices[0].message.content)

def transform_scholarship_statement(json_raw, json_schema):
    # Load environment variables
    configure_env()
    
    # Retrieve the OpenAI API key from the environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables.")
    
    # Set the API key for OpenAI
    openai.api_key = api_key

    # System prompt tailored for document classification
    schema = schema_type(json_schema)
    system_prompt = f"""
You are a data transformation tool that takes in JSON data and a reference JSON schema, and outputs JSON data strictly adhering to the schema.

### Instructions:
1. **Validation**:
   - Ensure all values conform to the expected data types and formats specified in the schema.
   - For fields with predefined categories (e.g., "degree_type"), only use valid values as per the schema. If the input data does not match, set the value to "null".

2. **Translation**:
   - Translate all input data into English if not already in English.

3. **Formatting**:
   - Ensure dates are formatted as "YYYY-MM-DD".
   - Preserve numerical precision (e.g., for GPA).

4. **Handling Missing or Invalid Data**:
   - If a field is missing in the input JSON or the value is invalid (e.g., "major" in "degree_type"), set it to "null".
   - Do not guess or infer data. Only transform and map the data that fits the schema.

5. **Output Requirements**:
   - Include all fields in the schema, even if the values are "null".
   - Maintain the structure of the schema, including nested objects and arrays.

6. **Error-Prone Fields**:
   - Pay special attention to fields like:
     - "degree_type": Ensure this matches the schema's allowed values (e.g., "Bachelor's", "Master's", "PhD").
     - "dates": Ensure all dates are valid and formatted correctly.
     - "numbers": Ensure numerical fields (e.g., GPA) are not corrupted or misformatted.
     - "program": area of study(ex. "business", "mechanical engineering")

7. **Examples**:
   - If the input contains "degree_type": "major" and the schema expects "degree_type" as "Bachelor's", "Master's", or "PhD", set the field to "null".
   - If a date is written as "Jan 1, 2025", convert it to "2025-01-01".
   - If a field like "program" is blank, set it to "null".

### Schema:
{schema}
"""


    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
    )
    response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Transform the following raw JSON data according to the provided schema. Ensure all data is in English and formatted as specified by values in the schema. Here is the raw JSON: {json_raw}"}
                    ]
                }
            ],
            temperature=0.0,
    )
    return json.loads(response.choices[0].message.content)

def transform_billing_statement(json_raw, json_schema):
    # Load environment variables
    configure_env()
    
    # Retrieve the OpenAI API key from the environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables.")
    
    # Set the API key for OpenAI
    openai.api_key = api_key

    # System prompt tailored for document classification
    schema = schema_type(json_schema)
    system_prompt = f"""
You are a data transformation tool that takes in JSON data and a reference JSON schema, and outputs JSON data strictly adhering to the schema.

### Instructions:
1. **Validation**:
   - Ensure all values conform to the expected data types and formats specified in the schema.
   - For fields with predefined categories (e.g., "degree_type"), only use valid values as per the schema. If the input data does not match, set the value to "null".

2. **Translation**:
   - Translate all input data into English if not already in English.

3. **Formatting**:
   - Ensure dates are formatted as "YYYY-MM-DD".
   - Preserve numerical precision (e.g., for GPA).

4. **Handling Missing or Invalid Data**:
   - If a field is missing in the input JSON or the value is invalid (e.g., "major" in "degree_type"), set it to "null".
   - Do not guess or infer data. Only transform and map the data that fits the schema.

5. **Output Requirements**:
   - Include all fields in the schema, even if the values are "null".
   - Maintain the structure of the schema, including nested objects and arrays.

6. **Error-Prone Fields**:
   - Pay special attention to fields like:
     - "degree_type": Ensure this matches the schema's allowed values (e.g., "Bachelor's", "Master's", "PhD").
     - "dates": Ensure all dates are valid and formatted correctly.
     - "numbers": Ensure numerical fields (e.g., GPA) are not corrupted or misformatted.
     - "program": area of study(ex. "business", "mechanical engineering")

7. **Examples**:
   - If the input contains "degree_type": "major" and the schema expects "degree_type" as "Bachelor's", "Master's", or "PhD", set the field to "null".
   - If a date is written as "Jan 1, 2025", convert it to "2025-01-01".
   - If a field like "program" is blank, set it to "null".

### Schema:
{schema}
"""


    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
    )
    response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Transform the following raw JSON data according to the provided schema. Ensure all data is in English and formatted as specified by values in the schema. Here is the raw JSON: {json_raw}"}
                    ]
                }
            ],
            temperature=0.0,
    )
    return json.loads(response.choices[0].message.content)

def transform_attendance_statement(json_raw, json_schema):
    # Load environment variables
    configure_env()
    
    # Retrieve the OpenAI API key from the environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables.")
    
    # Set the API key for OpenAI
    openai.api_key = api_key

    # System prompt tailored for document classification
    schema = schema_type(json_schema)
    system_prompt = f"""
You are a data transformation tool that takes in JSON data and a reference JSON schema, and outputs JSON data strictly adhering to the schema.

### Instructions:
1. **Validation**:
   - Ensure all values conform to the expected data types and formats specified in the schema.
   - For fields with predefined categories (e.g., "degree_type"), only use valid values as per the schema. If the input data does not match, set the value to "null".

2. **Translation**:
   - Translate all input data into English if not already in English.

3. **Formatting**:
   - Ensure dates are formatted as "YYYY-MM-DD".
   - Preserve numerical precision (e.g., for GPA).

4. **Handling Missing or Invalid Data**:
   - If a field is missing in the input JSON or the value is invalid (e.g., "major" in "degree_type"), set it to "null".
   - Do not guess or infer data. Only transform and map the data that fits the schema.

5. **Output Requirements**:
   - Include all fields in the schema, even if the values are "null".
   - Maintain the structure of the schema, including nested objects and arrays.

6. **Error-Prone Fields**:
   - Pay special attention to fields like:
     - "degree_type": Ensure this matches the schema's allowed values (e.g., "Bachelor's", "Master's", "PhD").
     - "dates": Ensure all dates are valid and formatted correctly.
     - "numbers": Ensure numerical fields (e.g., GPA) are not corrupted or misformatted.
     - "program": area of study(ex. "business", "mechanical engineering")

7. **Examples**:
   - If the input contains "degree_type": "major" and the schema expects "degree_type" as "Bachelor's", "Master's", or "PhD", set the field to "null".
   - If a date is written as "Jan 1, 2025", convert it to "2025-01-01".
   - If a field like "program" is blank, set it to "null".

### Schema:
{schema}
"""


    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
    )
    response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Transform the following raw JSON data according to the provided schema. Ensure all data is in English and formatted as specified by values in the schema. Here is the raw JSON: {json_raw}"}
                    ]
                }
            ],
            temperature=0.0,
    )
    return json.loads(response.choices[0].message.content)

def transform_diploma_statement(json_raw, json_schema):
    # Load environment variables
    configure_env()
    
    # Retrieve the OpenAI API key from the environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables.")
    
    # Set the API key for OpenAI
    openai.api_key = api_key

    # System prompt tailored for document classification
    schema = schema_type(json_schema)
    system_prompt = f"""
You are a data transformation tool that takes in JSON data and a reference JSON schema, and outputs JSON data strictly adhering to the schema.

### Instructions:
1. **Validation**:
   - Ensure all values conform to the expected data types and formats specified in the schema.
   - For fields with predefined categories (e.g., "degree_type"), only use valid values as per the schema. If the input data does not match, set the value to "null".

2. **Translation**:
   - Translate all input data into English if not already in English.

3. **Formatting**:
   - Ensure dates are formatted as "YYYY-MM-DD".
   - Preserve numerical precision (e.g., for GPA).

4. **Handling Missing or Invalid Data**:
   - If a field is missing in the input JSON or the value is invalid (e.g., "major" in "degree_type"), set it to "null".
   - Do not guess or infer data. Only transform and map the data that fits the schema.

5. **Output Requirements**:
   - Include all fields in the schema, even if the values are "null".
   - Maintain the structure of the schema, including nested objects and arrays.

6. **Error-Prone Fields**:
   - Pay special attention to fields like:
     - "degree_type": Ensure this matches the schema's allowed values (e.g., "Bachelor's", "Master's", "PhD").
     - "dates": Ensure all dates are valid and formatted correctly.
     - "numbers": Ensure numerical fields (e.g., GPA) are not corrupted or misformatted.
     - "program": area of study(ex. "business", "mechanical engineering")

7. **Examples**:
   - If the input contains "degree_type": "major" and the schema expects "degree_type" as "Bachelor's", "Master's", or "PhD", set the field to "null".
   - If a date is written as "Jan 1, 2025", convert it to "2025-01-01".
   - If a field like "program" is blank, set it to "null".

### Schema:
{schema}
"""


    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
    )
    response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Transform the following raw JSON data according to the provided schema. Ensure all data is in English and formatted as specified by values in the schema. Here is the raw JSON: {json_raw}"}
                    ]
                }
            ],
            temperature=0.0,
    )
    return json.loads(response.choices[0].message.content)

#determine document type and select function accordingly 
def load_document(schema_name, json_schema, json_raw):
    
    function_name = f"transform_{schema_name}"
    if function_name in globals():
        return globals()[function_name](json_raw, json_schema)
    else:
        raise ValueError(f"Function {function_name} not found!")
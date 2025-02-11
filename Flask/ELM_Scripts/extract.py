from werkzeug.utils import secure_filename
from pdf2image import convert_from_path
from pytesseract import image_to_string
import pytesseract
from PIL import Image
import json
import os
import firebase_admin 
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./unipayf24-firebase-adminsdk-htopk-7786ba0ef8.json")  
firebase_admin.initialize_app(cred)
db = firestore.client()

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

#retrieve document from firebase
def retrieve_document(): 
    {
        #firebase 
    }

#convert pdf to image
def convert_pdf_to_img(pdf_file):
    """
    Converts a PDF into a list of images, one per page.
    :param pdf_file: Path to the PDF file to be converted.
    :return: A list of PIL.Image objects representing pages of the PDF.
    """
    return convert_from_path(pdf_file, poppler_path=r'C:\Program Files\poppler-24.08.0\Library\bin')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_image_to_text(file):
    """
    Extracts text from an image using Tesseract OCR.
    :param file: A PIL.Image object or path to an image file.
    :return: Extracted textual content as a string.
    """
    return image_to_string(file)

#convert document to image
def process_pdf(document):
    
    #retrieve document from firebase
    retrieve_document()
    try:
        images = convert_pdf_to_img(document)
        extracted_text = ""
        for pg, img in enumerate(images):
            extracted_text += convert_image_to_text(img) + "\n"  # Add a newline after each page's text
        return extracted_text
    except FileNotFoundError:
        return "File not found. Ensure the file path is correct."
    except Exception as e:
        return f"An error occurred: {e}"
    
    

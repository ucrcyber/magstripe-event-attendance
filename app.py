'''Simple backend for card system'''
import os
import time

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

#mongodb
mongodb_uri = os.getenv('MONGODB_URI')
db_name = os.getenv('DB_NAME')
collection_name = os.getenv('COLLECTION_NAME')

client = MongoClient(mongodb_uri,
                     tls=True,
                     tlsCertificateKeyFile='cert.pem',
                     server_api=ServerApi('1'))
db = client[db_name]
collection = db[collection_name]

def is_valid_id(id_str):
    return id_str.isdigit() and len(id_str) == 9

def is_valid_name(name):
    return len(name)<=50

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/checkin', methods=['POST'])
def checkin():
    data = request.get_json()
    if 'name' in data and 'id' in data and 'raw_card_data' in data:
        _name = data['name']
        _id = str(data['id']).strip()
        _raw_card_data = data['raw_card_data']

        if not is_valid_id(_id):
            return jsonify({'error': 'Invalid ID format'}), 400
        if not is_valid_name(_name):
            return jsonify({'error': 'Invalid name format'}), 400

        # existing_record = collection.find_one({'id': _id})
        # if not existing_record:
        #     post_data = {
        #         'name': _name,
        #         'id': _id,
        #         'raw_card_data': _raw_card_data,
        #         'timestamp': int(time.time())
        #     }
        #     collection.insert_one(post_data)
        post_data = {
            'name': _name,
            'id': _id,
            'raw_card_data': _raw_card_data,
            'timestamp': int(time.time())
        }
        collection.insert_one(post_data)

        return jsonify({'message': 'Success'})
    else:
        return jsonify({'error': 'Invalid data format'}), 400

@app.route('/api/count', methods=['GET'])
def count():
    res = collection.count_documents({})
    return jsonify({"checkin_count": f"{res}"})

if __name__ == '__main__':
    app.run(host='0.0.0.0')
from sklearn.externals import joblib
import pickle
from flask import Flask, jsonify, request
import numpy as np

# pipeline doet de voorspellingen
with open('all_models_beauty.pkl','rb') as model:
    pipeline = pickle.load(model)
    
# voorspelling zijn brand_ids. om iets toegankelijker te maken zit 
# in brand_translator2.pkl een dictionary om brand_id om te kunnen 
# zetten naar brand_name
with open('brand_translator2.pkl','rb') as brand_trans_pkl:
    brand_translator = pickle.load(brand_trans_pkl)

def single_shot_predictions(pipeline,title):
    probas = pipeline.predict_proba(title)
    top3_index = np.argsort(probas,axis=1)[:,-10:][:,::-1]
    top3_brandids = pipeline.named_steps['sgd'].classes_[top3_index]
    top3_waarden = np.sort(probas,axis=1)[:,-10:][:,::-1]

    multiple = [{"brand_id": brand_id, \
                 "brand_name":brand_translator.get(brand_id,None), \
                 "prob":round(top3_waarden[0][nr],3)} \
                            for nr,brand_id in enumerate(top3_brandids[0].tolist())]    
    return multiple

app = Flask(__name__)

@app.route('/api', methods=['POST'])
def make_predict():
    input_user = request.get_json(force=True)
    print([input_user.get("title",None)])
    top3 = single_shot_predictions(pipeline,[input_user.get("title",None)])
    return jsonify(results=top3)

# omdat ik niet direct op de contentserver een rest-call kon doen met Chrome (want eerst een OPTIONS call en dan pas GET)
# heb ik de request nu hier ingezet.

import requests

@app.route('/partyid', methods=['GET'])
def get_partyid_info():
    party_id = request.args.get('partyid') #in de url zit een partyid als parameter, haal die uit de url
    print(party_id)
    headers = {'Accept': 'application/json'} #ik wil json als antwoord en niks anders
    resp = requests.get('https://productcontent.services.acc2.bol.com:443/v1/parties/list/' + party_id,headers=headers)
    return app.response_class(resp.content, content_type='application/json') #antwoord naar Chrome moet een callable zijn, dat doe ik hiermee.


# Chrome was first sending OPTIONS request, before sending the actual POST request,
# so i added this block of code
# http://www.davidadamojr.com/handling-cors-requests-in-flask-restful-apis/

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

if __name__ == '__main__':
    app.run()
   
    

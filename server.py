from flask import Flask, render_template, url_for, request, redirect, flash, jsonify
from flask_cors import CORS, cross_origin
import requests
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, send_wildcard=True)


def callYelp(latitude, longitude, name):
    '''Function callYelp takes in latitude, longitude, and the name of a business
    as name. Function makes search request to yelp's API, and then returns the
    results.'''


    api_key = '6nVFWurXJl9LWINDxsC3T6U67TjZKkvXr0nv3zFgp5_TFxlrpzHPJa3-mxO-_Ag6'
    api_key += 'zMtchF8ujE0X0_uwUAz5G1v01Xn--sSCFaubwE-9vgCz7-u8eU7rzONGGTxMWnYx'
    APIhost = 'https://api.yelp.com/v3/businesses/search##?latitude='
    APIhost += '47.65736163117977&longitude=-122.31285631656647'
    url_params = {
        'latitude': latitude,
        'longitude': longitude,
        'term': name,
        'radius': 80,
        'limit': 1
    }
    headers = {
        'Authorization': 'Bearer %s' % api_key
        }
    response = requests.request('GET', APIhost, headers=headers, params=url_params)
    return response


@app.route('/yelpAPI/', methods=['POST', 'GET'])
@cross_origin()
def showMenuJSON():
    '''showMenuJSON handles AJAX request from app.js, from app.js takes latitude,
     longitude, and name then calls callYelp to get data.  Data from yelp API is
     jsonified and returned back to app.js for use.'''
    if request.method == 'POST':
        latitude = request.form['latitude']
        longitude = request.form['longitude']
        name = request.form['name']
        response = callYelp(latitude, longitude, name)
        return jsonify(response.json())


if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)

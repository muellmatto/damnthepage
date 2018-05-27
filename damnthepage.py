#!/usr/bin/env python3
from urllib.request import urlopen
from json import loads as from_json

import facebook
from flask import Flask, render_template




# ---------------------
# FB GRAPH
# ---------------------
def build_date_str(dt, year=False):
    month_names = [ "zero_element",
                    "Januar",
                    "Februar",
                    "März",
                    "April",
                    "Mai",
                    "Juni",
                    "Juli",
                    "August",
                    "September",
                    "Oktober",
                    "November",
                    "Dezember",]
    d = dt.split('-')
    if year:
        return "{}.{}.{}".format(d[2][:2].lstrip("0"), month_names[int(d[1])], d[0])
    else:
        return "{}. {}".format(d[2][:2].lstrip("0"), month_names[int(d[1])])


def build_jsonld(dates):
    jsonld = []
    for date in dates:
        j = { '@context' : 'http://schema.org',
                    '@type' : 'MusicEvent',
                    'name': 'DAMNIAM',
                    'performer': 'DAMNIAM',
                    'location': { '@type': 'Place' }
                    }
        j['location']['name'] = date['venue']['name']
        j['location']['address'] = date['venue']['city']
        j['url'] = date['url']
        j['startDate'] = date['raw_datetime']
        jsonld.append(j)
    return jsonld


def get_dates():
    with urlopen('https://rest.bandsintown.com/artists/damniam/events?app_id=damniam_website') as req:
        dates = from_json(req.read().decode())
        for date in dates:
            date['raw_datetime'] = date['datetime']
            date['datetime'] = build_date_str(date['datetime'])
        return dates



def get_images():
    with urlopen('https://api.instagram.com/v1/users/self/media/recent/?access_token=328950673.93e3299.50f6a823351144fa89ff552524d343c6&count=16&date_format=U') as req:
        return from_json(req.read().decode())['data']

def get_list_of_posts():
    def get_post(id):
        post = graph.get_object(id=id, fields='full_picture,message,link,created_time')
        post['created_time'] = build_date_str( post['created_time'] )
        return post
    graph = facebook.GraphAPI(access_token='1280679008628028|iSLmie0AppAKj2yWz3zx2TN8C4Q', version='2.12')
    posts_response = graph.get_connections('35075947587', 'posts')
    data = posts_response['data'][:10]
    return [get_post(p['id']) for p in data]


# ---------------------
# Flask 
# ---------------------

damn = Flask(__name__)

@damn.route('/')
def damnthepage():
    dates = get_dates()
    jsonld = build_jsonld(dates)
    return render_template('index.html',
            posts=get_list_of_posts(),
            dates=dates,
            jsonld = jsonld,
            images=get_images())


if __name__ == '__main__':
    damn.run(host='0.0.0.0', port=64005, debug=True)


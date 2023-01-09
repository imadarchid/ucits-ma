import re
import requests
import pandas as pd

from datetime import datetime
from bs4 import BeautifulSoup

def scrap(limit = 1, frequency = 'weekly'):

    n_r = requests.get('https://asfim.ma/tableaux-des-performances/')
    soup = BeautifulSoup(n_r.text, 'html.parser')
    nonce = soup.find_all(id='wdtNonceFrontendEdit_25')[0]['value']

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    raw = f'draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=wdt_ID&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=titre&columns%5B1%5D%5Bsearchable%5D=false&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=date&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=document&columns%5B3%5D%5Bsearchable%5D=false&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=2&order%5B0%5D%5Bdir%5D=desc&start=0&length={limit}&search%5Bvalue%5D=&search%5Bregex%5D=false&wdtNonce={nonce}'

    r = requests.post(
        'https://asfim.ma/wp-admin/admin-ajax.php?action=get_wdtable&table_id=25',
        headers=headers,
        data=raw
    )

    response = r.json()
    docs = response['data']

    if frequency == 'weekly':
        docs = list(filter(lambda x: re.search(r'\bHebdomadaires\b', x[1]), docs))
    elif frequency == 'daily':
        docs = list(filter(lambda x: re.search(r'\bQuotidiennes\b', x[1]), docs))
    else:
        pass
    
    return docs

def extract(doc_item):
    url = doc_item[3]
    stripped_url = re.search(r"https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)", url)
    stripped_url = stripped_url.group(0)

    storage_options = {'User-Agent': 'Mozilla/9.0'} # tricking ASFIM 😁
    df = pd.read_excel(stripped_url, usecols='A:F, I, L:N, Q,R', storage_options=storage_options)

    df.drop(0, inplace=True) # drop first header row, contains no data
    df.set_axis(['isin_code', 'mc_code', 'name', 'managed_by', 'legal_type', 'category', 'periodicity', 'subscription_fee', 'redemption_fee', 'mgt_fee', 'an_value', 'vl_value'], axis=1, inplace=True)
    df['subscription_fee'] = df['subscription_fee'].replace('-', 0, regex=True) # make data consistent for rates
    df['redemption_fee'] = df['redemption_fee'].replace('-', 0, regex=True) # make data consistent for rates
    df['mgt_fee'] = df['mgt_fee'].replace('-', 0, regex=True) # make data consistent for rates

    df['date'] = datetime.strptime(doc_item[2], '%d/%m/%Y')

    return df

scrap(10)
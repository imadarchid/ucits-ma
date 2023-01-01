import os
import json
import boto3
import psycopg2

from dotenv import load_dotenv
from datetime import datetime

from utils import scrap, extract

load_dotenv()

# Local testing
# conn = psycopg2.connect(database="ucits", user='postgres', password='postgres', host='localhost', port='5200')

def get_credentials():
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=os.getenv['REGION']
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=os.getenv['SECRET_NAME']
        )
    except Exception as e:
        raise e
    
    secret = json.loads(get_secret_value_response['SecretString'])
    return secret

# Load AWS Credentials to be passed to conn
credentials = get_credentials()
conn = psycopg2.connect(user=os.getenv['DB_USER'], password=credentials['password'], host=os.getenv['DB_HOST'], database=os.getenv['DB_MAIN'])

conn.autocommit = True
cursor = conn.cursor()

""" 
    Updating/Upserting UCITS funds with its data
    update_funds() will populate the DB with UCITS info
    Data will come from the latest scrapped file
"""
def update_funds(event, context):
    
    last_record = scrap()
    data = extract(last_record[0])
    
    for i, row in data.iterrows():
        # Add manager if doesn't exist
        cursor.execute('INSERT INTO managers (manager_name) VALUES (%s) ON CONFLICT DO NOTHING', (row['managed_by'],))

        # Daily or Weekly?
        periodicity = 1 if row['periodicity'] == 'Quotidienne' else 2

        # Processing all attributes
        cursor.execute('''
           INSERT INTO funds (isin_code, mc_code, name, managed_by, legal_type, category, periodicity)
           SELECT 
                %s AS isin_code, 
                %s AS mc_code, 
                %s AS name, 
                id, 
                (SELECT legal_type_id FROM legal_types WHERE legal_types.name = %s) AS legal_type,
                (SELECT category_id FROM categories WHERE categories.name = %s) AS category,
                %s AS periodicity
           FROM managers
           WHERE manager_name = %s
           ON CONFLICT DO NOTHING
        ''', (row['isin_code'], row['mc_code'], row['name'], row['legal_type'], row['category'], periodicity, row['managed_by']))

        # Processing rates
        cursor.execute('''
            INSERT INTO rates (isin_code, subscription_fee, redemption_fee, mgt_fee)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        ''', (row['isin_code'], row['subscription_fee'], row['redemption_fee'], row['mgt_fee']))

        conn.commit()

    return {"statusCode": 200, "body": "done"}

""" 
    Update Performance
    update_perf() will run daily to get the latest performance from ASFIM for all available funds.
"""
def update_performance(event, context):

    last_record = scrap()
    cursor.execute('SELECT date FROM performances ORDER BY date DESC LIMIT 1')
    latest_date = cursor.fetchone()

    if latest_date is None or latest_date[0] != datetime.strptime(last_record[0][2], '%d/%m/%Y').date():
        data = extract(last_record[0])
        for i, row in data.iterrows():
            cursor.execute('''
                INSERT INTO performances (isin_code, date, an_value, vl_value)
                VALUES (%s, %s, %s, %s)
            ''', (row['isin_code'], row['date'], row['an_value'], row['vl_value']))
    else:
        print('null')
    return {"statusCode": 200, "body": "done"}

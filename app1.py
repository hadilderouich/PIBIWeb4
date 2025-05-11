from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from datetime import timedelta
import statsmodels.api as sm
import pyodbc  # ou autre module selon ta connexion
from datetime import datetime, timedelta 
from flask_cors import CORS

# Configuration de l'app
app = Flask(__name__)

CORS(app)

# Connexion à la base de données (ajuste selon ton contexte)
conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    f"SERVER=DESKTOP-SDJ4E76;"
    f"DATABASE=DW_PIBI;"
    f"UID=hadil;"
    f"PWD=1234;"
    "TrustServerCertificate=yes;"
)

# Charger et entraîner le modèle une seule fois au démarrage
def charger_et_entrainer_modele():
    query = """
    SELECT 
        FK_date_entretien,
        FK_date_resultat,
        FK_date_preinscrits
    FROM dbo.Fact_Admission
    WHERE 
        FK_date_entretien IS NOT NULL AND
        (FK_date_resultat IS NOT NULL OR FK_date_preinscrits IS NOT NULL)
    """
    df = pd.read_sql(query, conn, parse_dates=['FK_date_entretien', 'FK_date_resultat', 'FK_date_preinscrits'])

    def calculer_delai(row):
        if pd.notnull(row['FK_date_resultat']) and row['FK_date_resultat'] >= row['FK_date_entretien']:
            return (row['FK_date_resultat'] - row['FK_date_entretien']).days
        elif pd.notnull(row['FK_date_preinscrits']):
            return (row['FK_date_preinscrits'] - row['FK_date_entretien']).days
        else:
            return None

    df['delai_jours'] = df.apply(calculer_delai, axis=1)
    df = df[df['delai_jours'].notnull() & (df['delai_jours'] >= 0)]

    df['mois_entretien'] = df['FK_date_entretien'].dt.month

    X = df[['mois_entretien']]
    y = df['delai_jours']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    return model

# Charger le modèle
model = charger_et_entrainer_modele()


# Fonction pour convertir la date du format "yyyy-mm-dd" en un objet datetime
def convertir_date(date_str):
    try:
        # Convertir la date au format "yyyy-mm-dd"
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj
    except ValueError:
        # Si la conversion échoue (format incorrect), retourner None
        return None

# Fonction de prédiction (ajuste selon ta logique de prédiction)
# Fonction de prédiction
def predire_date_future(date_entretien):
    try:
        date_entretien = pd.to_datetime(date_entretien)
        mois = date_entretien.month
        input_data = pd.DataFrame([[mois]], columns=['mois_entretien'])
        predicted_delay = model.predict(input_data)[0]
        predicted_delay = max(0, round(predicted_delay))  
        return date_entretien + timedelta(days=predicted_delay)
    except Exception as e:
        print("Erreur dans la date donnée :", e)
        return None

@app.route('/predire', methods=['POST'])
def predire():
    # Récupérer les données JSON envoyées par le client
    data = request.get_json()

    # Vérifier que la date d'entretien est présente dans la requête
    if not data or 'date_entretien' not in data:
        return jsonify({'error': 'Veuillez envoyer un JSON avec la clé "date_entretien"'}), 400

    # Récupérer la date d'entretien envoyée par le client
    date_entretien = data['date_entretien']
    
    # Convertir la date du format "yyyy-mm-dd" en objet datetime
    date_entretien_convertie = convertir_date(date_entretien)
    
    if date_entretien_convertie:
        # Calculer la date prédite
        date_predite = predire_date_future(date_entretien_convertie)

        if date_predite:
            return jsonify({
                'date_entretien': date_entretien,
                'date_predite': date_predite.strftime('%Y-%m-%d')
            })
        else:
            return jsonify({'error': 'Erreur dans la prédiction'}), 400
    else:
        return jsonify({'error': 'Format de date invalide'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
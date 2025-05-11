from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://localhost/DW_PIBI?driver=ODBC+Driver+17+for+SQL+Server'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Allowed emails
ALLOWED_EMAILS = {
    "hadil.derouich@esprit.tn",
    "meriem.dghaies@esprit.tn",
    "wala.aloulou@esprit.tn",
    "bahaeddine.elfidha@esprit.tn",
    "hadil.miladi@gmail.com",
    "mouhib.jendoubi@esprit.tn"
}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return redirect(url_for('login'))
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['email']
        except:
            return redirect(url_for('login'))
        
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if email not in ALLOWED_EMAILS:
            return render_template('login.html', error="Invalid email address")
            
        # Here you would typically check the password against your database
        # For this example, we'll just check if the email is allowed
        
        token = jwt.encode({
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        response = redirect(url_for('dashboard'))
        response.set_cookie('token', token)
        return response
    
    return render_template('login.html')

@app.route('/dashboard')
@token_required
def dashboard(current_user):
    return render_template('dashboard.html', current_user=current_user)

if __name__ == '__main__':
    app.run(debug=True)

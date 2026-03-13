import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

def train_model():
    # Load dataset
    data_path = os.path.join('data', 'training_data.csv')
    test_path = os.path.join('data', 'test_data.csv')
    
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    df = pd.read_csv(data_path)
    
    # Handle the extra column if it exists (sometimes 'Unnamed: 133')
    df = df.dropna(axis=1, how='all')
    
    if 'prognosis' in df.columns:
        y = df['prognosis']
        X = df.drop('prognosis', axis=1)
    else:
        # Fallback to iloc if prognosis is not named exactly
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]
    
    # Train Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X, y)
    
    # Save model
    model_path = os.path.join('models', 'disease_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(rf, f)
    
    # Save symptom list
    symptoms = list(X.columns)
    symptoms_path = os.path.join('models', 'symptoms.pkl')
    with open(symptoms_path, 'wb') as f:
        pickle.dump(symptoms, f)
    
    print(f"Model trained and saved to {model_path}")
    print(f"Symptoms list saved to {symptoms_path}")
    
    # Test accuracy
    if os.path.exists(test_path):
        test_df = pd.read_csv(test_path)
        X_test = test_df.iloc[:, :-1]
        y_test = test_df.iloc[:, -1]
        y_pred = rf.predict(X_test)
        print(f"Test Accuracy: {accuracy_score(y_test, y_pred):.2f}")

if __name__ == "__main__":
    train_model()

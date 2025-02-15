from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd
import json

app = Flask(__name__, template_folder="templates")

# Load the trained model
model_path = "models/crop_production_model.joblib"
model = joblib.load(model_path)

# Load dataset for autocomplete and filtering
df = pd.read_csv("datasets/crop_production.csv")

# Extract unique values for frontend dropdowns
states = sorted(df["State_Name"].unique().tolist())
seasons = sorted(df["Season"].str.strip().unique().tolist())
crops = sorted(df["Crop"].str.strip().unique().tolist())

df["District_Name"] = df["District_Name"].str.strip()
districts = sorted(df["District_Name"].unique().tolist())

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/model')
def model_page():
    return render_template(
        'model.html', 
        states=json.dumps(states),  # Sending JSON for autocomplete
        seasons=json.dumps(seasons),
        crops=json.dumps(crops),
        districts=json.dumps(districts)
    )

@app.route('/autocomplete/<field>')
def autocomplete(field):
    query = request.args.get('query', '').strip().lower()
    if field == 'state':
        suggestions = [state for state in states if query in state.lower()]
    elif field == 'district':
        suggestions = [district for district in districts if query in district.lower()]
    elif field == 'season':
        suggestions = [season for season in seasons if query in season.lower()]
    elif field == 'crop':
        suggestions = [crop for crop in crops if query in crop.lower()]
    else:
        suggestions = []
    return jsonify(suggestions)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Define feature columns
        categorical_cols = ["State_Name", "District_Name", "Season", "Crop"]
        numerical_cols = ["Area", "Crop_Year"]

        # Convert input data to DataFrame
        input_df = pd.DataFrame([data])

        # Ensure correct column order
        input_df = input_df[categorical_cols + numerical_cols]

        # Convert numerical columns to correct type
        input_df[numerical_cols] = input_df[numerical_cols].astype(float)

        # Predict using the model and ensure it's a float
        prediction = float(model.predict(input_df)[0])

        # Return formatted prediction (rounded to 2 decimal places)
        return jsonify({"prediction": f"{prediction:.2f} Tons"})
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
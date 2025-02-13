from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd

app = Flask(__name__, template_folder="templates")

# Load the trained model
model_path = "models/crop_production_model.joblib"
model = joblib.load(model_path)

# Define feature columns
categorical_cols = ["State_Name", "District_Name", "Season", "Crop"]
numerical_cols = ["Area", "Crop_Year"]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/model')
def model_page():
    return render_template('model.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

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

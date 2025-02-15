document.addEventListener("DOMContentLoaded", function () {
    // Clear All Button Functionality
    document.getElementById("clear-all").addEventListener("click", function () {
        // Clear all input fields
        document.getElementById("State_Name").value = "";
        document.getElementById("District_Name").value = "";
        document.getElementById("Season").value = "";
        document.getElementById("Crop").value = "";
        document.getElementById("Area").value = "";
        document.getElementById("Crop_Year").value = "";

        // Hide the prediction result
        document.getElementById("prediction-result").style.display = "none";
    });

    // Form Submission Functionality
    document.getElementById("prediction-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let formData = {
            State_Name: document.getElementById("State_Name").value,
            District_Name: document.getElementById("District_Name").value,
            Season: document.getElementById("Season").value,
            Crop: document.getElementById("Crop").value,
            Area: document.getElementById("Area").value,
            Crop_Year: document.getElementById("Crop_Year").value
        };

        fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            let resultDiv = document.getElementById("prediction-result");
            if (data.error) {
                resultDiv.className = "alert alert-danger";
                resultDiv.innerText = "Error: " + data.error;
            } else {
                resultDiv.className = "alert alert-success mt-4";
                resultDiv.innerText = "Predicted Yield: " + data.prediction;
            }
            resultDiv.style.display = "block";
        })
        .catch(error => console.error("Error:", error));
    });
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("clear-all").addEventListener("click", function () {
        document.querySelectorAll("input").forEach(input => input.value = "");
        document.getElementById("prediction-result").style.display = "none";
    });

    // Autocomplete functionality
    document.querySelectorAll(".autocomplete").forEach(input => {
        let datalist = document.getElementById(input.id + "-list");

        input.addEventListener("input", function () {
            let query = this.value.trim();
            if (query.length < 1) return;

            fetch(this.dataset.url + "?query=" + encodeURIComponent(query))
                .then(response => response.json())
                .then(suggestions => {
                    datalist.innerHTML = "";
                    suggestions.forEach(suggestion => {
                        let option = document.createElement("option");
                        option.value = suggestion;
                        datalist.appendChild(option);
                    });
                })
                .catch(error => console.error("Error fetching autocomplete data:", error));
        });

        // Show all seasons when season input is clicked
        if (input.id === "Season") {
            input.addEventListener("focus", function () {
                fetch("/autocomplete/season?query=")
                    .then(response => response.json())
                    .then(suggestions => {
                        datalist.innerHTML = "";
                        suggestions.forEach(suggestion => {
                            let option = document.createElement("option");
                            option.value = suggestion;
                            datalist.appendChild(option);
                        });
                    })
                    .catch(error => console.error("Error fetching seasons:", error));
            });
        }
    });

    // Form submission
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            let resultDiv = document.getElementById("prediction-result");
            // Check for "Invalid" key instead of "error"
            resultDiv.className = data.Invalid ? "alert alert-danger" : "alert alert-success";
            resultDiv.innerText = data.Invalid ? "Invalid: " + data.Invalid : "Predicted Yield: " + data.prediction;
            resultDiv.style.display = "block";
        })
        .catch(error => console.error("Error:", error));
    });
});
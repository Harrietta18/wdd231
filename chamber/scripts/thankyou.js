/* ==========================================================================
   URL PARAMETER DECODER ENGINE (thankyou.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const dataContainer = document.getElementById("receipt-data-table");
    
    // Extract search query variables out of URL window scope
    const windowUrlParams = new URLSearchParams(window.location.search);
    
    if (windowUrlParams.has("firstName")) {
        dataContainer.innerHTML = ""; // Drop placeholder text

        // Helper function to create clean rows
        function generateReceiptRow(label, parameterKey) {
            let rawDataValue = windowUrlParams.get(parameterKey) || "Not Specified";
            
            // Clean up timestamp visibility formatting strings
            if (parameterKey === "timestamp") {
                rawDataValue = new Date(rawDataValue).toLocaleString();
            }

            const wrapperRow = document.createElement("div");
            wrapperRow.className = "receipt-parameter-row";
            wrapperRow.innerHTML = `<strong>${label}:</strong> <span>${decodeURIComponent(rawDataValue.replace(/\+/g, ' '))}</span>`;
            return wrapperRow;
        }

        // Print required data points securely to screen matrix
        dataContainer.appendChild(generateReceiptRow("First Name", "firstName"));
        dataContainer.appendChild(generateReceiptRow("Last Name", "lastName"));
        dataContainer.appendChild(generateReceiptRow("Email Address", "email"));
        dataContainer.appendChild(generateReceiptRow("Mobile Phone", "phone"));
        dataContainer.appendChild(generateReceiptRow("Business Entity", "organization"));
        dataContainer.appendChild(generateReceiptRow("Membership Level Code", "membershipLevel"));
        dataContainer.appendChild(generateReceiptRow("Submission Timestamp", "timestamp"));
    } else {
        dataContainer.innerHTML = `<p class="warning-alert">No valid submission parameter traces detected in stream.</p>`;
    }
});
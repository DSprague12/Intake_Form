document.addEventListener("DOMContentLoaded", function() {
const exportButton = document.querySelector(".exportButton");
const form = document.querySelector(".intake-form");

exportButton.addEventListener("click", function() {
    const formData = new FormData(form);
    const headers = [];
    const values = [];
    
    // Use an object to aggregate multiple values under the same key
    const groupedData = {};
    
    for (const [key, value] of formData.entries()) {
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push(value);
    }
    
    // Now construct headers and combined values safely
    for (const key in groupedData) {
        headers.push(escapeCSV(key));
        
        // Join multi-selects with a semicolon (e.g., "Sports; Music")
        const combinedValue = groupedData[key].join("; ");
        values.push(escapeCSV(combinedValue));
    }
    
    // Using \r\n ensures universal compatibility across Excel and Google Sheets
    const csvContent = headers.join(",") + "\r\n" + values.join(",");
    downloadCSV(csvContent, "intake_form_data.csv");
});

function escapeCSV(value) {
    // Cast to string to prevent errors if non-string types exist
    let stringValue = String(value); 
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n") || stringValue.includes("\r")) {
        stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
    }
    return stringValue;
}

function downloadCSV(csvContent, fileName) {
    // Adding a UTF-8 Byte Order Mark (BOM) helps Excel read special characters/accents flawlessly
    const BOM = "\uFEFF"; 
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
});
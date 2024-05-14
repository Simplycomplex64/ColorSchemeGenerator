const selectedColorInput = document.getElementById("colorInput");
const submitBtn = document.getElementById("submit-btn");
const schemeSelect = document.getElementById("schemeSelect");
const mainColorDrop = document.getElementById("main-color-drop");

submitBtn.addEventListener("click", function(e){
    // Prevent the default form submission behavior
    e.preventDefault();

    // Get the value of the colorInput
    const colorInputValue = selectedColorInput.value;

    // Get the selected option of the schemeSelect
    const selectedOption = schemeSelect.value;

    // Construct the URL for the Color API endpoint using the provided hex color code and selected mode
    const apiUrl = `https://www.thecolorapi.com/scheme?hex=${encodeURIComponent(colorInputValue)}&mode=${selectedOption}&count=5`;

    // Send an HTTP GET request to the Color API endpoint
    fetch(apiUrl)
        .then(res => {
            // Check if the response is successful
            if (!res.ok) {
                throw new Error('Failed to fetch color scheme');
            }
            // Parse the response body as JSON
            return res.json();
        })
        .then(data => {

            // Iterate through the colors and generate HTML for each color div
            let htmlForColorDrop = "";
            for (let i = 0; i < data.colors.length; i++) {
                htmlForColorDrop += `
                    <div class="colorDrop noBorder" style="background-color: ${data.colors[i].hex.value};"><span>${data.colors[i].hex.value}</span></div>
                `;
            }

            // Set the innerHTML of the mainColorDrop element to the generated HTML
            mainColorDrop.innerHTML = htmlForColorDrop;

            // Attach click event listeners to each color drop to copy the color value to clipboard
            const colorDrops = document.querySelectorAll('.colorDrop');
            colorDrops.forEach(colorDrop => {
                colorDrop.addEventListener('click', function() {
                    const colorValue = this.querySelector('span').innerText;
                    navigator.clipboard.writeText(colorValue)
                        .then(() => {
                            // Create a dialog box element
                            const dialogBox = document.createElement('div');
                            dialogBox.classList.add('dialog-box');
                            dialogBox.textContent = `Color value "${colorValue}" copied to clipboard!`;

                            // Append the dialog box element to the document body
                            document.body.appendChild(dialogBox);

                            // Remove the dialog box after a delay
                            setTimeout(() => {
                                dialogBox.remove();
                            }, 2000); // Remove after 3 seconds (adjust as needed)
                        })
                        .catch(error => {
                            // Create a dialog box element
                            const dialogBox = document.createElement('div');
                            dialogBox.classList.add('dialog-box', 'error');
                            dialogBox.textContent = `Error copying color value to clipboard: ${error}`;

                            // Append the dialog box element to the document body
                            document.body.appendChild(dialogBox);

                            // Remove the dialog box after a delay
                            setTimeout(() => {
                                dialogBox.remove();
                            }, 3000); // Remove after 5 seconds (adjust as needed)
                        });
                });
            });
        })
        .catch(error => {
            // Log any errors to the console
            console.error('Error fetching color scheme:', error);
        });
});

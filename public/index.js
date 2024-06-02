function doSomething() {
    const apiUrl = 'https://ip.guide';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': window.document.referrer
                },
                body: JSON.stringify(data)
            })
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                })
                .catch(error => {
                    console.error('Error sending data to /api:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching data from ip.guide:', error);
        });
}

window.addEventListener('load', doSomething);
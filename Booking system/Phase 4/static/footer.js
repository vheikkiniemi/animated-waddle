document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        fetch('/static/footer.html')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to load footer');
                }
                return res.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
            })
            .catch(err => {
                console.error('Footer loading error:', err);
            });
    }
});

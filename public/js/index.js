function toggleContent(containerId) {
    const container = document.getElementById(containerId);
    const content = container.querySelector('.content');
    content.classList.toggle('expanded');
}


function confirmDeletion() {
    return confirm('Are you sure you want to delete this option set? This action cannot be undone.');
}

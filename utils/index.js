const crypto = require('crypto');

exports.formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

exports.generateUniqueString = () => {
    return crypto.randomBytes(48).toString('hex');
};

exports.formatId = (id, width = 6) => {
    return String(id).padStart(width, '0');
};

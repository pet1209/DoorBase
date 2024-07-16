const db = require('../models/database');

// Function to get client's IP address
function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0]; // Get the first IP from the list
    }
    return req.connection.remoteAddress;
}

// Function to add site activity
function addSiteActivity(req, page, action) {
    const time = new Date().toISOString();
    const user = req.session.user ? req.session.user.username : 'Guest';
    const ip = getClientIp(req);

    const query = `INSERT INTO site_activity (page, action, username, ip, time) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [page, action, user, ip, time], function(err) {
        if (err) {
            console.error('Error inserting site activity:', err.message);
        } 
    });
}

// Middleware to check if the user is authenticated
function checkAuthenticated(req, res, next) {

    if (req.session.user && req.session.user.id) {

        // console.log('User is authenticated:', req.session.user);
        
        addSiteActivity(req, req.originalUrl, 'Authenticated Access');
        return next();
    }

    addSiteActivity(req, req.originalUrl, 'Unauthorized Access');
    res.redirect('/login');
}



function publicPage(req, res, next) {

    if (req.session.user && req.session.user.id) {

        addSiteActivity(req, req.originalUrl, 'Authenticated Access');
        return next();
    }

    addSiteActivity(req, req.originalUrl, 'Unauthorized Access');
    return next();
}





// Middleware to check the user's role
function checkRole(role) {
    return (req, res, next) => {
        if (req.session.user) {
            const userId = req.session.user.id;
            db.get('SELECT role FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) {
                    console.error('Database error:', err);
                    addSiteActivity(req, req.originalUrl, 'Role Check Error');

                    return res.status(500).send('Internal server error');
                }
                if (row && (row.role === role || row.role === 'Supreme Overlord')) {
                    console.log('User role is authorized');

                    return next();
                }
                addSiteActivity(req, req.originalUrl, 'Forbidden Role Access');
                res.status(403).send('Forbidden');
            });
        } else {
            addSiteActivity(req, req.originalUrl, 'Forbidden Access - No Session');
            res.status(403).send('Forbidden');
        }
    };
}

module.exports = { addSiteActivity, getClientIp, checkAuthenticated, publicPage, checkRole };

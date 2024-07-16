const bcrypt = require('bcryptjs');
const db = require('../models/database');

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0]; // Get the first IP from the list
    }
    return req.connection.remoteAddress;
}


exports.viewContact = async (req, res) => {
    try {

        const query = `SELECT * FROM contact_submissions`;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error fetching data:', err);
                res.status(500).send({ error: err.message });
                return;
            }

            res.render('home/viewcontact', { data: rows });
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: err.message });
    }
};


exports.getLoginHistory = (req, res) => {
    db.all('SELECT * FROM login_history ORDER BY login_time DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching login history:', err.message);
            res.status(500).send({ error: 'Failed to fetch login history' });
        } else {
            // Format login_time to a human-readable format
            const formattedRows = rows.map(row => {
                row.login_time = new Date(row.login_time).toLocaleString();
                return row;
            });
            res.render('p/loginHistory', { loginHistory: formattedRows });
        }
    });
};


exports.getSiteActivity = (req, res) => {

    db.all('SELECT * FROM site_activity ORDER BY time DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching site activity:', err.message);
            res.status(500).send({ error: 'Failed to fetch site activity' });
        } else {
            // Format time to a human-readable format
            const formattedRows = rows.map(row => {
                row.time = new Date(row.time).toLocaleString();
                return row;
            });
            
            res.render('p/siteActivity', { siteActivity: formattedRows });
        }
    });
};


exports.deletecontact = async (req, res) => {
    try {
            const { id } = req.params;
    const query = `DELETE FROM contact_submissions WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.send('');
        }
    });
     
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: err.message });
    }
};


exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        if (!user) {
            return res.status(400).send({ error: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ error: 'Invalid username or password' });
        }

        req.session.user = { id: user.id, username: user.username, role: user.role };

        const ipAddress = getClientIp(req)
        ;
        const userAgent = req.headers['user-agent'];
        const loginTime = new Date().toISOString();

        db.run('INSERT INTO login_history (user_id, username, login_time, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)', [user.id, user.username, loginTime, ipAddress, userAgent], function(err) {
            if (err) {
                console.error('Error recording login history:', err.message);
            }
            res.redirect('/');
        });
    });
};


exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ error: 'Logout failed' });
        }
        res.redirect('/');
    });
};


exports.getProfile = (req, res) => {
    res.render('user/profile', { user: req.session.user });
};


exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        db.get('SELECT username FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).send({ error: 'Internal server error' });
            }

            if (row) {
                return res.status(400).send({ error: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function(err) {
                if (err) {
                    console.error('Error inserting user into database:', err.message);
                    return res.status(500).send({ error: 'User registration failed' });
                }
                res.redirect('/login');
            });
        });
    } catch (error) {
        console.error('Error during registration process:', error.message);
        res.status(500).send({ error: 'User registration failed' });
    }
};


exports.updateProfile = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const userId = req.session.user.id;

    if (password && password !== confirmPassword) {
        return res.status(400).send({ error: 'Passwords do not match' });
    }

    let sql = `UPDATE users SET username = ? WHERE id = ?`;
    const params = [username, userId];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        sql = `UPDATE users SET username = ?, password = ? WHERE id = ?`;
        params.push(hashedPassword);
    }

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).send({ error: 'Failed to update profile' });
        }

        req.session.user.username = username;
        res.redirect('/');
    });
};


exports.getUsers = (req, res) => {
    db.all('SELECT * FROM users', [], (err, users) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server Error');
        }
        res.render('user/users', { users });
    });
};


exports.editUserForm = (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server Error');
        }
        res.render('user/editUser', { user });
    });
};


exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, role } = req.body;
    db.run('UPDATE users SET username = ?, role = ? WHERE id = ?', [username, role, userId], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server Error');
        }
        res.redirect('/users');
    });
};


exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server Error');
        }
        res.redirect('/users');
    });
};


exports.getLoginHistory = (req, res) => {
    db.all('SELECT * FROM login_history ORDER BY login_time DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching login history:', err.message);
            res.status(500).send({ error: 'Failed to fetch login history' });
        } else {
            // Format login_time to a human-readable format
            const formattedRows = rows.map(row => {
                row.login_time = new Date(row.login_time).toLocaleString();
                return row;
            });
            res.render('p/loginHistory', { loginHistory: formattedRows });
        }
    });
};
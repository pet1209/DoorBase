const db = require('../models/database');
const { formatDate, generateUniqueString, formatId } = require('../utils/dateUtils');
const path = require('path');
const fs = require('fs');
const { getClientIp } = require('../middlewares/auth');
//const { publicDecrypt } = require('crypto');


exports.homepage = async (req, res) => {
    try {
        res.render('home/index');
    } catch (err) {

        console.error('Error fetching data:', err);
        res.status(500).send({ error: err.message });
    }
};


exports.submitContactForm = async (req, res) => {

    try {
        const {
            firstName,
            lastName,
            email,
            company,
            streetAddress,
            city,
            country,
            state,
            zipCode,
            phone,
            contactMethod,
            category,
            otherCategory,
            projectStart,
            comments,
            emailOffers
        } = req.body;

        const time = new Date().toISOString();
        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'];

        // Insert the data into the database
        const query = `INSERT INTO contact_submissions (
            firstName, lastName, email, company, streetAddress, city, country, state, zipCode, phone, contactMethod, category, otherCategory, projectStart, comments, emailOffers, time, ipAddress, userAgent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(query, [
            firstName,
            lastName,
            email,
            company,
            streetAddress,
            city,
            country,
            state,
            zipCode,
            phone,
            contactMethod,
            category,
            otherCategory,
            projectStart,
            comments,
            emailOffers,
            time,
            ipAddress,
            userAgent
        ], function(err) {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send({ error: err.message });
            } else {
                console.log('Data inserted successfully');

                res.render('home/contactsub', {
                    firstName,
                    lastName,
                    contactMethod
                });
            }
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: err.message });
    }
};


exports.page = async (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, '../views/home', `${page}.htm`);
    console.log(filePath); // For debugging
    try {
        res.sendFile(filePath);


       // res.render('home/'+page);

    } catch (err) {

        console.error('Error fetching data:', err);
        res.status(500).send({ error: err.message });
    }
};


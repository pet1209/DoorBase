const db = require('../models/database');


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getContractsList = (req, res) => {
    db.all(`
        SELECT contractSets.*, users.username AS userName
        FROM contractSets
        LEFT JOIN users ON contractSets.userId = users.id
        ORDER BY contractSets.creationDate DESC
    `, [], (err, sets) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }


        db.all('SELECT * FROM contracts ORDER BY name ASC', [], (err, contracts) => {
            if (err) {
                res.status(500).send({ error: err.message });
                return;
            }

            const setItemsQuery = `
                SELECT contractSetItems.*, contracts.name AS contractName
                FROM contractSetItems
                LEFT JOIN contracts ON contractSetItems.contractId = contracts.id
                WHERE contractSetItems.setId = ?
                ORDER BY contractSetItems.position ASC
            `;

            const setItemsPromises = sets.map(set => {
                return new Promise((resolve, reject) => {
                    db.all(setItemsQuery, [set.id], (err, setItems) => {
                        if (err) {
                            reject(err);
                        } else {
                            set.contracts = setItems;
                            resolve();
                        }
                    });
                });
            });

            Promise.all(setItemsPromises)
                .then(() => {
                    res.render('contracts/contracts', { sets, contracts });
                })
                .catch(err => {
                    res.status(500).send({ error: err.message });
                });
        });
    });
};



exports.newContractsSet = (req, res) => {
    db.all(`
        SELECT contractSets.*, users.username AS userName
        FROM contractSets
        LEFT JOIN users ON contractSets.userId = users.id
        ORDER BY contractSets.creationDate DESC
    `, [], (err, sets) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }



        db.all('SELECT * FROM contracts ORDER BY name ASC', [], (err, contracts) => {
            if (err) {
                res.status(500).send({ error: err.message });
                return;
            }


            const setItemsQuery = `
                SELECT contractSetItems.*, contracts.name AS contractName
                FROM contractSetItems
                LEFT JOIN contracts ON contractSetItems.contractId = contracts.id
                WHERE contractSetItems.setId = ?
                ORDER BY contractSetItems.position ASC
            `;

            const setItemsPromises = sets.map(set => {
                return new Promise((resolve, reject) => {
                    db.all(setItemsQuery, [set.id], (err, setItems) => {
                        if (err) {
                            reject(err);
                        } else {
                            set.contracts = setItems;
                            resolve();
                        }
                    });
                });
            });

            Promise.all(setItemsPromises)
                .then(() => {
                    res.render('contracts/newContractsSet', { sets, contracts });
                })
                .catch(err => {
                    res.status(500).send({ error: err.message });
                });
        });
    });
};








//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.editContract = (req, res) => {

    const contractId = req.params.id;

    db.get(`
        SELECT contracts.*, users.username AS userName
        FROM contracts
        LEFT JOIN users ON contracts.userId = users.id
        WHERE contracts.id = ?
    `, [contractId], (err, contract) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (!contract) {
            res.status(404).send({ error: 'Contract not found' });
            return;
        }
        res.render('contracts/editContract', { contract });
    });
};








//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.addContracts = (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).send({ error: 'User not authenticated' });
    }

    const { name, type, preset } = req.body;
    const dateNow = new Date().toISOString();
    const userId = req.session.user.id; // Get the user ID from the session

    const sql = `INSERT INTO contracts (name, type, preset, creationDate, editDate, userId) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [name, type, preset, dateNow, dateNow, userId], function(err) {
        if (err) {
            console.error('Error inserting contract into database:', err.message);
            return res.status(500).send({ error: err.message });
        }
        res.redirect('/control/contract');
    });
};







/////////////////////////////////////////////////////////////////////////////?????????????????/////////////////////////////////
exports.updateContractsPosition = (req, res) => {
    const { setId, contractId, newPosition } = req.body;
    const updatePositionQuery = `UPDATE contractSetItems SET position = ? WHERE setId = ? AND contractId = ?`;

    db.run(updatePositionQuery, [newPosition, setId, contractId], function(err) {
        if (err) {
            res.status(500).send({ success: false, error: err.message });
        } else {
            res.send({ success: true });
        }
    });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getContract = (req, res) => {

    const contractId = req.params.id;

        db.get(`
        SELECT contracts.*, users.username AS userName
        FROM contracts
        LEFT JOIN users ON contracts.userId = users.id
        WHERE contracts.id = ?
    `, [contractId], (err, contract) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (!contract) {
            res.status(404).send({ error: 'Contract not found' });
            return;
        }
        res.render('contracts/getContract', { contract });
    });





};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.saveContract = (req, res) => {

    const { id, name, type, preset } = req.body;
    const editDate = new Date().toISOString(); // Set editDate to current timestamp
    const sqlUpdate = `UPDATE contracts SET name = ?, type = ?, preset = ?, editDate = ? WHERE id = ?`;
    
    db.run(sqlUpdate, [name, type, preset, editDate, id], function(err) {
        if (err) {
            console.error('Error updating contract:', err.message);
            res.status(500).send({ error: err.message });
            return;
        }

        db.get(`
        SELECT contracts.*, users.username AS userName
        FROM contracts
        LEFT JOIN users ON contracts.userId = users.id
        WHERE contracts.id = ?
    `, [id], (err, contract) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (!contract) {
            res.status(404).send({ error: 'Contract not found' });
            return;
        }
        res.render('contracts/getContract', { contract });
    });


    });
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.deleteContracts = (req, res) => {
    const { id } = req.params;  // Fetch the ID from the URL parameters
    const sql = `DELETE FROM contracts WHERE id = ?`;
    
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.send('');
    });
};




exports.addContractSet = (req, res) => {
    const { name, selectedContracts } = req.body;

    const contractsArray = JSON.parse(selectedContracts);
    const dateNow = new Date().toISOString();
    const userId = req.session.user.id;

    const insertSetQuery = `INSERT INTO contractSets (name, creationDate, editDate, userId) VALUES (?, ?, ?, ?)`;

    db.run(insertSetQuery, [name, dateNow, dateNow, userId], function (err) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }

        const setId = this.lastID;
        const insertSetItemsQuery = `INSERT INTO contractSetItems (setId, contractId, position) VALUES (?, ?, ?)`;

        const insertSetItemsPromises = contractsArray.map((contract, index) => {
            return new Promise((resolve, reject) => {
                db.run(insertSetItemsQuery, [setId, contract.id, contract.position], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });

        Promise.all(insertSetItemsPromises)
            .then(() => {
                // Fetch the updated contract sets
                return new Promise((resolve, reject) => {
                    db.all(`
                        SELECT contractSets.*, users.username AS userName
                        FROM contractSets
                        LEFT JOIN users ON contractSets.userId = users.id
                        ORDER BY contractSets.creationDate DESC
                    `, [], (err, sets) => {
                        if (err) {
                            reject(err);
                        } else {
                            const setItemsQuery = `
                                SELECT contractSetItems.*, contracts.name AS contractName
                                FROM contractSetItems
                                LEFT JOIN contracts ON contractSetItems.contractId = contracts.id
                                WHERE contractSetItems.setId = ?
                                ORDER BY contractSetItems.position ASC
                            `;

                            const setItemsPromises = sets.map(set => {
                                return new Promise((resolve, reject) => {
                                    db.all(setItemsQuery, [set.id], (err, setItems) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            set.contracts = setItems;
                                            resolve();
                                        }
                                    });
                                });
                            });

                            Promise.all(setItemsPromises)
                                .then(() => {
                                    resolve(sets);
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        }
                    });
                });
            })
            .then((sets) => {
                res.render('contracts/getContractSets', { sets });
            })
            .catch(err => {
                res.status(500).send({ error: err.message });
            });
    });
};







exports.editContractsSet = (req, res) => {
    const contractSetId = req.params.id;

    // Fetch a specific contract set by its ID
    const fetchContractSetById = (id) => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT contractSets.*, users.username AS userName
                FROM contractSets
                LEFT JOIN users ON contractSets.userId = users.id
                WHERE contractSets.id = ?
            `, [id], (err, set) => {
                if (err) {
                    reject(err);
                } else {
                    if (!set) {
                        return reject(new Error('Contract Set not found'));
                    }

                    const setItemsQuery = `
                        SELECT contractSetItems.*, contracts.name AS contractName
                        FROM contractSetItems
                        LEFT JOIN contracts ON contractSetItems.contractId = contracts.id
                        WHERE contractSetItems.setId = ?
                        ORDER BY contractSetItems.position ASC
                    `;

                    db.all(setItemsQuery, [set.id], (err, setItems) => {
                        if (err) {
                            reject(err);
                        } else {
                            set.contracts = setItems;
                            resolve(set);
                        }
                    });
                }
            });
        });
    };

    // Fetch all available contracts
    const fetchAllContracts = () => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT * FROM contracts
            `, [], (err, contracts) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(contracts);
                }
            });
        });
    };

    Promise.all([fetchContractSetById(contractSetId), fetchAllContracts()])
        .then(([contractSet, contracts]) => {
            res.render('contracts/editContractSet', { contractSet, contracts });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
};

















exports.getContractsSets = (req, res) => {
    // Fetch the updated contract sets
    const fetchContractSets = () => {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT contractSets.*, users.username AS userName
                FROM contractSets
                LEFT JOIN users ON contractSets.userId = users.id
                ORDER BY contractSets.creationDate DESC
            `, [], (err, sets) => {
                if (err) {
                    reject(err);
                } else {
                    const setItemsQuery = `
                        SELECT contractSetItems.*, contracts.name AS contractName
                        FROM contractSetItems
                        LEFT JOIN contracts ON contractSetItems.contractId = contracts.id
                        WHERE contractSetItems.setId = ?
                        ORDER BY contractSetItems.position ASC
                    `;

                    const setItemsPromises = sets.map(set => {
                        return new Promise((resolve, reject) => {
                            db.all(setItemsQuery, [set.id], (err, setItems) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    set.contracts = setItems;
                                    resolve();
                                }
                            });
                        });
                    });

                    Promise.all(setItemsPromises)
                        .then(() => {
                            resolve(sets);
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        });
    };

    fetchContractSets()
        .then((sets) => {
            res.render('contracts/getContractSets', { sets });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
};









exports.getContractsSet = (req, res) => {
    const contractSetId = req.params.id;

    const fetchContractSet = (id) => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT contractSets.*, users.username AS userName
                FROM contractSets
                LEFT JOIN users ON contractSets.userId = users.id
                WHERE contractSets.id = ?
            `, [id], (err, set) => {
                if (err) {
                    reject(err);
                } else if (!set) {
                    reject(new Error('Contract set not found'));
                } else {
                    const setItemsQuery = `
                        SELECT contractSetItems.*, contracts.name AS contractName
                        FROM contractSetItems
                        LEFT JOIN contracts ON contractSetItems.contractId = contracts.id
                        WHERE contractSetItems.setId = ?
                        ORDER BY contractSetItems.position ASC
                    `;

                    db.all(setItemsQuery, [id], (err, setItems) => {
                        if (err) {
                            reject(err);
                        } else {
                            set.contracts = setItems;
                            resolve(set);
                        }
                    });
                }
            });
        });
    };

    fetchContractSet(contractSetId)
        .then((set) => {
            res.render('contracts/getContractSet', { set });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
};









exports.deleteContractSet = (req, res) => {
    const contractSetId = req.params.id;

    const deleteContractSetItems = (id) => {
        return new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM contractSetItems
                WHERE setId = ?
            `, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    const deleteContractSet = (id) => {
        return new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM contractSets
                WHERE id = ?
            `, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    deleteContractSetItems(contractSetId)
        .then(() => deleteContractSet(contractSetId))
        .then(() => {
            res.send('');

        })
        .catch(err => {
            console.error(`Error deleting contract set: ${err.message}`);
            res.status(500).send({ error: err.message });
        });
};















exports.saveContractSet = (req, res) => {
    const contractSetId = req.params.id;
    const { name, selectedContracts } = req.body;
    console.log(`Received data - Name: ${name}, Selected Contracts: ${selectedContracts}`);
    console.log(`Contract Set ID: ${contractSetId}`);

    // Check if contractSetId is defined
    if (!contractSetId) {
        console.error('Contract set ID is undefined');
        return res.status(400).send({ error: 'Contract set ID is required' });
    }

    // Parse the selectedContracts string into an array of contract objects
    const contractsArray = JSON.parse(selectedContracts);
    console.log(`Contracts array: ${JSON.stringify(contractsArray)}`);

    // Update the contract set details
    const updateContractSet = (id, name) => {
        return new Promise((resolve, reject) => {
            console.log(`Updating contract set - ID: ${id}, Name: ${name}`);
            db.run(`
                UPDATE contractSets
                SET name = ?
                WHERE id = ?
            `, [name, id], function(err) {
                if (err) {
                    console.error(`Error updating contract set: ${err.message}`);
                    reject(err);
                } else {
                    console.log('Contract set updated successfully');
                    resolve();
                }
            });
        });
    };

    // Remove all current contractSetItems for this contract set
    const clearContractSetItems = (id) => {
        return new Promise((resolve, reject) => {
            console.log(`Clearing contract set items for set ID: ${id}`);
            db.run(`
                DELETE FROM contractSetItems
                WHERE setId = ?
            `, [id], function(err) {
                if (err) {
                    console.error(`Error clearing contract set items: ${err.message}`);
                    reject(err);
                } else {
                    console.log('Contract set items cleared successfully');
                    resolve();
                }
            });
        });
    };

    // Insert the new contractSetItems
    const insertContractSetItems = (id, contractsArray) => {
        return new Promise((resolve, reject) => {
            if (contractsArray.length === 0) {
                console.log('No contract items to insert');
                return resolve();
            }

            const insertSetItemsQuery = `INSERT INTO contractSetItems (setId, contractId, position) VALUES (?, ?, ?)`;

            const insertSetItemsPromises = contractsArray.map((contract, index) => {
                return new Promise((resolve, reject) => {
                    db.run(insertSetItemsQuery, [id, contract.id, contract.position], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(insertSetItemsPromises)
                .then(() => {
                    console.log('Contract set items inserted successfully');
                    resolve();
                })
                .catch(err => {
                    console.error(`Error inserting contract set items: ${err.message}`);
                    reject(err);
                });
        });
    };

    // Fetch the updated contract set
    const fetchUpdatedContractSet = (id) => {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT contractSets.*, users.username AS userName
                FROM contractSets
                LEFT JOIN users ON contractSets.userId = users.id
                WHERE contractSets.id = ?
            `, [id], (err, set) => {
                if (err) {
                    reject(err);
                } else if (!set) {
                    reject(new Error('Contract set not found'));
                } else {
                    const setItemsQuery = `
                        SELECT contractSetItems.*, contracts.name AS contractName
                        FROM contractSetItems
                        LEFT JOIN contracts ON contractSetItems.contractId = contracts.id
                        WHERE contractSetItems.setId = ?
                        ORDER BY contractSetItems.position ASC
                    `;

                    db.all(setItemsQuery, [id], (err, setItems) => {
                        if (err) {
                            reject(err);
                        } else {
                            set.contracts = setItems;
                            resolve(set);
                        }
                    });
                }
            });
        });
    };

    // Perform the updates
    updateContractSet(contractSetId, name)
        .then(() => clearContractSetItems(contractSetId))
        .then(() => insertContractSetItems(contractSetId, contractsArray))
        .then(() => fetchUpdatedContractSet(contractSetId))
        .then((updatedSet) => {
            console.log('All updates performed successfully. Rendering updated set...');
            res.render('contracts/getContractSet', { set: updatedSet });
        })
        .catch(err => {
            console.error(`Error during saveContractSet process: ${err.message}`);
            res.status(500).send({ error: err.message });
        });
};
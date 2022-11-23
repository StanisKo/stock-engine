db.createUser({
    user: 'stock-engine',
    pwd: 'stock-engine',
    roles: [{ role: 'readWrite', db: 'stock-engine' }]
});

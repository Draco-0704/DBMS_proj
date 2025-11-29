const bcrypt = require('bcrypt');
const fs = require('fs');

async function generate() {
    const pass1 = 'test1234';
    const pass2 = 'password123';

    const hash1 = await bcrypt.hash(pass1, 10);
    const hash2 = await bcrypt.hash(pass2, 10);

    const data = {
        test1234: hash1,
        password123: hash2
    };

    fs.writeFileSync('hashes.json', JSON.stringify(data, null, 2));
}

generate();

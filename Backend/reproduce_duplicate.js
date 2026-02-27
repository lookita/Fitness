const main = async () => {
    const email = 'duplicate@example.com';
    try {
        // First creation
        console.log('Creating first user...');
        await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre: 'User 1',
                email: email,
                contrasena: 'password123'
            })
        });

        // Second creation (should fail)
        console.log('Creating second user (duplicate)...');
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre: 'User 2',
                email: email,
                contrasena: 'password123'
            })
        });
        
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error:', e);
    }
};
main();

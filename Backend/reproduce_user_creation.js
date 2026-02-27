const main = async () => {
    try {
        console.log('Sending request to http://localhost:3000/usuarios');
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: 'Test User',
                email: 'test' + Date.now() + '@example.com',
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

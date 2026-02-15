import { supabase } from './src/lib/supabase';

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('bus_routes').select('count', { count: 'exact' });
        if (error) {
            console.error('Connection failed:', error.message);
            if (error.message.includes('relation "bus_routes" does not exist')) {
                console.log('TIP: It looks like you haven\'t run the SQL schema in Supabase yet!');
            }
        } else {
            console.log('Successfully connected to Supabase!');
            console.log('Route count:', data);
        }
    } catch (err) {
        console.error('An unexpected error occurred:', err);
    }
}

testConnection();

import { supabase } from './src/lib/supabase';

async function testConnection() {
    console.log('--- VERBOSE CONNECTION TEST ---');
    console.log('URL:', process.env.SUPABASE_URL);

    try {
        const { data, error, status } = await supabase.from('bus_routes').select('*').limit(1);

        if (error) {
            console.log('❌ STATUS:', status);
            console.log('❌ ERROR:', error.message);
            console.log('❌ DETAILS:', error.details);
            console.log('❌ HINT:', error.hint);

            if (error.message.includes('relation "bus_routes" does not exist')) {
                console.log('\n⚠️  ACTION REQUIRED: You need to run the SQL schema in your Supabase SQL Editor!');
            }
        } else {
            console.log('✅ SUCCESS! Connected to Supabase.');
            console.log('✅ DATA:', data);
        }
    } catch (err: any) {
        console.log('💥 CRASH:', err.message);
    }
    process.exit(0);
}

testConnection();

import { supabase } from './src/lib/supabase';

async function seed() {
    console.log('--- SEEDING DATABASE (EXPANDED) ---');

    // 1. Seed Demo User
    const demoUserId = 'd0a5e8fe-1234-5678-9abc-def123456789';
    console.log('Seeding demo user...');
    await supabase.from('users').upsert({
        id: demoUserId,
        email: 'test@nitj.ac.in',
        name: 'Tabish Ahmad',
        role: 'STUDENT',
        department: 'Computer Science',
        phone: '+91 9876543210'
    });

    // 2. Seed Bus Routes
    console.log('Seeding bus routes...');
    const routes = [
        { id: 'route-1', name: 'Campus ⭢ Maqsudan ⭢ City Stand', frequency: 'Every 30 mins' },
        { id: 'route-2', name: 'Campus ⭢ PAP Chowk ⭢ Railway Station', frequency: 'Every 1 hour' },
        { id: 'route-3', name: 'Campus ⭢ Bus Stand ⭢ Model Town', frequency: 'Every 45 mins' }
    ];
    await supabase.from('bus_routes').upsert(routes);

    // 3. Seed Route Stops (Simplified for demo)
    console.log('Seeding route stops...');
    const stops = [
        // Route 1
        { route_id: 'route-1', name: 'Main Gate', lat: 31.3960, lng: 75.5360, arrival_offset: 0, stop_order: 1 },
        { route_id: 'route-1', name: 'Maqsudan Chowk', lat: 31.3600, lng: 75.5600, arrival_offset: 15, stop_order: 2 },
        { route_id: 'route-1', name: 'City Stand', lat: 31.3260, lng: 75.5762, arrival_offset: 30, stop_order: 3 },
        // Route 2
        { route_id: 'route-2', name: 'Main Gate', lat: 31.3960, lng: 75.5360, arrival_offset: 0, stop_order: 1 },
        { route_id: 'route-2', name: 'PAP Chowk', lat: 31.3000, lng: 75.6000, arrival_offset: 20, stop_order: 2 },
        { route_id: 'route-2', name: 'Railway Station', lat: 31.3300, lng: 75.5900, arrival_offset: 40, stop_order: 3 },
    ];
    await supabase.from('route_stops').upsert(stops);

    // 4. Seed Active Buses
    console.log('Seeding active buses...');
    const buses = [
        { id: 'BUS-01', route_id: 'route-1', lat: 31.3700, lng: 75.5500, load_status: 'MEDIUM', last_seen: 'Crossing Maqsudan' },
        { id: 'BUS-02', route_id: 'route-1', lat: 31.3960, lng: 75.5360, load_status: 'LOW', last_seen: 'Boarding at Main Gate' },
        { id: 'BUS-03', route_id: 'route-2', lat: 31.3500, lng: 75.5800, load_status: 'HIGH', last_seen: 'Near Pathankot Bypass' },
        { id: 'BUS-04', route_id: 'route-3', lat: 31.3300, lng: 75.5700, load_status: 'MEDIUM', last_seen: 'Approaching Bus Stand' },
        { id: 'BUS-05', route_id: 'route-2', lat: 31.3100, lng: 75.5900, load_status: 'LOW', last_seen: 'PAP Chowk' }
    ];
    await supabase.from('buses').upsert(buses);

    // 5. Seed Ride Pools
    console.log('Seeding ride pools...');
    const rides = [
        {
            host_id: demoUserId,
            dest: 'Maqsudan Chowk',
            departure_time: new Date(Date.now() + 1800000).toISOString(),
            max_passengers: 3,
            riders_count: 1,
            fare: 20,
            gender_pref: 'ANY'
        },
        {
            host_id: demoUserId,
            dest: 'Jalandhar City',
            departure_time: new Date(Date.now() + 3600000).toISOString(),
            max_passengers: 4,
            riders_count: 3,
            fare: 50,
            gender_pref: 'ANY'
        },
        {
            host_id: demoUserId,
            dest: 'Railway Station',
            departure_time: new Date(Date.now() + 5400000).toISOString(),
            max_passengers: 4,
            riders_count: 4,
            fare: 60,
            gender_pref: 'FEMALE_ONLY',
            status: 'FULL'
        },
        {
            host_id: demoUserId,
            dest: 'PAP Chowk',
            departure_time: new Date(Date.now() + 7200000).toISOString(),
            max_passengers: 3,
            riders_count: 0,
            fare: 40,
            gender_pref: 'ANY'
        },
        {
            host_id: demoUserId,
            dest: 'Bus Stand',
            departure_time: new Date(Date.now() + 900000).toISOString(),
            max_passengers: 2,
            riders_count: 1,
            fare: 40,
            gender_pref: 'ANY'
        }
    ];
    await supabase.from('rides').upsert(rides);

    // 6. Seed Complaints
    console.log('Seeding complaints...');
    const complaints = [
        {
            user_id: demoUserId,
            type: 'DRIVER',
            target: 'Auto PB-08-1234',
            description: 'Driver refused to go to Maqsudan Chowk despite agreeing earlier.',
            status: 'OPEN'
        },
        {
            user_id: demoUserId,
            type: 'BUS',
            target: 'BUS-03',
            description: 'Bus was extremely overcrowded, students were hanging from the door.',
            status: 'IN_PROGRESS'
        },
        {
            user_id: demoUserId,
            type: 'RIDE',
            target: 'RIDE-88',
            description: 'Ride host did not show up at the meeting point.',
            status: 'RESOLVED'
        },
        {
            user_id: demoUserId,
            type: 'GENERAL',
            target: 'App Feature',
            description: 'Please add UPI payment integration for ride splitting.',
            status: 'OPEN'
        },
        {
            user_id: demoUserId,
            type: 'DRIVER',
            target: 'E-Rickshaw 44',
            description: 'Rash driving near the main gate.',
            status: 'DISMISSED'
        }
    ];
    await supabase.from('complaints').upsert(complaints);

    console.log('--- EXPANDED SEEDING COMPLETE ---');
    process.exit(0);
}

seed();

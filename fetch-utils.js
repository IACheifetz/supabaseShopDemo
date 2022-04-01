const SUPABASE_URL = 'https://piaaxjtzsxubseeoqown.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYWF4anR6c3h1YnNlZW9xb3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc5ODgwOTMsImV4cCI6MTk2MzU2NDA5M30.-JF8rp3uujkLpMpiJj70fwmuyamVh64NHTUYK5UFA04';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export async function getWorkshops() {
    const response = await client
        .from('workshops')
        .select('*, participants (*)')
        .match({ 'participants.user_id}': client.auth.session().user.id });
    
    return checkError(response);
}

export async function deleteParticipant(id) {
    const response = await client
        .from('participants')
        .delete()
        .match({ id: id })
        .single();

    return checkError(response);
}

export async function createParticipant(participant) {
    const response = await client
        .from('participants')
        .insert({
            ...participant,
            user_id: client.auth.session().user.id,
        });

    return checkError(response);
}

export function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./workshops');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });

    return response.user;
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}


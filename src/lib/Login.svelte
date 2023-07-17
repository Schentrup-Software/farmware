<script lang="ts">
    import { currentUser, pb } from './pocketbase';

    let username: string;
    let password: string;

    async function login() {
        await pb.collection('users').authWithPassword(username, password);
    }

    async function register() {
        try {
            const data = {
                username,
                password,
                passwordConfirm: password,
            }

            await pb.collection('users').create(data);
            await login();
        } catch (e) {
            console.log(e);
        }
    }

    function signOut() {
        pb.authStore.clear();
    }

</script>

{#if $currentUser}
    <p>Logged in as {$currentUser.username}</p>
    <button on:click={signOut}>Logout</button>
{:else}
    <form on:submit|preventDefault>

        <input type="text" bind:value={username} placeholder="Username" />
        <input type="password" bind:value={password} placeholder="Password" />

        <button on:click={login}>Login</button>
        <button on:click={register}>Register</button>

    </form>
{/if}
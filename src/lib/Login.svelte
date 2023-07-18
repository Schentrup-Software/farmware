<script lang="ts">
    import { currentUser, pb } from './pocketbase';
    import { 
        Button, 
        Form, 
        FormGroup, 
        Input, 
        Label,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader
    } from 'sveltestrap';

    let open = false;
    const toggle = () => (open = !open);

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

<div>
    <Button color="danger" on:click={toggle}>Open Modal</Button>
    <Modal isOpen={open} {toggle}>
      <ModalHeader {toggle}>Modal title</ModalHeader>
      <ModalBody>
        {#if $currentUser}
            <p>Logged in as {$currentUser.username}</p>
        {:else}
            <Form on:submit={login}>
                <FormGroup>
                    <Label for="usernameInput">Username</Label>
                    <Input type="text" id="usernameInput" bind:value={username} />
                </FormGroup>
                <FormGroup>
                    <Label for="passwordInput">Password</Label>
                    <Input type="password" id="passwordInput" bind:value={password} />
                </FormGroup>
            </Form>
        {/if}
      </ModalBody>
      <ModalFooter>
        {#if $currentUser}
            <Button on:click={signOut}>Logout</Button>
        {:else}
            <Button color="primary" on:click={login}>Login</Button>
        {/if}
        <Button color="secondary" on:click={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
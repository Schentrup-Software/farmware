<script lang="ts">
  import { currentUser, pb } from "./pocketbase";
  import { currentlyOpenModal, modals, closeModal } from "./modal";
  import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";

  let email: string;
  let password: string;

  async function login() {
    await pb.collection("users").authWithPassword(email, password);
  }

  function signOut() {
    pb.authStore.clear();
  }
</script>

{#if $currentlyOpenModal === modals.login}
  <div>
    <Modal isOpen={true} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>Login</ModalHeader>
        <ModalBody>
          {#if $currentUser}
            <p>Logged in as {$currentUser.name}</p>
          {:else}
            <Form on:submit={login}>
              <FormGroup>
                <Label for="usernameInput">Email</Label>
                  <Input
                    type="text"
                    id="usernameInput"
                    bind:value={email}
                  />
                  </FormGroup>
                  <FormGroup>
                    <Label for="passwordInput">Password</Label>
                    <Input
                      type="password"
                      id="passwordInput"
                      bind:value={password}
                    />
                  </FormGroup>
              </Form>
          {/if}
        </ModalBody>
        <ModalFooter>
          {#if $currentUser}
            <Button color="primary" on:click={closeModal}>Close</Button>
            <Button color="secondary" on:click={signOut}>Logout</Button>
          {:else}
            <Button color="primary" on:click={login}>Login</Button>
            <Button color="secondary" on:click={closeModal}>Cancel</Button>
          {/if}
        </ModalFooter>
    </Modal>
  </div>
{/if}


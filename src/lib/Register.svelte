<script lang="ts">
  import { pb } from "./pocketbase";
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

  let name: string;
  let email: string;
  let password: string;
  let passwordConfirm: string;

  async function register() {
    try {
      const data = {
        name,
        email,
        password,
        passwordConfirm: passwordConfirm,
      };

      await pb.collection("users").create(data);
      await pb.collection("users").authWithPassword(email, password);
      closeModal();
    } catch (e) {
      console.log(e);
    }
  }
</script>

{#if $currentlyOpenModal === modals.register}
  <div>
    <Modal isOpen={true} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>Register</ModalHeader>
        <ModalBody>
          <Form on:submit={register}>
            <FormGroup>
              <Label for="nameInput">Name</Label>
              <Input
                type="text"
                id="nameInput"
                bind:value={name}
              />
            </FormGroup>
            <FormGroup>
              <Label for="emailInput">Email</Label>
              <Input
                type="text"
                id="emailInput"
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
              <Label for="passwordConfirmInput">Password Confirm</Label>
              <Input
                type="password"
                id="passwordConfirmInput"
                bind:value={passwordConfirm}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button on:click={register}>Register</Button>
          <Button color="secondary" on:click={closeModal}>Cancel</Button>
        </ModalFooter>
    </Modal>
  </div>
{/if}


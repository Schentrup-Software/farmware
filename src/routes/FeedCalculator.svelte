<script lang="ts">
  import {
    Card,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Alert,
  } from "sveltestrap";
  import { pb } from "../lib/pocketbase";
  import { onMount } from 'svelte';

  let alertMessage = '';
  
  let species = [];
  let chosenSpeciesID = '';

  onMount(async () => {
    try {
      species = await pb.collection('species').getFullList();
    } catch (e) {
      console.log(e);
      alertMessage = 'There was an error loading the species data.';
    }
  });

  let conditions = [];
  let chosenConditionID = '';

  async function onSpeciesChange(event) {
    try {
      chosenSpeciesID = event.target.value;

      if (!chosenSpeciesID) {
        conditions = [];
        return;
      }

      conditions = await pb.collection('conditions').getFullList({
        filter: `species_id ~ '${chosenSpeciesID}'`,
      });
    } catch (e) {
      console.log(e);
      alertMessage = 'There was an error loading the condition data.';
    }
  }

  let feeds = [];
  let feedId = '';

  async function onConditionChange(event) {
    try {
      chosenConditionID = event.target.value;

      if (!chosenConditionID) {
        feeds = [];
        return;
      }
      
      feeds = await pb.collection('feed_amounts').getFullList({
        filter: `species_id = '${chosenSpeciesID}' && condition_id = '${chosenConditionID}'`,
        expand: 'food_type_id',
      });
    } catch (e) {
      console.log(e);
      alertMessage = 'There was an error loading the condition data.';
    }
  }

  function addToCart() {
    console.log("add to cart");
  }


</script>

<Card>
  <h1>Feed Calculator</h1>
  <h3>Use this tool to calculate how much feed you need to order.</h3>
  <hr />
  {#if alertMessage}
    <Alert color="danger" toggle={() => alertMessage = ''}>
      {alertMessage}
    </Alert>
  {/if}
  <Form on:submit={addToCart}>
    <FormGroup>
      <Label for="speciesInput">Species</Label>
      <Input type="select" name="select" id="speciesInput" on:change={onSpeciesChange}>
        {#each species as speciesItem (speciesItem.id)}
          <option value={speciesItem.id}>{speciesItem.name}</option>
        {/each}
      </Input>
    </FormGroup>
    {#if conditions.length > 0}
      <FormGroup>
        <Label for="conditionInput">Condition</Label>
        <Input type="select" name="select" id="conditionInput" on:change={onConditionChange}>
          {#each conditions as conditionItem (conditionItem.id)}
            <option value={conditionItem.id}>{conditionItem.name}</option>
          {/each}
        </Input>
      </FormGroup>
    {/if}
  </Form>
</Card>
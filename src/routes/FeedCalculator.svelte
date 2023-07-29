<script lang="ts">
  import {
    Card,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Alert,
    Spinner,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col,
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

  let age = null;
  let ageUnits = 'weeks';

  function calcMinAge() {
    return calcAge(Math.min);
  }

  function calcMaxAge() {
    return calcAge(Math.max);
  }

  function calcAge(reduce: { (...values: number[]): number }) {
    if (feeds.length === 0) return 0;

    const numDays = feeds.map(feed => {
      switch (feed.age_units) {
        case 'days':
          return feed.age;
        case 'weeks':
          return feed.age * 7;
        case 'months':
          return feed.age * 30;
        case 'years':
          return feed.age * 365;
      }
    }).reduce((a, b) => reduce(a, b));

    switch (ageUnits) {
      case 'days':
        return numDays;
      case 'weeks':
        return numDays / 7;
      case 'months':
        return numDays / 30;
      case 'years':
        return numDays / 365;
    }
  }

  function validateAge() {
    if (age == null) return;

    if (age < calcMinAge()) {
      age = calcMinAge();
    } else if (age > calcMaxAge()) {
      age = calcMaxAge();
    }
  }

  let weight = null;
  let weightUnits = 'pounds';

  function calcMinWeight() {
    return calcWeight(Math.min);
  }

  function calcMaxWeight() {
    return calcWeight(Math.max);
  }

  function calcWeight(reduce: { (...values: number[]): number }) {
    if (feeds.length === 0) return 0;

    const weightPounds = feeds.map(feed => {
      switch (feed.animal_weight_units) {
        case 'pounds':
          return feed.animal_weight;
        case 'kilograms':
          return feed.animal_weight * 2.205;
      }
    }).reduce((a, b) => reduce(a, b));

    switch (weightUnits) {
        case 'pounds':
          return weightPounds;
        case 'kilograms':
          return weightPounds / 2.205;
      }
  }

  function validateWeight() {
    if (weight == null) return;

    if (weight < calcMinWeight()) {
      weight = calcMinWeight();
    } else if (weight > calcMaxWeight()) {
      weight = calcMaxWeight();
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
  <Container>
    {#if alertMessage}
      <Alert color="danger" toggle={() => alertMessage = ''}>
        {alertMessage}
      </Alert>
    {/if}
    <Form on:submit={addToCart}>
      <Row>
        {#if species.length === 0}
          <Spinner />
        {:else}
          <FormGroup>
            <Label for="speciesInput">Species</Label>
            <Input type="select" name="Species Input" id="speciesInput" on:change={onSpeciesChange} placeholder="Select the species...">
              {#each species as speciesItem (speciesItem.id)}
                <option value={speciesItem.id}>{speciesItem.name}</option>
              {/each}
            </Input>
          </FormGroup>
        {/if}
      </Row>
      {#if conditions.length > 0}
      <Row>
        <FormGroup>
          <Label for="conditionInput">Condition</Label>
          <Input type="select" name="Condition Input" id="conditionInput" placeholder="Select the animals condition..." on:change={onConditionChange}>
            {#each conditions as conditionItem (conditionItem.id)}
              <option value={conditionItem.id}>{conditionItem.name}</option>
            {/each}
          </Input>
        </FormGroup>
      </Row>
      {/if}
      {#if feeds.length > 0}
        <Row>
          <Col>
            <FormGroup>
              <Label for="conditionInput">Age</Label>
              <InputGroup>
                <Input 
                  type="number" 
                  name="number" 
                  id="ageNumber" 
                  placeholder={"Enter in animals age... (between " + calcMinAge() + " and " + calcMaxAge() + ")"}
                  min={calcMinAge()} 
                  max={calcMaxAge()}
                  bind:value={age}
                  on:change={validateAge}  
                />
                <InputGroupText>
                  Weeks
                </InputGroupText>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="conditionInput">Weight</Label>
              <InputGroup>
                <Input 
                  type="number" 
                  name="number" 
                  id="weightNumber" 
                  placeholder={"Enter in animals weight... (between " + calcMinWeight() + " and " + calcMaxWeight() + ")"}
                  min={calcMinWeight()} 
                  max={calcMaxWeight()}
                  bind:value={weight}
                  on:change={validateWeight}  
                />
                <InputGroupText>
                  Pounds
                </InputGroupText>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      {/if}
    </Form>
  </Container>
</Card>
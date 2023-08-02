<script lang="ts">
  import {
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
  import { onMount } from 'svelte';
  import { convertToDays, convertToPounds } from "./conversion";
  import { 
    addItemToCart, 
    cart, 
    chosenSpeciesID, 
    conditions, 
    feeds,
    getConditions,
    getFeeds,
    getSpecies,
    species,
    alertMessage,
  } from "./store";
  import { writable } from "svelte/store";

  onMount(async () => {
    getSpecies();
  });

  let chosenConditionID = '';

  async function onSpeciesChange(event) { 
    chosenSpeciesID.set(event.target.value);
    feeds.set([]);
    
    chosenConditionID = '';
    age.set(null);
    weight.set(null);

    if (!$chosenSpeciesID) {
      conditions.set([]);
      return;
    }

    getConditions($chosenSpeciesID);
  }

  async function onConditionChange(event) {
    chosenConditionID = event.target.value;

    if (!chosenConditionID) {
      feeds.set([]);
      return;
    }
      
    getFeeds($chosenSpeciesID, chosenConditionID);
  }

  const age = writable(null);
  let ageUnits = 'weeks';

  function calcMinAge(feedData) {
    return calcAge(feedData, Math.min);
  }

  function calcMaxAge(feedData) {
    return calcAge(feedData, Math.max);
  }

  function calcAge(feedData, reduce: { (...values: number[]): number }) {
    return feedData.map(feed => convertToDays(feed.age, feed.age_units)).reduce((a, b) => reduce(a, b), 0);
  }

  function validateAge(feedData, ageData) {
    if (ageData == null) return false;

    ageData = convertToDays(ageData, ageUnits);

    if (ageData < calcMinAge(feedData)) {
      return false;
    } else if (ageData > calcMaxAge(feedData)) {
      return false;
    }

    return true;
  }

  const weight = writable(null);
  let weightUnits = 'pounds';

  function calcMinWeight(feedData) {
    return calcWeight(feedData, Math.min);
  }

  function calcMaxWeight(feedData) {
    return calcWeight(feedData, Math.max);
  }

  function calcWeight(feedData, reduce: { (...values: number[]): number }) {
    return feedData.map(feed => convertToPounds(feed.animal_weight, feed.animal_weight_units)).reduce((a, b) => reduce(a, b), 0);
  }

  function validateWeight(feedData, weightData) {
    if (weightData == null) return false;

    weightData = convertToPounds(weightData, weightUnits);

    if (weightData < calcMinWeight(feedData)) {
      return false;
    } else if (weightData > calcMaxWeight(feedData)) {
      return false;
    }

    return true;
  }

  let quantity = 1;

  function addToCart(feedData, event) {
    event.preventDefault();

    if (validateAge(feedData, $age)) {
      const ageMatch = feedData.reduceRight((previous, current) => 
        Math.abs(convertToDays($age, ageUnits) - convertToDays(previous.age, previous.age_units))
        < Math.abs(convertToDays($age, ageUnits) - convertToDays(current.age, current.age_units))
        ? previous : current     
      );

      if (ageMatch) {
        addItemToCart($cart, ageMatch, quantity);
        return;
      }
    }

    if (validateWeight(feedData, $weight)) {
      const weightMatch = feedData.reduceRight((previous, current) => 
        Math.abs(convertToPounds($weight, weightUnits) - convertToPounds(previous.animal_weight, previous.animal_weight_units))
        < Math.abs(convertToPounds($weight, weightUnits) - convertToPounds(current.animal_weight, current.animal_weight_units))
        ? previous : current     
      );

      if (weightMatch) {
        addItemToCart($cart, weightMatch, quantity);
        return;
      }
    }

    alertMessage.set('There was an error adding the feed to the list.');
  }

  function clear() {
    chosenSpeciesID.set('');
    conditions.set([]);
    chosenConditionID = '';
    feeds.set([]);
    cart.set([]);
  }
</script>

<Container>
  {#if $alertMessage}
    <Alert color="danger" toggle={() =>alertMessage.set('')}>
      {$alertMessage}
    </Alert>
  {/if}
  <Form on:submit={(event) => addToCart($feeds, event)}>
    <Row>
      {#if $species.length === 0}
        <Spinner />
      {:else}
        <FormGroup>
          <Label for="speciesInput">Species</Label>
          <Input type="select" name="Species Input" id="speciesInput" on:change={onSpeciesChange} placeholder="Select the species...">
            {#each $species as speciesItem (speciesItem.id)}
              <option value={speciesItem.id}>{speciesItem.name}</option>
            {/each}
          </Input>
        </FormGroup>
      {/if}
    </Row>
    {#if $conditions.length > 0}
    <Row>
      <FormGroup>
        <Label for="conditionInput">Condition</Label>
        <Input type="select" name="Condition Input" id="conditionInput" placeholder="Select the animals condition..." on:change={onConditionChange} bind:value={chosenConditionID}>
          {#each $conditions as conditionItem (conditionItem.id)}
            <option value={conditionItem.id}>{conditionItem.name}</option>
          {/each}
        </Input>
      </FormGroup>
    </Row>
    {/if}
    {#if $feeds.length > 0}
      <Row>
        <Col>
          <FormGroup>
            <Label for="conditionInput">Age</Label>
            <InputGroup>
              <Input 
                type="number" 
                name="ageNumber" 
                id="ageNumber"
                min={calcMinAge($feeds)} 
                max={calcMaxAge($feeds)}
                bind:value={$age}
                valid={$age && validateAge($feeds, $age)}
                invalid={$age && !validateAge($feeds, $age)}
                disabled={validateWeight($feeds, $weight)}
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
                name="weightNumber" 
                id="weightNumber"
                min={calcMinWeight($feeds)} 
                max={calcMaxWeight($feeds)}
                bind:value={$weight}
                valid={$weight && validateWeight($feeds, $weight)}
                invalid={$weight && !validateWeight($feeds, $weight)}
                step="0.01"
                disabled={validateAge($feeds, $age)}
              />
              <InputGroupText>
                Pounds
              </InputGroupText>
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup>
            <Label for="conditionInput">Quantity</Label>
            <Input 
              type="number" 
              name="quantityNumber" 
              id="quantityNumber"
              min="1" 
              step="1"
              bind:value={quantity}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row class="addMargin">
        <Col>
          <Button color="primary" type="submit">Add to List</Button>
          <Button color="danger" on:click={clear} type="reset">Clear List</Button>
        </Col>
      </Row>
    {/if}
  </Form>
</Container>

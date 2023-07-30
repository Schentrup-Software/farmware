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
    Popover,
    Table,
  } from "sveltestrap";
  import { pb } from "../lib/pocketbase";
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const alertMessage = writable('');
  
  const species = writable([]);
  const chosenSpeciesID = writable('');

  onMount(async () => {
    try {
      species.set(await pb.collection('species').getFullList());
    } catch (e) {
      console.log(e);
      alertMessage.set('There was an error loading the species data.');
    }
  });

  const conditions = writable([]);
  const chosenConditionID = writable('');

  async function onSpeciesChange(event) {
    try {
      chosenSpeciesID.set(event.target.value);
      chosenConditionID.set('');
      feeds.set([]);
      age = null;
      weight = null;

      if (!$chosenSpeciesID) {
        conditions.set([]);
        return;
      }

      conditions.set(await pb.collection('conditions').getFullList({
        filter: `species_id ~ '${$chosenSpeciesID}'`,
      }));

    } catch (e) {
      console.log(e);
      alertMessage.set('There was an error loading the condition data.');
    }
  }

  const feeds = writable([]);

  async function onConditionChange(event) {
    try {
      chosenConditionID.set(event.target.value);

      if (!$chosenConditionID) {
        feeds.set([]);
        return;
      }
      
      feeds.set(await pb.collection('feed_amounts').getFullList({
        filter: `species_id = '${$chosenSpeciesID}' && condition_id = '${$chosenConditionID}'`,
        expand: 'food_type_id,species_id,condition_id',
      }));
    } catch (e) {
      console.log(e);
      alertMessage.set('There was an error loading the condition data.');
    }
  }

  let age = null;
  let ageUnits = 'weeks';

  function calcMinAge(feedData) {
    return calcAge(feedData, Math.min);
  }

  function calcMaxAge(feedData) {
    return calcAge(feedData, Math.max);
  }

  function calcAge(feedData, reduce: { (...values: number[]): number }) {
    if (feedData.length === 0) return 0;

    const numDays = feedData.map(feed => convertToDays(feed.age, feed.age_units)).reduce((a, b) => reduce(a, b));

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

  function convertToDays(age: number, units: string) {
    switch (units) {
      case 'days':
        return age;
      case 'weeks':
        return age * 7;
      case 'months':
        return age * 30;
      case 'years':
        return age * 365;
    }
  }

  function validateAge(feedData) {
    if (age == null) return null;

    if (age < calcMinAge(feedData)) {
      return false;
    } else if (age > calcMaxAge(feedData)) {
      return false;
    }

    return true;
  }

  let weight = null;
  let weightUnits = 'pounds';

  function calcMinWeight(feedData) {
    return calcWeight(feedData, Math.min);
  }

  function calcMaxWeight(feedData) {
    return calcWeight(feedData, Math.max);
  }

  function calcWeight(feedData, reduce: { (...values: number[]): number }) {
    if (feedData.length === 0) return 0;

    const weightPounds = feedData.map(feed => convertToPounds(feed.animal_weight, feed.animal_weight_units)).reduce((a, b) => reduce(a, b));

    switch (weightUnits) {
        case 'pounds':
          return weightPounds;
        case 'kilograms':
          return weightPounds / 2.205;
      }
  }

  function convertToPounds(weight: number, units: string) {
    switch (units) {
      case 'pounds':
        return weight;
      case 'kilograms':
        return weight * 2.205;
    }
  }

  function validateWeight(feedData) {
    if (weight == null) return null;

    if (weight < calcMinWeight(feedData)) {
      return false;
    } else if (weight > calcMaxWeight(feedData)) {
      return false;
    }

    return true;
  }

  const cart = writable([]);
  let quantity = 1;

  function addToCart(feedData, event) {
    event.preventDefault();

    if (validateAge(feedData)) {
      const ageMatch = feedData.reduceRight((previous, current) => 
        Math.abs(convertToDays(age, ageUnits) - convertToDays(previous.age, previous.age_units))
        < Math.abs(convertToDays(age, ageUnits) - convertToDays(current.age, current.age_units))
        ? previous : current     
      );

      if (ageMatch) {
        addItemToCart(ageMatch);
        return;
      }
    }

    if (validateWeight(feedData)) {
      const weightMatch = feedData.reduceRight((previous, current) => 
        Math.abs(convertToPounds(weight, weightUnits) - convertToPounds(previous.animal_weight, previous.animal_weight_units))
        < Math.abs(convertToPounds(weight, weightUnits) - convertToPounds(current.animal_weight, current.animal_weight_units))
        ? previous : current     
      );

      if (weightMatch) {
        addItemToCart(weightMatch);
        return;
      }
    }

    alertMessage.set('There was an error adding the feed to the list.');
  }

  function addItemToCart(matchedItem) {
    const newCart = $cart;
    const existingItem = newCart.find(item => item.id === matchedItem.id);

    if (existingItem) {
      newCart.splice(newCart.findIndex(item => item.id === existingItem.id), 1);
      matchedItem.quantity = existingItem.quantity + quantity;
    } else {
      matchedItem.quantity = quantity;
    }

    newCart.push(matchedItem);
    cart.set(newCart);
  }

  function groupByFeedType(cartData) {
    const grouped = cartData.reduce((previous, current) => {
      if (!previous[current.food_type_id]) {
        previous[current.food_type_id] = [];
      }

      previous[current.food_type_id].push(current);

      return previous;
    }, {});

    return Object.keys(grouped).map(key => {
      return {
        id: key,
        name: grouped[key][0].expand.food_type_id.name,
        totalWeight: grouped[key].reduce((previous, current) => previous + convertToPounds(current.feed_weight * current.quantity, current.feed_weight_units), 0).toFixed(2),
        units: 'pounds',
      };
    });
  }

  function clear() {
    chosenSpeciesID.set('');
    conditions.set([]);
    chosenConditionID.set('');
    feeds.set([]);
    cart.set([]);
  }
</script>

<Container>
  <Row>
    <Col xl=8 >
      <Card>
        <h1>Feed Calculator</h1>
        <h3>Use this tool to calculate how much feed you need to order.</h3>
        <hr />
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
                <Input type="select" name="Condition Input" id="conditionInput" placeholder="Select the animals condition..." on:change={onConditionChange} bind:value={$chosenConditionID}>
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
                        bind:value={age}
                        feedback="Age must be between {calcMinAge($feeds)} and {calcMaxAge($feeds)}"
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
                        bind:value={weight}
                        valid={validateWeight($feeds) === true}
                        invalid={validateWeight($feeds) === false}
                        step="0.01"
                        feedback="Weight must be between {calcMinWeight($feeds)} and {calcMaxWeight($feeds)}"
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
      </Card>
    </Col>
    <Col xl=4 >
      <Card>
        <h3>Month of Feed</h3>
        <Table bordered>
          <thead>
            <tr>
              <th>Type</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {#each groupByFeedType($cart) as groupedFeed (groupedFeed.id)}
              <tr>
                <th scope="row">{groupedFeed.name}</th>
                <td>{groupedFeed.totalWeight} {groupedFeed.units}</td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </Card>
      <Card>
        <h3>Animals</h3>
        <Table bordered>
          <thead>
            <tr>
              <th>Species</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {#each $cart as cartItem (cartItem.id)}
              <tr>
                <th id={'text_' + cartItem.id}><a target="_blank" href={cartItem.source}>{cartItem.expand.species_id.name}</a></th>
                <td>{cartItem.quantity}</td>
              </tr>
              <Popover
                trigger="hover"
                placement="left"
                target={'text_' + cartItem.id}
                title="Details"
                dismissible
              >
                <p>Age: {cartItem.age} {cartItem.age_units}</p>
                <p>Weight: {cartItem.animal_weight} {cartItem.animal_weight_units}</p>
                <p>Condition: {cartItem.expand.condition_id.name}</p>
              </Popover>
            {/each}
          </tbody>
        </Table>
      </Card>
    </Col>
  </Row>
</Container>
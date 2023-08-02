<script lang="ts">
  import {
    Popover,
    Table,
  } from "sveltestrap";
  import { cart } from "./store";

</script>


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
        <th id={'text_' + cartItem.id}>{cartItem.expand.species_id.name}</th>
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

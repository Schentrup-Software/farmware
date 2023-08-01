<script lang="ts">
  import { Table } from "sveltestrap";
  import { cart } from "./store";
  import { convertToPounds } from "./conversion";

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
</script>


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

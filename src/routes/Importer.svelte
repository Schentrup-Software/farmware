<script lang="ts">
  import { Card, Spinner, Alert } from 'sveltestrap';
  import { pb } from '../lib/pocketbase';

  let importing = false;
  let alertMessage = '';

  async function importCSV(event) {
    if (importing) {
      return;
    }

    importing = true;

    const file = event.target.files[0];

    if (!file) {
      alertMessage = 'Please select a CSV file.';
      return;
    }

    const csvData = await readCSV(file);
    const jsonData = csvToJSON(csvData);

    const species = await pb.collection('species').getFullList();
    const conditions = await pb.collection('conditions').getFullList();
    const foodTypes = await pb.collection('food_types').getFullList();

    let numberOfFailures = 0;

    jsonData.forEach(async (element) => {
      if (!species.find(s => s.name === element?.Species)) {
        return;
      }

      console.log(element);

      const data = {
        species_id: species.find(s => s.name === element.Species).id,
        condition_id: conditions.find(c => c.name === element.Condition2).id,
        food_type_id: foodTypes.find(f => f.name === element.FoodType).id,
        age: element.Age,
        age_units: element.AgeUnits,
        animal_weight: element.Weight,
        animal_weight_units: element.WeightUnits,
        feed_weight: element.Quantity,
        feed_weight_units: element.QuantityUnits,
        time_period: element.TimePeriod,
        time_period_units: element.TimePeriodUnits,
        source: element.Source,
      };

      try {
        await pb.collection('feed_amounts').create(data);
      } catch (e) {
        console.log(e);
        numberOfFailures++;
      }
    });

    alertMessage = `Imported ${jsonData.length - numberOfFailures} records. Failed to import ${numberOfFailures} records.`;

    importing = false;
  }

  async function readCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  }

  function csvToJSON(csvData) {
    const lines = csvData.split('\n');
    const result = [];

    const headers = lines[0].split(',').map(h => h.trim());
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',').map(l => l.trim());
      if (currentLine.length !== headers.length) continue;

      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }
      result.push(obj);
    }

    return result;
  }
</script>

<Card>
  <h1>Importers</h1>
  <hr />
  <div>
    <h2>CSV Import</h2>
    {#if alertMessage}
      <Alert toggle={() => alertMessage = ''}>
        {alertMessage}
      </Alert>
    {/if}
    {#if importing}
      <Spinner />
    {:else}
      <form>
        <input type="file" on:change={importCSV} accept=".csv" />
      </form>
    {/if}
  </div>
</Card>

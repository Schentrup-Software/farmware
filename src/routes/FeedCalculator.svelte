<script lang="ts">
  import {
    Card,
    Container,
    Row,
    Col,
  } from "sveltestrap";
  import Form from "../lib/feedCalculator/Form.svelte";
  import FeedTotals from "../lib/feedCalculator/FeedTotals.svelte";
  import AnimalList from "../lib/feedCalculator/AnimalList.svelte";
</script>

<Container>
  <Row>
    <Col xl=8 >
      <Card>
        <h1>Feed Calculator</h1>
        <h3>Use this tool to calculate how much feed you need to order.</h3>
        <hr />
        <Form />
      </Card>
    </Col>
    <Col xl=4 >
      <Card>
        <FeedTotals />
      </Card>
      <Card>
        <AnimalList />
      </Card>
    </Col>
  </Row>
</Container>
<script lang="ts">
  import { Link } from 'svelte-routing';
  import { Card, Col, Container, Row } from 'sveltestrap';
</script>

<Card>
  <Container>
    <Row>
      <h1 style="margin-left: 0;">Home</h1>
    </Row>
    <Row>
      <p>
        Welcome to Farmware, a farm management tool for small to medium sized farms.
      </p>
      <p>
        Farmware is a free and open source project. You can find the source code
        on{' '}
        <a href="https://github.com/Schentrup-Software/farmware">GitHub</a>. 
        If you would like to contribute, please submit a pull request. Right now, there is only tool for calculating feed rations, but we are working on adding more tools.
      </p>
    </Row>
    <Row>
      <Col sm="12" md="4">
        <Card>
          <div class="addMargin">
            <h2>Feed Calculator</h2>
            <p>
              The feed calculator is a tool for calculating feed rations for your
              animals. You can find it{' '}
              <Link to="/feed-calculator">here</Link>.
            </p>
          </div>
        </Card>
      </Col>
    </Row>
  </Container>
</Card>

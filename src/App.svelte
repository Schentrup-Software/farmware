<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Login from "./lib/Login.svelte";
  import FeedCalculator from "./routes/FeedCalculator.svelte";
  import About from "./routes/About.svelte";
  import { Nav, NavItem, NavLink, Button } from 'sveltestrap';
  import { openLoginModal } from './lib/modal';
  import { Link } from "svelte-routing";
  import Home from "./routes/Home.svelte";

  export let url = "";
</script>

<Router {url}>
  <Nav>
    <NavItem>
      <img width="50" alt="logo" src="/Logo.png" />
    </NavItem>
    <NavItem>
      <h1>Farmware</h1>
    </NavItem>
    <NavItem>
      <NavLink>
        <Link to="/">Home</Link>
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink>
        <Link to="/about">About</Link>
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink>
        <Link to="/feed-calculator">Feed Calculator</Link>
      </NavLink>
    </NavItem>
    <NavItem>
      <Button on:click={openLoginModal}>Login</Button>
    </NavItem>
  </Nav>
  <div>
    <Route path="/feed-calculator" component={FeedCalculator} />
    <Route path="/about" component={About} />
    <Route path="/" component={Home} />
  </div>
</Router>

<!-- Modals -->
<Login />


<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Login from "./lib/Login.svelte";
  import FeedCalculator from "./routes/FeedCalculator.svelte";
  import About from "./routes/About.svelte";
  import { Nav, NavItem, NavLink, Button } from 'sveltestrap';
  import { openLoginModal, openRegisterModal } from './lib/modal';
  import { Link } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import Register from "./lib/Register.svelte";
  import { currentUser, pb } from "./lib/pocketbase";
  import Importer from "./routes/Importer.svelte";

  export let url = "";

  function signOut() {
    pb.authStore.clear();
  }
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
    <!--<NavItem>
      <NavLink>
        <Link to="/about">About</Link>
      </NavLink>
    </NavItem>-->
    <NavItem>
      <NavLink>
        <Link to="/feed-calculator">Feed Calculator</Link>
      </NavLink>
    </NavItem>
    {#if $currentUser?.role === "Admin"}
      <NavItem>
        <NavLink>
          <Link to="/import">Importer</Link>
        </NavLink>
      </NavItem>
    {/if}
    <NavItem>
      {#if $currentUser}
        <Button on:click={signOut}>Logout</Button>
      {:else}
        <Button on:click={openLoginModal}>Login</Button>
        <Button on:click={openRegisterModal}>Register</Button>
      {/if}
    </NavItem>
  </Nav>
  <div>
    <Route path="/feed-calculator" component={FeedCalculator} />
    <Route path="/about" component={About} />
    <Route path="/" component={Home} />
    <Route path="/import" component={Importer} />
  </div>
</Router>

<!-- Modals -->
<Login />
<Register />


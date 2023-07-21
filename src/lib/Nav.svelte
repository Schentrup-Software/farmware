<script lang="ts">
  import { Nav, NavItem, NavLink, Button } from 'sveltestrap';
  import { openLoginModal } from './modal';
</script>
  
<Nav>
  <NavItem>
    <img width="50" alt="logo" src="/Logo.png" />
  </NavItem>
  <NavItem>
    <h1>Farmware</h1>
  </NavItem>
  <NavItem>
    <NavLink href="#">Home</NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="#">Feed Calculator</NavLink>
  </NavItem>
  <NavItem>
    <Button on:click={openLoginModal}>Login</Button>
  </NavItem>
</Nav>

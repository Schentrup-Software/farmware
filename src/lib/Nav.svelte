<script lang="ts">
  import { writable } from 'svelte/store';
  import { Nav, NavItem, NavLink } from 'sveltestrap';
  import Login from './Login.svelte';
  
  const openModal = writable(false);
</script>
  
<Nav>
  <NavItem>
    <NavLink href="#">Home</NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="#">Feed Calculator</NavLink>
  </NavItem>
  <NavItem>
    <NavLink on:click={()=> openModal.set(true)}>Login</NavLink>
  </NavItem>
</Nav>

<Login open={$openModal} />
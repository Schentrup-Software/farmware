import { writable } from 'svelte/store';

export const modals = {
  none: '',
  login: 'login',
};

export const currentlyOpenModal = writable(modals.none);

export const closeModal = () => {
  console.log('close modal');
  currentlyOpenModal.set(modals.none);
}

export const openLoginModal = () => {
  console.log('open login modal');
  currentlyOpenModal.set(modals.login);
}
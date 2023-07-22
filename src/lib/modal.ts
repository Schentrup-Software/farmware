import { writable } from 'svelte/store';

export const modals = {
  none: '',
  login: 'login',
  register: 'register',
};

export const currentlyOpenModal = writable(modals.none);

export const closeModal = () => {
  currentlyOpenModal.set(modals.none);
}

export const openLoginModal = () => {
  currentlyOpenModal.set(modals.login);
}

export const openRegisterModal = () => {
  currentlyOpenModal.set(modals.register);
}
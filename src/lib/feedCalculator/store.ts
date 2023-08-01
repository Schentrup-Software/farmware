import { pb } from "../pocketbase";
import { writable } from 'svelte/store';

export const alertMessage = writable('');

export const species = writable([]);
export const chosenSpeciesID = writable('');

export async function getSpecies() {
  try {
    species.set(await pb.collection('species').getFullList());
  } catch (e) {
    console.log(e);
    alertMessage.set('There was an error loading the species data.');
  }
}

export const conditions = writable([]);

export async function getConditions(speciesID: string) {
  try {
    conditions.set(await pb.collection('conditions').getFullList({
      filter: `species_id ~ '${speciesID}'`,
    }));
  } catch (e) {
    console.log(e);
    alertMessage.set('There was an error loading the species data.');
  }
}

export const feeds = writable([]);

export async function getFeeds(speciesID: string, conditionID: string) {
  try {
    feeds.set(await pb.collection('feed_amounts').getFullList({
      filter: `species_id = '${speciesID}' && condition_id = '${conditionID}'`,
      expand: 'food_type_id,species_id,condition_id',
    }));
  } catch (e) {
    console.log(e);
    alertMessage.set('There was an error loading the species data.');
  }
}

export const cart = writable([]);

export function addItemToCart(existingCart: Array<any>, matchedItem: any, quantity: number) {
  const newCart = existingCart;
  const existingItem = newCart.find(item => item.id === matchedItem.id);

  if (existingItem) {
    newCart.splice(newCart.findIndex(item => item.id === existingItem.id), 1);
    matchedItem.quantity = existingItem.quantity + quantity;
  } else {
    matchedItem.quantity = quantity;
  }

  newCart.push(matchedItem);
  cart.set(newCart);
}

import { products } from "./products.js";

export let cart = JSON.parse(localStorage.getItem('cart'))||[
    {
        productId:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId : '1'
    },
    {
        productId:"15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity:3,
        deliveryOptionId : '2'
    }
]

export function saveToStorage() {
    localStorage.setItem('cart',JSON.stringify(cart));
}



export function addToCart(productId,productName){
  let matchingItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem
    }
  })
  if(matchingItem){
    matchingItem.quantity=matchingItem.quantity + Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
      // totalCartQuantity += 1;
  }
  else{cart.push({
    productId,
    //using shorthand method we simply used productId, instead of writting productId : productId,
    productName,
    quantity:Number(document.querySelector(`.js-quantity-selector-${productId}`).value),
    deliveryOptionId : '1'
  })
  saveToStorage();
  // totalCartQuantity += 1;
}
}

export function removeFromCart(productId){
    let newCart = cart.filter((cartItem) =>{
        if(!(cartItem.productId === productId)) return cartItem;
    })
    cart = newCart;
    saveToStorage();

}

export function updateDeliveryOption(productId,deliveryOptionId){
    let matchingItem;
    cart.forEach((cartItem) => {
        if(cartItem.productId === productId){
            matchingItem = cartItem;
            matchingItem.deliveryOptionId = deliveryOptionId;
        }
    });
    saveToStorage();
}
export function calculateTotalCartQuantity(cart){
    let totalCartQuantity =0;
    cart.forEach((cartItem) => {
        totalCartQuantity = totalCartQuantity + Number(cartItem.quantity);
        document.querySelector('.cart-quantity-displayer').innerHTML =`${totalCartQuantity}`;
    })
}
import { cart, removeFromCart, saveToStorage,updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { calculateTotalCartQuantity } from "../../data/cart.js";
export function renderOrderSummary(){
document.querySelector('.order-summary').innerHTML=``;
cart.forEach((cartItem) =>{
    const productId = cartItem.productId;
    
   let dateString;
    let matchingProduct;
       products.forEach((product) => {
        if (product.id === productId){
             matchingProduct = product
             let deliveryOptionId = cartItem.deliveryOptionId;
             deliveryOptions.forEach((deliveryOption) => {
                 if(deliveryOptionId===deliveryOption.id)
                 { 
                 const today = dayjs();
                 const deliveryDate= today.add(deliveryOption.deliveryDays,'days');
                 dateString = deliveryDate.format('dddd, MMMM D');
                 }
             })
            }; 
    })

    let html = `<div class="cart-item-container js-cart-item-container-${productId}">
    <div class="delivery-date">
    Delivery date: ${dateString}
    </div>
    
    <div class="cart-item-details-grid">
    <img class="product-image"
    src="${matchingProduct.image}">
    
    <div class="cart-item-details">
    <div class="product-name">
    ${matchingProduct.name}
    </div>
    <div class="product-price">
    $${((matchingProduct.priceCents)/100).toFixed(2)}
    </div>
    <div class="product-quantity">
    <span>
    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
    </span>
    <span class="update-quantity-link link-primary" data-product-id ="${matchingProduct.id}">
    Update
    </span>
    <input class="quantity-input-${productId} quantity-input" data-product-id ="${matchingProduct.id}">
    <span class="save-quantity-link-${productId} save-quantity-link link-primary" data-product-id ="${matchingProduct.id}">Save</span>
    <span class="delete-quantity-link link-primary" data-product-id ="${matchingProduct.id}">
    Delete
    </span>
    </div>
    </div>
    
    <div class="delivery-options">
    <div class="delivery-options-title">
    Choose a delivery option:
    </div>  
    ${deliveryOptionsHTML(matchingProduct,cartItem)}
    

                      </div>
                      </div>
                      </div>`
          document.querySelector('.order-summary').innerHTML += html;
        })

        document.querySelectorAll('.delete-quantity-link').forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);
                calculateTotalCartQuantity(cart);
                document.querySelector(`.js-cart-item-container-${productId}`).remove();  
                renderPaymentSummary();
    })
})
function deliveryOptionsHTML(matchingProduct,cartItem) {
    let html ='';
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate= today.add(deliveryOption.deliveryDays,'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'Free':`$${(deliveryOption.priceCents/100).toFixed(2)} -`
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id = "${deliveryOption.id}" >
            <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
                            name="delivery-option-${matchingProduct.id}">
                            <div>
                            <div class="delivery-option-date">
                            ${dateString}
                            </div>
                            <div class="delivery-option-price">
                            ${priceString} Shipping
                            </div>
                            </div>
                            </div>
                            `
    });
    return html;
}
document.querySelectorAll('.update-quantity-link').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        cart.forEach((cartItem) => {
            if(cartItem.productId === productId){
                document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
                document.querySelector(`.is-editing-quantity .quantity-label`).innerHTML = '';
            }
        })
    })
})
document.querySelectorAll('.save-quantity-link').forEach((link) => {
    link.addEventListener('click' , () => {
        const productId = link.dataset.productId;
        cart.forEach((cartItem) => {
            if(cartItem.productId === productId){
                cartItem.quantity =  Number(document.querySelector(`.js-cart-item-container-${productId} .quantity-input`).value);
                document.querySelector(`.js-cart-item-container-${productId} .quantity-label`).innerHTML=`${cartItem.quantity}`
                document.querySelector(`.js-cart-item-container-${productId} .quantity-input`).value ='';
                document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
                calculateTotalCartQuantity(cart);
                saveToStorage();
                renderPaymentSummary();
                
            }
        })

    })
})
calculateTotalCartQuantity(cart);


document.querySelectorAll('.js-delivery-option').forEach((button) => {
    button.addEventListener('click', () => {
        let productId = button.dataset.productId;
        let deliveryOptionId = button.dataset.deliveryOptionId;
        updateDeliveryOption(productId,deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
        
    })
})
}
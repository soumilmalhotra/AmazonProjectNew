import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { calculateTotalCartQuantity } from "../../data/cart.js";
import { addOrder } from "../../data/orders.js";
export function renderPaymentSummary(){    
    let html ='';
    let totalCartCost = 0;
    let totalShippingCost = 0;
    cart.forEach(cartItem => {
        products.forEach(product => {
            if(product.id === cartItem.productId) totalCartCost += Number(((cartItem.quantity)*(product.priceCents))/100);
        })
        let {deliveryOptionId} = cartItem;
        deliveryOptions.forEach((deliveryOption) => {
            if(deliveryOptionId === deliveryOption.id) totalShippingCost += (deliveryOption.priceCents)/100;
        })
    });
    
    let totalCostBeforeTax = totalCartCost + totalShippingCost;
    let taxCost  = totalCostBeforeTax*0.1; 
    let totalCostAfterTax = totalCostBeforeTax + taxCost;
    
    html = ` <div class="payment-summary-title">
    Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (<text class="cart-quantity-displayer"></text>):</div>
            <div class="payment-summary-money">$${totalCartCost.toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${totalShippingCost.toFixed(2)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${totalCostBeforeTax.toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(taxCost).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${totalCostAfterTax.toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
`;
    document.querySelector('.payment-summary').innerHTML = html;
    calculateTotalCartQuantity(cart);

    document.querySelector('.place-order-button').addEventListener('click', async() => {
      try{ 
      const response = await fetch('https://supersimplebackend.dev/orders' , {
        method: 'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body :JSON.stringify({
          cart:cart
        })
      })

      const order = await response.json();
      console.log(order);
      addOrder(order);
    }
    catch(error) {
      console.log('error occured please try again');
    }
    window.location.href = 'orders.html';
    })
}
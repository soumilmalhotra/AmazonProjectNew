import { orders } from "./orders.js";
import { products, loadProductsFetch } from "./products.js";
loadPage();
async function loadPage() {
    await loadProductsFetch();
    loadOrders();
}

function loadOrders(){
console.log(orders);
orders.forEach(order => {
    const dateObject = new Date(order.orderTime);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    const month = monthNames[dateObject.getMonth()];
    
    const date = dateObject.getDate();
    
    console.log();

    let html = '';
    html+= `
    <div class="order-container">
    
    <div class="order-header">
    <div class="order-header-left-section">
    <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${month} ${date}</div>
                </div>
                    <div class="order-total">
                        <div class="order-header-label">Total:</div>
                        <div>$${(order.totalCostCents/100).toFixed(2)}</div>
                    </div>
                </div>
                
            <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>
          

          `
          order.products.forEach((product) =>{
            let productToBeDisplayed;
            products.forEach(productOg => {
                if (productOg.id === product.productId) {
                    const estimatedDeliveryDateObject = new Date(product.estimatedDeliveryTime);
                    const estimatedDeliveryMonth = monthNames[estimatedDeliveryDateObject.getMonth()];
                    const estimatedDeliveryDate = estimatedDeliveryDateObject.getDate();
                    const formatedEstimatedDeliveryDate = `${estimatedDeliveryMonth} ${estimatedDeliveryDate}`
                    html+=
                    `
                    <div class="order-details-grid">
                      <div class="product-image-container">
                        <img src="${productOg.image}">
                      </div>
          
                      <div class="product-details">
                        <div class="product-name">
                          ${productOg.name}
                          </div>
                        <div class="product-delivery-date">
                          Arriving on: ${formatedEstimatedDeliveryDate}
                        </div>
                        <div class="product-quantity">
                        Quantity: ${product.quantity}
                        </div>
                        <button class="buy-again-button button-primary">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                        </button>
                        </div>
                        
                        <div class="product-actions">
                        <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                        <button class="track-package-button button-secondary">
                            Track package
                          </button>
                        </a>
                      </div>
                      </div>
                      `
                } 
            });

           
          })


   html += `

   
   </div>
   `
   
   document.querySelector('.orders-grid').innerHTML += html;
});
}
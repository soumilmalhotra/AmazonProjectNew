import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
// import '../data/backend-practice.js';

// loadProductsFetch().then(()=>{
// });
async function loadPage() {
    await loadProductsFetch();
    renderOrderSummary();
    renderPaymentSummary();
}

loadPage();


// new Promise((resolve) => {
//     loadProducts(() => {
//         resolve();
//     });
// }).then(() => {    
// })


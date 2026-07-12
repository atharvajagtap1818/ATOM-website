// shopping cart controller for ATOM
class AtomCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('atom_cart')) || [];
    this.injectCartUI();
    this.updateUI();
  }

  save() {
    localStorage.setItem('atom_cart', JSON.stringify(this.items));
    this.updateUI();
  }

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: 1
      });
    }
    this.save();
    
    // Track Meta AddToCart Event
    if (typeof fbq === 'function') {
      fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'INR'
      });
    }
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  }

  updateQty(id, newQty) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.qty = Math.max(1, parseInt(newQty) || 1);
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  injectCartUI() {
    // 1. Inject Floating Indicator Button (if not checkout page)
    if (window.location.pathname.includes('/checkout.html')) return;

    if (!document.getElementById('atomCartIndicator')) {
      const btn = document.createElement('button');
      btn.id = 'atomCartIndicator';
      btn.setAttribute('aria-label', 'Open Shopping Cart');
      btn.style.cssText = `
        position: fixed; right: 32px; bottom: 32px; z-index: 999;
        width: 56px; height: 56px; border-radius: 50%;
        background: #1a1916; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 24px rgba(26,25,22,0.15);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      `;
      btn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EDF0EE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span id="atomCartIndicatorBadge" style="
          position: absolute; top: -4px; right: -4px;
          background: #5A2E2B; color: #EDF0EE;
          font-size: 0.7rem; font-weight: 600;
          min-width: 18px; height: 18px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px; border: 1px solid #1a1916;
        ">0</span>
      `;
      
      // Tactile scale
      btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.93)');
      btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
      btn.addEventListener('click', () => this.openDrawer());
      
      document.body.appendChild(btn);
    }

    // 2. Inject Cart Drawer Overlay & Panel
    if (!document.getElementById('atomCartDrawer')) {
      // Backdrop Overlay
      const overlay = document.createElement('div');
      overlay.id = 'atomCartOverlay';
      overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(26,25,22,0.4);
        z-index: 1000; opacity: 0; pointer-events: none;
        transition: opacity 0.3s ease; backdrop-filter: blur(4px);
      `;
      overlay.addEventListener('click', () => this.closeDrawer());
      document.body.appendChild(overlay);

      // Panel Drawer
      const drawer = document.createElement('div');
      drawer.id = 'atomCartDrawer';
      drawer.style.cssText = `
        position: fixed; top: 0; right: -440px; z-index: 1001;
        width: 440px; max-width: 100vw; height: 100vh;
        background: #F9F6F0; border-left: 1px solid rgba(44,43,40,0.1);
        box-shadow: -10px 0 30px rgba(26,25,22,0.08);
        transition: right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: flex; flex-direction: column;
      `;
      drawer.innerHTML = `
        <!-- Header -->
        <div style="padding: 24px 32px; border-bottom: 1px solid rgba(44,43,40,0.08); display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-family: Cormorant Garamond, serif; font-size: 1.8rem; font-weight: 500; font-style: italic; color: #1a1916; margin: 0;">Your Basket</h2>
          <button id="atomCartCloseBtn" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: #1a1916; padding: 4px; line-height: 1;">&times;</button>
        </div>
        
        <!-- Items Container -->
        <div id="atomCartItemsList" style="flex: 1; overflow-y: auto; padding: 24px 32px; display: flex; flex-direction: column; gap: 20px;">
          <!-- Rendered items go here -->
        </div>

        <!-- Footer Checkout -->
        <div style="padding: 24px 32px; border-top: 1px solid rgba(44,43,40,0.08); background: rgba(44,43,40,0.01);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <span style="font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; color: #6D695F;">Subtotal</span>
            <span id="atomCartSubtotal" style="font-size: 1.35rem; font-weight: 600; color: #5A2E2B;">₹0/-</span>
          </div>
          <button id="atomCartCheckoutBtn" class="btn-primary" style="width: 100%; justify-content: center; padding: 14px 0; margin-bottom: 12px;">PROCEED TO CHECKOUT</button>
          <button id="atomCartContinueBtn" style="width: 100%; background: none; border: none; cursor: pointer; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: #6D695F; text-decoration: underline;">Continue Gifting</button>
        </div>
      `;

      document.body.appendChild(drawer);
      
      // Event listeners
      document.getElementById('atomCartCloseBtn').addEventListener('click', () => this.closeDrawer());
      document.getElementById('atomCartContinueBtn').addEventListener('click', () => this.closeDrawer());
      document.getElementById('atomCartCheckoutBtn').addEventListener('click', () => {
        if (this.items.length === 0) {
          alert('Your basket is empty. Please add items to continue.');
          return;
        }
        window.location.href = '/checkout.html';
      });
    }
  }

  openDrawer() {
    const drawer = document.getElementById('atomCartDrawer');
    const overlay = document.getElementById('atomCartOverlay');
    if (drawer && overlay) {
      overlay.style.pointerEvents = 'auto';
      overlay.style.opacity = '1';
      drawer.style.right = '0';
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('atomCartDrawer');
    const overlay = document.getElementById('atomCartOverlay');
    if (drawer && overlay) {
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
      drawer.style.right = '-440px';
    }
  }

  updateUI() {
    // 1. Update Indicator Badge count
    const badge = document.getElementById('atomCartIndicatorBadge');
    if (badge) {
      badge.innerText = this.getTotalCount();
    }

    // 2. Render List items in drawer
    const listContainer = document.getElementById('atomCartItemsList');
    if (!listContainer) return;

    if (this.items.length === 0) {
      listContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; gap: 16px; color: #6D695F;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p style="font-family: Cormorant Garamond, serif; font-size: 1.25rem; font-style: italic; margin: 0;">Your basket is empty.</p>
        </div>
      `;
      document.getElementById('atomCartSubtotal').innerText = '₹0/-';
      return;
    }

    let html = '';
    this.items.forEach(item => {
      html += `
        <div style="display: flex; gap: 16px; align-items: center; padding-bottom: 16px; border-bottom: 1px solid rgba(44,43,40,0.06);">
          <div style="width: 60px; height: 75px; background: rgba(44,43,40,0.04); border: 1px solid rgba(44,43,40,0.08); border-radius: 2px; overflow: hidden; flex-shrink: 0;">
            <img src="${item.img}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-family: Cormorant Garamond, serif; font-size: 1.15rem; font-weight: 500; color: #1a1916; margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</h4>
            <div style="font-size: 0.95rem; font-weight: 600; color: #5A2E2B; margin-bottom: 8px;">₹${item.price}/-</div>
            
            <!-- Quantity selectors -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="display: inline-flex; align-items: center; border: 1px solid rgba(44,43,40,0.1); border-radius: 2px; background: #fff;">
                <button onclick="window.updateCartItemQty('${item.id}', ${item.qty - 1})" style="border: none; background: none; width: 24px; height: 24px; cursor: pointer; color: #1a1916;">-</button>
                <span style="font-size: 0.78rem; font-weight: 600; min-width: 24px; text-align: center; color: #1a1916;">${item.qty}</span>
                <button onclick="window.updateCartItemQty('${item.id}', ${item.qty + 1})" style="border: none; background: none; width: 24px; height: 24px; cursor: pointer; color: #1a1916;">+</button>
              </div>
              <button onclick="window.removeCartItem('${item.id}')" style="background: none; border: none; cursor: pointer; font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; color: #8F8B83; margin-left: auto;">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;
    document.getElementById('atomCartSubtotal').innerText = `₹${this.getTotalPrice()}/-`;
  }
}

// Instantiate globally
let cartInstance;
document.addEventListener('DOMContentLoaded', () => {
  cartInstance = new AtomCart();
  
  // Bind global helper triggers for inline HTML handlers
  window.addToCart = (product) => {
    cartInstance.addItem(product);
  };

  window.removeCartItem = (id) => {
    cartInstance.removeItem(id);
  };

  window.updateCartItemQty = (id, qty) => {
    cartInstance.updateQty(id, qty);
  };

  window.clearCart = () => {
    cartInstance.clear();
  };

  window.openCartDrawer = () => {
    cartInstance.openDrawer();
  };

  window.closeCartDrawer = () => {
    cartInstance.closeDrawer();
  };
});
export { cartInstance };

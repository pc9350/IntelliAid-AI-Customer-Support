// Simulated order tracking system
// In a real implementation, this would connect to your actual order database

// Generate random sample orders
const generateSampleOrders = () => {
  const statuses = [
    'Processing', 
    'Shipped', 
    'Out for Delivery', 
    'Delivered', 
    'Cancelled',
    'Return Processing',
    'Return Completed'
  ];
  
  const products = [
    'Summer Breeze Dress',
    'Classic Business Suit',
    'Designer Jeans',
    'Winter Wonderland Jacket',
    'Everyday Comfort Tee',
    'Autumn Knit Sweater',
    'Classic Oxford Shirt',
    'Active Performance Leggings'
  ];
  
  const cities = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA'
  ];
  
  // Create 20 sample orders
  const orders = {};
  for (let i = 1; i <= 20; i++) {
    // Generate an order ID with pattern TT-2023-XXXXX
    const orderId = `TT-2023-${(10000 + i).toString()}`;
    
    // Random order date in last 30 days
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
    
    // Random estimated delivery date (7-14 days after order)
    const estDeliveryDate = new Date(orderDate);
    estDeliveryDate.setDate(estDeliveryDate.getDate() + 7 + Math.floor(Math.random() * 7));
    
    // Random actual delivery date (if delivered)
    const deliveryDate = Math.random() > 0.8 ? null : new Date(estDeliveryDate);
    if (deliveryDate) {
      // 50% chance of delivering early
      if (Math.random() > 0.5) {
        deliveryDate.setDate(deliveryDate.getDate() - Math.floor(Math.random() * 3));
      }
    }
    
    // Randomly select 1-3 products
    const numProducts = 1 + Math.floor(Math.random() * 3);
    const orderItems = [];
    for (let j = 0; j < numProducts; j++) {
      orderItems.push({
        product: products[Math.floor(Math.random() * products.length)],
        quantity: 1 + Math.floor(Math.random() * 3),
        price: (20 + Math.floor(Math.random() * 80)) * 0.99
      });
    }
    
    // Calculate total cost
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.0825; // 8.25% tax rate
    const total = subtotal + shipping + tax;
    
    // Random status (weighted towards delivered/shipped)
    let status;
    const statusRoll = Math.random();
    if (statusRoll < 0.4) {
      status = 'Delivered';
    } else if (statusRoll < 0.7) {
      status = 'Shipped';
    } else if (statusRoll < 0.8) {
      status = 'Processing';
    } else if (statusRoll < 0.9) {
      status = 'Out for Delivery';
    } else {
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    // Generate tracking information based on status
    let trackingInfo = null;
    let carrier = null;
    
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      carrier = Math.random() > 0.5 ? 'FedEx' : 'UPS';
      trackingInfo = {
        number: `${carrier[0]}${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        carrier,
        history: []
      };
      
      if (status === 'Shipped' || status === 'Out for Delivery' || status === 'Delivered') {
        const shipDate = new Date(orderDate);
        shipDate.setDate(shipDate.getDate() + 1 + Math.floor(Math.random() * 3));
        trackingInfo.history.push({
          date: shipDate.toISOString(),
          status: 'Shipped',
          location: 'TrendyThreads Warehouse'
        });
      }
      
      if (status === 'Out for Delivery' || status === 'Delivered') {
        const transitDate = new Date(orderDate);
        transitDate.setDate(transitDate.getDate() + 3 + Math.floor(Math.random() * 3));
        trackingInfo.history.push({
          date: transitDate.toISOString(),
          status: 'In Transit',
          location: Math.random() > 0.5 ? 'Regional Distribution Center' : 'Local Sorting Facility'
        });
        
        const outForDeliveryDate = new Date(transitDate);
        outForDeliveryDate.setDate(outForDeliveryDate.getDate() + 1);
        trackingInfo.history.push({
          date: outForDeliveryDate.toISOString(),
          status: 'Out for Delivery',
          location: cities[Math.floor(Math.random() * cities.length)]
        });
      }
      
      if (status === 'Delivered') {
        const deliveryDateTracking = new Date(estDeliveryDate);
        trackingInfo.history.push({
          date: deliveryDateTracking.toISOString(),
          status: 'Delivered',
          location: cities[Math.floor(Math.random() * cities.length)]
        });
      }
    }
    
    // Create the complete order object
    orders[orderId] = {
      id: orderId,
      customerName: `Customer ${i}`, // In a real system, this would be actual customer data
      orderDate: orderDate.toISOString(),
      items: orderItems,
      shippingAddress: `123 Main St, ${cities[Math.floor(Math.random() * cities.length)]}`,
      billingAddress: `123 Main St, ${cities[Math.floor(Math.random() * cities.length)]}`,
      paymentMethod: Math.random() > 0.7 ? 'PayPal' : 'Credit Card',
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status,
      estimatedDelivery: estDeliveryDate.toISOString(),
      actualDelivery: deliveryDate ? deliveryDate.toISOString() : null,
      trackingInfo
    };
  }
  
  return orders;
};

// Generate orders once (would be stored in a database in a real application)
const sampleOrders = generateSampleOrders();

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { orderId, email } = req.query;
    
    if (orderId) {
      // Check if order exists
      if (sampleOrders[orderId]) {
        return res.status(200).json(sampleOrders[orderId]);
      } else {
        return res.status(404).json({ error: "Order not found." });
      }
    }
    
    // If no orderId is provided, return the last 5 orders (simulating a customer view)
    // In a real application, this would be filtered by authenticated user
    const recentOrders = Object.values(sampleOrders).slice(0, 5);
    return res.status(200).json({ orders: recentOrders });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 
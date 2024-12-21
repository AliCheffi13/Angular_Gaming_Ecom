const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  const { cart, userData } = req.body;

  const lineItems = cart.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
      customer_email: userData.email,
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));

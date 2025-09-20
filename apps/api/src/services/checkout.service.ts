// Define interfaces for Stripe types
interface StripeCheckoutSession {
  id: string;
  url: string;
}

interface StripeLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

interface StripeCheckoutOptions {
  payment_method_types: string[];
  line_items: StripeLineItem[];
  mode: 'payment' | 'subscription';
  success_url: string;
  cancel_url: string;
  metadata: Record<string, string>;
}

// Define interface for StickerPack
interface StickerPack {
  id: string;
  name: string;
  price: number;
}

// Mock Stripe implementation
const mockStripe = {
  checkout: {
    sessions: {
      create: async (options: StripeCheckoutOptions): Promise<StripeCheckoutSession> => {
        return {
          id: 'mock-session-id',
          url: 'https://checkout.stripe.com/mock-session',
        };
      }
    }
  }
};

export const checkoutService = {
  createCheckoutSession: async (userId: string, packId: string): Promise<StripeCheckoutSession> => {
    // In a real implementation, this would use the Stripe SDK
    
    // Get pack details (mock)
    const pack: StickerPack = {
      id: packId,
      name: 'Sticker Pack',
      price: 199, // $1.99
    };
    
    // Create checkout session
    const session = await mockStripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pack.name,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId,
        packId,
      },
    });
    
    return session;
  }
};

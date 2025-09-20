'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out our service',
    features: [
      '5 sticker packs per month',
      'Basic avatar styles',
      'Standard quality output',
      'Community support',
    ],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 299,
    period: 'month',
    description: 'Great for regular users',
    features: [
      '50 sticker packs per month',
      'All avatar styles',
      'High quality output',
      'Priority support',
      'Custom backgrounds',
      'Bulk download',
    ],
    buttonText: 'Start Pro',
    popular: true,
  },
  {
    name: 'Premium',
    price: 799,
    period: 'month',
    description: 'For power users and creators',
    features: [
      'Unlimited sticker packs',
      'All avatar styles + exclusive ones',
      'Ultra HD quality output',
      '24/7 priority support',
      'Custom backgrounds & effects',
      'Bulk download & API access',
      'Commercial usage rights',
      'Early access to new features',
    ],
    buttonText: 'Go Premium',
    popular: false,
  },
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState("monthly" as "monthly" | "yearly");
    //   const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const router = useRouter();

  const handlePlanSelect = (planName: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }
    
    // Here you would integrate with your payment processor
    console.log(`Selected plan: ${planName}`);
    alert(`Payment integration for ${planName} plan would be implemented here`);
  };

  const getDiscountedPrice = (price: number) => {
    return billingCycle === 'yearly' ? Math.floor(price * 10) : price; // 2 months free on yearly
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create amazing sticker avatars with our flexible pricing options
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular
                  ? 'ring-2 ring-blue-500 transform scale-105'
                  : 'hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{getDiscountedPrice(plan.price).toLocaleString('en-IN')}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-1">
                      /{billingCycle === 'yearly' ? 'year' : plan.period}
                    </span>
                  )}
                </div>

                {billingCycle === 'yearly' && plan.price > 0 && (
                  <div className="text-sm text-gray-500">
                    <span className="line-through">₹{(plan.price * 12).toLocaleString('en-IN')}/year</span>
                    <span className="text-green-600 ml-2 font-medium">
                      Save ₹{((plan.price * 12) - getDiscountedPrice(plan.price)).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan.name)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, UPI, and net banking for Indian customers.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Our Free plan gives you 5 sticker packs per month to try out our service with no time limit.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee for all paid plans if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to create amazing stickers?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already creating personalized sticker avatars
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}

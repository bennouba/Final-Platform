# API Integration for 3rd Party Needs

## Overview

This document outlines the comprehensive API integration strategy for the EISHRO platform, covering payment gateways, logistics providers, communication services, and other third-party integrations essential for platform operations.

## Integration Architecture

### Core Integration Principles
- **Modular Design**: Each integration is independently configurable
- **Error Resilience**: Circuit breakers and retry mechanisms
- **Monitoring**: Comprehensive logging and alerting
- **Security**: Encrypted credentials and secure API calls
- **Scalability**: Asynchronous processing for high-volume operations

### Integration Framework
```typescript
interface IntegrationConfig {
  provider: string;
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  rateLimit: number;
  enabled: boolean;
}

interface IntegrationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  provider: string;
  timestamp: Date;
  requestId: string;
}
```

## Payment Gateway Integrations

### Moamalat Payment Gateway

#### Integration Overview
Moamalat is Libya's primary payment processor, handling card payments, mobile payments, and bank transfers.

#### API Configuration
```typescript
const moamalatConfig: IntegrationConfig = {
  provider: 'moamalat',
  apiKey: process.env.MOAMALAT_MID,
  apiSecret: process.env.MOAMALAT_SECRET,
  baseUrl: process.env.MOAMALAT_ENV === 'sandbox'
    ? 'https://test.moamalat.net'
    : 'https://api.moamalat.net',
  timeout: 30000,
  retryAttempts: 3,
  rateLimit: 100,
  enabled: true
};
```

#### Payment Flow Implementation
```typescript
class MoamalatService {
  async initiatePayment(orderData: OrderData): Promise<PaymentResult> {
    const payload = {
      merchantId: moamalatConfig.apiKey,
      amount: orderData.total,
      currency: 'LYD',
      orderId: orderData.id,
      customerEmail: orderData.customer.email,
      successUrl: `${process.env.FRONTEND_URL}/payment/success`,
      failureUrl: `${process.env.FRONTEND_URL}/payment/failure`,
      webhookUrl: `${process.env.BACKEND_URL}/api/webhooks/moamalat`
    };

    const response = await this.makeRequest('/api/initiate', payload);
    return this.parsePaymentResponse(response);
  }

  async verifyPayment(paymentId: string): Promise<VerificationResult> {
    const response = await this.makeRequest('/api/verify', { paymentId });
    return this.parseVerificationResponse(response);
  }

  async refundPayment(paymentId: string, amount: number): Promise<RefundResult> {
    const payload = {
      paymentId,
      amount,
      reason: 'customer_request'
    };

    const response = await this.makeRequest('/api/refund', payload);
    return this.parseRefundResponse(response);
  }
}
```

#### Webhook Handling
```typescript
// Webhook endpoint for payment notifications
app.post('/api/webhooks/moamalat', async (req, res) => {
  const signature = req.headers['x-moamalat-signature'];
  const payload = req.body;

  // Verify webhook signature
  if (!this.verifySignature(payload, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process payment notification
  const result = await this.processWebhook(payload);

  // Update order status
  await this.updateOrderStatus(result);

  res.status(200).json({ received: true });
});
```

#### Error Handling & Monitoring
```typescript
const paymentErrorCodes = {
  '1001': 'Invalid merchant credentials',
  '1002': 'Payment amount exceeds limit',
  '1003': 'Card expired',
  '1004': 'Insufficient funds',
  '1005': 'Transaction declined',
  '2001': 'Network timeout',
  '2002': 'Service unavailable'
};
```

### Future Payment Integrations

#### Fawry Integration
```typescript
const fawryConfig: IntegrationConfig = {
  provider: 'fawry',
  apiKey: process.env.FAWRY_API_KEY,
  apiSecret: process.env.FAWRY_API_SECRET,
  baseUrl: 'https://api.fawry.com',
  timeout: 25000,
  retryAttempts: 3,
  rateLimit: 200,
  enabled: false // Enable when needed
};
```

#### PayPal Integration
```typescript
const paypalConfig: IntegrationConfig = {
  provider: 'paypal',
  apiKey: process.env.PAYPAL_CLIENT_ID,
  apiSecret: process.env.PAYPAL_CLIENT_SECRET,
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.paypal.com'
    : 'https://api.sandbox.paypal.com',
  timeout: 30000,
  retryAttempts: 2,
  rateLimit: 50,
  enabled: false
};
```

## Logistics & Shipping Integrations

### Aramex Integration

#### Service Overview
Aramex provides domestic and international shipping services across the Middle East and North Africa.

#### API Configuration
```typescript
const aramexConfig: IntegrationConfig = {
  provider: 'aramex',
  apiKey: process.env.ARAMEX_API_KEY,
  apiSecret: process.env.ARAMEX_API_SECRET,
  baseUrl: 'https://ws.aramex.net',
  timeout: 45000,
  retryAttempts: 2,
  rateLimit: 30,
  enabled: true
};
```

#### Shipping Implementation
```typescript
class AramexService {
  async createShipment(shipmentData: ShipmentData): Promise<ShipmentResult> {
    const payload = {
      ClientInfo: {
        UserName: aramexConfig.apiKey,
        Password: aramexConfig.apiSecret,
        Version: '1.0'
      },
      Shipments: [{
        Shipper: {
          AccountNumber: process.env.ARAMEX_ACCOUNT,
          Contact: {
            PersonName: shipmentData.shipper.name,
            CompanyName: 'EISHRO Platform',
            PhoneNumber1: shipmentData.shipper.phone,
            EmailAddress: shipmentData.shipper.email
          },
          Address: {
            Line1: shipmentData.shipper.address,
            City: shipmentData.shipper.city,
            CountryCode: 'LY'
          }
        },
        Consignee: {
          Contact: {
            PersonName: shipmentData.recipient.name,
            PhoneNumber1: shipmentData.recipient.phone,
            EmailAddress: shipmentData.recipient.email
          },
          Address: {
            Line1: shipmentData.recipient.address,
            City: shipmentData.recipient.city,
            CountryCode: 'LY'
          }
        },
        Details: {
          ActualWeight: shipmentData.weight,
          ChargeableWeight: shipmentData.weight,
          DescriptionOfGoods: shipmentData.description,
          GoodsOriginCountry: 'LY',
          NumberOfPieces: shipmentData.pieces
        },
        ShippingDateTime: new Date().toISOString()
      }]
    };

    const response = await this.makeSoapRequest('CreateShipments', payload);
    return this.parseShipmentResponse(response);
  }

  async trackShipment(awbNumber: string): Promise<TrackingResult> {
    const payload = {
      ClientInfo: {
        UserName: aramexConfig.apiKey,
        Password: aramexConfig.apiSecret,
        Version: '1.0'
      },
      Shipments: [awbNumber]
    };

    const response = await this.makeSoapRequest('TrackShipments', payload);
    return this.parseTrackingResponse(response);
  }
}
```

### Libyan Post Integration

#### Service Overview
Libyan Post provides nationwide postal services and package delivery.

#### Integration Approach
```typescript
const libyanPostConfig: IntegrationConfig = {
  provider: 'libyan_post',
  apiKey: process.env.LIBYAN_POST_API_KEY,
  baseUrl: 'https://api.libyanpost.ly',
  timeout: 60000, // Longer timeout for postal services
  retryAttempts: 1,
  rateLimit: 20,
  enabled: true
};
```

### Local Courier Integration

#### Multiple Provider Support
```typescript
const courierProviders = [
  {
    name: 'bebo_fast',
    apiUrl: 'https://api.bebofast.ly',
    regions: ['Tripoli', 'Benghazi'],
    maxWeight: 10,
    enabled: true
  },
  {
    name: 'sonic_express',
    apiUrl: 'https://api.sonicexpress.ly',
    regions: ['Tripoli', 'Misrata'],
    maxWeight: 20,
    enabled: true
  },
  {
    name: 'go_delivery',
    apiUrl: 'https://api.godelivery.ly',
    regions: ['All cities'],
    maxWeight: 5,
    enabled: true
  }
];
```

## Communication Integrations

### Email Service Integration

#### SMTP Configuration
```typescript
const emailConfig = {
  provider: 'smtp',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  rateLimit: 100, // emails per hour
  enabled: true
};
```

#### Email Templates & Automation
```typescript
const emailTemplates = {
  order_confirmation: {
    subject: 'تأكيد الطلب - {{orderId}}',
    template: 'order-confirmation.html',
    variables: ['customerName', 'orderId', 'orderTotal', 'items']
  },
  shipping_notification: {
    subject: 'تم شحن طلبك',
    template: 'shipping-notification.html',
    variables: ['customerName', 'orderId', 'trackingNumber', 'carrier']
  },
  payment_success: {
    subject: 'تم دفع الطلب بنجاح',
    template: 'payment-success.html',
    variables: ['customerName', 'orderId', 'amount', 'paymentMethod']
  }
};
```

### SMS Service Integration

#### SMS Gateway Configuration
```typescript
const smsConfig: IntegrationConfig = {
  provider: 'libyan_sms_gateway',
  apiKey: process.env.SMS_API_KEY,
  apiSecret: process.env.SMS_API_SECRET,
  baseUrl: 'https://api.libyansms.ly',
  timeout: 15000,
  retryAttempts: 2,
  rateLimit: 200,
  enabled: true
};
```

#### SMS Templates
```typescript
const smsTemplates = {
  order_placed: 'تم استلام طلبك رقم {{orderId}}. سيتم التواصل معك قريباً.',
  payment_received: 'تم استلام دفعة بقيمة {{amount}} دينار للطلب {{orderId}}.',
  shipping_update: 'تم شحن طلبك {{orderId}}. رقم التتبع: {{trackingNumber}}',
  delivery_today: 'سيتم توصيل طلبك {{orderId}} اليوم. يرجى التواجد في العنوان المسجل.',
  otp_verification: 'رمز التحقق: {{otp}}. صالح لمدة 5 دقائق.'
};
```

## Analytics & Monitoring Integrations

### Google Analytics Integration

#### E-commerce Tracking
```typescript
const analyticsConfig = {
  measurementId: process.env.GA_MEASUREMENT_ID,
  apiSecret: process.env.GA_API_SECRET,
  enabled: true
};

// Enhanced E-commerce events
const gaEvents = {
  purchase: {
    event: 'purchase',
    parameters: {
      currency: 'LYD',
      value: '{{orderTotal}}',
      items: '{{orderItems}}',
      transaction_id: '{{orderId}}'
    }
  },
  add_to_cart: {
    event: 'add_to_cart',
    parameters: {
      currency: 'LYD',
      value: '{{productPrice}}',
      items: [{
        item_id: '{{productId}}',
        item_name: '{{productName}}',
        price: '{{productPrice}}'
      }]
    }
  }
};
```

### Error Monitoring Integration

#### Sentry Configuration
```typescript
const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version,
  enabled: true
};

// Error tracking setup
Sentry.init({
  dsn: sentryConfig.dsn,
  environment: sentryConfig.environment,
  release: sentryConfig.release,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Console(),
    new Sentry.Integrations.OnUncaughtException(),
    new Sentry.Integrations.OnUnhandledRejection()
  ],
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Sanitize sensitive data
    return this.sanitizeEvent(event);
  }
});
```

## Social Media Integrations

### Facebook Business Integration

#### API Configuration
```typescript
const facebookConfig: IntegrationConfig = {
  provider: 'facebook',
  apiKey: process.env.FACEBOOK_APP_ID,
  apiSecret: process.env.FACEBOOK_APP_SECRET,
  baseUrl: 'https://graph.facebook.com/v18.0',
  timeout: 30000,
  retryAttempts: 2,
  rateLimit: 200,
  enabled: true
};
```

#### Marketing API Implementation
```typescript
class FacebookService {
  async createCampaign(campaignData: CampaignData): Promise<CampaignResult> {
    const payload = {
      name: campaignData.name,
      objective: 'CONVERSIONS',
      status: 'PAUSED',
      special_ad_categories: [],
      campaign_budget_optimization: true
    };

    const response = await this.makeRequest('/act_{{adAccountId}}/campaigns', payload);
    return this.parseCampaignResponse(response);
  }

  async getInsights(campaignId: string): Promise<InsightsResult> {
    const params = {
      fields: 'impressions,clicks,spend,conversions',
      time_range: {
        since: campaignData.startDate,
        until: campaignData.endDate
      }
    };

    const response = await this.makeRequest(`/${campaignId}/insights`, params);
    return this.parseInsightsResponse(response);
  }
}
```

## Integration Management System

### Configuration Management
```typescript
class IntegrationManager {
  private integrations: Map<string, IntegrationConfig> = new Map();

  async registerIntegration(config: IntegrationConfig): Promise<void> {
    this.integrations.set(config.provider, config);
    await this.validateConfiguration(config);
    await this.testConnection(config);
  }

  async executeIntegration<T>(
    provider: string,
    operation: string,
    params: any
  ): Promise<IntegrationResult<T>> {
    const config = this.integrations.get(provider);
    if (!config || !config.enabled) {
      throw new Error(`Integration ${provider} not available`);
    }

    return await this.circuitBreaker.execute(async () => {
      return await this.callIntegration(config, operation, params);
    });
  }

  private async circuitBreaker<T>(operation: () => Promise<T>): Promise<T> {
    // Implementation of circuit breaker pattern
    // Prevents cascading failures
  }
}
```

### Monitoring & Alerting
```typescript
class IntegrationMonitor {
  async monitorIntegrationHealth(): Promise<void> {
    for (const [provider, config] of this.integrations) {
      const health = await this.checkHealth(config);

      if (!health.healthy) {
        await this.sendAlert({
          provider,
          status: 'unhealthy',
          error: health.error,
          timestamp: new Date()
        });
      }

      await this.recordMetrics({
        provider,
        responseTime: health.responseTime,
        successRate: health.successRate,
        errorRate: health.errorRate
      });
    }
  }

  async checkHealth(config: IntegrationConfig): Promise<HealthCheckResult> {
    // Perform health check for integration
  }
}
```

## Security Considerations

### API Key Management
```typescript
class SecretManager {
  async encryptSecret(secret: string): Promise<string> {
    // Encrypt sensitive API credentials
    return await this.kms.encrypt(secret);
  }

  async decryptSecret(encryptedSecret: string): Promise<string> {
    // Decrypt when needed for API calls
    return await this.kms.decrypt(encryptedSecret);
  }

  async rotateSecrets(): Promise<void> {
    // Automatically rotate API keys
    for (const integration of this.integrations) {
      if (this.shouldRotate(integration)) {
        await this.rotateSecret(integration);
      }
    }
  }
}
```

### Rate Limiting & Throttling
```typescript
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Redis store for distributed rate limiting
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  })
};
```

## Testing & Quality Assurance

### Integration Testing
```typescript
class IntegrationTester {
  async testPaymentGateway(): Promise<TestResult> {
    // Test payment flow with sandbox
    const testOrder = this.createTestOrder();
    const result = await this.paymentService.initiatePayment(testOrder);

    return {
      success: result.success,
      responseTime: result.responseTime,
      errors: result.errors
    };
  }

  async testShippingIntegration(): Promise<TestResult> {
    // Test shipping API with mock data
    const testShipment = this.createTestShipment();
    const result = await this.shippingService.createShipment(testShipment);

    return {
      success: result.success,
      trackingNumber: result.trackingNumber,
      errors: result.errors
    };
  }
}
```

## Future Integrations

### Planned Third-Party Services
1. **AI/ML Services**: Product recommendations, fraud detection
2. **Marketing Automation**: Customer segmentation, email campaigns
3. **Customer Support**: Chatbots, ticketing systems
4. **Business Intelligence**: Advanced analytics, reporting
5. **International Payments**: Multi-currency support
6. **Global Shipping**: International logistics partners

## Conclusion

The EISHRO platform's third-party API integrations provide comprehensive functionality for payments, logistics, communications, and business operations. The modular architecture ensures reliability, security, and scalability while maintaining ease of maintenance and updates.

## Appendices

### Appendix A: API Documentation Links
### Appendix B: Integration Testing Procedures
### Appendix C: Error Code Reference
### Appendix D: Rate Limiting Policies
### Appendix E: Security Compliance Checklist
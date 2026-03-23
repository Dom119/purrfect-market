package com.purrfectmarket.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.api.key:}")
    private String stripeSecretKey;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public String createCheckoutSession(Long userId, long amountCents) throws StripeException {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new IllegalStateException("Stripe is not configured. Set STRIPE_SECRET_KEY or stripe.api.key");
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(amountCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Purrfect Market - Order")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .setSuccessUrl(frontendUrl + "/cart?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/cart")
                .putMetadata("userId", String.valueOf(userId))
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    public String getSessionUserId(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);
        return session.getMetadata().get("userId");
    }

    public boolean isPaymentComplete(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);
        return "paid".equals(session.getPaymentStatus());
    }
}

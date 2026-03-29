package com.purrfectmarket.service;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StripeServiceTest {

    @InjectMocks
    private StripeService stripeService;

    @BeforeEach
    void setDefaults() {
        ReflectionTestUtils.setField(stripeService, "stripeSecretKey", "");
        ReflectionTestUtils.setField(stripeService, "frontendUrl", "http://localhost:5173");
    }

    @Test
    void createCheckoutSession_throwsWhenStripeNotConfigured() {
        assertThatThrownBy(() -> stripeService.createCheckoutSession(1L, 500))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Stripe is not configured");
    }

    @Test
    void createCheckoutSession_returnsSessionUrl() throws Exception {
        ReflectionTestUtils.setField(stripeService, "stripeSecretKey", "sk_test_xxx");

        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {
            Session session = mock(Session.class);
            when(session.getUrl()).thenReturn("https://checkout.stripe.com/c/pay/cs_test");
            sessionMock.when(() -> Session.create(any(SessionCreateParams.class))).thenReturn(session);

            String url = stripeService.createCheckoutSession(42L, 1999);

            assertThat(url).isEqualTo("https://checkout.stripe.com/c/pay/cs_test");
        }
    }

    @Test
    void getSessionUserId_readsMetadata() throws Exception {
        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {
            Session session = mock(Session.class);
            when(session.getMetadata()).thenReturn(Map.of("userId", "7"));
            sessionMock.when(() -> Session.retrieve("sid_1")).thenReturn(session);

            assertThat(stripeService.getSessionUserId("sid_1")).isEqualTo("7");
        }
    }

    @Test
    void isPaymentComplete_trueWhenPaid() throws Exception {
        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {
            Session session = mock(Session.class);
            when(session.getPaymentStatus()).thenReturn("paid");
            sessionMock.when(() -> Session.retrieve("sid")).thenReturn(session);

            assertThat(stripeService.isPaymentComplete("sid")).isTrue();
        }
    }
}

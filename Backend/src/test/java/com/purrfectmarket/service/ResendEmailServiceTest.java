package com.purrfectmarket.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ResendEmailServiceTest {

    @Test
    void isConfigured_falseWhenKeyBlank() {
        ResendEmailService svc = new ResendEmailService("", "from", "");
        assertThat(svc.isConfigured()).isFalse();
    }

    @Test
    void isConfigured_trueWhenKeyPresent() {
        ResendEmailService svc = new ResendEmailService("re_xxx", "from", "");
        assertThat(svc.isConfigured()).isTrue();
    }

    @Test
    void sendWelcomeEmail_noOpWhenNotConfigured() {
        ResendEmailService svc = new ResendEmailService("", "from", "");
        svc.sendWelcomeEmail("any@test.com");
        // no exception; no HTTP
    }

    @Test
    void sendHtmlBulk_throwsWhenNotConfigured() {
        ResendEmailService svc = new ResendEmailService("", "from", "");
        assertThatThrownBy(() -> svc.sendHtmlBulk(java.util.List.of("a@b.com"), "S", "<p>x</p>"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Resend is not configured");
    }
}

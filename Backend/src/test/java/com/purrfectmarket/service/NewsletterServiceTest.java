package com.purrfectmarket.service;

import com.purrfectmarket.model.NewsletterSubscriber;
import com.purrfectmarket.repository.NewsletterSubscriberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NewsletterServiceTest {

    @Mock
    private NewsletterSubscriberRepository repository;
    @Mock
    private ResendEmailService resendEmailService;

    @InjectMocks
    private NewsletterService newsletterService;

    @Test
    void subscribe_validatesEmail() {
        assertThatThrownBy(() -> newsletterService.subscribe(null))
                .isInstanceOf(IllegalArgumentException.class);

        assertThatThrownBy(() -> newsletterService.subscribe("   "))
                .isInstanceOf(IllegalArgumentException.class);

        assertThatThrownBy(() -> newsletterService.subscribe("bad"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("valid email");
    }

    @Test
    void subscribe_returnsMessageWhenAlreadyExists() {
        when(repository.existsByEmail("a@b.com")).thenReturn(true);

        String msg = newsletterService.subscribe("  A@B.com ");

        assertThat(msg).contains("already subscribed");
        verify(repository, never()).save(any());
    }

    @Test
    void subscribe_savesAndSendsWelcome() {
        when(repository.existsByEmail("n@b.com")).thenReturn(false);
        when(repository.save(any(NewsletterSubscriber.class))).thenAnswer(inv -> inv.getArgument(0));

        String msg = newsletterService.subscribe("n@b.com");

        assertThat(msg).contains("Thanks for subscribing");
        verify(resendEmailService).sendWelcomeEmail("n@b.com");
    }
}

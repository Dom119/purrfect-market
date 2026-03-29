package com.purrfectmarket.service;

import com.purrfectmarket.dto.NewsletterBroadcastRequest;
import com.purrfectmarket.model.NewsletterSubscriber;
import com.purrfectmarket.repository.NewsletterSubscriberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminNewsletterServiceTest {

    @Mock
    private NewsletterSubscriberRepository subscriberRepository;
    @Mock
    private ResendEmailService resendEmailService;

    @InjectMocks
    private AdminNewsletterService adminNewsletterService;

    @Test
    void broadcast_requiresSubject() {
        assertThatThrownBy(() -> adminNewsletterService.broadcast(
                new NewsletterBroadcastRequest(" ", "body", List.of("a@b.com"))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Subject");
    }

    @Test
    void broadcast_requiresBody() {
        assertThatThrownBy(() -> adminNewsletterService.broadcast(
                new NewsletterBroadcastRequest("Subj", "  ", List.of("a@b.com"))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("body");
    }

    @Test
    void broadcast_requiresRecipients() {
        assertThatThrownBy(() -> adminNewsletterService.broadcast(
                new NewsletterBroadcastRequest("S", "H", List.of())))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("subscriber");
    }

    @Test
    void broadcast_filtersToKnownSubscribersOnly() {
        NewsletterSubscriber s = new NewsletterSubscriber("ok@test.com");
        org.springframework.test.util.ReflectionTestUtils.setField(s, "id", 1L);
        when(subscriberRepository.findAllByOrderBySubscribedAtDesc()).thenReturn(List.of(s));
        when(resendEmailService.sendHtmlBulk(anyList(), eq("Hi"), eq("<p>x</p>")))
                .thenReturn(new ResendEmailService.BroadcastResult(1, 0));

        var result = adminNewsletterService.broadcast(new NewsletterBroadcastRequest(
                "Hi", "<p>x</p>", List.of("  OK@Test.COM ", "unknown@x.com")));

        assertThat(result.sent()).isEqualTo(1);
        verify(resendEmailService).sendHtmlBulk(List.of("ok@test.com"), "Hi", "<p>x</p>");
    }

    @Test
    void broadcast_throwsWhenNoValidRecipients() {
        when(subscriberRepository.findAllByOrderBySubscribedAtDesc()).thenReturn(List.of());
        assertThatThrownBy(() -> adminNewsletterService.broadcast(
                new NewsletterBroadcastRequest("S", "B", List.of("a@b.com"))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("No valid subscribers");
    }

    @Test
    void listSubscribers_mapsRows() {
        NewsletterSubscriber s = new NewsletterSubscriber("e@e.com");
        org.springframework.test.util.ReflectionTestUtils.setField(s, "id", 5L);
        org.springframework.test.util.ReflectionTestUtils.setField(s, "subscribedAt", Instant.parse("2024-06-01T12:00:00Z"));
        when(subscriberRepository.findAllByOrderBySubscribedAtDesc()).thenReturn(List.of(s));

        var rows = adminNewsletterService.listSubscribers();

        assertThat(rows).hasSize(1);
        assertThat(rows.getFirst().email()).isEqualTo("e@e.com");
    }
}

package com.purrfectmarket.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "newsletter_broadcast_log")
public class NewsletterBroadcastLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String htmlBody;

    @Column(name = "recipients", nullable = false, columnDefinition = "TEXT")
    private String recipients;

    @Column(name = "sent_count")
    private int sentCount;

    @Column(name = "failed_count")
    private int failedCount;

    @Column(name = "sent_at", nullable = false)
    private Instant sentAt = Instant.now();

    protected NewsletterBroadcastLog() {}

    public NewsletterBroadcastLog(String subject, String htmlBody, List<String> recipients, int sentCount, int failedCount) {
        this.subject = subject;
        this.htmlBody = htmlBody;
        this.recipients = String.join(",", recipients);
        this.sentCount = sentCount;
        this.failedCount = failedCount;
    }

    public Long getId() { return id; }
    public String getSubject() { return subject; }
    public String getHtmlBody() { return htmlBody; }
    public List<String> getRecipients() { return List.of(recipients.split(",")); }
    public int getSentCount() { return sentCount; }
    public int getFailedCount() { return failedCount; }
    public Instant getSentAt() { return sentAt; }
}

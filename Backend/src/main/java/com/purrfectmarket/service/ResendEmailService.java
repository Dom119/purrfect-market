package com.purrfectmarket.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResendEmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);

    private static final String RESEND_API = "https://api.resend.com/emails";

    private static final String WELCOME_HTML = """
            <div style="font-family: system-ui, sans-serif; max-width: 560px; line-height: 1.5;">
              <h1 style="color: #1e3a5f;">Welcome to Purrfect Market</h1>
              <p>Thanks for joining the Purrfect Club. You’re on the list for tips, new arrivals, and special offers.</p>
              <p style="color: #64748b; font-size: 14px;">We’ll use your email only for updates you signed up for.</p>
            </div>
            """;

    private final String apiKey;
    private final String from;
    private final String replyTo;
    private final RestClient http = RestClient.builder().build();

    public ResendEmailService(
            @Value("${resend.api.key:}") String apiKey,
            @Value("${resend.from:Purrfect Market <onboarding@resend.dev>}") String from,
            @Value("${resend.reply-to:}") String replyTo) {
        this.apiKey = apiKey != null ? apiKey : "";
        this.from = from;
        this.replyTo = replyTo != null ? replyTo : "";
    }

    public boolean isConfigured() {
        return !apiKey.isBlank();
    }

    /**
     * Sends a welcome email after newsletter signup. Swallows failures so subscription still succeeds.
     */
    public void sendWelcomeEmail(String toEmail) {
        if (!isConfigured()) {
            return;
        }
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("from", from);
        body.put("to", List.of(toEmail));
        body.put("subject", "Welcome to Purrfect Market");
        body.put("html", WELCOME_HTML);
        if (!replyTo.isBlank()) {
            body.put("reply_to", replyTo);
        }
        try {
            http.post()
                    .uri(RESEND_API)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            log.warn("Resend API error {} for {}: {}", e.getStatusCode().value(), toEmail, e.getResponseBodyAsString());
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }
}

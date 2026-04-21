package com.purrfectmarket.controller;

import com.purrfectmarket.dto.ContactRequest;
import com.purrfectmarket.service.ResendEmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ResendEmailService resendEmailService;
    private final String supportEmail;

    public ContactController(
            ResendEmailService resendEmailService,
            @Value("${app.support.email:hello@purrfect.market}") String supportEmail) {
        this.resendEmailService = resendEmailService;
        this.supportEmail = supportEmail;
    }

    @PostMapping
    public ResponseEntity<Void> submit(@RequestBody ContactRequest req) {
        if (resendEmailService.isConfigured()) {
            String html = """
                    <div style="font-family: system-ui, sans-serif; max-width: 560px; line-height: 1.5;">
                      <h2>New contact form submission</h2>
                      <p><strong>Name:</strong> %s</p>
                      <p><strong>Email:</strong> %s</p>
                      <p><strong>Message:</strong></p>
                      <p style="white-space: pre-wrap;">%s</p>
                    </div>
                    """.formatted(req.name(), req.email(), req.message());
            resendEmailService.sendHtmlOrLog(supportEmail, "Contact: " + req.name(), html);
        }
        return ResponseEntity.ok().build();
    }
}

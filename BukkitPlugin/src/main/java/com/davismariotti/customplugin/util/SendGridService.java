package com.davismariotti.customplugin.util;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import java.io.IOException;

public class SendGridService {
    private String apiKey;

    public SendGridService(String apiKey) {
        this.apiKey = apiKey;
    }

    public void sendLoggedInEmail(String recipient, String loggedInName) throws IOException {
        Email from = new Email("survival@davismariotti.com");
        Email to = new Email(recipient);
        Content content = new Content("text/plain", String.format("%s has just logged in.", loggedInName));
        Mail mail = new Mail(from, "Player just logged in", to, content);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        sg.api(request);
    }
}

package com.davismariotti.customplugin;

import com.davismariotti.customplugin.util.SendGridService;

import java.io.IOException;

public class MainClass {
    public static void main(String[] args) {
        SendGridService service = new SendGridService("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");
        try {
            service.sendLoggedInEmail("9254827277@txt.att.net", "gomeow");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

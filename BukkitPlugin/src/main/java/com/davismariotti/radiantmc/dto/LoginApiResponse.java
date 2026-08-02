package com.davismariotti.radiantmc.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginApiResponse {
    private String status;
    private List<MessageDto> payload;

    public String getStatus() {
        return status;
    }

    public List<MessageDto> getPayload() {
        return payload;
    }
}

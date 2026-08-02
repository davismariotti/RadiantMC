package com.davismariotti.radiantmc.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageDto {
    private String to;

    @JsonProperty("date_created")
    private String dateCreated;

    private String body;
    private String sid;
    private String request;

    public String getTo() {
        return to;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public String getBody() {
        return body;
    }

    public String getSid() {
        return sid;
    }

    public String getRequest() {
        return request;
    }
}

package com.davismariotti.radiantmc.util;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import okhttp3.*;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class LoginApiService {

    private final String baseUrl;
    private final String apiKey;

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Inject
    public LoginApiService(RadiantMCPlugin plugin) {
        this.baseUrl = plugin.getConfig().getString("text.apiUrl");
        this.apiKey = plugin.getConfig().getString("text.apiKey");
    }

    public void postPlayerLoggedIn(UUID playerName, List<UUID> loggedInPlayers) throws IOException {
        LoggedInPayload payload = new LoggedInPayload();
        payload.excludedPlayers = loggedInPlayers;
        String json = mapper.writeValueAsString(payload);

        RequestBody body = RequestBody.create(json, MediaType.parse("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(String.format("%s/login/%s", baseUrl, playerName))
                .addHeader("User-Agent", "OkHttp CustomPlugin")
                .addHeader("Authorization", String.format("Bearer %s", apiKey))
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {

            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            System.out.println(Objects.requireNonNull(response.body()).string());
        }

    }
}

package com.davismariotti.radiantmc.util;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.bukkit.configuration.file.FileConfiguration;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public class LoginApiService {


    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final FileConfiguration configuration = RadiantMCPlugin.instance.getConfig();
    private final String baseUrl = configuration.getString("text.apiUrl");
    private final String apiKey = configuration.getString("text.apiKey");

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
            System.out.println(response.body().string());
        }

    }
}

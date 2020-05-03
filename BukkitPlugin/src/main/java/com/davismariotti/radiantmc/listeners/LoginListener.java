package com.davismariotti.radiantmc.listeners;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.davismariotti.radiantmc.util.LoginApiService;
import com.davismariotti.radiantmc.util.SendGridService;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class LoginListener implements Listener {

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        try {
            File file = new File(RadiantMCPlugin.instance.getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
            for (String line : Files.readAllLines(file.toPath())) {
                player.sendMessage(ChatColor.translateAlternateColorCodes('&', line));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Respect cooldown
        FileConfiguration configuration = RadiantMCPlugin.instance.getConfig();
        boolean emailEnabled = configuration.getBoolean("email.enabled", false);

        if (emailEnabled) {
            long cooldown = configuration.getLong("email.cooldown", 7200);
            if (System.currentTimeMillis() >= player.getLastPlayed() + cooldown) {

                // Check the time
                ZoneId id = ZoneId.of("America/Los_Angeles");
                ZonedDateTime zdt = ZonedDateTime.now(id);
                if (zdt.getHour() <= 23 && zdt.getHour() >= 7) {

                    // Find excluded
                    List<String> excludedPlayers = configuration.getStringList("email.excludedPlayers");
                    if (!excludedPlayers.contains(player.getName())) {
                        String apiKey = configuration.getString("email.apiKey");
                        ConfigurationSection configurationSection = configuration.getConfigurationSection("email.recipients");
                        if (configurationSection != null) {
                            Map<String, Object> recipients = configurationSection.getValues(false);
                            SendGridService service = new SendGridService(apiKey);
                            int sentCount = 0;
                            for (Map.Entry<String, Object> recipient : recipients.entrySet()) {
                                String recipientName = recipient.getKey();
                                if (recipientName.equals(player.getName())) continue;
                                if (Bukkit.getServer().getOnlinePlayers().stream().anyMatch(p -> p.getName().equals(recipientName))) continue;

                                try {
                                    service.sendLoggedInEmail((String) recipient.getValue(), player.getName());
                                    sentCount++;
                                } catch (IOException e) {
                                    RadiantMCPlugin.instance.getLogger().warning("There was an exception sending an email.");
                                    e.printStackTrace();
                                }
                            }
                            RadiantMCPlugin.instance.getLogger().info(String.format("Emails sent to %d recipient%s", sentCount, sentCount == 1 ? "" : "s"));
                        }
                    }
                }
            }
        }

        boolean textEnabled = configuration.getBoolean("text.enabled", false);
        if (textEnabled) {
            long textCooldown = configuration.getLong("text.cooldown", 5000L);
            long now = System.currentTimeMillis();
            long lastLoggedIn = RadiantMCPlugin.instance.getData().getLong(String.format("logout.%s", player.getUniqueId()), 0L);
            RadiantMCPlugin.instance.getLogger().info(String.format("tc = %d; now = %d; ll = %d;", textCooldown, now, lastLoggedIn));

            if (now - textCooldown > textCooldown) {

                Bukkit.getScheduler().runTaskAsynchronously(RadiantMCPlugin.instance, () -> {
                    LoginApiService service = new LoginApiService();
                    try {
                        service.postPlayerLoggedIn(player.getName(), Bukkit.getServer().getOnlinePlayers().stream().map(Player::getName).collect(Collectors.toList()));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        }
    }

}

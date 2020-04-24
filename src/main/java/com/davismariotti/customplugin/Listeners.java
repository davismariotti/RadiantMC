package com.davismariotti.customplugin;

import com.davismariotti.customplugin.util.SendGridService;
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
import java.util.*;

public class Listeners implements Listener {

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        try {
            File file = new File(CustomPlugin.instance.getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
            for (String line : Files.readAllLines(file.toPath())) {
                player.sendMessage(ChatColor.translateAlternateColorCodes('&', line));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Check the time
        ZoneId id = ZoneId.of("America/Los_Angeles");
        ZonedDateTime zdt = ZonedDateTime.now(id);
        if (zdt.getHour() <= 23 && zdt.getHour() >= 7) {
            // Send the email
            FileConfiguration configuration = CustomPlugin.instance.getConfig();

            // Find excluded
            List<String> excludedPlayers = configuration.getStringList("email.excludedPlayers");
            if (!excludedPlayers.contains(player.getName())) {
                String apiKey = configuration.getString("email.apiKey");
                ConfigurationSection configurationSection = configuration.getConfigurationSection("email.recipients");
                if (configurationSection != null) {
                    Map<String, Object> recipients = configurationSection.getValues(false);
                    SendGridService service = new SendGridService(apiKey);
                    for (Map.Entry<String, Object> recipient : recipients.entrySet()) {
                        if (recipient.getKey().equals(player.getName())) continue;
                        CustomPlugin.instance.getLogger().info(recipient.getValue().toString());
                        try {
                            service.sendLoggedInEmail((String) recipient.getValue(), player.getName());
                        } catch (IOException e) {
                            CustomPlugin.instance.getLogger().warning("There was an exception sending an email.");
                            e.printStackTrace();
                        }
                    }
                    CustomPlugin.instance.getLogger().info(String.format("Emails sent to %d recipient%s", recipients.size(), recipients.size() == 1 ? "" : "s"));
                }
            }
        }
    }

}

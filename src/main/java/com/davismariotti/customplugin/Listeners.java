package com.davismariotti.customplugin;

import com.davismariotti.customplugin.util.SendGridService;
import org.bukkit.ChatColor;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.logging.Level;

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

        // Send the email
        FileConfiguration configuration = CustomPlugin.instance.getConfig();

        // Find excluded
        List<String> excludedPlayers = configuration.getStringList("email.excludedPlayers");
        if (!excludedPlayers.contains(player.getName())) {
            String apiKey = configuration.getString("email.apiKey");
            List<String> recipients = configuration.getStringList("email.recipients");

            SendGridService service = new SendGridService(apiKey);
            for (String recipient : recipients) {
                try {
                    service.sendLoggedInEmail(recipient, player.getName());
                } catch (IOException e) {
                    CustomPlugin.instance.getLogger().warning("There was an exception sending an email.");
                    e.printStackTrace();
                }
            }
        }
    }

}

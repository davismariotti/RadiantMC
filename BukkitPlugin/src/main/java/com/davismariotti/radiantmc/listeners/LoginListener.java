package com.davismariotti.radiantmc.listeners;

import static com.davismariotti.radiantmc.util.NicknameChatColors.getDesiredChatColors;
import static com.davismariotti.radiantmc.util.RandomUtils.getRandomObject;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.davismariotti.radiantmc.util.LoginApiService;
import com.davismariotti.radiantmc.util.SendGridService;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public class LoginListener implements Listener {

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        sendMotd(player);
        sendLoggedInEmail(player);
        sendLoggedInText(player);
        setNameColor(player);
    }

    public void sendMotd(Player player) {
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
    }

    public void sendLoggedInEmail(Player player) {
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
                                if (recipientName.equals(player.getName())) {
                                    continue;
                                }
                                if (Bukkit.getServer().getOnlinePlayers().stream().anyMatch(p -> p.getName().equals(recipientName))) {
                                    continue;
                                }

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
    }

    public void sendLoggedInText(Player player) {
        FileConfiguration configuration = RadiantMCPlugin.instance.getConfig();
        boolean textEnabled = configuration.getBoolean("text.enabled", false);
        if (textEnabled) {
            long textCooldown = configuration.getLong("text.cooldown", 5000L);
            long now = System.currentTimeMillis();
            long lastLoggedIn = RadiantMCPlugin.instance.getData().getLong(String.format("logout.%s", player.getUniqueId()), 0L);
            if (now - lastLoggedIn > textCooldown) {

                Bukkit.getScheduler().runTaskAsynchronously(RadiantMCPlugin.instance, () -> {
                    LoginApiService service = new LoginApiService();
                    try {
                        service.postPlayerLoggedIn(player.getUniqueId(), Bukkit.getServer().getOnlinePlayers().stream().map(Player::getUniqueId).collect(Collectors.toList()));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        }
    }

    public void setNameColor(Player player) {
        ConfigurationSection data = RadiantMCPlugin.instance.getData().getConfigurationSection("color");
        if (data == null) {
            return;
        }
        // Check if they have a color set already
        String color = data.getString(player.getUniqueId().toString());
        if (color != null) {
            player.setDisplayName(ChatColor.valueOf(color) + player.getName() + ChatColor.RESET);
        } else {
            // Create a list of untaken colors
            Set<ChatColor> availableColors = getDesiredChatColors();

            data.getKeys(false).forEach(key -> {
                availableColors.remove(ChatColor.valueOf(data.getString(key)));
            });

            // If all colors are gone, re-add them
            if (availableColors.size() == 0) {
                availableColors.addAll(getDesiredChatColors());
            }

            ChatColor newColor = getRandomObject(availableColors);

            player.setDisplayName(newColor + player.getName() + ChatColor.RESET);
            data.set(player.getUniqueId().toString(), newColor.name());
            RadiantMCPlugin.instance.saveData();

        }
    }


}

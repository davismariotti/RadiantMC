package com.davismariotti.radiantmc.data;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import lombok.RequiredArgsConstructor;
import org.bukkit.ChatColor;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.Player;

import java.io.File;
import java.io.IOException;
import java.util.Set;

import static com.davismariotti.radiantmc.util.NicknameChatColors.getDesiredChatColors;
import static com.davismariotti.radiantmc.util.RandomUtils.getRandomObject;

@Singleton
@RequiredArgsConstructor(onConstructor_ = {@Inject})
public class DataFile {
    private File dataFile;
    private YamlConfiguration data;

    private final RadiantMCPlugin plugin;

    public void loadData() {
        File f = new File(plugin.getDataFolder(), "data.yml");
        if (!f.exists()) {
            try {
                f.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        dataFile = f;
        data = YamlConfiguration.loadConfiguration(f);

        if (!data.isConfigurationSection("color")) {
            data.createSection("color");
        }
        saveData();
    }

    private YamlConfiguration getData() {
        return data;
    }

    public void saveData() {
        try {
            data.save(dataFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void setColor(Player player, ChatColor chatColor) {
        getData().set(player.getUniqueId().toString(), chatColor.name());
        saveData();
    }

    public long getLastLogin(Player player) {
        return getData().getLong(String.format("logout.%s", player.getUniqueId()), 0L);
    }

    public void setRandomNameColor(Player player) {
        ConfigurationSection data = getData().getConfigurationSection("color");
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

            data.getKeys(false).forEach(key -> availableColors.remove(ChatColor.valueOf(data.getString(key))));

            // If all colors are gone, re-add them
            if (availableColors.size() == 0) {
                availableColors.addAll(getDesiredChatColors());
            }

            ChatColor newColor = getRandomObject(availableColors);

            player.setDisplayName(newColor + player.getName() + ChatColor.RESET);
            data.set(player.getUniqueId().toString(), newColor.name());
            saveData();
        }
    }

    public void setLastLoginAsNow(Player player) {
        getData().set(String.format("logout.%s", player.getUniqueId()), System.currentTimeMillis());
        saveData();
    }
}

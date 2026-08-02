package com.davismariotti.radiantmc.commands;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.google.inject.Inject;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class MotdCommand implements CommandExecutor {

    private final RadiantMCPlugin plugin;

    @Inject
    public MotdCommand(RadiantMCPlugin plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(@NotNull CommandSender commandSender, @NotNull Command command, @NotNull String label, String[] strings) {
        try {
            File file = new File(plugin.getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
            for (String line : Files.readAllLines(file.toPath())) {
                commandSender.sendMessage(ChatColor.translateAlternateColorCodes('&', line));
            }
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}

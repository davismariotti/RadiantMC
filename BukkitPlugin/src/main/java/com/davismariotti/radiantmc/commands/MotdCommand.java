package com.davismariotti.radiantmc.commands;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class MotdCommand implements CommandExecutor {
    @Override
    public boolean onCommand(CommandSender commandSender, Command command, String s, String[] strings) {
        try {
            File file = new File(RadiantMCPlugin.instance.getDataFolder(), "motd.txt");
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

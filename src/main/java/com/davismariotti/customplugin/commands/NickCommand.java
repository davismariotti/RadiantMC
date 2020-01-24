package com.davismariotti.customplugin.commands;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class NickCommand implements CommandExecutor {
    private boolean setChatColor(CommandSender sender, Player player, String color) {
        if (player == null) {
            sender.sendMessage("Invalid player name.");
            return false;
        }
        ChatColor chatColor;
        if (color.length() == 1) {
            chatColor = ChatColor.getByChar(color);
            if (chatColor == null) {
                sender.sendMessage("That color is invalid");
                return false;
            }
        } else {
            try {
                chatColor = ChatColor.valueOf(color);
            } catch (IllegalArgumentException e) {
                sender.sendMessage("That color is invalid");
                return false;
            }
        }
        player.setDisplayName(chatColor + player.getName() + ChatColor.RESET);
        sender.sendMessage("Chat color changed.");
        return true;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            sender.sendMessage("Usage: /nick {your nickname color}");
            return true;
        } else if (args.length == 1) {
            if (sender instanceof Player) {
                Player player = (Player) sender;
                return setChatColor(sender, player, args[0].toUpperCase());
            } else {
                sender.sendMessage("Usage: /nick {player name} {color}");
            }
        } else if (args.length == 2) {
            Player player = Bukkit.getPlayer(args[0]);
            if (player == null) {
                player = Bukkit.getOfflinePlayer(args[0]).getPlayer();
            }
            return setChatColor(sender, player, args[1].toUpperCase());
        } else {
            sender.sendMessage("Usage: /nick {color}");
        }
        return true;
    }
}

package com.davismariotti.customplugin.commands;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class RemoveNickCommand implements CommandExecutor {

    private boolean removeChatColor(CommandSender sender, Player player) {
        if (player == null) {
            sender.sendMessage("Invalid player name.");
            return false;
        }
        player.setDisplayName(player.getName());
        sender.sendMessage("Chat color removed.");
        return true;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            if (sender instanceof Player) {
                Player player = (Player) sender;
                return removeChatColor(sender, player);
            } else {
                sender.sendMessage("Usage: /removenick {player name}");
            }
        } else if (args.length == 1) {
            Player player = Bukkit.getPlayer(args[0]);
            if (player == null) {
                player = Bukkit.getOfflinePlayer(args[0]).getPlayer();
            }
            if (player != null) {
                return removeChatColor(sender, player);
            } else {
                sender.sendMessage("Invalid player name.");
                return false;
            }
        } else {
            sender.sendMessage("Usage: /removenick {player name}");
        }
        return true;
    }
}

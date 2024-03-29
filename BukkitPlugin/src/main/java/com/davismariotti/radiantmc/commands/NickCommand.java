package com.davismariotti.radiantmc.commands;

import com.davismariotti.radiantmc.data.DataFile;
import com.google.inject.Inject;
import lombok.RequiredArgsConstructor;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.NotNull;

@RequiredArgsConstructor(onConstructor_ = {@Inject})
public class NickCommand implements CommandExecutor {

    private final DataFile dataFile;

    private boolean setChatColor(CommandSender sender, Player player, String color) {
        if (player == null) {
            sender.sendMessage("Invalid player name.");
            return false;
        }
        ChatColor chatColor;
        if (color.length() == 1) {
            chatColor = ChatColor.getByChar(color);
            if (chatColor == null || chatColor == ChatColor.RESET) {
                sendColorInvalidMessage(sender);
                return false;
            }
        } else {
            try {
                chatColor = ChatColor.valueOf(color);
                if (chatColor == ChatColor.RESET) {
                    sendColorInvalidMessage(sender);
                    return false;
                }
            } catch (IllegalArgumentException e) {
                sendColorInvalidMessage(sender);
                return false;
            }
        }
        player.setDisplayName(chatColor + player.getName() + ChatColor.RESET);

        dataFile.setColor(player, chatColor);

        sender.sendMessage("Chat color changed.");
        return true;
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command, @NotNull String label, String[] args) {
        if (args.length == 0) {
            sender.sendMessage("Usage: /nick {your nickname color}");
            return true;
        } else if (args.length == 1) {
            if (sender instanceof Player player) {
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

    public void sendColorInvalidMessage(CommandSender sender) {
        StringBuilder sb = new StringBuilder("That color is invalid. Available colors: ");
        for (ChatColor color : ChatColor.values()) {
            if (color == ChatColor.RESET) continue;
            sb.append(color.toString());
        }
        sender.sendMessage(sb.toString());
    }
}

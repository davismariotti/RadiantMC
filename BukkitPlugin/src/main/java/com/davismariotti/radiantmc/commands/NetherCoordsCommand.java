package com.davismariotti.radiantmc.commands;

import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.NotNull;

public class NetherCoordsCommand implements CommandExecutor {

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command, @NotNull String label, String[] strings) {
        if (sender instanceof Player player) {
            World world = player.getWorld();
            World.Environment environment = world.getEnvironment();
            Location location = player.getLocation();
            final double x = location.getX(), z = location.getZ();
            double transformedX, transformedZ;

            if (environment == World.Environment.NORMAL) {
                transformedX = x / 8;
                transformedZ = z / 8;
            } else if (environment == World.Environment.NETHER) {
                transformedX = x * 8;
                transformedZ = z * 8;
            } else {
                sender.sendMessage(ChatColor.RED + "You must be in the overworld or nether to use this command.");
                return true;
            }

            sender.sendMessage(String.format(
                    ChatColor.YELLOW + "The %s (x, z) coordinates for your location are (%d, %d)",
                    environment == World.Environment.NORMAL ? "nether" : "overworld",
                    Math.round(transformedX),
                    Math.round(transformedZ)
            ));
        } else {
            sender.sendMessage("You must be a player to use this command.");
        }
        return true;
    }
}
